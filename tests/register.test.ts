import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { PRODUCTS } from '@/data/catalog';
import {
  SEED,
  __resetRegister,
  addKeyword,
  addProduct,
  removeEntry,
  setStatus,
} from '@/store/register';

/**
 * The register store, exercised without a browser.
 *
 * A fake localStorage is enough: the store reads storage only inside its own
 * functions, never at import time, so it can be stubbed here. Nothing in this
 * file renders — `useRegister` is the only part that needs React.
 */
const store = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
  },
});

beforeEach(() => {
  store.clear();
  __resetRegister([]);
});

test('the seeded rows still match the catalogue', () => {
  for (const seeded of SEED) {
    const product = PRODUCTS.find((candidate) => candidate.id === seeded.id);
    assert.ok(product, `seed id "${seeded.id}" is no longer in the catalogue`);
    assert.equal(seeded.name, product.name);
    assert.equal(seeded.category, product.category);
    assert.equal(seeded.rate, product.rate);
  }
});

test('adding a line writes it to storage', () => {
  const product = PRODUCTS[0]!;
  assert.equal(addProduct(product, 'stocked'), true);
  const raw = store.get('trendkart.register.v1');
  assert.ok(raw);
  const parsed = JSON.parse(raw) as Array<{ id: string; status: string }>;
  assert.deepEqual(parsed.map((row) => row.id), [product.id]);
  assert.equal(parsed[0]!.status, 'stocked');
});

test('the same line cannot be added twice', () => {
  const product = PRODUCTS[0]!;
  assert.equal(addProduct(product, 'stocked'), true);
  assert.equal(addProduct(product, 'ordered'), false);
  const parsed = JSON.parse(store.get('trendkart.register.v1')!) as unknown[];
  assert.equal(parsed.length, 1);
});

test('newest lines sit at the top', () => {
  addProduct(PRODUCTS[0]!, 'stocked');
  addProduct(PRODUCTS[1]!, 'stocked');
  const parsed = JSON.parse(store.get('trendkart.register.v1')!) as Array<{
    id: string;
  }>;
  assert.deepEqual(parsed.map((row) => row.id), [
    PRODUCTS[1]!.id,
    PRODUCTS[0]!.id,
  ]);
});

test('watched keywords get a stable slug id and watching status', () => {
  const trend = {
    keyword: 'car subwoofer 10 inch',
    volume: '14K+',
    delta: 62,
    category: 'Car Audio',
  } as const;
  assert.equal(addKeyword(trend), true);
  assert.equal(addKeyword(trend), false);
  const parsed = JSON.parse(store.get('trendkart.register.v1')!) as Array<{
    id: string;
    status: string;
  }>;
  assert.equal(parsed[0]!.id, 'kw-car-subwoofer-10-inch');
  assert.equal(parsed[0]!.status, 'watching');
});

test('status changes touch only the row asked for', () => {
  addProduct(PRODUCTS[0]!, 'stocked');
  addProduct(PRODUCTS[1]!, 'stocked');
  setStatus(PRODUCTS[0]!.id, 'out');
  const rows = JSON.parse(store.get('trendkart.register.v1')!) as Array<{
    id: string;
    status: string;
  }>;
  assert.equal(rows.find((row) => row.id === PRODUCTS[0]!.id)!.status, 'out');
  assert.equal(
    rows.find((row) => row.id === PRODUCTS[1]!.id)!.status,
    'stocked',
  );
});

test('removing a line leaves the rest alone', () => {
  addProduct(PRODUCTS[0]!, 'stocked');
  addProduct(PRODUCTS[1]!, 'stocked');
  removeEntry(PRODUCTS[0]!.id);
  const rows = JSON.parse(store.get('trendkart.register.v1')!) as Array<{
    id: string;
  }>;
  assert.deepEqual(rows.map((row) => row.id), [PRODUCTS[1]!.id]);
});

test('a corrupt storage payload does not throw', () => {
  store.set('trendkart.register.v1', '{ not json');
  assert.doesNotThrow(() => addProduct(PRODUCTS[0]!, 'stocked'));
});
