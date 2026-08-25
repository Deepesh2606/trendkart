'use client';
import { useState } from 'react';
import { Check, Plus, Search } from 'lucide-react';
import type { Category, Product, RegisterEntry } from '@/types';
import { inr, searchUrl } from '@/lib/format';
import { discountOffMrp, marginPerUnit } from '@/lib/market';
import { STATUS_META } from '@/lib/status';
import { addProduct } from '@/store/register';
import { toast } from '@/store/toast';

const FRESH_TAB = 'New in';

/**
 * The rate list itself: street rate against printed MRP, row by row, in the
 * order things actually sell. Kept as a real table — it is tabular data, and a
 * screen reader should be able to read the rate column as a rate column.
 */
export function RateList({
  products,
  categories,
  register,
  marginNote,
}: {
  products: Product[];
  categories: readonly Category[];
  register: RegisterEntry[];
  marginNote: string;
}) {
  const [tab, setTab] = useState<Category | typeof FRESH_TAB>(FRESH_TAB);
  const [query, setQuery] = useState('');

  const held = new Map(register.map((entry) => [entry.id, entry]));
  const needle = query.trim().toLowerCase();
  const rows = products
    .filter((product) =>
      tab === FRESH_TAB ? product.fresh === true : product.category === tab,
    )
    .filter(
      (product) =>
        needle === '' || product.name.toLowerCase().includes(needle),
    );

  return (
    <section aria-labelledby="rate-heading">
      <div className="border-rule-strong mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b pb-1">
        <h2 id="rate-heading" className="text-xl font-bold">
          Rate list
        </h2>
        <span className="form-label">{products.length} lines · rank order</span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div
          className="-mx-1 flex flex-1 gap-1 overflow-x-auto px-1 pb-1"
          role="group"
          aria-label="Category"
        >
          {[FRESH_TAB, ...categories].map((name) => {
            const active = tab === name;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                onClick={() => setTab(name as Category | typeof FRESH_TAB)}
                className={`font-condensed shrink-0 border px-2.5 py-1 text-xs tracking-[0.06em] whitespace-nowrap uppercase ${
                  active
                    ? 'border-ink bg-ink text-paper'
                    : 'border-rule text-ink-soft hover:border-rule-strong'
                } ${name === FRESH_TAB && !active ? 'text-stamp border-stamp/50' : ''}`}
              >
                {name}
              </button>
            );
          })}
        </div>

        <label className="border-rule-strong bg-raised flex items-center gap-2 border px-2 py-1">
          <Search
            size={13}
            strokeWidth={1.75}
            aria-hidden="true"
            className="text-ink-faint"
          />
          <span className="sr-only">Search this list</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a line"
            className="w-28 bg-transparent text-xs outline-none sm:w-40"
          />
        </label>
      </div>

      <div className="border-l-margin-red overflow-x-auto border-l-2 pl-3">
        <table className="w-full border-collapse text-left">
          <caption className="text-ink-faint mt-2 caption-bottom text-left text-[0.6875rem]">
            {marginNote} Rates are representative street rates, not quotes.
          </caption>
          <thead>
            <tr className="border-rule-strong border-b">
              <th scope="col" className="form-label w-8 pb-1">
                #
              </th>
              <th scope="col" className="form-label pb-1">
                Line
              </th>
              <th scope="col" className="form-label pb-1 text-right">
                Rate
              </th>
              <th scope="col" className="form-label hidden pb-1 text-right sm:table-cell">
                Margin
              </th>
              <th scope="col" className="form-label hidden pb-1 text-right md:table-cell">
                Rating
              </th>
              <th scope="col" className="form-label pb-1 text-right">
                <span className="sr-only">Register</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => {
              const entry = held.get(product.id);
              return (
                <tr key={product.id} className="border-rule hover:bg-raised border-b align-top">
                  <td className="figure text-ink-faint py-2 text-xs">
                    {product.rank}
                  </td>
                  <td className="py-2 pr-3">
                    <a
                      href={searchUrl(`${product.name} price`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="decoration-rule-strong text-sm font-medium underline-offset-2 hover:underline"
                    >
                      {product.name}
                    </a>
                    <span className="text-ink-faint ml-2 text-[0.6875rem]">
                      {product.brand}
                    </span>
                    {product.fresh === true ? (
                      <span className="form-label text-stamp border-stamp/60 ml-2 border px-1 py-px">
                        New
                      </span>
                    ) : null}
                    <span className="form-label mt-0.5 block md:hidden">
                      {product.rating} ★ · {product.reviews}
                    </span>
                  </td>
                  <td className="figure py-2 text-right whitespace-nowrap">
                    <span className="text-sm font-medium">
                      ₹{inr(product.rate)}
                    </span>
                    <span className="struck ml-1.5 text-[0.6875rem]">
                      ₹{inr(product.mrp)}
                    </span>
                    <span className="text-margin-red block text-[0.6875rem]">
                      {discountOffMrp(product.rate, product.mrp)}% off MRP
                    </span>
                  </td>
                  <td className="figure hidden py-2 text-right text-sm whitespace-nowrap sm:table-cell">
                    ≈ ₹{inr(marginPerUnit(product.rate))}
                  </td>
                  <td className="figure hidden py-2 text-right text-xs whitespace-nowrap md:table-cell">
                    {product.rating} ★
                    <span className="text-ink-faint block">
                      {product.reviews}
                    </span>
                  </td>
                  <td className="py-2 pl-2 text-right">
                    {entry === undefined ? (
                      <button
                        type="button"
                        onClick={() => {
                          addProduct(product, 'stocked');
                          toast(`${product.name} added to register`);
                        }}
                        className="border-rule-strong hover:bg-sunk inline-flex items-center gap-1 border px-2 py-1 text-xs"
                        aria-label={`Add ${product.name} to register`}
                      >
                        <Plus size={12} strokeWidth={2} aria-hidden="true" />
                        Add
                      </button>
                    ) : (
                      <span
                        className={`figure inline-flex items-center gap-1 border px-2 py-1 text-[0.6875rem] uppercase ${STATUS_META[entry.status].className}`}
                      >
                        <Check size={12} strokeWidth={2} aria-hidden="true" />
                        {STATUS_META[entry.status].short}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {rows.length === 0 ? (
          <p className="text-ink-soft py-6 text-sm">
            Nothing on this row matches “{query}”.
          </p>
        ) : null}
      </div>
    </section>
  );
}
