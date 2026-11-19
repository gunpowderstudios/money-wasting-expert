'use strict';
const assert = require('node:assert/strict');
const R = require('../js/rating.js');
const D = require('../data/products.js');
let n = 0;
const t = (name, fn) => { fn(); n++; console.log('ok', n, name); };
const ev = (whole, total, mode = 'count') => R.evaluateRating({ whole, total, mode });

t('frying pan passes (41 low v 31 high, 79 total)', () => assert.equal(ev([37,4,7,5,26],79).state, 'pass'));
t('under 50 ratings is small, even if low wins', () => assert.equal(ev([20,10,5,2,2],39).state, 'small'));
t('exactly 50 ratings is allowed', () => assert.equal(ev([30,10,2,3,5],50).state, 'pass'));
t('tie does not pass', () => assert.equal(ev([20,10,10,10,20],70).state, 'no'));
t('high ratings winning does not pass', () => assert.equal(ev([5,5,10,30,50],100).state, 'no'));
t('thin margin is "close" (51 v 49 of 100)', () => assert.equal(ev([30,21,0,19,30],100).state, 'close'));
t('margin of exactly 10% passes', () => assert.equal(ev([35,20,0,15,30],100).state, 'pass'));
t('counts must add up to the total', () => assert.equal(ev([37,4,7,5,26],80).valid, false));
t('negative or fractional counts rejected', () => { assert.equal(ev([-1,4,7,5,26],41).valid, false); assert.equal(ev([1.5,4,7,5,26],43.5).valid, false); });
t('percentages: clear low win is a lead', () => assert.equal(ev([40,20,10,10,20],120,'percent').state, 'pass'));
t('percentages: within 2 points is uncertain', () => assert.equal(ev([26,15,19,20,20],120,'percent').state, 'uncertain'));
t('percentages: a 5-point lead is close, not a pass', () => assert.equal(ev([30,15,15,20,20],120,'percent').state, 'close'));
t('percentages: a 3-point deficit is no, not uncertain', () => assert.equal(ev([20,20,0,20,40],120,'percent').state, 'no'));
t('percentages over 100 or not summing to 100 rejected', () => { assert.equal(ev([120,0,0,0,0],120,'percent').valid, false); assert.equal(ev([10,10,10,10,10],120,'percent').valid, false); });

t('every featured product in the data passes the live rules', () => {
  assert.ok(D.featured.length >= 1);
  for (const f of D.featured) { const r = ev(f.whole, f.total, f.mode); assert.equal(r.state, 'pass', f.name); assert.match(f.productUrl, /^https:\/\//); assert.ok(f.sources.length); }
});
t('nothing in the audit passes the live rules (otherwise it belongs in featured)', () => {
  for (const a of D.audit) { const r = ev(a.whole, R.sum(a.whole)); assert.notEqual(r.state, 'pass', a.name); }
});
t('near misses really are near misses', () => {
  for (const f of D.nearMisses) assert.ok(R.isNearMiss(ev(f.whole, f.total, f.mode)), f.name);
});
t('every card id has a photo entry or is allowed not to', () => {
  for (const f of D.featured) assert.ok(D.photos[f.id], 'photo for ' + f.id);
});
t('version badge matches the top changelog heading', () => {
  const log = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'CHANGELOG.md'), 'utf8');
  assert.equal(log.match(/^## (v[\d.]+)/m)[1], D.whatsNew[0].version);
});
t('featured and audit ids are unique', () => {
  const ids = [...D.featured, ...D.nearMisses, ...D.audit].map(x => x.id);
  assert.equal(new Set(ids).size, ids.length);
});
console.log('\nAll ' + n + ' checks passed');
