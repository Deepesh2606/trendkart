'use client';
import { useNow } from '@/store/clock';

const TIME = new Intl.DateTimeFormat('en-IN', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});

const DAY = new Intl.DateTimeFormat('en-IN', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

/** Counter clock. Shows dashes for the single frame before it starts ticking. */
export function Clock() {
  const now = useNow();
  if (now === 0) {
    return (
      <span className="figure text-ink-faint text-xs" aria-hidden="true">
        --:-- --
      </span>
    );
  }
  const at = new Date(now);
  return (
    <span className="figure text-ink-soft text-xs whitespace-nowrap">
      <span className="text-ink-faint">{DAY.format(at)}</span>{' '}
      <span className="tabular-nums">{TIME.format(at)}</span>
    </span>
  );
}
