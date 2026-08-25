'use client';
import type { Product, RegisterEntry } from '@/types';
import { coverageScore, getCoverage } from '@/lib/market';

/**
 * How much of the list you actually carry, row by row.
 *
 * Drawn with plain divs rather than a chart library: fifteen category labels
 * stay readable, it works before any JavaScript loads, and a ruled bar is closer
 * to the printed form this page is imitating than a rounded chart would be.
 */
export function Coverage({
  products,
  register,
}: {
  products: Product[];
  register: RegisterEntry[];
}) {
  const rows = getCoverage(products, register);
  const score = coverageScore(rows);
  const carried = rows.reduce((sum, row) => sum + row.inRegister, 0);
  const total = rows.reduce((sum, row) => sum + row.onList, 0);

  return (
    <section aria-labelledby="coverage-heading">
      <div className="border-rule-strong mb-3 flex items-baseline justify-between border-b pb-1">
        <h2 id="coverage-heading" className="text-xl font-bold">
          Coverage
        </h2>
        <span className="figure text-ink-soft text-xs">
          {carried} of {total} lines · {score}%
        </span>
      </div>

      <ul className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
        {rows.map((row) => {
          const filled = row.onList === 0 ? 0 : (row.inRegister / row.onList) * 100;
          return (
            <li key={row.category} className="flex items-center gap-2">
              <span className="font-condensed w-24 shrink-0 truncate text-[0.6875rem] tracking-[0.06em] uppercase">
                {row.category}
              </span>
              <div
                className="bg-sunk border-rule h-3 flex-1 border"
                role="img"
                aria-label={`${row.category}: ${row.inRegister} of ${row.onList} lines in register`}
              >
                <div
                  className={filled === 0 ? '' : 'bg-stamp h-full'}
                  style={{ width: `${filled}%` }}
                />
              </div>
              <span className="figure text-ink-faint w-10 text-right text-[0.6875rem]">
                {row.inRegister}/{row.onList}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
