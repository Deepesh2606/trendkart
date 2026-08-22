'use client';
import React, { useEffect, useState } from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, DollarSign, Plus, PackageX } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

interface ChartData {
  category: string;
  marketItems: number;
  shopItems: number;
}

export default function SmartInsights() {
  const [cards, setCards] = useState<InsightCard[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
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
        
        let allProducts: Product[] = [];
        const cData: ChartData[] = [];

        Object.keys(data.bestsellers).forEach(cat => {
          const items = data.bestsellers[cat].map((item: any) => ({ ...item, category: cat }));
          allProducts = [...allProducts, ...items];
          
          // Compute chart data
          const shopStock = inventory.filter(i => i.category === cat && i.status !== 'Out of Stock').length;
          cData.push({
            category: cat,
            marketItems: items.length,
            shopItems: shopStock
          });
        });
        
        setChartData(cData);

        const unstocked = allProducts.filter(p => !inventory.find(i => i.name === p.name));
        
        // 1. High Margin Sourcing
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

        // 2. Lost Revenue Warning
        const outOfStock = inventory.filter(i => i.status === 'Out of Stock');
        if (outOfStock.length > 0) {
          const oosItem = outOfStock[0];
          const productMatch = allProducts.find(p => p.name === oosItem.name) || { id: oosItem.id, name: oosItem.name, price: 999 };
          const estimatedLost = productMatch.price * 3; 
          
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
        const topItem = unstocked.find(p => (p as any).rank === 1);
        if (topItem) {
          newCards.push({
            id: 'mover-card',
            type: 'mover',
            title: 'Missing Top Seller',
            productName: topItem.name,
            description: "Ranked #1 in " + (topItem.category || "its category") + " locally. High demand expected this weekend.",
            badgeText: "Trending #1",
            badgeColor: 'text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/40 ring-teal-500/30',
            icon: <TrendingUp size={20} className="text-teal-600 dark:text-teal-400" />,
            product: topItem
          });
        }

      } catch (e) {
        console.error(e);
      }

      setCards(newCards.slice(0, 3));
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl border border-slate-700">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-slate-300">Market Trending: <span className="text-teal-400 font-bold">{payload[0].value} items</span></p>
          <p className="text-slate-300">Your Shop Stock: <span className="text-emerald-400 font-bold">{payload[1].value} items</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg shadow-sm">
            <Lightbulb size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Market Intelligence</h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row gap-4 h-full">
        {/* Left Side: Cards */}
        <div className="w-full xl:w-1/3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm animate-pulse h-[160px]"></div>
            ))
          ) : (
            cards.map(card => (
              <div key={card.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group shrink-0">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300">
                      {card.icon}
                    </div>
                    <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 " + card.badgeColor}>
                      {card.badgeText}
                    </span>
                  </div>
                  <h3 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{card.title}</h3>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight mb-1 truncate">{card.productName}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                    {card.description}
                  </p>
                </div>
                
                <button 
                  onClick={() => handleAction(card.product, card.type)}
                  className="mt-3 w-full flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-teal-600 dark:bg-slate-800 dark:hover:bg-teal-600 text-slate-700 hover:text-white dark:text-slate-300 py-1.5 rounded-lg font-medium text-xs transition-colors active:scale-[0.97] custom-focus-ring"
                >
                  <Plus size={14} />
                  <span>{card.type === 'revenue' ? 'Restock' : 'Track'}</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Graph */}
        <div className="w-full xl:w-2/3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Inventory Deficit vs Market Demand</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tracking how many trending items you currently carry per category.</p>
          </div>
          
          <div className="flex-1 w-full min-h-[250px]">
            {loading ? (
              <div className="w-full h-full bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="category" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                  <Bar dataKey="marketItems" name="Market Trend" fill="#0d9488" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="shopItems" name="Your Stock" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
