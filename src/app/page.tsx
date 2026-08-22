import TrendingKeywords from '@/components/TrendingKeywords';
import BestsellersList from '@/components/BestsellersList';
import WhatsHotCard from '@/components/WhatsHotCard';
import ShopInventory from '@/components/ShopInventory';
import { RefreshCcw, Activity } from 'lucide-react';

export default function Home() {
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-xl shadow-sm">
                <Activity size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">TrendKart</h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Jalandhar Local Market Intelligence</p>
          </div>
          
          <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <RefreshCcw size={14} className="text-blue-500" />
            <span>Last updated: {currentTime}</span>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-140px)] min-h-[700px]">
          
          {/* Column 1: Market Trends (Left) */}
          <div className="lg:col-span-3 h-full flex flex-col space-y-6">
            <div className="flex-1">
              <TrendingKeywords />
            </div>
            <div className="flex-1">
              <WhatsHotCard />
            </div>
          </div>

          {/* Column 2: Bestseller Rankings (Middle) */}
          <div className="lg:col-span-5 h-full">
            <BestsellersList />
          </div>

          {/* Column 3: My Shop Inventory (Right) */}
          <div className="lg:col-span-4 h-full">
            <ShopInventory />
          </div>

        </div>
      </div>
    </div>
  );
}
