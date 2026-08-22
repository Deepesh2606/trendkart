'use client';
import { useState } from 'react';
import TrendingKeywords from '@/components/TrendingKeywords';
import BestsellersList from '@/components/BestsellersList';
import WhatsHotCard from '@/components/WhatsHotCard';
import ShopInventory from '@/components/ShopInventory';
import SmartInsights from '@/components/SmartInsights';
import HeroSection from '@/components/HeroSection';
import { RefreshCcw, Activity, Store, Heart } from 'lucide-react';

export default function Home() {
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [inventoryCount, setInventoryCount] = useState(0);
  
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col">
      
      {/* Sticky Header Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-stone-900 text-white p-1.5 rounded-lg shadow-sm">
              <Activity size={20} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight leading-none text-stone-900 dark:text-white">TrendKart</h1>
                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm tracking-widest border border-orange-200 dark:border-orange-800/50">Under Development</span>
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 uppercase tracking-wider font-semibold">Jalandhar Market</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-1.5 text-xs font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-full shadow-inner">
              <RefreshCcw size={12} className="text-stone-300" />
              <span>{currentTime}</span>
            </div>
            
            <button 
              onClick={() => setIsInventoryOpen(true)}
              className="flex items-center space-x-2 bg-stone-900 hover:bg-stone-900 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm active:scale-[0.97] custom-focus-ring"
            >
              <Store size={16} />
              <span>My Shop</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-xs font-bold">{inventoryCount}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Hero Section */}
        <HeroSection />

        {/* Top Analytics Row (Flexible Height) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[300px]">
          <div className="lg:col-span-8">
            <SmartInsights />
          </div>
          <div className="lg:col-span-4">
            <WhatsHotCard />
          </div>
        </div>

        {/* Bottom Data Row (Flexible Height) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[400px]">
          <div className="lg:col-span-4">
            <TrendingKeywords />
          </div>
          <div className="lg:col-span-8">
            <BestsellersList />
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-white mt-8 border-t-4 border-stone-900">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <div className="bg-stone-900 p-1.5 rounded-lg shadow-sm">
              <Activity size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-wider uppercase text-stone-100">Accessories Hub Ltd.</span>
          </div>
          
          <p className="text-sm text-stone-400 font-medium flex items-center">
  © 2026 All rights reserved. 
  <span className="mx-2 text-stone-700">|</span> 
  <a 
    href="https://github.com/deepesh2606" 
    target="_blank" 
    rel="noopener noreferrer"
    className="hover:text-stone-300 transition-colors"
  >
    Deepesh
  </a>
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
