// Money Wasting Expert: live search Worker. Holds the API keys so the static site doesn't have to.
//   GET /api/amazon?q=air+fryer  Amazon UK listings, with 1-5 star breakdown for the lowest-rated ones
//   GET /api/web?q=air+fryer     Web results: Argos pages, other retailers, independent reviews and forums
//   GET /api/health              Which keys are set (never the keys themselves)
// Secrets: RAINFOREST_API_KEY, BRAVE_API_KEY. Optional: ALLOWED_ORIGINS, DAILY_LIMIT, MWE_KV (daily call counter).
import { normaliseQuery, parseWebResults, parseAmazonSearch, findBreakdown, pickCandidates, corsHeaders } from './lib.mjs';

const DEFAULT_ORIGINS = ['https://gunpowderstudios.github.io'];
const CACHE_SECONDS = 60 * 60 * 24;
const json = (body, status, headers) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers } });

class Limit extends Error {}

// Stops a runaway bill: counts paid provider calls per day when a KV namespace is bound.
async function spend(env, n = 1) {
  if (!env.MWE_KV) return;
  const cap = Number(env.DAILY_LIMIT) || 200;
  const key = 'calls:' + new Date().toISOString().slice(0, 10);
  const used = Number(await env.MWE_KV.get(key)) || 0;
  if (used + n > cap) throw new Limit('daily limit reached');
  await env.MWE_KV.put(key, String(used + n), { expirationTtl: 60 * 60 * 36 });
}

async function getJson(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error('provider ' + res.status);
  return res.json();
}

async function braveSearch(env, query, count = 10) {
  if (!env.BRAVE_API_KEY) throw new Error('web search is not configured');
  await spend(env);
  const u = new URL('https://api.search.brave.com/res/v1/web/search');
  u.search = new URLSearchParams({ q: query, count: String(count), country: 'gb', search_lang: 'en' }).toString();
  return parseWebResults(await getJson(u, { headers: { Accept: 'application/json', 'X-Subscription-Token': env.BRAVE_API_KEY } }), count);
}

async function webSearch(env, q) {
  // Brave's free credit allows about 1 request a second, so run these one after the other.
  const general = await braveSearch(env, q + ' review problems complaints UK', 12);
  const argos = await braveSearch(env, q + ' site:argos.co.uk', 6).catch(e => { if (e instanceof Limit) throw e; return []; });
  const seen = new Set(), all = [];
  for (const r of [...argos, ...general]) { if (!seen.has(r.url)) { seen.add(r.url); all.push(r); } }
  return { retailers: all.filter(r => r.kind === 'retailer'), independent: all.filter(r => r.kind === 'independent'), community: all.filter(r => r.kind === 'community') };
}

function rainforest(env, params) {
  if (!env.RAINFOREST_API_KEY) throw new Error('Amazon ratings are not configured');
  const u = new URL('https://api.rainforestapi.com/request');
  u.search = new URLSearchParams({ api_key: env.RAINFOREST_API_KEY, amazon_domain: 'amazon.co.uk', ...params }).toString();
  return getJson(u);
}

async function amazonSearch(env, q) {
  await spend(env);
  const listings = parseAmazonSearch(await rainforest(env, { type: 'search', search_term: q }));
  const picks = pickCandidates(listings, 3);
  const warnings = [];
  if (!listings.length) warnings.push('no listings recognised in the provider response');
  const details = await Promise.all(picks.map(async p => {
    try {
      await spend(env);
      const bd = findBreakdown(await rainforest(env, { type: 'reviews', asin: p.asin }));
      if (!bd.ok) { warnings.push(p.asin + ': ' + bd.why); return p; }
      return { ...p, percent: bd.percent, ratingsTotal: bd.total ?? p.ratingsTotal };
    } catch (e) { if (e instanceof Limit) throw e; warnings.push(p.asin + ': lookup failed'); return p; }
  }));
  const byAsin = new Map(details.map(d => [d.asin, d]));
  const results = listings.slice(0, 16).map(l => byAsin.get(l.asin) || l);
  return { source: 'Amazon UK', basis: 'Amazon shows a weighted percentage breakdown, not a count of buyers.', results, warnings };
}

export default {
  async fetch(request, env, ctx) {
    const allowed = (env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : DEFAULT_ORIGINS);
    const origin = request.headers.get('Origin');
    const cors = corsHeaders(origin, allowed);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'GET') return json({ error: 'method not allowed' }, 405, cors);
    if (origin && !allowed.includes(origin)) return json({ error: 'origin not allowed' }, 403, cors);
    const url = new URL(request.url);
    if (url.pathname === '/api/health') return json({ ok: true, amazon: !!env.RAINFOREST_API_KEY, web: !!env.BRAVE_API_KEY, budget: !!env.MWE_KV }, 200, cors);
    const route = { '/api/amazon': amazonSearch, '/api/web': webSearch }[url.pathname];
    if (!route) return json({ error: 'not found' }, 404, cors);
    const q = normaliseQuery(url.searchParams.get('q'));
    if (!q) return json({ error: 'enter a product name (2 to 100 characters)' }, 400, cors);

    const cache = caches.default;
    const key = new Request(url.origin + url.pathname + '?q=' + encodeURIComponent(q.toLowerCase()));
    const hit = await cache.match(key);
    if (hit) return new Response(hit.body, { status: 200, headers: { ...Object.fromEntries(hit.headers), ...cors, 'X-Cache': 'hit' } });
    try {
      const data = await route(env, q);
      const res = json({ query: q, fetchedAt: new Date().toISOString(), ...data }, 200, { 'Cache-Control': 'public, max-age=' + CACHE_SECONDS });
      ctx.waitUntil(cache.put(key, res.clone()));
      return new Response(res.body, { status: 200, headers: { ...Object.fromEntries(res.headers), ...cors, 'X-Cache': 'miss' } });
    } catch (e) {
      if (e instanceof Limit) return json({ error: 'The daily search limit has been reached. Try again tomorrow.' }, 429, cors);
      return json({ error: 'Live search is unavailable right now.' }, 502, cors);
    }
  }
};
