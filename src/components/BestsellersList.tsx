'use client';
import { useEffect, useState } from 'react';
import {
  Star, ShoppingBag, ExternalLink, Cable, Smartphone, Headphones,
  BatteryCharging, Plus, Speaker, MonitorSpeaker, HardDrive, Car, Camera,
  CheckCircle2, Clock, PackageX, Search,
} from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { showToast } from '@/components/Toast';
import type { Product, InventoryItem } from '@/types';

const CATEGORIES = [
  'Cables', 'Covers', 'Headsets', 'Wearables', 'Chargers',
  'Speakers', 'Car Tech', 'Vlogging', 'Soundbars', 'SD Cards',
];

const CategoryIcon = ({ category, className }: { category: string; className?: string }) => {
  switch (category) {
    case 'Cables':   return <Cable className={className} />;
    case 'Covers':   return <Smartphone className={className} />;
    case 'Headsets': return <Headphones className={className} />;
    case 'Wearables':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="2" width="12" height="20" rx="4" />
          <path d="M12 18h.01" />
        </svg>
      );
    case 'Chargers':  return <BatteryCharging className={className} />;
    case 'Speakers':  return <Speaker className={className} />;
    case 'Soundbars': return <MonitorSpeaker className={className} />;
    case 'SD Cards':  return <HardDrive className={className} />;
    case 'Car Tech':  return <Car className={className} />;
    case 'Vlogging':  return <Camera className={className} />;
    default:          return <ShoppingBag className={className} />;
  }
};

/** Per-status display config for the inline stock badge */
const STATUS_CONFIG: Record<
  InventoryItem['status'],
  { label: string; className: string; Icon: typeof CheckCircle2 }
> = {
  Stocked:       { label: 'In Stock',   className: 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20 ring-emerald-500/30', Icon: CheckCircle2 },
  Ordered:       { label: 'Ordered',    className: 'text-stone-600 bg-stone-100 dark:text-stone-300 dark:bg-stone-700/60 ring-stone-400/30',           Icon: Clock },
  'Out of Stock':{ label: 'Out',         className: 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/20 ring-rose-500/30',                 Icon: PackageX },
  Researching:   { label: 'Research',   className: 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20 ring-amber-500/30',            Icon: Search },
};

export default function BestsellersList() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isTracked, addItem } = useInventory();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/bestsellers?category=${activeCategory}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.bestsellers);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [activeCategory]);

  const handleAdd = (product: Product) => {
    const added = addItem({ ...product, category: activeCategory, status: 'Stocked' });
    if (added) {
      showToast(`"${product.name.slice(0, 28)}…" added to shop`);
    } else {
      showToast('Already in your inventory', 'warning');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm h-full flex flex-col group/container hover:shadow-md transition-shadow duration-300">

      {/* Header */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-stone-200 dark:bg-stone-700/30 text-stone-900 dark:text-stone-100 rounded-lg group-hover/container:scale-110 transition-transform duration-300">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 leading-none">
              Flipkart Bestsellers
            </h2>
          </div>
        </div>

        {/* Category tabs — horizontal scroll on mobile instead of wrapping */}
        <div className="flex overflow-x-auto no-scrollbar gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-lg select-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 custom-focus-ring ${
                activeCategory === cat
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm scale-[1.03]'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product list */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center p-3 rounded-lg border border-stone-100 dark:border-stone-800">
                <div className="w-7 h-7 bg-stone-200 dark:bg-stone-700 rounded-full mr-3" />
                <div className="w-9 h-9 bg-stone-200 dark:bg-stone-700 rounded-lg mr-3" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-stone-200 dark:bg-stone-700 rounded w-3/4" />
                  <div className="h-2.5 bg-stone-200 dark:bg-stone-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {products.map((product, idx) => {
              const tracked = isTracked(product.name);
              const discountPct =
                product.originalPrice > product.price
                  ? Math.round((1 - product.price / product.originalPrice) * 100)
                  : 0;
              // Rough 35% margin estimate — useful rule of thumb for accessories wholesale
              const estMargin = Math.round(product.price * 0.35);
              const statusCfg = tracked ? STATUS_CONFIG[tracked.status] : null;

              return (
                <div
                  key={product.id}
                  className={`group flex items-center p-2.5 rounded-lg border transition-all duration-200 hover:-translate-y-0.5 ${
                    tracked
                      ? 'border-stone-200 dark:border-stone-700 bg-stone-50/80 dark:bg-stone-800/40'
                      : 'border-transparent hover:border-stone-200 dark:hover:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  {/* Rank bubble */}
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full font-black text-xs mr-3 shrink-0 ${
                      idx < 3
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {product.rank}
                  </div>

                  {/* Category icon */}
                  <div className="w-9 h-9 flex shrink-0 items-center justify-center bg-stone-100 dark:bg-stone-800 rounded-lg mr-3 text-stone-500 dark:text-stone-400">
                    <CategoryIcon category={activeCategory} className="w-4 h-4" />
                  </div>

                  {/* Product name + meta */}
                  <div className="flex-1 min-w-0 pr-2">
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm font-medium text-stone-900 dark:text-stone-100 truncate hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      {product.name}
                    </a>
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                      <span className="flex items-center text-xs text-stone-500 dark:text-stone-400">
                        <Star size={11} className="text-yellow-400 mr-1 fill-yellow-400" />
                        {product.rating} ({product.reviews})
                      </span>
                      {estMargin > 0 && (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          ~₹{estMargin.toLocaleString()} margin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price column */}
                  <div className="text-right flex flex-col items-end justify-center mr-2 shrink-0">
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 line-through leading-none">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    {discountPct > 0 && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                        {discountPct}% off
                      </span>
                    )}
                  </div>

                  {/* Stock status badge OR add button */}
                  <div className="shrink-0">
                    {statusCfg ? (
                      <span
                        className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ring-1 whitespace-nowrap ${statusCfg.className}`}
                      >
                        <statusCfg.Icon size={11} />
                        {statusCfg.label}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAdd(product)}
                        aria-label="Add to Shop Inventory"
                        title="Add to Shop Inventory"
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-orange-600 hover:text-white transition-all hover:scale-110 active:scale-[0.97] custom-focus-ring"
                      >
                        <Plus size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Explore link */}
      {!loading && (
        <div className="pt-4 mt-2 border-t border-stone-100 dark:border-stone-800 shrink-0">
          <a
            href={`https://www.google.com/search?q=best+trending+mobile+${activeCategory.toLowerCase()}+in+india+${currentYear}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/50 dark:hover:bg-stone-800 text-orange-700 dark:text-orange-400 py-3 rounded-xl font-medium text-sm transition-colors active:scale-[0.98] custom-focus-ring group"
          >
            <span>Search {activeCategory} on Google</span>
            <ExternalLink size={15} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      )}
    </div>
  );
}
