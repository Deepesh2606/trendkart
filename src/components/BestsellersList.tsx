'use client';
import { useEffect, useState } from 'react';
import { Star, ShoppingBag, ExternalLink, Cable, Smartphone, Headphones, BatteryCharging, Plus, Speaker, MonitorSpeaker, HardDrive } from 'lucide-react';

interface Product {
  id: string;
  rank: number;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: string;
  link: string;
  imageUrl?: string;
}

const CATEGORIES = ['Cables', 'Covers', 'Headsets', 'Chargers', 'Speakers', 'Soundbars', 'SD Cards'];

const CategoryIcon = ({ category, className }: { category: string, className?: string }) => {
  switch (category) {
    case 'Cables': return <Cable className={className} />;
    case 'Covers': return <Smartphone className={className} />;
    case 'Headsets': return <Headphones className={className} />;
    case 'Chargers': return <BatteryCharging className={className} />;
    case 'Speakers': return <Speaker className={className} />;
    case 'Soundbars': return <MonitorSpeaker className={className} />;
    case 'SD Cards': return <HardDrive className={className} />;
    default: return <ShoppingBag className={className} />;
  }
};

export default function BestsellersList() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/bestsellers?category=${activeCategory}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.bestsellers);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [activeCategory]);

  const addToInventory = (product: Product) => {
    window.dispatchEvent(new CustomEvent('addToInventory', { 
      detail: { ...product, category: activeCategory, status: 'Stocked' } 
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm h-full flex flex-col group/container hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg group-hover/container:scale-110 transition-transform duration-300">
            <ShoppingBag size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Flipkart Bestsellers</h2>
        </div>
        
        <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg self-start">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-300 ${activeCategory === cat ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm scale-105' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center p-3 border-b border-gray-100 dark:border-gray-800">
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-md mr-3"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((product, idx) => (
              <div key={product.id} className="group flex items-center p-3 bg-white dark:bg-gray-900 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50 rounded-lg hover:bg-blue-50/50 dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm mr-3 transition-colors ${idx < 3 ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'}`}>
                  {product.rank}
                </div>
                
                <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg mr-3 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                  <CategoryIcon category={activeCategory} className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0 pr-4">
                  <a href={product.link} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-gray-900 dark:text-gray-100 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {product.name}
                  </a>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-3">
                    <span className="flex items-center">
                      <Star size={12} className="text-yellow-400 mr-1 fill-yellow-400" />
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end justify-center mr-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                  )}
                  <a href={product.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors mt-1 hidden sm:block opacity-0 group-hover:opacity-100">
                    <ExternalLink size={14} />
                  </a>
                </div>

                <button 
                  onClick={() => addToInventory(product)}
                  title="Add to Shop Inventory"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                >
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
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
