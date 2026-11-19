# Live search Worker

A small Cloudflare Worker that lets the static site search live. It keeps the API keys private, caches every search for 24 hours, and only answers requests from the site.

| Route | What it does | Provider |
|---|---|---|
| `/api/amazon?q=` | Amazon UK listings. For the three lowest-rated listings with 50+ ratings it also fetches the 1–5 star breakdown. | Rainforest API |
| `/api/web?q=` | Web results sorted into Argos/other retailers, independent reviews, and forums. | Brave Search API |
| `/api/health` | Shows which keys are set (never the keys). | none |

The site does the pass/fail judging itself (`js/rating.js`), so the rules stay in one place.

## What it costs

Each *new* search (not cached) makes **2 Brave requests** and **up to 4 Rainforest requests** (1 search + 3 breakdown lookups). Repeat searches within 24 hours are free.

Check current prices before you start, as both change:
- Brave Search API: usage-priced (about $5 per 1,000 requests when this was written) with a small monthly credit. A card is needed.
- Rainforest API: pay per request, with a trial. See rainforestapi.com.
- Cloudflare Workers: the free plan is plenty for this.

Set a cap in each provider's dashboard as well as the optional `DAILY_LIMIT` guard below.

## Set it up (about 10 minutes)

You need Node.js installed.

1. Get a key from [Brave Search API](https://brave.com/search/api/) and one from [Rainforest API](https://www.rainforestapi.com/).
2. In a terminal:
   ```
   cd worker
   npx wrangler login
   npx wrangler deploy
   npx wrangler secret put RAINFOREST_API_KEY
   npx wrangler secret put BRAVE_API_KEY
   ```
   `deploy` prints your Worker address, like `https://mwe-live-search.YOURNAME.workers.dev`.
3. Check it's alive: open `<address>/api/health`. It should say `"amazon":true,"web":true`.
4. **First-run check (important).** The Rainforest docs don't spell out the exact field names for the star breakdown, so confirm it works with one real search:
   ```
   curl -H "Origin: https://gunpowderstudios.github.io" "<address>/api/amazon?q=air+fryer"
   ```
   Look at `"warnings"`. If it's `[]` and some results have a `"percent"` list, you're done. If it lists something like `star keys not recognised: ...`, send me that line and I'll adjust the parser (one small change).
5. Put the address in `config.js` (no trailing slash), commit and push:
   ```js
   window.MWE_API = 'https://mwe-live-search.YOURNAME.workers.dev';
   ```
   Leave it empty and the site still works without live results.

## Protect your wallet (recommended)

- **Daily cap.** Create a store and bind it, then the Worker stops calling providers after `DAILY_LIMIT` calls a day (default 200):
  ```
  npx wrangler kv namespace create MWE_KV
  ```
  Paste the printed id into the commented `[[kv_namespaces]]` block in `wrangler.toml`, uncomment it, and `npx wrangler deploy` again.
- **Rate limit per visitor.** In the Cloudflare dashboard add a rate limiting rule for your Worker (for example 10 requests a minute per IP).

## Testing locally

`ALLOWED_ORIGINS` in `wrangler.toml` lists the sites the Worker will answer. Add `http://localhost:8000` while testing, and remove it afterwards. Run the checks with `npm test` from the repo root.

## Limits you should know about

- **Argos has no ratings API.** Argos pages show up under "Argos and other retailers", but their star counts can't be read, so you open the listing yourself.
- **Amazon gives weighted percentages**, not buyer counts. The site treats them as a strong lead, not proof. Only hand-checked products reach the front-page shelf.
- Amazon search results are ordered by relevance. The Worker checks the lowest-rated listings among the ones Amazon returns, so a bad product buried deep in the results can be missed.
