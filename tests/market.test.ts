import assert from 'node:assert/strict';
import { test } from 'node:test';
import { PRODUCTS } from '@/data/catalog';
import {
  coverageScore,
  discountOffMrp,
  getBuyList,
  getCoverage,
  marginPerUnit,
  marginRate,
  reviewWeight,
} from '@/lib/market';
import { inr, readableDate, signedPct } from '@/lib/format';
import type { RegisterEntry } from '@/types';

/** The maths the buy list is built on, and the formatting it is printed in. */

function entry(
  id: string,
  name: string,
  category: string,
  status: RegisterEntry['status'] = 'stocked',
): RegisterEntry {
  return { id, name, category, status, addedAt: 0 };
}

test('margin bands apply at their boundaries, not past them', () => {
  assert.equal(marginRate(499), 0.45);
  assert.equal(marginRate(500), 0.45);
  assert.equal(marginRate(501), 0.35);
  assert.equal(marginRate(2000), 0.35);
  assert.equal(marginRate(2001), 0.25);
  assert.equal(marginRate(10_000), 0.25);
  assert.equal(marginRate(10_001), 0.15);
  assert.equal(marginRate(64_990), 0.15);
});

test('margin per unit is whole rupees', () => {
  assert.equal(marginPerUnit(299), 135);
  assert.equal(marginPerUnit(1899), 665);
  for (const product of PRODUCTS) {
    assert.ok(Number.isInteger(marginPerUnit(product.rate)), product.name);
  }
});

test('discount off MRP is 0 when a line sells at or above MRP', () => {
  assert.equal(discountOffMrp(299, 899), 67);
  assert.equal(discountOffMrp(46_900, 46_900), 0);
  assert.equal(discountOffMrp(1000, 900), 0);
});

test('review bands convert to comparable numbers', () => {
  assert.equal(reviewWeight('1.2L+'), 120_000);
  assert.equal(reviewWeight('45K+'), 45_000);
  assert.equal(reviewWeight('3L+'), 300_000);
  assert.equal(reviewWeight('nonsense'), 0);
  assert.ok(reviewWeight('1L+') > reviewWeight('90K+'));
});

test('the buy list gives three distinct lines for an empty register', () => {
  const lines = getBuyList(PRODUCTS, []);
  assert.equal(lines.length, 3);
  assert.deepEqual(
    lines.map((line) => line.kind),
    ['margin', 'volume', 'gap'],
  );
  assert.equal(new Set(lines.map((line) => line.product.id)).size, 3);
});

test('the buy list never suggests something already in the register', () => {
  const first = getBuyList(PRODUCTS, [])[0]!;
  const after = getBuyList(PRODUCTS, [
    entry(first.product.id, first.product.name, first.product.category),
  ]);
  assert.equal(
    after.some((line) => line.product.id === first.product.id),
    false,
  );
});

test('the turnover pick stays under the counter price ceiling', () => {
  const volume = getBuyList(PRODUCTS, []).find((line) => line.kind === 'volume');
  assert.ok(volume);
  assert.ok(volume.product.rate <= 1500);
});

test('coverage counts what is held and ignores out-of-stock lines', () => {
  const rows = getCoverage(PRODUCTS, [
    entry('a', 'boAt Type-C A325 1.5m', 'Cables'),
    entry('b', 'Ambrane 60W C-to-C Braided', 'Cables', 'out'),
  ]);
  const cables = rows.find((row) => row.category === 'Cables');
  assert.ok(cables);
  assert.equal(cables.inRegister, 1);
  assert.equal(cables.onList, 8);
  assert.equal(coverageScore(rows), Math.round((1 / PRODUCTS.length) * 100));
});

test('coverage of an empty catalogue does not divide by zero', () => {
  assert.equal(coverageScore([]), 0);
});

test('rupees use Indian digit grouping', () => {
  assert.equal(inr(64_990), '64,990');
  assert.equal(inr(159_999), '1,59,999');
  assert.equal(inr(99), '99');
});

test('deltas print with a sign and a real minus glyph', () => {
  assert.equal(signedPct(62), '+62%');
  assert.equal(signedPct(-18), '−18%');
  assert.equal(signedPct(0), '0%');
});

test('dates read the way a shopkeeper writes them', () => {
  assert.equal(readableDate('2026-08-25'), '25 Aug 2026');
  assert.equal(readableDate('2026-01-01'), '1 Jan 2026');
});
