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
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm h-full flex flex-col group/container hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg group-hover/container:scale-110 transition-transform duration-300">
          <TrendingUp size={20} />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Trending in Punjab</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
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
              <div key={i} className="group flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-900/50 hover:bg-teal-50/50 dark:hover:bg-slate-800/80 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5">
                <div className="flex flex-col flex-1">
                  <span className="font-medium text-sm text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{trend.keyword}</span>
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
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-teal-600 hover:text-white transition-all transform hover:scale-110 active:scale-[0.97] custom-focus-ring"
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
        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <a 
            href={`https://trends.google.com/trends/explore?geo=IN-PB&q=mobile+accessories`}
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-teal-600 dark:text-teal-400 py-3 rounded-xl font-medium text-sm transition-colors active:scale-[0.98] custom-focus-ring group border border-slate-200 dark:border-slate-700"
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
