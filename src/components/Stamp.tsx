import { readableDate } from '@/lib/format';

/**
 * The rubber stamp. It exists to keep one promise the old dashboard broke: this
 * catalogue is hand-compiled sample data, and the page says so where you cannot
 * miss it rather than in a tooltip.
 */
export function Stamp({ asOf }: { asOf: string }) {
  return (
    <div
      className="stamp-mark inline-flex flex-col items-center px-3 py-1.5 leading-tight select-none"
      role="note"
    >
      <span className="text-[0.8125rem] font-bold">Sample data</span>
      <span className="figure text-[0.625rem] tracking-[0.12em] opacity-80">
        {readableDate(asOf)}
      </span>
    </div>
  );
}
