'use client';
import type { Category, Product, TrendRow } from '@/types';
import { BuyList } from '@/components/BuyList';
import { Coverage } from '@/components/Coverage';
import { RateList } from '@/components/RateList';
import { TrendPanel } from '@/components/TrendPanel';
import { useRegister } from '@/store/register';

/**
 * One client boundary for the whole sheet.
 *
 * The page is a Server Component and hands the catalogue down as props, so this
 * is the single place the register is read — every section below gets it as a
 * plain prop instead of subscribing to the store itself.
 */
export function Sheet({
  products,
  categories,
  trends,
  marginNote,
}: {
  products: Product[];
  categories: readonly Category[];
  trends: TrendRow[];
  marginNote: string;
}) {
  const register = useRegister();

  return (
    <div className="flex flex-col gap-10">
      <BuyList products={products} register={register} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <RateList
          products={products}
          categories={categories}
          register={register}
          marginNote={marginNote}
        />
        <TrendPanel trends={trends} register={register} />
      </div>

      <Coverage products={products} register={register} />
    </div>
  );
}
