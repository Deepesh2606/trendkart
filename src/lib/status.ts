import type { StockStatus } from '@/types';

/** How each status is written and coloured, in one place. */
export const STATUS_META: Record<
  StockStatus,
  { label: string; short: string; className: string }
> = {
  stocked: {
    label: 'In stock',
    short: 'In',
    className: 'text-gain border-gain',
  },
  ordered: {
    label: 'Ordered',
    short: 'Ord',
    className: 'text-hold border-hold',
  },
  out: {
    label: 'Out of stock',
    short: 'Out',
    className: 'text-margin-red border-margin-red',
  },
  watching: {
    label: 'Watching',
    short: 'Watch',
    className: 'text-stamp border-stamp',
  },
};

/** The three statuses a stocked line can be cycled between at the counter. */
export const STOCK_STATUSES: StockStatus[] = ['stocked', 'ordered', 'out'];
