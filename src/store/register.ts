'use client';
import { useSyncExternalStore } from 'react';
import type { Product, RegisterEntry, StockStatus, TrendRow } from '@/types';

/**
 * The shopkeeper's own register, kept in localStorage.
 *
 * This is an external store read through `useSyncExternalStore` rather than a
 * context holding `useState`: the server renders an empty register, the client
 * hydrates from storage on subscribe, and every write has a synchronous view of
 * the current list — so no stale closures and no effect that sets state.
 */

const KEY = 'trendkart.register.v1';

/** Stable reference for the server and for the first client render. */
const EMPTY: RegisterEntry[] = [];

/**
 * Two lines so a first-time visitor sees a working register rather than an empty
 * panel. The ids are catalogue slugs, written out here instead of imported so the
 * 120-row catalogue stays out of the client bundle; `SEED` is checked against the
 * catalogue in the test suite, which is where drift would otherwise hide.
 */
export const SEED: ReadonlyArray<
  Pick<RegisterEntry, 'id' | 'name' | 'category' | 'status' | 'rate'>
> = [
  {
    id: 'boat-type-c-a325-1-5m',
    name: 'boAt Type-C A325 1.5m',
    category: 'Cables',
    status: 'stocked',
    rate: 299,
  },
  {
    id: 'spigen-ultra-hybrid-magfit-iphone-16',
    name: 'Spigen Ultra Hybrid MagFit iPhone 16',
    category: 'Cases',
    status: 'ordered',
    rate: 1899,
  },
];

function seed(): RegisterEntry[] {
  const now = Date.now();
  return SEED.map((entry, index) => ({ ...entry, addedAt: now - index }));
}

let snapshot: RegisterEntry[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function isEntry(value: unknown): value is RegisterEntry {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Partial<RegisterEntry>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.name === 'string' &&
    typeof entry.category === 'string' &&
    (entry.status === 'stocked' ||
      entry.status === 'ordered' ||
      entry.status === 'out' ||
      entry.status === 'watching')
  );
}

function read(): RegisterEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return seed();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seed();
    const entries = parsed.filter(isEntry);
    return entries.map((entry) => ({ ...entry, addedAt: entry.addedAt ?? 0 }));
  } catch {
    // Unreadable or tampered storage — start clean rather than crash the page.
    return seed();
  }
}

function write(next: RegisterEntry[]) {
  snapshot = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private browsing or a full quota: the register still works this session.
  }
  listeners.forEach((notify) => notify());
}

function onStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== KEY) return;
  snapshot = read();
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void): () => void {
  if (!hydrated) {
    hydrated = true;
    snapshot = read();
    window.addEventListener('storage', onStorage);
  }
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => EMPTY;

/** The register as it stands. Re-renders on any change, including other tabs. */
export function useRegister(): RegisterEntry[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Adds a line. Returns false if it is already in the register. */
export function addProduct(product: Product, status: StockStatus): boolean {
  if (snapshot.some((entry) => entry.id === product.id)) return false;
  write([
    {
      id: product.id,
      name: product.name,
      category: product.category,
      status,
      rate: product.rate,
      addedAt: Date.now(),
    },
    ...snapshot,
  ]);
  return true;
}

/** Adds a search term to watch. Returns false if already watched. */
export function addKeyword(trend: TrendRow): boolean {
  const id = `kw-${trend.keyword.replace(/[^a-z0-9]+/gi, '-')}`;
  if (snapshot.some((entry) => entry.id === id)) return false;
  write([
    {
      id,
      name: trend.keyword,
      category: trend.category,
      status: 'watching',
      addedAt: Date.now(),
    },
    ...snapshot,
  ]);
  return true;
}

export function removeEntry(id: string): void {
  write(snapshot.filter((entry) => entry.id !== id));
}

export function setStatus(id: string, status: StockStatus): void {
  write(
    snapshot.map((entry) => (entry.id === id ? { ...entry, status } : entry)),
  );
}

/** Reset for tests. Not wired to any UI. */
export function __resetRegister(next: RegisterEntry[] = []): void {
  snapshot = next;
  hydrated = true;
  listeners.forEach((notify) => notify());
}
