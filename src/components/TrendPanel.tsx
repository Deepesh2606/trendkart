'use client';
import { Eye, EyeOff } from 'lucide-react';
import type { RegisterEntry, TrendRow } from '@/types';
import { signedPct } from '@/lib/format';
import { addKeyword, removeEntry } from '@/store/register';
import { toast } from '@/store/toast';

function watchId(keyword: string): string {
  return `kw-${keyword.replace(/[^a-z0-9]+/gi, '-')}`;
}

/**
 * What Punjab is typing into search, week on week. Deltas are drawn as bars
 * running out from a centre line so a cooling row reads as clearly as a hot one
 * — a table of coloured percentages hides the shape of it.
 */
export function TrendPanel({
  trends,
  register,
}: {
  trends: TrendRow[];
  register: RegisterEntry[];
}) {
  const watched = new Set(register.map((entry) => entry.id));
  const peak = Math.max(...trends.map((trend) => Math.abs(trend.delta)), 1);

  return (
    <section aria-labelledby="trend-heading">
      <div className="border-rule-strong mb-3 flex items-baseline justify-between border-b pb-1">
        <h2 id="trend-heading" className="text-xl font-bold">
          Searches this week
        </h2>
        <span className="form-label">Punjab · week on week</span>
      </div>

      <ul>
        {trends.map((trend) => {
          const id = watchId(trend.keyword);
          const isWatched = watched.has(id);
          const rising = trend.delta >= 0;
          return (
            <li
              key={trend.keyword}
              className="border-rule grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-b py-2 sm:grid-cols-[1fr_5rem_7rem_auto]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{trend.keyword}</p>
                <p className="form-label mt-0.5">{trend.category}</p>
              </div>

              <span className="figure text-ink-soft hidden text-xs sm:block">
                {trend.volume}
              </span>

              <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                <div className="bg-sunk relative h-2 flex-1">
                  <div
                    className={`absolute inset-y-0 ${rising ? 'bg-gain left-1/2' : 'bg-margin-red right-1/2'}`}
                    style={{
                      width: `${(Math.abs(trend.delta) / peak) * 50}%`,
                    }}
                  />
                  <div className="bg-rule-strong absolute inset-y-[-2px] left-1/2 w-px" />
                </div>
                <span
                  className={`figure w-12 text-right text-xs ${rising ? 'text-gain' : 'text-margin-red'}`}
                >
                  {signedPct(trend.delta)}
                </span>
              </div>

              <button
                type="button"
                aria-pressed={isWatched}
                onClick={() => {
                  if (isWatched) {
                    removeEntry(id);
                    toast(`Stopped watching "${trend.keyword}"`, 'warn');
                    return;
                  }
                  addKeyword(trend);
                  toast(`Watching "${trend.keyword}"`);
                }}
                className={`flex items-center gap-1 border px-2 py-1 text-xs ${
                  isWatched
                    ? 'border-stamp text-stamp bg-raised'
                    : 'border-rule-strong text-ink-soft hover:bg-sunk'
                }`}
              >
                {isWatched ? (
                  <EyeOff size={13} strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <Eye size={13} strokeWidth={1.75} aria-hidden="true" />
                )}
                <span className="hidden sm:inline">
                  {isWatched ? 'Watching' : 'Watch'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
