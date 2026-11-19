// Pure helpers for the Money Wasting Expert Worker. No network, no secrets: easy to test.

const RETAILERS = ['amazon.co.uk', 'amazon.com', 'argos.co.uk', 'currys.co.uk', 'very.co.uk', 'johnlewis.com', 'tesco.com', 'asda.com', 'ebay.co.uk', 'ao.com', 'robertdyas.co.uk', 'b-and-q.co.uk', 'diy.com', 'screwfix.com', 'wilko.com', 'lakeland.co.uk', 'boots.com', 'next.co.uk'];
const COMMUNITY = ['reddit.com', 'trustpilot.com', 'mumsnet.com', 'moneysavingexpert.com', 'forums.moneysavingexpert.com', 'quora.com', 'news.ycombinator.com', 'youtube.com'];

export function normaliseQuery(q) {
  if (typeof q !== 'string') return null;
  const s = q.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
  return s.length >= 2 ? s : null;
}

export function hostOf(url) {
  try { const u = new URL(url); return ['http:', 'https:'].includes(u.protocol) ? u.hostname.replace(/^www\./, '').toLowerCase() : ''; } catch { return ''; }
}

const matches = (host, list) => list.some(d => host === d || host.endsWith('.' + d));
export function classifyHost(host) {
  if (matches(host, RETAILERS)) return 'retailer';
  if (matches(host, COMMUNITY)) return 'community';
  return 'independent';
}

export function parseWebResults(json, limit = 10) {
  const rows = json?.web?.results;
  if (!Array.isArray(rows)) return [];
  const out = [];
  for (const r of rows) {
    const host = hostOf(r?.url);
    if (!host || typeof r.title !== 'string') continue;
    out.push({ title: clean(r.title, 140), url: new URL(r.url).href, host, kind: classifyHost(host), snippet: clean(r.description || '', 200) });
    if (out.length >= limit) break;
  }
  return out;
}

function clean(s, n) {
  const t = String(s).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t;
}

export const asinOk = a => typeof a === 'string' && /^[A-Z0-9]{10}$/.test(a);
export const amazonUrl = asin => 'https://www.amazon.co.uk/dp/' + asin;

const num = v => (typeof v === 'number' && Number.isFinite(v) ? v : typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v.replace(/[,%]/g, ''))) ? Number(v.replace(/[,%]/g, '')) : null);

export function parseAmazonSearch(json) {
  const rows = json?.search_results ?? json?.results;
  if (!Array.isArray(rows)) return [];
  const out = [];
  for (const r of rows) {
    if (!asinOk(r?.asin) || typeof r.title !== 'string') continue;
    out.push({
      asin: r.asin, title: clean(r.title, 160), url: amazonUrl(r.asin),
      image: typeof r.image === 'string' && /^https:\/\//.test(r.image) ? r.image : '',
      rating: num(r.rating), ratingsTotal: num(r.ratings_total ?? r.reviews_total),
      sponsored: r.is_sponsored === true || r.sponsored === true
    });
  }
  return out;
}

// Reads a per-star breakdown from the provider's reviews response, tolerating a few shapes.
// Returns percentages for 1★..5★ (Amazon's breakdown is a weighted percentage, so we never present buyer counts).
const STAR_KEYS = [['one_star', '1', 'one', '1_star'], ['two_star', '2', 'two', '2_star'], ['three_star', '3', 'three', '3_star'], ['four_star', '4', 'four', '4_star'], ['five_star', '5', 'five', '5_star']];
export function findBreakdown(json) {
  const bd = json?.summary?.rating_breakdown ?? json?.rating_breakdown ?? json?.product?.rating_breakdown ?? json?.summary?.ratings_breakdown;
  if (!bd || typeof bd !== 'object') return { ok: false, why: 'no rating_breakdown object found' };
  const counts = [], pcts = [];
  for (const keys of STAR_KEYS) {
    const k = keys.find(k => k in bd);
    if (k === undefined) return { ok: false, why: 'star keys not recognised: ' + Object.keys(bd).slice(0, 8).join(',') };
    const v = bd[k];
    if (v && typeof v === 'object') { counts.push(num(v.count)); pcts.push(num(v.percentage ?? v.percent)); }
    else { counts.push(num(v)); pcts.push(null); }
  }
  let percent = null;
  if (pcts.every(p => p !== null)) percent = pcts;
  else if (counts.every(c => c !== null)) {
    const total = counts.reduce((a, b) => a + b, 0);
    if (total > 0) percent = counts.map(c => (c / total) * 100);
  }
  if (!percent) return { ok: false, why: 'breakdown values missing' };
  const sum = percent.reduce((a, b) => a + b, 0);
  if (Math.abs(sum - 100) > 3) return { ok: false, why: 'breakdown does not add to 100%' };
  return { ok: true, percent: percent.map(p => Math.round(p * 100) / 100), total: num(json?.summary?.ratings_total ?? json?.ratings_total) };
}

// Amazon search results are relevance ordered. We only know the average rating, so look up the breakdown
// for the lowest-rated listings that have enough ratings to count.
export function pickCandidates(products, max = 3, minRatings = 50) {
  return products
    .filter(p => !p.sponsored && p.rating !== null && p.ratingsTotal !== null && p.ratingsTotal >= minRatings)
    .sort((a, b) => a.rating - b.rating)
    .slice(0, max);
}

export function corsHeaders(origin, allowed) {
  const ok = origin && allowed.includes(origin);
  return { 'Access-Control-Allow-Origin': ok ? origin : allowed[0], 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400', 'Vary': 'Origin' };
}
