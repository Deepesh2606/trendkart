import type { Category, Product, TrendRow } from '@/types';

/**
 * Curated sample catalogue for a Jalandhar mobile-accessories counter.
 *
 * These are representative street rates and MRPs for the Punjab market, hand
 * compiled — not a live feed. Nothing here is fetched, so the dashboard works
 * offline and renders instantly. When a real source is available, replace this
 * file's exports and leave `src/lib/market.ts` untouched.
 */
export const DATA_AS_OF = '2026-08-25';

/** [category, brand, model, rate, mrp, rating, reviews, isFresh?] */
type Row = [Category, string, string, number, number, number, string, boolean?];

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * Rows are listed in rank order within each category, so rank is derived from
 * position rather than stored twice and left to drift.
 */
const ROWS: Row[] = [
  // ── Cables ────────────────────────────────────────────────────────────────
  ['Cables', 'boAt', 'Type-C A325 1.5m', 299, 899, 4.4, '1L+'],
  ['Cables', 'Ambrane', '60W C-to-C Braided', 249, 599, 4.3, '62K+'],
  ['Cables', 'Portronics', 'Konnect L 1.2m', 179, 399, 4.1, '38K+'],
  ['Cables', 'Mi', '6A 120W Braided Type-C', 349, 799, 4.4, '45K+'],
  ['Cables', 'Realme', '65W SuperVOOC Type-C', 499, 799, 4.5, '18K+'],
  ['Cables', 'Spigen', 'DuraSync 3-in-1', 899, 1499, 4.5, '11K+'],
  ['Cables', 'Anker', '240W USB-C PD 3.1', 1499, 2499, 4.7, '9K+', true],
  ['Cables', 'Apple', 'USB-C to Lightning 1m', 1699, 1900, 4.6, '80K+'],

  // ── Chargers ──────────────────────────────────────────────────────────────
  ['Chargers', 'Ambrane', '20W PD Wall Charger', 399, 999, 4.2, '42K+'],
  ['Chargers', 'boAt', 'WCD 20W Dual Port', 349, 699, 4.0, '85K+'],
  ['Chargers', 'Spigen', 'ArcStation 30W GaN', 999, 1999, 4.4, '16K+'],
  ['Chargers', 'Portronics', 'Adapto 65W GaN Tri-Port', 1899, 3499, 4.5, '13K+'],
  ['Chargers', 'Apple', '20W USB-C Adapter', 1549, 1900, 4.6, '1.2L+'],
  ['Chargers', 'Samsung', '25W Travel Adapter', 1149, 1699, 4.5, '61K+'],
  ['Chargers', 'Anker', 'Nano 45W Qi2 MagGo Pad', 3299, 4999, 4.6, '6K+', true],
  ['Chargers', 'UGREEN', 'Nexode 100W GaN Desk', 4499, 6999, 4.7, '4K+', true],
  // ── Power Banks ───────────────────────────────────────────────────────────
  ['Power Banks', 'Mi', '10000mAh 22.5W Pocket', 999, 1799, 4.3, '1.5L+'],
  ['Power Banks', 'Ambrane', 'Stylo Slim 10000mAh 20W', 899, 1999, 4.2, '95K+'],
  ['Power Banks', 'boAt', 'Energyshroom PB300 10000mAh', 1099, 2499, 4.1, '70K+'],
  ['Power Banks', 'URBN', '20000mAh 22.5W', 1499, 2999, 4.3, '55K+'],
  ['Power Banks', 'Zebronics', 'ZEB-PG10000M Magnetic', 1299, 2499, 4.0, '12K+', true],
  ['Power Banks', 'pTron', 'Dynamo Slim 10000mAh', 749, 1499, 3.9, '40K+'],
  ['Power Banks', 'Anker', '622 MagGo Qi2 5000mAh', 3499, 5499, 4.5, '8K+', true],
  ['Power Banks', 'Anker', 'Prime 20000mAh 100W', 8999, 12999, 4.7, '3K+', true],

  // ── Cases ─────────────────────────────────────────────────────────────────
  ['Cases', 'TheGiftKart', 'Silicone Case iPhone 15', 349, 999, 4.1, '46K+'],
  ['Cases', 'Pikkme', 'Back Cover Redmi 13 5G', 199, 599, 4.0, '28K+'],
  ['Cases', 'Kapa', 'MagSafe Clear iPhone 16', 699, 1499, 4.3, '19K+'],
  ['Cases', 'Fntcase', 'Rugged Armour Redmi Note 14', 449, 1199, 4.2, '22K+'],
  ['Cases', 'Ringke', 'Fusion-X Galaxy S25', 1199, 2199, 4.5, '6K+', true],
  ['Cases', 'ESR', 'Classic Kickstand OnePlus 13', 999, 1799, 4.4, '5K+', true],
  ['Cases', 'DailyObjects', 'Plant-Based Eco Case', 1299, 1999, 4.6, '9K+'],
  ['Cases', 'Spigen', 'Ultra Hybrid MagFit iPhone 16', 1899, 2999, 4.8, '14K+'],

  // ── Screen Guards ─────────────────────────────────────────────────────────
  ['Screen Guards', 'Generic', '11D Tempered Glass (10 pack)', 99, 299, 3.9, '1.8L+'],
  ['Screen Guards', 'Generic', 'UV Curable Glass for Curved', 299, 799, 4.0, '60K+'],
  ['Screen Guards', 'Generic', 'Privacy Anti-Spy Glass', 249, 699, 4.1, '35K+'],
  ['Screen Guards', 'Generic', 'Camera Lens Ring (pack)', 149, 399, 4.0, '42K+'],
  ['Screen Guards', 'Nillkin', 'CP+ Pro Redmi Note 14', 449, 999, 4.4, '15K+'],
  ['Screen Guards', 'Spigen', 'GLAS.tR EZ Fit iPhone 16', 1499, 2499, 4.7, '11K+'],
  ['Screen Guards', 'Generic', 'Hydrogel Film Roll + Cutter', 1999, 4999, 4.2, '2K+', true],
  ['Screen Guards', 'Whitestone', 'Dome Galaxy S25 Ultra', 2999, 4499, 4.6, '3K+', true],
  // ── Earbuds ───────────────────────────────────────────────────────────────
  ['Earbuds', 'boAt', 'Airdopes 141', 1099, 4490, 4.2, '3L+'],
  ['Earbuds', 'Boult', 'Z40 Pro', 999, 4999, 4.1, '1.4L+'],
  ['Earbuds', 'Noise', 'Buds VS104 Pro', 1199, 3999, 4.1, '1.1L+'],
  ['Earbuds', 'pTron', 'Bassbuds Duo', 449, 1999, 3.8, '2.2L+'],
  ['Earbuds', 'OnePlus', 'Nord Buds 3 Pro', 2999, 3499, 4.4, '45K+'],
  ['Earbuds', 'Realme', 'Buds Air 8 Pro', 4299, 5999, 4.5, '12K+', true],
  ['Earbuds', 'Samsung', 'Galaxy Buds 3 FE', 6999, 8999, 4.5, '9K+', true],
  ['Earbuds', 'Apple', 'AirPods Pro 3', 24900, 26900, 4.7, '21K+', true],

  // ── Neckbands ─────────────────────────────────────────────────────────────
  ['Neckbands', 'boAt', 'Rockerz 255 Pro+', 899, 2990, 4.1, '2.6L+'],
  ['Neckbands', 'Boult', 'Curve Max', 799, 2999, 4.0, '90K+'],
  ['Neckbands', 'pTron', 'Tangent Sport', 399, 1299, 3.7, '75K+'],
  ['Neckbands', 'Noise', 'Nerve Pro', 749, 2499, 3.9, '55K+'],
  ['Neckbands', 'Realme', 'Buds Wireless 3 Neo', 1099, 1999, 4.2, '38K+'],
  ['Neckbands', 'OnePlus', 'Bullets Z2', 1699, 2199, 4.4, '1.3L+'],
  ['Neckbands', 'JBL', 'Tune 215BT', 1799, 2999, 4.3, '26K+'],
  ['Neckbands', 'Sony', 'WI-C100', 1799, 2990, 4.4, '30K+'],

  // ── Headphones ────────────────────────────────────────────────────────────
  ['Headphones', 'boAt', 'Rockerz 450', 1299, 3990, 4.2, '1.7L+'],
  ['Headphones', 'Zebronics', 'Zeb-Thunder Pro', 699, 1999, 3.9, '1.2L+'],
  ['Headphones', 'JBL', 'Tune 520BT', 2999, 4999, 4.4, '41K+'],
  ['Headphones', 'Skullcandy', 'Hesh Evo', 5999, 8999, 4.3, '7K+'],
  ['Headphones', 'Sony', 'WH-CH720N', 8990, 14990, 4.5, '24K+'],
  ['Headphones', 'Marshall', 'Major V', 14999, 19999, 4.6, '4K+', true],
  ['Headphones', 'Bose', 'QuietComfort SC', 26900, 32900, 4.7, '5K+'],
  ['Headphones', 'Sony', 'WH-1000XM6', 34990, 39990, 4.8, '6K+', true],

  // ── Smartwatches ──────────────────────────────────────────────────────────
  ['Smartwatches', 'Noise', 'ColorFit Pro 6', 3299, 7999, 4.3, '65K+', true],
  ['Smartwatches', 'boAt', 'Wave Sigma 3', 1799, 7990, 4.1, '1.9L+'],
  ['Smartwatches', 'Fire-Boltt', 'Ninja Call Pro Max', 1499, 9999, 4.0, '1.6L+'],
  ['Smartwatches', 'boAt', 'Lunar Discovery', 2499, 8999, 4.0, '52K+'],
  ['Smartwatches', 'Titan', 'Smart Pro 2', 4999, 9995, 4.2, '18K+'],
  ['Smartwatches', 'Amazfit', 'Bip 6', 5999, 8999, 4.5, '14K+', true],
  ['Smartwatches', 'Samsung', 'Galaxy Watch 8', 32999, 37999, 4.6, '8K+', true],
  ['Smartwatches', 'Apple', 'Watch Series 11', 46900, 46900, 4.8, '11K+', true],
  // ── Speakers ──────────────────────────────────────────────────────────────
  ['Speakers', 'boAt', 'Stone 358 Pro', 1699, 3990, 4.3, '2.1L+'],
  ['Speakers', 'boAt', 'Stone 320 Flame LED', 1299, 2990, 4.2, '88K+', true],
  ['Speakers', 'Mivi', 'Roam 2', 899, 1999, 4.1, '1L+'],
  ['Speakers', 'Zebronics', 'Zeb-County 2', 599, 1199, 4.0, '1.3L+'],
  ['Speakers', 'JBL', 'Go 4', 3299, 4499, 4.6, '33K+', true],
  ['Speakers', 'Sony', 'SRS-XB100', 3490, 4990, 4.5, '19K+'],
  ['Speakers', 'Tribit', 'StormBox 2', 4999, 7999, 4.4, '6K+'],
  ['Speakers', 'Marshall', 'Emberton III', 15999, 19999, 4.7, '3K+', true],

  // ── Party Speakers ────────────────────────────────────────────────────────
  ['Party Speakers', 'Generic', '12in DJ Trolley with Mic', 4499, 11999, 3.8, '18K+'],
  ['Party Speakers', 'Zebronics', 'Bomb X', 5999, 13999, 4.0, '31K+'],
  ['Party Speakers', 'boAt', 'PartyPal 200', 7999, 17990, 4.1, '22K+'],
  ['Party Speakers', 'Zebronics', 'Monster Pro 100', 8999, 19999, 4.2, '14K+'],
  ['Party Speakers', 'Blaupunkt', 'PS100 Trolley', 11999, 29999, 4.3, '8K+'],
  ['Party Speakers', 'Sony', 'ULT Field 3', 21990, 27990, 4.6, '4K+', true],
  ['Party Speakers', 'JBL', 'PartyBox Encore Essential', 24999, 32999, 4.6, '6K+'],
  ['Party Speakers', 'Blaupunkt', 'SBW600 Xceed Boombox', 64990, 159999, 4.5, '1K+', true],

  // ── Car Audio ─────────────────────────────────────────────────────────────
  ['Car Audio', 'Sony', 'XS-FB1620E 6.5in Coaxial', 2490, 3990, 4.4, '12K+'],
  ['Car Audio', 'Blaupunkt', 'GTx 662 MYSTIC 6.5in', 2799, 4999, 4.2, '6K+'],
  ['Car Audio', 'JBL', 'Stage2 624 6.5in Coaxial', 3499, 4999, 4.5, '5K+'],
  ['Car Audio', 'Pioneer', 'TS-A1670F 6.5in 3-Way', 4290, 5990, 4.6, '9K+'],
  ['Car Audio', 'Blaupunkt', 'AMP1804 4-Channel Amp', 6499, 11999, 4.1, '2K+'],
  ['Car Audio', 'Hertz', 'Dieci DSK 165.3 Component', 8990, 12990, 4.7, '2K+'],
  ['Car Audio', 'Sony', 'XS-W104ES 10in Subwoofer', 9990, 13990, 4.6, '3K+', true],
  ['Car Audio', 'Pioneer', 'TS-WX130DA Active Sub', 12990, 16990, 4.5, '4K+'],

  // ── Car Tech ──────────────────────────────────────────────────────────────
  ['Car Tech', 'Generic', 'T10 LED RGB Parking Bulbs (pair)', 129, 349, 4.2, '92K+'],
  ['Car Tech', 'Generic', 'Magnetic AC Vent Mount', 199, 499, 4.1, '62K+'],
  ['Car Tech', 'Generic', 'Dual USB 36W Car Charger', 249, 599, 4.0, '48K+'],
  ['Car Tech', 'Portronics', 'Auto 14 BT FM Receiver', 649, 1299, 4.3, '27K+'],
  ['Car Tech', 'Generic', 'Qi2 15W Wireless Car Mount', 999, 2499, 4.3, '14K+', true],
  ['Car Tech', 'Generic', 'Tyre Inflator 150PSI Digital', 1499, 3499, 4.4, '33K+', true],
  ['Car Tech', 'Blaupunkt', 'BP 2.0 Dash Cam', 3999, 7999, 4.2, '5K+'],
  ['Car Tech', '70mai', 'Dash Cam A510', 6499, 9990, 4.5, '7K+'],
  // ── Memory Cards ──────────────────────────────────────────────────────────
  ['Memory Cards', 'SanDisk', 'Ultra 128GB microSDXC', 799, 1800, 4.5, '3.2L+'],
  ['Memory Cards', 'Strontium', 'Nitro 32GB microSDHC', 299, 599, 4.1, '2L+'],
  ['Memory Cards', 'HP', '64GB microSDXC', 449, 900, 4.2, '52K+'],
  ['Memory Cards', 'Kingston', 'Canvas Select Plus 128GB', 899, 1599, 4.3, '31K+'],
  ['Memory Cards', 'SanDisk', 'Extreme 128GB A2', 1499, 3200, 4.7, '44K+'],
  ['Memory Cards', 'Samsung', 'EVO Plus 256GB', 1699, 3499, 4.6, '1.6L+'],
  ['Memory Cards', 'SanDisk', 'Ultra Dual Drive Luxe 128GB', 1199, 2400, 4.6, '68K+'],
  ['Memory Cards', 'Lexar', 'Play 256GB microSD', 1899, 3699, 4.4, '5K+', true],

  // ── Creator Kit ───────────────────────────────────────────────────────────
  ['Creator Kit', 'Generic', '10in Ring Light + Tripod', 549, 1599, 4.1, '1.1L+'],
  ['Creator Kit', 'Generic', 'Flexible Gorilla Tripod', 279, 699, 4.2, '1.6L+'],
  ['Creator Kit', 'Generic', 'Wireless Collar Mic Type-C', 449, 999, 3.9, '92K+'],
  ['Creator Kit', 'Generic', 'RGB Pocket Video Light', 749, 1999, 4.4, '34K+'],
  ['Creator Kit', 'Boya', 'BY-M1 Lavalier Mic', 899, 1999, 4.3, '48K+'],
  ['Creator Kit', 'Digitek', 'DTR 550LW Tripod', 1599, 2495, 4.5, '62K+'],
  ['Creator Kit', 'DJI', 'Osmo Mobile 7 Gimbal', 8499, 10999, 4.6, '5K+', true],
  ['Creator Kit', 'Hollyland', 'Lark M2 Wireless Mic', 11999, 15999, 4.7, '3K+', true],
];

const rankCounter = new Map<Category, number>();

export const PRODUCTS: Product[] = ROWS.map(
  ([category, brand, name, rate, mrp, rating, reviews, fresh]) => {
    const rank = (rankCounter.get(category) ?? 0) + 1;
    rankCounter.set(category, rank);
    return {
      id: slug(`${brand}-${name}`),
      name: `${brand} ${name}`,
      brand,
      category,
      rate,
      mrp,
      rating,
      reviews,
      rank,
      ...(fresh ? { fresh: true } : {}),
    };
  },
);

/**
 * What Punjab is searching for. Google retired the endpoint the old
 * `google-trends-api` package used, so this is compiled by hand from what
 * moves at the counter. Deltas are week on week.
 */
export const TRENDS: TrendRow[] = [
  { keyword: 'car subwoofer 10 inch', volume: '14K+', delta: 62, category: 'Car Audio' },
  { keyword: 'dj trolley speaker 12 inch', volume: '11K+', delta: 48, category: 'Party Speakers' },
  { keyword: 'qi2 magsafe car charger', volume: '9K+', delta: 41, category: 'Car Tech' },
  { keyword: 'component speaker set 6.5', volume: '8K+', delta: 33, category: 'Car Audio' },
  { keyword: 'slim power bank 10000mah', volume: '8K+', delta: 27, category: 'Power Banks' },
  { keyword: 'boat flame led speaker', volume: '7K+', delta: 22, category: 'Speakers' },
  { keyword: 'wireless collar mic type c', volume: '6K+', delta: 14, category: 'Creator Kit' },
  { keyword: 'hydrogel screen guard machine', volume: '5K+', delta: 9, category: 'Screen Guards' },
  { keyword: '120w charging cable', volume: '5K+', delta: -6, category: 'Cables' },
  { keyword: 'gorilla tripod stand', volume: '4K+', delta: -11, category: 'Creator Kit' },
  { keyword: 'neckband under 500', volume: '3K+', delta: -18, category: 'Neckbands' },
];
