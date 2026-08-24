'use client';
import { useEffect, useState } from 'react';
import { Flame, ArrowUp, ArrowUpRight } from 'lucide-react';
import type { Product } from '@/types';

interface HotProduct {
  name: string;
  discountPct: number;
  savingsAmount: number;
  category: string;
  price: number;
  originalPrice: number;
}

export default function WhatsHotCard() {
  const [hotProducts, setHotProducts] = useState<HotProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bestsellers?category=all')
      .then(res => res.json())
      .then(data => {
        const all: HotProduct[] = [];

        // Derive "What's Hot" from products with highest absolute discount %
        // This is more meaningful than hardcoded fake uplift numbers
        Object.keys(data.bestsellers).forEach(cat => {
          (data.bestsellers[cat] as Product[]).forEach(p => {
            if (p.originalPrice > p.price) {
              all.push({
                name: p.name,
                discountPct: Math.round((1 - p.price / p.originalPrice) * 100),
                savingsAmount: p.originalPrice - p.price,
                category: cat,
                price: p.price,
                originalPrice: p.originalPrice,
              });
            }
          });
        });

        // Top 3 most heavily discounted — high discount = market pressure = "hot"
        setHotProducts(all.sort((a, b) => b.discountPct - a.discountPct).slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-100 dark:border-orange-900/50 rounded-xl p-5 shadow-sm h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-lg">
          <Flame size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 leading-none">
            What&apos;s Hot
          </h2>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
            Biggest market discounts right now
          </p>
        </div>
      </div>

      {/* Product list */}
      <div className="flex-1 space-y-3">
        {loading
          ? [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white/60 dark:bg-stone-900/40 rounded-xl h-[80px]" />
            ))
          : hotProducts.map((product, idx) => (
              <div
                key={idx}
                className="bg-white/70 dark:bg-stone-900/60 backdrop-blur-sm p-3.5 rounded-xl border border-white/50 dark:border-stone-800 hover:shadow-md transition-shadow cursor-default"
              >
                <div className="flex justify-between items-start gap-2">
                  {/* Name + meta */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100 leading-snug line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                        {product.category}
                      </span>
                      <span className="text-[11px] text-stone-600 dark:text-stone-400">
                        ₹{product.price.toLocaleString()}{' '}
                        <span className="line-through text-stone-400 dark:text-stone-500">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Discount badge */}
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <div className="flex items-center text-red-600 dark:text-red-400 font-black text-sm bg-red-50 dark:bg-red-900/20 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                      <ArrowUp size={13} className="mr-0.5" />
                      {product.discountPct}% OFF
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Save ₹{product.savingsAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
        }
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-orange-200/50 dark:border-orange-900/30 space-y-3">
        <div className="text-xs text-stone-500 dark:text-stone-400 flex justify-between items-center">
          <span>Ranked by market discount %</span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>

        <a
          href={`https://www.google.com/search?q=trending+mobile+accessories+india+${currentYear}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/40 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-400 py-3 rounded-xl font-medium text-sm transition-colors active:scale-[0.98] custom-focus-ring group"
        >
          <span>Explore Latest Releases</span>
          <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}
