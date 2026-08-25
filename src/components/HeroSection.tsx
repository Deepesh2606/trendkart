'use client';
import { MapPin, TrendingUp, Store, Tag, Package } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';

export default function HeroSection() {
  const { inventory } = useInventory();

  const shopItemCount = inventory.length;
  const stockedCount = inventory.filter(i => i.status === 'Stocked').length;
  const categoriesCovered = new Set(inventory.map(i => i.category)).size;

  const stats = [
    {
      label: 'Market Products',
      value: '60+',
      icon: <Tag size={12} className="mr-1 text-emerald-400" />,
    },
    {
      label: 'Shop Items',
      value: shopItemCount > 0 ? String(shopItemCount) : '—',
      icon: <Store size={12} className="mr-1 text-sky-400" />,
    },
    {
      label: 'In Stock',
      value: stockedCount > 0 ? String(stockedCount) : '0',
      icon: <Package size={12} className="mr-1 text-green-400" />,
    },
    {
      label: 'Categories',
      value: categoriesCovered > 0 ? String(categoriesCovered) : '—',
      icon: <TrendingUp size={12} className="mr-1 text-amber-400" />,
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl p-8 sm:p-10 shadow-lg text-white border border-stone-700">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-stone-300/20 blur-3xl mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-stone-500/10 blur-3xl mix-blend-screen pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Copy */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-medium text-stone-200 select-none">
            <MapPin size={12} className="text-stone-100" />
            <span>Jalandhar Electronics Market</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-stone-300">
            Market Intelligence Dashboard
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Real-time data on what's selling across Jalandhar. Spot high-margin gaps, restock before you run dry.
          </p>
        </div>

        {/* Live stat tiles — data flows from InventoryContext */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap md:flex-nowrap">
          {stats.map(stat => (
            <div
              key={stat.label}
              className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md select-none min-w-[82px]"
            >
              <span className="flex items-center text-stone-400 text-[11px] mb-1 whitespace-nowrap">
                {stat.icon}
                {stat.label}
              </span>
              <span className="text-2xl font-black text-white tracking-tight leading-none">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
