import TrendingKeywords from '@/components/TrendingKeywords';
import BestsellersList from '@/components/BestsellersList';
import WhatsHotCard from '@/components/WhatsHotCard';
import { RefreshCcw, Activity } from 'lucide-react';

export default function Home() {
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-xl shadow-sm">
                <Activity size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">TrendKart</h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mobile Accessories Market Intelligence</p>
          </div>
          
          <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <RefreshCcw size={14} className="text-blue-500" />
            <span>Last updated: {currentTime}</span>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-140px)] min-h-[600px]">
          
          {/* Column 1: Trending Keywords (Left) */}
          <div className="lg:col-span-3 h-full">
            <TrendingKeywords />
          </div>

          {/* Column 2: Bestseller Rankings (Middle) */}
          <div className="lg:col-span-6 h-full">
            <BestsellersList />
          </div>

          {/* Column 3: What's Hot Highlights (Right) */}
          <div className="lg:col-span-3 h-full flex flex-col space-y-6">
            <div className="flex-1">
              <WhatsHotCard />
            </div>
            
            {/* Small Quick Stat Card */}
            <div className="bg-blue-600 dark:bg-blue-700 text-white rounded-xl p-5 shadow-sm border border-blue-500 dark:border-blue-600">
              <h3 className="text-sm font-medium text-blue-100 mb-1">Market Insight</h3>
              <p className="text-lg font-bold">Type-C Cables demand up 24% this week.</p>
              <button className="mt-4 text-xs bg-white text-blue-700 font-semibold px-3 py-1.5 rounded-lg w-full hover:bg-blue-50 transition-colors">
                View Stock Recommendations
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
