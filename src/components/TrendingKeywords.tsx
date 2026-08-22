'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

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

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm h-full">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
          <TrendingUp size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Trending Keywords</h2>
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
            <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
              <div className="flex flex-col">
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{trend.keyword}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Vol: {trend.volume}</span>
              </div>
              <div className={`flex items-center space-x-1 text-sm font-semibold ${trend.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}`}>
                {trend.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span>{trend.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
