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
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm h-full group/container hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg group-hover/container:scale-110 transition-transform duration-300">
          <TrendingUp size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Trending in Punjab</h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {trends.map((trend, i) => (
            <div key={i} className="group flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/50 dark:hover:bg-gray-800/80 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5">
              <div className="flex flex-col flex-1">
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{trend.keyword}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Vol: {trend.volume}</span>
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
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-[0.97] custom-focus-ring"
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
