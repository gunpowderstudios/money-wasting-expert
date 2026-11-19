# Money Wasting Expert — changelog and Claude handoff

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

- The app is static GitHub Pages. HTML, CSS, source snapshots, filtering, and the checker are in `index.html`. There is no backend, API credential, or live Amazon or Argos ratings scan.
- For a featured candidate, inspect the exact retailer listing and any variant aggregation first. Store the five raw counts in 1-star through 5-star order with the total, original review URL, short attributed excerpt, and a practical tip. Keep percentages and unverifiable or mismatched data out of the public feed. Recheck snapshots periodically before citing them elsewhere.
- The original Hacker News tool is still an optional discussion search, separate from retailer rating eligibility. Retailer discovery buttons open search-engine results externally. Checking pasted figures is local and does not submit or publish them.
- Preserve the paused shortlist data under `mwe-shortlist-v1`. Increment the header version with each published change and extend this changelog.
