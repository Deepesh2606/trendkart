'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Plus } from 'lucide-react';

interface Trend {
  keyword: string;
  volume: string;
  trend: 'up' | 'down';
  percentage: number;
}

export default function TrendingKeywords() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);

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

  const addToInventory = (trend: Trend) => {
    window.dispatchEvent(new CustomEvent('addToInventory', { 
      detail: { 
        id: `trend-${Date.now()}`,
        name: trend.keyword,
        category: 'Trending',
        price: 0,
        originalPrice: 0,
        rating: 0,
        reviews: trend.volume,
        link: `https://www.flipkart.com/search?q=${encodeURIComponent(trend.keyword)}`,
        status: 'Researching'
      } 
    }));
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm h-full group/container hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover/container:scale-110 transition-transform duration-300">
          <TrendingUp size={20} />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Trending in Punjab</h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-8"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {trends.map((trend, i) => (
            <div key={i} className="group flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-indigo-50/50 dark:hover:bg-slate-800/80 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5">
              <div className="flex flex-col flex-1">
                <span className="font-medium text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">{trend.keyword}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Vol: {trend.volume}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-1 text-sm font-semibold ${trend.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}`}>
                  {trend.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span>{trend.percentage}%</span>
                </div>
                
                <button 
                  onClick={() => addToInventory(trend)}
                  aria-label="Track in Shop Inventory"
                  title="Track in Shop Inventory"
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110 active:scale-[0.97] custom-focus-ring"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
