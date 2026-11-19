# Money Wasting Expert — changelog and Claude handoff

## v0.2.0 — clearer rules, tidier code

- **Stricter pass rule.** Low (1–2★) ratings must now beat high (4–5★) ratings by at least 10% of all ratings, on top of the 50-rating minimum. A 51 v 49 split is "too close", not "worst". The current featured pick still passes (41 low v 31 high of 79). Constants live in `js/rating.js` (`MIN_RATINGS`, `MIN_MARGIN`).
- **Watch list.** New "Not quite there yet" shelf for products where low beats high but the sample is small or the gap is thin. It stays hidden until `nearMisses[]` in `data/products.js` has an entry. Nothing was invented to fill it.
- **Checked-on dates.** Cards show when the counts were read (`checked`, YYYY-MM-DD). The frying pan's snapshot date was never recorded, so its card says so. **To do: recheck the Argos page and set `checked` for it.**
- **Checker produces a data entry.** After checking pasted counts, "Add it to the site" prints a ready-to-paste JSON entry for `featured`, `nearMisses` or `audit`, with today's date. It no longer takes hand-editing in four places.
- **Parser** also reads `5 stars (26)` style brackets.
- **Copy.** Hero line is now "Where more buyers gave 1–2 stars than 4–5. Check before you buy!". The version badge opens a "What's new" panel. The audit is titled "What didn't make the cut" and shows the reason for each product. The Hacker News research desk moved below the archive.
- **Code.** Product data moved to `data/products.js` (edit that, not `index.html`). Ratings logic moved to `js/rating.js`. Removed the disabled book shortlist, "Add a lead" form, photo upload and notes export. Browser data under `mwe-shortlist-v1` is not touched or deleted, so nothing is lost if the shortlist returns.
- **Tests.** `npm test` (or `node tests/rating.test.js`) runs 27 checks: pass/small/close/tie/no cases, percentage handling, parsing, mismatched totals, and that every featured product in the data passes the live rules and nothing in the audit does.

Known gaps: retailer photos are hotlinked and may break (a text fallback shows). There is still no live ratings scan; counts are pasted by hand.

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
- The original Hacker News tool is still an optional discussion search, separate from retailer rating eligibility. Retailer discovery buttons open search-engine results externally. Checking pasted figures is local and does not submit or publish them.
- Preserve the paused shortlist data under `mwe-shortlist-v1`. Add each release to the top of this file and to `whatsNew` in `data/products.js`. The version badge reads `whatsNew[0].version`, and a test checks it matches the top heading here.
