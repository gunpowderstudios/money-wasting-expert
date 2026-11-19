import assert from 'node:assert/strict';
import * as L from '../worker/src/lib.mjs';
import worker from '../worker/src/index.mjs';
let n = 0; const t = async (name, fn) => { await fn(); n++; console.log('ok', n, name); };

await t('normaliseQuery trims, strips control chars, limits length', () => {
  assert.equal(L.normaliseQuery('  air\n fryer \u0000 '), 'air fryer');
  assert.equal(L.normaliseQuery('a'), null); assert.equal(L.normaliseQuery(null), null);
  assert.equal(L.normaliseQuery('x'.repeat(500)).length, 100);
});
await t('classifyHost sorts retailers, community and independent sites', () => {
  assert.equal(L.classifyHost('www.argos.co.uk'.replace('www.', '')), 'retailer');
  assert.equal(L.classifyHost('old.reddit.com'), 'community');
  assert.equal(L.classifyHost('which.co.uk'), 'independent');
  assert.equal(L.classifyHost('notargos.co.uk'), 'independent');
});
await t('parseWebResults drops non-http links and strips tags', () => {
  const r = L.parseWebResults({ web: { results: [{ title: 'A', url: 'javascript:alert(1)' }, { title: 'Good <b>one</b>', url: 'https://www.which.co.uk/x', description: 'It &amp; <b>broke</b>' }] } });
  assert.equal(r.length, 1); assert.equal(r[0].snippet, 'It & broke'); assert.equal(r[0].host, 'which.co.uk');
});
await t('findBreakdown: count objects become percentages', () => {
  const r = L.findBreakdown({ summary: { ratings_total: 100, rating_breakdown: { five_star: { count: 10 }, four_star: { count: 10 }, three_star: { count: 10 }, two_star: { count: 20 }, one_star: { count: 50 } } } });
  assert.equal(r.ok, true); assert.deepEqual(r.percent, [50, 20, 10, 10, 10]); assert.equal(r.total, 100);
});
await t('findBreakdown: percentage objects and bare numbers both work', () => {
  assert.deepEqual(L.findBreakdown({ rating_breakdown: { five_star: { percentage: 60 }, four_star: { percentage: 10 }, three_star: { percentage: 10 }, two_star: { percentage: 10 }, one_star: { percentage: 10 } } }).percent, [10, 10, 10, 10, 60]);
  assert.deepEqual(L.findBreakdown({ rating_breakdown: { 5: 60, 4: 10, 3: 10, 2: 10, 1: 10 } }).percent, [10, 10, 10, 10, 60]);
});
await t('findBreakdown: unknown shapes fail safely with a reason', () => {
  assert.equal(L.findBreakdown({}).ok, false);
  assert.match(L.findBreakdown({ rating_breakdown: { good: 1 } }).why, /not recognised/);
  assert.match(L.findBreakdown({ rating_breakdown: { five_star: { percentage: 90 }, four_star: { percentage: 90 }, three_star: { percentage: 90 }, two_star: { percentage: 90 }, one_star: { percentage: 90 } } }).why, /100%/);
});
await t('parseAmazonSearch rejects bad ASINs and non-https images', () => {
  const r = L.parseAmazonSearch({ search_results: [{ asin: 'B0SHORT', title: 'x' }, { asin: 'B081VRSGWF', title: 'Good', image: 'http://x/y.jpg', rating: '3.2', ratings_total: 1200 }] });
  assert.equal(r.length, 1); assert.equal(r[0].image, ''); assert.equal(r[0].rating, 3.2); assert.equal(r[0].url, 'https://www.amazon.co.uk/dp/B081VRSGWF');
});
await t('pickCandidates takes the lowest-rated listings with enough ratings, skips ads', () => {
  const p = [{ asin: 'A', rating: 4.8, ratingsTotal: 900 }, { asin: 'B', rating: 2.9, ratingsTotal: 400 }, { asin: 'C', rating: 2.1, ratingsTotal: 10 }, { asin: 'D', rating: 3.1, ratingsTotal: 80, sponsored: true }, { asin: 'E', rating: 3.4, ratingsTotal: 60 }];
  assert.deepEqual(L.pickCandidates(p, 2).map(x => x.asin), ['B', 'E']);
});

// End to end with stubbed providers and cache
const store = new Map();
globalThis.caches = { default: { match: async k => store.get(k.url)?.clone(), put: async (k, r) => { store.set(k.url, r); } } };
let calls = [];
globalThis.fetch = async (u) => {
  const url = new URL(u); calls.push(url.hostname + ':' + (url.searchParams.get('type') || 'web'));
  if (url.hostname === 'api.search.brave.com') return Response.json({ web: { results: [{ title: 'Argos fryer', url: 'https://www.argos.co.uk/product/1', description: 'd' }, { title: 'Which? review', url: 'https://www.which.co.uk/r', description: 'd' }, { title: 'Reddit thread', url: 'https://www.reddit.com/r/x', description: 'd' }] } });
  if (url.searchParams.get('type') === 'search') return Response.json({ search_results: [{ asin: 'B000000001', title: 'Fryer A', rating: 2.5, ratings_total: 300 }, { asin: 'B000000002', title: 'Fryer B', rating: 4.7, ratings_total: 20 }] });
  return Response.json({ summary: { ratings_total: 300, rating_breakdown: { five_star: { percentage: 15 }, four_star: { percentage: 5 }, three_star: { percentage: 10 }, two_star: { percentage: 20 }, one_star: { percentage: 50 } } } });
};
const env = { RAINFOREST_API_KEY: 'k1', BRAVE_API_KEY: 'k2' };
const ctx = { waitUntil: p => p };
const ask = (path, origin = 'https://gunpowderstudios.github.io', e = env) => worker.fetch(new Request('https://w.example' + path, { headers: origin ? { Origin: origin } : {} }), e, ctx);

await t('GET /api/amazon returns listings with a breakdown for the low-rated one', async () => {
  const res = await ask('/api/amazon?q=air%20fryer'); assert.equal(res.status, 200);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), 'https://gunpowderstudios.github.io');
  const d = await res.json(); assert.equal(d.results.length, 2);
  assert.deepEqual(d.results[0].percent, [50, 20, 10, 5, 15]); assert.equal(d.results[1].percent, undefined); assert.deepEqual(d.warnings, []);
});
await t('second identical request is served from cache with no provider calls', async () => {
  calls = []; const res = await ask('/api/amazon?q=Air%20Fryer'); assert.equal(res.headers.get('X-Cache'), 'hit'); assert.equal(calls.length, 0);
});
await t('GET /api/web groups retailers, independent and community; secrets never appear', async () => {
  const res = await ask('/api/web?q=toaster'); const text = await res.text(); const d = JSON.parse(text);
  assert.equal(d.retailers.length, 1); assert.equal(d.independent.length, 1); assert.equal(d.community.length, 1);
  assert.ok(!text.includes('k1') && !text.includes('k2'));
});
await t('other origins are refused; bad queries and unknown routes are rejected', async () => {
  assert.equal((await ask('/api/web?q=toaster', 'https://evil.example')).status, 403);
  assert.equal((await ask('/api/web?q=a')).status, 400);
  assert.equal((await ask('/api/nope?q=toaster')).status, 404);
});
await t('missing key gives a safe 502 with no detail', async () => {
  const res = await ask('/api/amazon?q=kettle', 'https://gunpowderstudios.github.io', {}); assert.equal(res.status, 502);
  assert.deepEqual(Object.keys(await res.json()), ['error']);
});
await t('daily limit stops paid calls', async () => {
  const kv = { m: new Map(), get: async k => kv.m.get(k) ?? null, put: async (k, v) => { kv.m.set(k, v); } };
  const res = await ask('/api/web?q=blender', 'https://gunpowderstudios.github.io', { ...env, MWE_KV: kv, DAILY_LIMIT: '1' });
  assert.equal(res.status, 429);
});
console.log('\nAll ' + n + ' worker checks passed');
