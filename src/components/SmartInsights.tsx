'use client';
import React, { useEffect, useState } from 'react';
import { Lightbulb, AlertCircle, TrendingUp, IndianRupee, Package } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  status: 'Stocked' | 'Ordered' | 'Out of Stock' | 'Researching';
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Insight {
  type: 'alert' | 'opportunity' | 'trend';
  title: string;
  description: string;
  metric?: string;
  icon: React.ReactNode;
  color: string;
}

export default function SmartInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = async () => {
      setLoading(true);
      
      const newInsights: Insight[] = [];
      const saved = localStorage.getItem('jalandharShopInventory');
      const inventory: InventoryItem[] = saved ? JSON.parse(saved) : [];

      // 1. Check for Out of Stock alerts
      const outOfStock = inventory.filter(i => i.status === 'Out of Stock');
      if (outOfStock.length > 0) {
        newInsights.push({
          type: 'alert',
          title: 'Restock Action Required',
          description: "You have " + outOfStock.length + " trending " + (outOfStock.length === 1 ? 'item' : 'items') + " marked as Out of Stock (e.g., " + outOfStock[0].name + ").",
          icon: <AlertCircle size={20} />,
          color: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 ring-red-500/30'
        });
      }

      // 2. Fetch bestsellers to find margin opportunities
      try {
        const res = await fetch('/api/bestsellers?category=Soundbars');
        const data = await res.json();
        const topProduct = data.bestsellers[0] as Product;
        
        if (topProduct && !inventory.find(i => i.name === topProduct.name)) {
          // Estimate wholesale price (approx 40% margin on electronics)
          const marginPercent = topProduct.price > 2000 ? 35 : 45;
          const wholesalePrice = Math.round(topProduct.price * (1 - (marginPercent / 100)));
          const profit = topProduct.price - wholesalePrice;

          newInsights.push({
            type: 'opportunity',
            title: 'High Margin Sourcing',
            description: "Source \"" + topProduct.name + "\". Est. Wholesale: ₹" + wholesalePrice + " | Retail: ₹" + topProduct.price,
            metric: "+₹" + profit + "/unit",
            icon: <IndianRupee size={20} />,
            color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 ring-emerald-500/30'
          });
        }
      } catch (e) {
        console.error(e);
      }

      // 3. General tracking stat
      const stocked = inventory.filter(i => i.status === 'Stocked');
      newInsights.push({
        type: 'trend',
        title: 'Inventory Health',
        description: "You are currently carrying " + stocked.length + " active top-trending products on your shelves.",
        icon: <Package size={20} />,
        color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 ring-blue-500/30'
      });

      setInsights(newInsights);
      setLoading(false);
    };

    // Initial load
    generateInsights();

    // Listen for inventory updates
    window.addEventListener('addToInventory', generateInsights);
    // Note: We'd ideally listen to custom events for status updates too, but simple polling or relying on user refresh is okay for this widget size
    const interval = setInterval(generateInsights, 30000); // refresh every 30s in case they update drawer
    
    return () => {
      window.removeEventListener('addToInventory', generateInsights);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm h-full flex flex-col group/container hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg group-hover/container:scale-110 transition-transform duration-300">
            <Lightbulb size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Smart Insights</h2>
        </div>
        <div className="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md select-none">
          <TrendingUp size={14} className="mr-1" /> Actionable Data
        </div>
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Automated recommendations based on Jalandhar market trends vs your current shop stock.
      </p>

      <div className="flex-1 w-full space-y-4 overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
            ))}
          </div>
        ) : (
          insights.map((insight, idx) => (
            <div key={idx} className="flex items-start p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <div className={"flex-shrink-0 p-2 rounded-lg ring-1 " + insight.color + " mr-4"}>
                {insight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{insight.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  {insight.description}
                </p>
              </div>
              {insight.metric && (
                <div className="ml-3 text-right">
                  <span className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
                    {insight.metric}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
