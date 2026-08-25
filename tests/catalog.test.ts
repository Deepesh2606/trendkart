import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CATEGORIES } from '@/types';
import { DATA_AS_OF, PRODUCTS, TRENDS } from '@/data/catalog';

/**
 * Catalogue integrity. Run with:
 *   node --experimental-strip-types --test tests/
 *
 * These are the invariants the UI silently relies on: unique ids for React keys
 * and register lookups, MRP never below the street rate (or the struck-price
 * signature reads as nonsense), and contiguous ranks per category.
 */

test('every product id is unique', () => {
  const seen = new Map<string, string>();
  for (const product of PRODUCTS) {
    assert.equal(
      seen.has(product.id),
      false,
      `duplicate id "${product.id}" — ${seen.get(product.id)} and ${product.name}`,
    );
    seen.set(product.id, product.name);
  }
});

test('ids are url-safe slugs', () => {
  for (const product of PRODUCTS) {
    assert.match(product.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, product.name);
  }
});

test('street rate never exceeds MRP', () => {
  for (const product of PRODUCTS) {
    assert.ok(
      product.rate <= product.mrp,
      `${product.name}: rate ${product.rate} > mrp ${product.mrp}`,
    );
  }
});

test('rates and MRPs are positive whole rupees', () => {
  for (const product of PRODUCTS) {
    for (const value of [product.rate, product.mrp]) {
      assert.ok(Number.isInteger(value) && value > 0, product.name);
    }
  }
});

test('ratings sit on the 1-5 scale', () => {
  for (const product of PRODUCTS) {
    assert.ok(
      product.rating >= 1 && product.rating <= 5,
      `${product.name}: ${product.rating}`,
    );
  }
});

test('review counts parse as printed bands', () => {
  for (const product of PRODUCTS) {
    assert.match(product.reviews, /^\d+(\.\d)?[KL]\+$/, product.name);
  }
});

test('every category is populated and ranks run 1..n', () => {
  for (const category of CATEGORIES) {
    const rows = PRODUCTS.filter((product) => product.category === category);
    assert.ok(rows.length > 0, `${category} has no lines`);
    assert.deepEqual(
      rows.map((product) => product.rank),
      rows.map((_, index) => index + 1),
      `${category} ranks are not contiguous`,
    );
  }
});

test('no product sits outside the declared categories', () => {
  const known = new Set<string>(CATEGORIES);
  for (const product of PRODUCTS) {
    assert.ok(known.has(product.category), `${product.name}: ${product.category}`);
  }
});

test('trends point at real categories and carry a delta', () => {
  const known = new Set<string>(CATEGORIES);
  for (const trend of TRENDS) {
    assert.ok(known.has(trend.category), trend.keyword);
    assert.ok(Number.isInteger(trend.delta), trend.keyword);
    assert.match(trend.volume, /^\d+(\.\d)?[KL]\+$/, trend.keyword);
  }
  assert.ok(
    TRENDS.some((trend) => trend.delta < 0),
    'a trend list where nothing is cooling off is not a trend list',
  );
});

test('the as-of date is a real ISO day, not a future one', () => {
  assert.match(DATA_AS_OF, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(Number.isNaN(Date.parse(DATA_AS_OF)), false);
});
