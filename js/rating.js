/* Money Wasting Expert: ratings test. Shared by the page and by tests/rating.test.js. */
(function (root) {
  'use strict';
  const MIN_RATINGS = 50;      // fewer total ratings than this is "small"
  const MIN_MARGIN = 0.10;     // low must beat high by at least 10% of all ratings (count mode)
  const PERCENT_TIE = 2;       // percentage points: rounded percentages closer than this are too close to call

  const sum = values => values.reduce((a, b) => a + b, 0);

  function evaluateRating(data) {
    if (!data || !['count', 'percent'].includes(data.mode) || !Array.isArray(data.whole) || data.whole.length !== 5 ||
        data.whole.some(n => !Number.isFinite(n) || n < 0) || !Number.isSafeInteger(data.total) || data.total < 1) return { valid: false };
    const values = data.whole;
    if (data.mode === 'count' && (values.some(n => !Number.isSafeInteger(n)) || sum(values) !== data.total)) return { valid: false };
    if (data.mode === 'percent' && (values.some(n => n > 100) || Math.abs(sum(values) - 100) > 2.51)) return { valid: false };
    const bad = values[0] + values[1], neutral = values[2], good = values[3] + values[4];
    const margin = bad - good;
    const small = data.total < MIN_RATINGS;
    let state;
    if (small) state = 'small';
    else if (data.mode === 'percent') state = Math.abs(margin) <= PERCENT_TIE ? 'uncertain' : margin < 0 ? 'no' : margin < MIN_MARGIN * 100 ? 'close' : 'pass';
    else if (margin <= 0) state = 'no';
    else state = margin / data.total >= MIN_MARGIN ? 'pass' : 'close';
    return { valid: true, state, bad, neutral, good, total: data.total, mode: data.mode, margin };
  }

  // States: pass (feature it), close (low beats high but under the margin), small (under 50 ratings),
  // uncertain (rounded percentages too close), no (high ratings win or tie).
  function explain(r) {
    if (!r.valid) return 'incomplete data';
    if (r.state === 'small') return 'under ' + MIN_RATINGS + ' ratings';
    if (r.state === 'close') return 'low beats high by less than ' + Math.round(MIN_MARGIN * 100) + '% of ratings';
    if (r.state === 'uncertain') return 'too close to call from rounded percentages';
    if (r.state === 'no') return r.bad === r.good ? 'low and high tied' : 'more high than low ratings';
    return 'passes';
  }

  // Is it a lead worth watching even though it doesn't pass? Low ratings must beat high ratings.
  function isNearMiss(r) { return r.valid && r.margin > 0 && (r.state === 'small' || r.state === 'close'); }

  function displayedRating(r) {
    const unit = r.mode === 'percent' ? '%' : '';
    const fmt = n => Number(n.toFixed(2)).toLocaleString('en-GB') + unit;
    return fmt(r.bad) + ' low (1–2★) · ' + fmt(r.good) + ' high (4–5★) · ' + fmt(r.neutral) + ' neutral (3★)';
  }

  const api = { MIN_RATINGS, MIN_MARGIN, sum, evaluateRating, explain, isNearMiss, displayedRating };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MWERating = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
