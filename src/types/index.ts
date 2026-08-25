/** Product categories, ordered as they appear in the rate list. */
export const CATEGORIES = [
  'Cables',
  'Chargers',
  'Power Banks',
  'Cases',
  'Screen Guards',
  'Earbuds',
  'Neckbands',
  'Headphones',
  'Smartwatches',
  'Speakers',
  'Party Speakers',
  'Car Audio',
  'Car Tech',
  'Memory Cards',
  'Creator Kit',
] as const;

export type Category = (typeof CATEGORIES)[number];

/** A single line on the rate list. */
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  /** Street rate in rupees — what a Jalandhar shop actually sells at. */
  rate: number;
  /** Printed MRP in rupees. Always >= rate. */
  mrp: number;
  rating: number;
  /** Review count as printed on the listing, e.g. "1.2L+". */
  reviews: string;
  /** Rank within its category. 1 is the top seller. */
  rank: number;
  /** True for lines that are new or newly moving this season. */
  fresh?: boolean;
}

/** What people in Punjab are searching for. */
export interface TrendRow {
  keyword: string;
  /** Search volume as a printed band, e.g. "12K+". */
  volume: string;
  /** Week-on-week change in percent. Negative means cooling off. */
  delta: number;
  category: Category;
}

export type StockStatus = 'stocked' | 'ordered' | 'out' | 'watching';

/** A line in the shopkeeper's own register. */
export interface RegisterEntry {
  id: string;
  name: string;
  category: string;
  status: StockStatus;
  /** Rate at the time it was added, if it came from the rate list. */
  rate?: number;
  addedAt: number;
}

/** One reason to buy something, shown on the buy list. */
export interface BuyLine {
  product: Product;
  /** Short reason this made the list, in the shopkeeper's terms. */
  reason: string;
  /** Rupees earned per unit at the assumed margin. */
  perUnit: number;
  kind: 'margin' | 'volume' | 'gap';
}

/** Market supply vs the register, per category. */
export interface CoverageRow {
  category: Category;
  onList: number;
  inRegister: number;
}
