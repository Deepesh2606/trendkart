'use client';
import React, { useEffect, useState } from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, DollarSign, Plus, PackageX } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  status: 'Stocked' | 'Ordered' | 'Out of Stock' | 'Researching';
}

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
}

interface InsightCard {
  id: string;
  type: 'margin' | 'revenue' | 'mover';
  title: string;
  productName: string;
  description: string;
  badgeText: string;
  badgeColor: string;
  icon: React.ReactNode;
  product: Product;
}

export default function SmartInsights() {
  const [cards, setCards] = useState<InsightCard[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAction = (product: Product, type: string) => {
    const customEvent = new CustomEvent('addToInventory', { 
      detail: { ...product, category: product.category || 'General', status: type === 'revenue' ? 'Ordered' : 'Researching' } 
    });
    window.dispatchEvent(customEvent);
  };

  useEffect(() => {
    const generateInsights = async () => {
      setLoading(true);
      const newCards: InsightCard[] = [];
      const saved = localStorage.getItem('jalandharShopInventory');
      const inventory: InventoryItem[] = saved ? JSON.parse(saved) : [];

      try {
        const res = await fetch('/api/bestsellers?category=all');
        const data = await res.json();
        
        // Flatten categories
        let allProducts: Product[] = [];
        Object.keys(data.bestsellers).forEach(cat => {
          const items = data.bestsellers[cat].map((item: any) => ({ ...item, category: cat }));
          allProducts = [...allProducts, ...items];
        });

        const unstocked = allProducts.filter(p => !inventory.find(i => i.name === p.name));
        
        // 1. High Margin Sourcing (Find most expensive unstocked item)
        const premiumItem = [...unstocked].sort((a, b) => b.price - a.price)[0];
        if (premiumItem) {
          const marginPercent = premiumItem.price > 2000 ? 35 : 45;
          const wholesalePrice = Math.round(premiumItem.price * (1 - (marginPercent / 100)));
          const profit = premiumItem.price - wholesalePrice;
          
          newCards.push({
            id: 'margin-card',
            type: 'margin',
            title: 'High Profit Margin',
            productName: premiumItem.name,
            description: "Source at Gaffar Market for ~₹" + wholesalePrice + ". Retail price is ₹" + premiumItem.price + ".",
            badgeText: "+₹" + profit + "/unit",
            badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 ring-emerald-500/30',
            icon: <DollarSign size={20} className="text-emerald-600 dark:text-emerald-400" />,
            product: premiumItem
          });
        }

        // 2. Lost Revenue Warning (Check Out of Stock items)
        const outOfStock = inventory.filter(i => i.status === 'Out of Stock');
        if (outOfStock.length > 0) {
          const oosItem = outOfStock[0];
          // Find the product to get price
          const productMatch = allProducts.find(p => p.name === oosItem.name) || { id: oosItem.id, name: oosItem.name, price: 999 };
          const estimatedLost = productMatch.price * 3; // Assume 3 lost sales a day
          
          newCards.push({
            id: 'revenue-card',
            type: 'revenue',
            title: 'Lost Revenue Warning',
            productName: oosItem.name,
            description: "Currently marked Out of Stock. You are losing an estimated 3 sales per day.",
            badgeText: "-₹" + estimatedLost + "/day",
            badgeColor: 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/40 ring-rose-500/30',
            icon: <AlertTriangle size={20} className="text-rose-600 dark:text-rose-400" />,
            product: productMatch
          });
        } else {
          // If no out of stock, suggest a cheap fast mover
          const cheapItem = [...unstocked].sort((a, b) => a.price - b.price)[0];
          if (cheapItem) {
            newCards.push({
              id: 'bulk-card',
              type: 'revenue',
              title: 'Bulk Buy Opportunity',
              productName: cheapItem.name,
              description: "Extremely fast-moving accessory. Buy 50+ units for max volume discount.",
              badgeText: "High Volume",
              badgeColor: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 ring-amber-500/30',
              icon: <PackageX size={20} className="text-amber-600 dark:text-amber-400" />,
              product: cheapItem
            });
          }
        }

        // 3. Fast Mover Category match
        // Find a highly ranked item they don't have
        const topItem = unstocked.find(p => (p as any).rank === 1);
        if (topItem) {
          newCards.push({
            id: 'mover-card',
            type: 'mover',
            title: 'Missing Top Seller',
            productName: topItem.name,
            description: "Ranked #1 in " + (topItem.category || "its category") + " locally. High demand expected this weekend.",
            badgeText: "Trending #1",
            badgeColor: 'text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/40 ring-indigo-500/30',
            icon: <TrendingUp size={20} className="text-indigo-600 dark:text-indigo-400" />,
            product: topItem
          });
        }

      } catch (e) {
        console.error(e);
      }

      setCards(newCards.slice(0, 3)); // Ensure max 3 cards
      setLoading(false);
    };

    generateInsights();

    window.addEventListener('addToInventory', generateInsights);
    const interval = setInterval(generateInsights, 30000); 
    
    return () => {
      window.removeEventListener('addToInventory', generateInsights);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg shadow-sm">
            <Lightbulb size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Market Opportunities</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm animate-pulse h-[220px]">
               <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"></div>
               <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
               <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
               <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          ))
        ) : (
          cards.map(card => (
            <div key={card.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <span className={"text-xs font-bold px-2.5 py-1 rounded-full ring-1 " + card.badgeColor}>
                    {card.badgeText}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{card.title}</h3>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight mb-2 line-clamp-2">{card.productName}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
              
              <button 
                onClick={() => handleAction(card.product, card.type)}
                className="mt-5 w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-700 hover:text-white dark:text-slate-300 py-2.5 rounded-xl font-semibold text-sm transition-colors active:scale-[0.97] custom-focus-ring"
              >
                <Plus size={16} />
                <span>{card.type === 'revenue' ? 'Restock Now' : 'Track in Shop'}</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
