/** Rupees, no decimals, Indian digit grouping: 64990 -> "64,990". */
export function inr(value: number): string {
  return value.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

/** Signed percentage for week-on-week deltas: 62 -> "+62%". */
export function signedPct(value: number): string {
  return `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value)}%`;
}

/** A search link for a product or keyword, so a rate can be checked. */
export function searchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

/** "2026-08-25" -> "25 Aug 2026", without pulling in a date library. */
export function readableDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const name = months[Number(month) - 1] ?? month;
  return `${Number(day)} ${name} ${year}`;
}
