'use client';
import { useState } from 'react';
import TrendingKeywords from '@/components/TrendingKeywords';
import BestsellersList from '@/components/BestsellersList';
import WhatsHotCard from '@/components/WhatsHotCard';
import ShopInventory from '@/components/ShopInventory';
import SmartInsights from '@/components/SmartInsights';
import { RefreshCcw, Activity, Store, Heart } from 'lucide-react';

export default function Home() {
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [inventoryCount, setInventoryCount] = useState(0);
  
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      
      {/* Sticky Header Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
              <Activity size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-none">TrendKart</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">Jalandhar Market</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
              <RefreshCcw size={12} className="text-blue-500" />
              <span>{currentTime}</span>
            </div>
            
            <button 
              onClick={() => setIsInventoryOpen(true)}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
            >
              <Store size={16} />
              <span>My Shop</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-xs">{inventoryCount}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Top Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[350px]">
          <div className="lg:col-span-8 h-full">
            <SmartInsights />
          </div>
          <div className="lg:col-span-4 h-full">
            <WhatsHotCard />
          </div>
        </div>

        {/* Bottom Data Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">
          <div className="lg:col-span-4 h-full">
            <TrendingKeywords />
          </div>
          <div className="lg:col-span-8 h-full">
            <BestsellersList />
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-8 border-t-4 border-blue-600">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Activity size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-wider uppercase">Accessories Hub Ltd.</span>
          </div>
          
          <p className="text-sm text-gray-400 font-medium flex items-center">
            © 2026 All rights reserved. 
            <span className="mx-2">|</span> 
            Made with <Heart size={14} className="text-red-500 mx-1.5 fill-red-500" /> by Deepesh
          </p>
        </div>
      </footer>

      {/* Slide-out Drawer */}
      <ShopInventory 
        isOpen={isInventoryOpen} 
        onClose={() => setIsInventoryOpen(false)} 
        onCountChange={setInventoryCount}
      />
    </div>
  );
}
