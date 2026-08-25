import { Chrome } from '@/components/Chrome';
import { Sheet } from '@/components/Sheet';
import { Stamp } from '@/components/Stamp';
import { readableDate } from '@/lib/format';
import {
  MARGIN_NOTE,
  getCategories,
  getDataAsOf,
  getProducts,
  getTrends,
} from '@/lib/market';

/**
 * A Server Component. Nothing here is fetched on the client, so there is no
 * loading state, no waterfall, and no second request for the same rows — the
 * catalogue is read once on the server and handed to `Sheet` as props.
 */
export default function Home() {
  const products = getProducts();
  const categories = getCategories();
  const trends = getTrends();
  const asOf = getDataAsOf();

  return (
    <>
      <Chrome />

      <header className="border-rule-strong border-b">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-4 pt-8 pb-6 sm:px-6">
          <div>
            <h1 className="text-4xl leading-none font-bold tracking-tight sm:text-5xl">
              TrendKart
            </h1>
            <p className="font-condensed text-ink-soft mt-2 text-base tracking-[0.14em] uppercase">
              Rate list &amp; stock register
            </p>
            <p className="figure text-ink-faint mt-3 text-xs">
              {products.length} lines · {categories.length} rows · Jalandhar
              street rates · as of {readableDate(asOf)}
            </p>
          </div>
          <Stamp asOf={asOf} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Sheet
          products={products}
          categories={categories}
          trends={trends}
          marginNote={MARGIN_NOTE}
        />
      </main>

      <footer className="border-rule-strong mt-8 border-t">
        <div className="text-ink-soft mx-auto max-w-6xl space-y-2 px-4 py-6 text-xs leading-relaxed sm:px-6">
          <p>
            <strong className="text-ink font-semibold">
              Where these numbers come from.
            </strong>{' '}
            The catalogue is hand-compiled from what moves at a Punjab
            accessories counter — representative street rates and printed MRPs,
            not a live price feed and not affiliated with any retailer. Margins
            are estimates: {MARGIN_NOTE.toLowerCase()} Search volumes and weekly
            deltas are indicative bands.
          </p>
          <p>
            Your register is stored in this browser only. Nothing is uploaded,
            and clearing site data clears it.
          </p>
          <p className="figure text-ink-faint">
            Data as of {readableDate(asOf)} · swap the catalogue for a live feed
            in src/lib/market.ts
          </p>
        </div>
      </footer>
    </>
  );
}
