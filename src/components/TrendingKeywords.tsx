'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Plus, ExternalLink } from 'lucide-react';

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
        link: `https://www.google.com/search?q=${encodeURIComponent(trend.keyword)}`,
        status: 'Researching'
      } 
    }));
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm h-full flex flex-col group/container hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-zinc-200 dark:bg-zinc-700/30 text-zinc-900 dark:text-zinc-100 rounded-lg group-hover/container:scale-110 transition-transform duration-300">
          <TrendingUp size={20} />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Trending in Punjab</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-100 dark:border-zinc-700">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3"></div>
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-8"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {trends.map((trend, i) => (
              <div key={i} className="group flex items-center justify-between p-3 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-100 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-700/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/80 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5">
                <div className="flex flex-col flex-1">
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">{trend.keyword}</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Vol: {trend.volume}</span>
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
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all transform hover:scale-110 active:scale-[0.97] custom-focus-ring"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Explore More Button */}
      {!loading && (
        <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
          <a 
            href={`https://trends.google.com/trends/explore?geo=IN-PB&q=mobile+accessories`}
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 py-3 rounded-xl font-medium text-sm transition-colors active:scale-[0.98] custom-focus-ring group border border-zinc-200 dark:border-zinc-700"
          >
            <span>Explore Punjab Trends</span>
            <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #334155;
        }
      `}} />
    </div>
  );
}
