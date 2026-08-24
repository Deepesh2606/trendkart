'use client';
import React, { useEffect, useState } from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, DollarSign, Plus, PackageX } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useInventory } from '@/context/InventoryContext';
import { showToast } from '@/components/Toast';
import type { Product, InsightCard, ChartData } from '@/types';

export default function SmartInsights() {
  const { inventory, addItem } = useInventory();
  const [cards, setCards] = useState<InsightCard[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [coverageScore, setCoverageScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAction = (product: Product, type: string) => {
    const added = addItem({
      ...product,
      category: product.category || 'General',
      status: type === 'revenue' ? 'Ordered' : 'Researching',
    });
    if (added) {
      showToast(`"${product.name.slice(0, 32)}…" added to inventory`);
    } else {
      showToast(`Already in your inventory`, 'warning');
    }
  };

  // Re-generate insights whenever inventory changes.
  // Removed 30-second polling — data is static mock; re-fetching constantly is wasteful.
  useEffect(() => {
    const generate = async () => {
      setLoading(true);
      const newCards: InsightCard[] = [];

      try {
        const res = await fetch('/api/bestsellers?category=all');
        const data = await res.json();

        let allProducts: Product[] = [];
        const cData: ChartData[] = [];
        let totalMarket = 0;
        let totalShop = 0;

        Object.keys(data.bestsellers).forEach(cat => {
          const items: Product[] = (data.bestsellers[cat] as Product[]).map(item => ({
            ...item,
            category: cat,
          }));
          allProducts = [...allProducts, ...items];

          const shopStock = inventory.filter(
            i => i.category === cat && i.status !== 'Out of Stock'
          ).length;

          totalMarket += items.length;
          totalShop += shopStock;

          cData.push({ category: cat, marketItems: items.length, shopItems: shopStock });
        });

        setChartData(cData);
        setCoverageScore(totalMarket > 0 ? Math.round((totalShop / totalMarket) * 100) : 0);

        const unstocked = allProducts.filter(p => !inventory.find(i => i.name === p.name));

        // ── Card 1: Highest margin opportunity ───────────────────────────
        const premiumItem = [...unstocked].sort((a, b) => b.price - a.price)[0];
        if (premiumItem) {
          const marginPct = premiumItem.price > 2000 ? 35 : 45;
          const wholesale = Math.round(premiumItem.price * (1 - marginPct / 100));
          const profitPerUnit = premiumItem.price - wholesale;
          const monthlyProfit = profitPerUnit * 3 * 30; // 3 units/day est.

          newCards.push({
            id: 'margin-card',
            type: 'margin',
            title: 'High Profit Margin',
            productName: premiumItem.name,
            description: `Source at Gaffar Market for ~₹${wholesale.toLocaleString()}. Retail ₹${premiumItem.price.toLocaleString()}. Est. monthly profit: ₹${monthlyProfit.toLocaleString()} (3 units/day).`,
            badgeText: `+₹${profitPerUnit.toLocaleString()}/unit`,
            badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 ring-emerald-500/30',
            icon: <DollarSign size={20} className="text-emerald-600 dark:text-emerald-400" />,
            product: premiumItem,
          });
        }

        // ── Card 2: Lost revenue / bulk opportunity ───────────────────────
        const outOfStock = inventory.filter(i => i.status === 'Out of Stock');
        if (outOfStock.length > 0) {
          const oosItem = outOfStock[0];
          const productMatch: Product = allProducts.find(p => p.name === oosItem.name) ?? {
            id: oosItem.id, name: oosItem.name, price: 999, originalPrice: 999, rating: 0, reviews: '—', link: '#',
          };
          const dailyLoss = productMatch.price * 3;

          newCards.push({
            id: 'revenue-card',
            type: 'revenue',
            title: 'Lost Revenue Warning',
            productName: oosItem.name,
            description: `Out of Stock. Losing ~3 sales/day = ₹${dailyLoss.toLocaleString()}/day in missed revenue. Restock immediately.`,
            badgeText: `-₹${dailyLoss.toLocaleString()}/day`,
            badgeColor: 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/40 ring-rose-500/30',
            icon: <AlertTriangle size={20} className="text-rose-600 dark:text-rose-400" />,
            product: productMatch,
          });
        } else {
          const cheapItem = [...unstocked].sort((a, b) => a.price - b.price)[0];
          if (cheapItem) {
            newCards.push({
              id: 'bulk-card',
              type: 'revenue',
              title: 'Bulk Buy Opportunity',
              productName: cheapItem.name,
              description: `Fast-moving at ₹${cheapItem.price.toLocaleString()}. Buy 50+ units for max volume discount from your distributor.`,
              badgeText: 'High Volume',
              badgeColor: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 ring-amber-500/30',
              icon: <PackageX size={20} className="text-amber-600 dark:text-amber-400" />,
              product: cheapItem,
            });
          }
        }

        // ── Card 3: Missing top-ranked item ──────────────────────────────
        // Fixed: previously used `as any` cast which masked the missing rank type
        const topItem = unstocked.find(p => p.rank === 1);
        if (topItem) {
          newCards.push({
            id: 'mover-card',
            type: 'mover',
            title: 'Missing Top Seller',
            productName: topItem.name,
            description: `Ranked #1 in ${topItem.category ?? 'its category'}. High demand expected this weekend.`,
            badgeText: 'Trending #1',
            badgeColor: 'text-stone-900 dark:text-teal-300 bg-stone-200 dark:bg-stone-700/40 ring-stone-300/30',
            icon: <TrendingUp size={20} className="text-stone-900 dark:text-stone-100" />,
            product: topItem,
          });
        }

      } catch (e) {
        console.error(e);
      }

      setCards(newCards.slice(0, 3));
      setLoading(false);
    };

    generate();
  }, [inventory]); // Only re-run when inventory changes — no wasteful 30s polling

  // ── Tooltip ──────────────────────────────────────────────────────────────
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const market = payload[0]?.value ?? 0;
    const shop = payload[1]?.value ?? 0;
    const pct = market > 0 ? Math.round((shop / market) * 100) : 0;
    return (
      <div className="bg-stone-900 text-white text-xs p-3 rounded-lg shadow-xl border border-stone-700">
        <p className="font-bold mb-1.5">{label}</p>
        <p className="text-stone-300">
          Market Trending: <span className="text-orange-400 font-bold">{market} items</span>
        </p>
        <p className="text-stone-300">
          Your Stock: <span className="text-stone-300 font-bold">{shop} items</span>
        </p>
        <p className="text-stone-400 mt-1.5 border-t border-stone-700 pt-1.5">
          Coverage: <span className={`font-bold ${pct >= 50 ? 'text-emerald-400' : pct >= 25 ? 'text-amber-400' : 'text-rose-400'}`}>{pct}%</span>
        </p>
      </div>
    );
  };

  const coverageColor =
    coverageScore === null ? 'text-stone-400'
    : coverageScore >= 60 ? 'text-emerald-600 dark:text-emerald-400'
    : coverageScore >= 30 ? 'text-amber-600 dark:text-amber-400'
    : 'text-rose-600 dark:text-rose-400';

  const coverageLabel =
    coverageScore === null ? '—'
    : coverageScore >= 60 ? 'Good'
    : coverageScore >= 30 ? 'Moderate'
    : 'Low';

  return (
    <div className="flex flex-col h-full space-y-4">

      {/* Header */}
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-stone-100 dark:bg-stone-800 text-orange-700 dark:text-orange-400 rounded-lg shadow-sm">
          <Lightbulb size={20} />
        </div>
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          Market Intelligence
        </h2>
      </div>

      <div className="flex-1 flex flex-col xl:flex-row gap-4 h-full">

        {/* ── Left: Insight Cards ───────────────────────────────────────── */}
        <div className="w-full xl:w-1/3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
          {loading
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm animate-pulse h-[170px]" />
              ))
            : cards.map(card => (
                <div
                  key={card.id}
                  className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group shrink-0"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-1.5 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-100 dark:border-stone-700 group-hover:scale-110 transition-transform duration-300">
                        {card.icon}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ring-1 ${card.badgeColor}`}>
                        {card.badgeText}
                      </span>
                    </div>
                    <h3 className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-0.5">
                      {card.title}
                    </h3>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-tight mb-1 truncate">
                      {card.productName}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-snug line-clamp-3">
                      {card.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAction(card.product, card.type)}
                    className="mt-3 w-full flex items-center justify-center space-x-1.5 bg-stone-100 hover:bg-stone-900 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 hover:text-white dark:text-stone-300 dark:hover:text-white py-1.5 rounded-lg font-medium text-xs transition-colors active:scale-[0.97] custom-focus-ring"
                  >
                    <Plus size={14} />
                    <span>{card.type === 'revenue' ? 'Restock' : 'Track in Shop'}</span>
                  </button>
                </div>
              ))
          }
        </div>

        {/* ── Right: Chart ─────────────────────────────────────────────── */}
        <div className="w-full xl:w-2/3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm flex flex-col">

          {/* Chart header + coverage score */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                Inventory Deficit vs Market Demand
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Trending items stocked per category in your shop.
              </p>
            </div>

            {/* Coverage score — colour-coded health indicator */}
            {!loading && coverageScore !== null && (
              <div className="text-right shrink-0 ml-4">
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold leading-none mb-1">
                  Market Coverage
                </p>
                <p className={`text-3xl font-black leading-none ${coverageColor}`}>
                  {coverageScore}%
                </p>
                <p className={`text-[10px] font-bold mt-0.5 ${coverageColor}`}>{coverageLabel}</p>
              </div>
            )}
          </div>

          {/* Chart legend */}
          <div className="flex items-center gap-5 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--chart-market)' }} />
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Market Trending</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--chart-stock)' }} />
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Your Stock</span>
            </div>
          </div>

          <div className="flex-1 w-full min-h-[200px]">
            {loading ? (
              <div className="w-full h-full bg-stone-100 dark:bg-stone-800/50 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -22, bottom: 0 }}>
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
                  <Tooltip
                    cursor={{ fill: 'rgba(148,163,184,0.07)' }}
                    content={<CustomTooltip />}
                  />
                  <Bar dataKey="marketItems" name="Market Trend" fill="var(--chart-market)" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="shopItems"   name="Your Stock"   fill="var(--chart-stock)"  radius={[4, 4, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
