'use client';
import { Plus } from 'lucide-react';
import type { Product, RegisterEntry } from '@/types';
import { inr } from '@/lib/format';
import { discountOffMrp, getBuyList } from '@/lib/market';
import { addProduct } from '@/store/register';
import { toast } from '@/store/toast';

const KIND_LABEL: Record<string, string> = {
  margin: 'Best margin',
  volume: 'Fastest mover',
  gap: 'Hole in the range',
};

/**
 * Three slips clipped to the top of the sheet: the lines worth buying next.
 * They change as the register fills up, which is the point — this is the one
 * part of the page that answers "so what do I do with this".
 */
export function BuyList({
  products,
  register,
}: {
  products: Product[];
  register: RegisterEntry[];
}) {
  const lines = getBuyList(products, register);

  return (
    <section aria-labelledby="buy-heading">
      <div className="border-rule-strong mb-3 flex items-baseline justify-between border-b pb-1">
        <h2 id="buy-heading" className="text-xl font-bold">
          Buy next
        </h2>
        <span className="form-label">Against your register</span>
      </div>

      {lines.length === 0 ? (
        <p className="text-ink-soft py-4 text-sm">
          Every line on the list is already in your register. Nothing left to
          suggest.
        </p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-3">
          {lines.map(({ product, reason, perUnit, kind }) => (
            <li
              key={product.id}
              className="bg-raised border-rule-strong border-l-stamp flex flex-col border border-l-4 p-3"
            >
              <p className="form-label text-stamp">{KIND_LABEL[kind]}</p>
              <h3 className="mt-1 text-base leading-snug font-semibold">
                {product.name}
              </h3>
              <p className="figure mt-2 text-sm">
                <span className="text-lg font-medium">₹{inr(product.rate)}</span>
                <span className="struck ml-2 text-xs">₹{inr(product.mrp)}</span>
                <span className="text-ink-faint ml-2 text-xs">
                  {discountOffMrp(product.rate, product.mrp)}% off
                </span>
              </p>
              <p className="text-ink-soft mt-2 flex-1 text-[0.8125rem] leading-relaxed">
                {reason}
              </p>
              <div className="border-rule mt-3 flex items-center justify-between border-t pt-2">
                <span className="figure text-gain text-sm">
                  ≈ ₹{inr(perUnit)}
                  <span className="text-ink-faint"> /unit</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const added = addProduct(product, 'ordered');
                    toast(
                      added
                        ? `${product.name} marked ordered`
                        : `${product.name} is already in the register`,
                      added ? 'ok' : 'warn',
                    );
                  }}
                  className="border-rule-strong hover:bg-sunk flex items-center gap-1 border px-2 py-1 text-xs font-medium"
                >
                  <Plus size={13} strokeWidth={2} aria-hidden="true" />
                  Mark ordered
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
