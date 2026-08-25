import { CATEGORIES } from '@/types';
import type { BuyLine, Category, CoverageRow, Product, RegisterEntry, TrendRow } from '@/types';
import { DATA_AS_OF, PRODUCTS, TRENDS } from '@/data/catalog';

/**
 * Everything the dashboard knows about the market comes through this file.
 * Today it reads a curated local catalogue; swapping in a live feed means
 * changing the four accessors below and nothing else.
 */

/**
 * Retail margin assumed when estimating what a line earns. Accessories carry
 * fatter margins at the bottom of the range and thinner ones at the top, so a
 * single flat percentage would flatter the cheap stuff and overstate the
 * premium stuff. These are rules of thumb, not quoted rates — the UI says so.
 */
const MARGIN_BANDS: Array<{ upTo: number; margin: number }> = [
  { upTo: 500, margin: 0.45 },
  { upTo: 2000, margin: 0.35 },
  { upTo: 10000, margin: 0.25 },
  { upTo: Infinity, margin: 0.15 },
];

export const MARGIN_NOTE =
  'Margin estimated at 45% under ₹500, 35% to ₹2,000, 25% to ₹10,000, then 15%.';

/** Assumed retail margin for a line, as a fraction. */
export function marginRate(rate: number): number {
  return MARGIN_BANDS.find((band) => rate <= band.upTo)!.margin;
}

/** Rupees earned per unit sold at the assumed margin. */
export function marginPerUnit(rate: number): number {
  return Math.round(rate * marginRate(rate));
}

/** Percent off MRP. Returns 0 when the line sells at MRP. */
export function discountOffMrp(rate: number, mrp: number): number {
  if (mrp <= rate) return 0;
  return Math.round((1 - rate / mrp) * 100);
}

export function getCategories(): readonly Category[] {
  return CATEGORIES;
}

export function getProducts(): Product[] {
  return PRODUCTS;
}

export function getProductsByCategory(category: Category): Product[] {
  return PRODUCTS.filter((product) => product.category === category);
}

export function getTrends(): TrendRow[] {
  return TRENDS;
}

export function getDataAsOf(): string {
  return DATA_AS_OF;
}

/** Lines added to the catalogue this season. */
export function getFreshProducts(): Product[] {
  return PRODUCTS.filter((product) => product.fresh);
}

/**
 * The three lines worth buying next, given what is already in the register.
 * One picked for margin, one for turnover, one for a hole in the range — a
 * shopkeeper cares about all three and they rarely point at the same item.
 *
 * Products are passed in rather than read from the catalogue so that the buy
 * list can be computed in the browser, where the register lives, without
 * dragging the whole catalogue into the client bundle.
 */
export function getBuyList(
  products: Product[],
  register: RegisterEntry[],
): BuyLine[] {
  const held = new Set(register.map((entry) => entry.name));
  const open = products.filter((product) => !held.has(product.name));
  const lines: BuyLine[] = [];
  const claim = (product: Product) => held.add(product.name);

  const byMargin = [...open].sort(
    (a, b) => marginPerUnit(b.rate) - marginPerUnit(a.rate),
  )[0];
  if (byMargin) {
    claim(byMargin);
    lines.push({
      product: byMargin,
      reason: `Thickest margin on the list. ${discountOffMrp(byMargin.rate, byMargin.mrp)}% under MRP leaves room to hold the price.`,
      perUnit: marginPerUnit(byMargin.rate),
      kind: 'margin',
    });
  }

  const byTurnover = [...open]
    .filter((product) => !held.has(product.name) && product.rate <= 1500)
    .sort((a, b) => reviewWeight(b.reviews) - reviewWeight(a.reviews))[0];
  if (byTurnover) {
    claim(byTurnover);
    lines.push({
      product: byTurnover,
      reason: `Fastest mover under ₹1,500 — ${byTurnover.reviews} reviews behind it. Buy deep, it clears.`,
      perUnit: marginPerUnit(byTurnover.rate),
      kind: 'volume',
    });
  }

  const stockedCategories = new Set(
    register
      .filter((entry) => entry.status !== 'out')
      .map((entry) => entry.category),
  );
  const byGap = open.find(
    (product) =>
      !held.has(product.name) &&
      product.rank === 1 &&
      !stockedCategories.has(product.category),
  );
  if (byGap) {
    claim(byGap);
    lines.push({
      product: byGap,
      reason: `Top seller in ${byGap.category} and you carry nothing in that row yet.`,
      perUnit: marginPerUnit(byGap.rate),
      kind: 'gap',
    });
  }

  return lines;
}

/** "1.2L+" / "45K+" as a rough number, for ranking by turnover. */
export function reviewWeight(reviews: string): number {
  const value = Number.parseFloat(reviews);
  if (Number.isNaN(value)) return 0;
  if (reviews.includes('L')) return value * 100_000;
  if (reviews.includes('K')) return value * 1_000;
  return value;
}

/** How much of each category the register actually covers. */
export function getCoverage(
  products: Product[],
  register: RegisterEntry[],
): CoverageRow[] {
  return CATEGORIES.map((category) => ({
    category,
    onList: products.filter((product) => product.category === category).length,
    inRegister: register.filter(
      (entry) => entry.category === category && entry.status !== 'out',
    ).length,
  }));
}

/** Share of the catalogue the register covers, as a percentage. */
export function coverageScore(rows: CoverageRow[]): number {
  const onList = rows.reduce((sum, row) => sum + row.onList, 0);
  const inRegister = rows.reduce((sum, row) => sum + row.inRegister, 0);
  if (onList === 0) return 0;
  return Math.round((inRegister / onList) * 100);
}
