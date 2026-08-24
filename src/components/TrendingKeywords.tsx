'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Plus, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import { showToast } from '@/components/Toast';
import type { Trend } from '@/types';

export default function TrendingKeywords() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const { isTracked, addItem } = useInventory();

  useEffect(() => {
    fetch('/api/trends')
      .then(res => res.json())
      .then(data => {
        setTrends(data.trends);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleTrack = (trend: Trend) => {
    const added = addItem({
      id: `trend-${Date.now()}`,
      name: trend.keyword,
      category: 'Trending',
      status: 'Researching',
    });
    if (added) {
      showToast(`Tracking "${trend.keyword.slice(0, 30)}…"`);
    } else {
      showToast('Already tracking this keyword', 'warning');
    }
  };

  return (
    <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm h-full flex flex-col group/container hover:shadow-md transition-shadow duration-300">

      {/* Header */}
      <div className="flex items-center space-x-2 mb-5">
        <div className="p-2 bg-stone-200 dark:bg-stone-700/30 text-stone-900 dark:text-stone-100 rounded-lg group-hover/container:scale-110 transition-transform duration-300">
          <TrendingUp size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 leading-none">
            Trending in Punjab
          </h2>
          <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">
            Click + to track · Green = already tracking
          </p>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-white dark:bg-stone-800 rounded-lg border border-stone-100 dark:border-stone-700">
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-2/3" />
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-10" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {trends.map((trend, i) => {
              const tracked = isTracked(trend.keyword);
              return (
                <div
                  key={i}
                  className={`group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                    tracked
                      ? 'bg-emerald-50/80 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50'
                      : 'bg-white dark:bg-stone-800 border-stone-100 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-800/80'
                  }`}
                >
                  {/* Keyword + volume */}
                  <div className="flex flex-col flex-1 min-w-0 pr-2">
                    <span
                      className={`font-medium text-sm truncate transition-colors ${
                        tracked
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-stone-900 dark:text-stone-100 group-hover:text-orange-600 dark:group-hover:text-stone-100'
                      }`}
                    >
                      {trend.keyword}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Vol: {trend.volume}
                    </span>
                  </div>

                  {/* Percentage + action */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <div
                      className={`flex items-center space-x-0.5 text-xs font-bold ${
                        trend.trend === 'up'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-500 dark:text-red-400'
                      }`}
                    >
                      {trend.trend === 'up'
                        ? <ArrowUpRight size={15} />
                        : <ArrowDownRight size={15} />
                      }
                      <span>{trend.percentage}%</span>
                    </div>

                    {tracked ? (
                      /* Already tracking — show green tick instead of + */
                      <div
                        title="Already tracking"
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      >
                        <CheckCircle2 size={14} />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTrack(trend)}
                        aria-label="Track in Shop Inventory"
                        title="Track in Shop Inventory"
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-100 dark:bg-stone-700 text-stone-500 hover:bg-orange-600 hover:text-white transition-all hover:scale-110 active:scale-[0.97] custom-focus-ring"
                      >
                        <Plus size={13} />
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
        <div className="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800 shrink-0">
          <a
            href="https://trends.google.com/trends/explore?geo=IN-PB&q=mobile+accessories&date=today+12-m"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-stone-100 dark:bg-stone-800/50 dark:hover:bg-stone-800 text-orange-700 dark:text-orange-400 py-3 rounded-xl font-medium text-sm transition-colors active:scale-[0.98] custom-focus-ring group border border-stone-200 dark:border-stone-700"
          >
            <span>Explore Punjab Trends</span>
            <ExternalLink size={15} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      )}
      {/* Note: scrollbar CSS moved to globals.css — no more dangerouslySetInnerHTML */}
    </div>
  );
}
