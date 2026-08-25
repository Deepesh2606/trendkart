'use client';
import { useState } from 'react';
import { NotebookText } from 'lucide-react';
import { Clock } from '@/components/Clock';
import { StockRegister } from '@/components/StockRegister';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toasts } from '@/components/Toasts';
import { useRegister } from '@/store/register';

/**
 * The counter strip: who we are, the time, and the register.
 *
 * This is the only place the drawer's open state lives, which is why the strip
 * and the drawer are one component rather than two talking through a store.
 */
export function Chrome() {
  const [open, setOpen] = useState(false);
  const entries = useRegister();
  const onShelf = entries.filter((entry) => entry.status === 'stocked').length;

  return (
    <>
      <div className="bg-paper/95 border-rule-strong sticky top-0 z-30 border-b backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 sm:px-6">
          <span className="font-condensed text-sm font-bold tracking-[0.2em] uppercase">
            TrendKart
          </span>
          <span className="text-rule-strong hidden sm:inline" aria-hidden="true">
            |
          </span>
          <span className="form-label hidden sm:inline">Jalandhar counter</span>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Clock />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              className="border-rule-strong hover:bg-sunk flex items-center gap-2 border px-2.5 py-1.5 text-xs font-medium"
            >
              <NotebookText size={14} strokeWidth={1.75} aria-hidden="true" />
              <span className="font-condensed tracking-[0.08em] uppercase">
                Register
              </span>
              <span className="figure border-rule-strong border-l pl-2">
                {entries.length}
                {onShelf === entries.length ? '' : ` / ${onShelf} in`}
              </span>
            </button>
          </div>
        </div>
      </div>

      <StockRegister open={open} onClose={() => setOpen(false)} />
      <Toasts />
    </>
  );
}
