# Money Wasting Expert — changelog and Claude handoff

## v0.5.0 — hall of shame

- **Direction change.** The site is now a collection of the worst products we can find, for building a funny book, not a search tool. The search box, tested-listing search, live results and Hacker News panel were removed from the page.
- **Parked, not deleted.** The live-search Worker (`worker/`), `config.js` and the v0.4.0 page are kept. To bring search back: `git checkout v0.4.0-search -- index.html`, then follow `worker/README.md`.
- **New content.** `shame[]` in `data/products.js`: 11 products from named independent tests, each with a source link, the date the source was read, a paraphrase of the finding and an original joke (clearly labelled). Seven are from Which? Don't Buy round-ups (UK); four are from Consumer Reports' 2025 worst list as reported by BGR (US models). Safety-critical fails in those articles (child car seat, stroller, blood pressure monitor, cholesterol monitor, smoke alarm) were left out on purpose: not something to joke about. Where a maker disputed a finding, the card says so.
- **Page.** One grid of everything: customer-ratings pick, tested-and-failed, famous flops, parody. Filters by kind. Each card links to Amazon UK and Argos searches so you can look at the stars yourself.
- **Book shortlist is back.** "+ Add to book" on each card, notes per product, and "Download book notes" as markdown. It uses the same browser key as before (`mwe-shortlist-v1`), so anything saved earlier shows up again.
- **Evidence rules.** The 50-rating, 1–2★ test still decides the customer-ratings card. Lab-test cards are labelled as test results, not star ratings. Several Consumer Reports duds have high customer ratings (BGR figures are quoted), which is part of the joke.
- **Not possible from here:** reading Argos or Amazon star counts. The tools used to research this can't open those pages, so no new star counts were added.
- Tests: `tests/rating.test.js` now also checks every `shame[]` entry (sources are https, source date present, unique ids, no empty text).

## v0.4.0 — live search (optional)

- **Worker.** New `worker/` folder: a Cloudflare Worker that holds the API keys. `/api/amazon` (Rainforest API, Amazon UK) returns listings and the 1–5 star breakdown for the three lowest-rated ones with 50+ ratings. `/api/web` (Brave Search API) returns web results sorted into retailers (Argos etc.), independent sites and forums. Results are cached 24 hours, requests are limited to the site's origin, and an optional KV-backed daily cap stops runaway spend. Setup and costs are in `worker/README.md`.
- **Page.** Set `window.MWE_API` in `config.js` to turn it on. Search then shows live Amazon UK cards (pass / close / mostly well rated, with a low-neutral-high bar), Argos and other retailer pages, and independent reviews and forums. With no address set, nothing changes. Errors and the daily-limit message are shown plainly.
- **Rule fix.** Percentage breakdowns now need the same 10-point margin as counts (previously any lead over 2 points passed). Amazon is always treated as percentages, per the earlier policy: weighted, not buyer counts, never promoted to the front-page shelf automatically.
- **Argos.** Search finds Argos pages, but Argos has no ratings API, so counts there are still checked by hand.
- **Unverified.** The Rainforest docs don't state the exact key names inside `rating_breakdown`, so the parser accepts several shapes (`one_star`…`five_star` as numbers or `{count, percentage}`, or `1`…`5`) and reports `warnings` if it can't read one. Run the first-run check in `worker/README.md` once with real keys.
- Tests: `npm test` now also runs `tests/worker.test.mjs` (14 checks with stubbed providers: parsing, grouping, caching, origin lock, safe errors, daily limit).

## v0.3.0 — one search box

- Removed the "Check a product" paste checker and its data-entry helper and parser. One search box now sits at the top of the page.
- Search shows (1) tested listings that match, with their counts: featured picks, watch-list items, and audited products that don't pass; (2) links to search Amazon UK and Argos, plus Google, Reddit and Which?; (3) Hacker News discussion leads. If nothing tested matches, it says "We haven't tested that yet".
- The ratings rule is unchanged. It still lives in `js/rating.js` and drives the shelf and search.
- Not possible from a static page: live star counts. Amazon and Argos block browser requests and have no free ratings API. Live results would need a small backend plus a paid ratings data service.
- Adding a product is now a manual edit of `data/products.js` (see the comment at the top of that file).

## v0.2.0 — clearer rules, tidier code

- **Stricter pass rule.** Low (1–2★) ratings must now beat high (4–5★) ratings by at least 10% of all ratings, on top of the 50-rating minimum. A 51 v 49 split is "too close", not "worst". The current featured pick still passes (41 low v 31 high of 79). Constants live in `js/rating.js` (`MIN_RATINGS`, `MIN_MARGIN`).
- **Watch list.** New "Not quite there yet" shelf for products where low beats high but the sample is small or the gap is thin. It stays hidden until `nearMisses[]` in `data/products.js` has an entry. Nothing was invented to fill it.
- **Checked-on dates.** Cards show when the counts were read (`checked`, YYYY-MM-DD). The frying pan's snapshot date was never recorded, so its card says so. **To do: recheck the Argos page and set `checked` for it.**
- (Superseded in v0.3.0: the checker, its data-entry helper and the parser were removed.)
- **Copy.** Hero line is now "Where more buyers gave 1–2 stars than 4–5. Check before you buy!". The version badge opens a "What's new" panel. The audit is titled "What didn't make the cut" and shows the reason for each product. The Hacker News research desk moved below the archive.
- **Code.** Product data moved to `data/products.js` (edit that, not `index.html`). Ratings logic moved to `js/rating.js`. Removed the disabled book shortlist, "Add a lead" form, photo upload and notes export. Browser data under `mwe-shortlist-v1` is not touched or deleted, so nothing is lost if the shortlist returns.
- **Tests.** `npm test` (or `node tests/rating.test.js`) runs the ratings checks: pass/small/close/tie/no cases, percentage handling, mismatched totals, and that every featured product in the data passes the live rules and nothing in the audit does.

Known gaps: retailer photos are hotlinked and may break (a text fallback shows). There is still no live ratings scan; counts are entered by hand.

## v0.1.12 — ratings evidence and Amazon UK checking

- The front page only features listings backed by sourced counts across all five star buckets. Minimum 50 total ratings. 1–2 stars must strictly outnumber 4–5 stars. Three stars are neutral but count towards the minimum. Ties, incomplete breakdowns, and small samples are excluded.
- Audited the previous ten Argos picks. None passed in the available snapshots. The collapsible audit shows the figures and why each was removed. Core source for the new Home Essentials frying pan card is [Argos SKU 3084841](https://www.argos.co.uk/product/3084841/#reviews): 37 one-star, 4 two-star, 7 three-star, 5 four-star and 26 five-star ratings (79 total). Only one qualified product is featured. No padding to ten.
- Added retailer search shortcuts and an in-browser paste checker for all five star values. It handles Argos-style copied counts and Amazon UK’s displayed percentages with a separate total line, such as `88 global ratings`. Percentages can flag candidates but never automatically qualify a product for public display. Amazon uses a weighted breakdown, not raw buyer counts. Do not infer buyer counts from percentages or equate global/variant-pooled scores with exact-model local counts.
- Verified parsing and policy with 14 scripted checks, including passing and excluded samples, an Amazon percentage lead, close rounding, ties, missing or conflicting totals, and the visible featured and audit sections.

## Earlier releases

- **v0.1.9–v0.1.11** — Restyled the hero copy as Money on line one and Wasting Expert on line two, kept lime italics, and added the independent satire/non-affiliation footer note.
- **v0.1.7–v0.1.8** — Hid the book shortlist controls without deleting browser data. Added View product links distinct from the review links.
- **v0.1.4–v0.1.6** — Replaced illustrations with attributed product photos, updated the waste section heading, and changed the homepage tagline.
- **v0.1.3** — Introduced ten curated excerpts with one- and two-star filters, product evidence links, and practical tips on buying less. Distinguished original editorial asides from customer quotes.
- **v0.1.1–v0.1.2** — Added visible versioning and original product thumbnails, later replaced with photos.

## How it works and what isn't built

- The app is static GitHub Pages. Page and styles are in `index.html`, product data in `data/products.js`, and the ratings rules in `js/rating.js`. There is no backend, API credential, or live Amazon or Argos ratings scan.
- For a featured candidate, inspect the exact retailer listing and any variant aggregation first. Store the five raw counts in 1-star through 5-star order with the total, original review URL, short attributed excerpt, and a practical tip. Keep percentages and unverifiable or mismatched data out of the public feed. Recheck snapshots periodically before citing them elsewhere.
- The original Hacker News tool is still an optional discussion search, separate from retailer rating eligibility. Retailer discovery buttons open search-engine results externally.
- Preserve the paused shortlist data under `mwe-shortlist-v1`. Add each release to the top of this file and to `whatsNew` in `data/products.js`. The version badge reads `whatsNew[0].version`, and a test checks it matches the top heading here.
