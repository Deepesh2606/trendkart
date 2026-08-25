'use client';
import { useEffect, useRef } from 'react';
import { Trash2, X } from 'lucide-react';
import type { RegisterEntry } from '@/types';
import { inr } from '@/lib/format';
import { STATUS_META, STOCK_STATUSES } from '@/lib/status';
import { removeEntry, setStatus, useRegister } from '@/store/register';

/**
 * The register drawer.
 *
 * The old version stayed in the tab order while off-screen, so a keyboard user
 * would tab into an invisible panel. Now it is `inert` and `aria-hidden` when
 * closed, focus moves in and back out, Escape closes it, and Tab wraps inside.
 */
export function StockRegister({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const entries = useRegister();
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreTo.current = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || panel.current === null) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (first === undefined || last === undefined) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      restoreTo.current?.focus();
    };
  }, [open, onClose]);

  const stocked = entries.filter((entry) => entry.status !== 'watching');
  const watching = entries.filter((entry) => entry.status === 'watching');

  return (
    <div
      className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={open ? undefined : true}
      inert={!open}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close register"
        onClick={onClose}
        className={`absolute inset-0 bg-black/35 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-heading"
        className={`bg-paper border-l-margin-red absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l-4 shadow-[-6px_0_24px_rgba(0,0,0,0.18)] transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="border-rule-strong flex items-baseline justify-between border-b px-4 py-3">
          <div>
            <h2 id="register-heading" className="text-lg font-bold">
              Stock register
            </h2>
            <p className="form-label mt-1">
              {stocked.length} lines · {watching.length} watching
            </p>
          </div>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            aria-label="Close register"
            className="border-rule-strong text-ink-soft hover:bg-sunk grid size-8 place-items-center border"
          >
            <X size={15} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {entries.length === 0 ? (
            <p className="text-ink-soft py-8 text-sm">
              Nothing written down yet. Add lines from the rate list and they
              show up here — the register is kept in this browser only.
            </p>
          ) : (
            <>
              <Group title="On the shelf" rows={stocked} />
              <Group title="Watching" rows={watching} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Group({ title, rows }: { title: string; rows: RegisterEntry[] }) {
  if (rows.length === 0) return null;
  return (
    <section className="mb-5">
      <h3 className="form-label border-rule border-b pb-1">{title}</h3>
      <ul>
        {rows.map((entry) => (
          <li key={entry.id} className="border-rule border-b py-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{entry.name}</p>
                <p className="form-label mt-0.5">
                  {entry.category}
                  {entry.rate === undefined ? '' : ` · ₹${inr(entry.rate)}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                aria-label={`Remove ${entry.name} from register`}
                className="text-ink-faint hover:text-margin-red shrink-0 p-1"
              >
                <Trash2 size={14} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
            {entry.status === 'watching' ? null : (
              <div
                className="mt-2 flex gap-1"
                role="group"
                aria-label={`Status for ${entry.name}`}
              >
                {STOCK_STATUSES.map((status) => {
                  const active = entry.status === status;
                  const meta = STATUS_META[status];
                  return (
                    <button
                      key={status}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setStatus(entry.id, status)}
                      className={`figure border px-2 py-0.5 text-[0.6875rem] uppercase ${
                        active
                          ? `${meta.className} bg-raised font-medium`
                          : 'border-rule text-ink-faint hover:border-rule-strong'
                      }`}
                    >
                      {meta.short}
                    </button>
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
