'use client';
import { useEffect, useState } from 'react';
import { Store, CheckCircle2, Clock, PackageX, Trash2 } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  status: 'Stocked' | 'Ordered' | 'Out of Stock' | 'Researching';
}

export default function ShopInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('jalandharShopInventory');
    if (saved) {
      setInventory(JSON.parse(saved));
    } else {
      // Default sample for the shop owner
      setInventory([
        { id: '1', name: 'boAt Type C A325', category: 'Cables', status: 'Stocked' },
        { id: '2', name: 'Spigen Ultra Hybrid iPhone 15', category: 'Covers', status: 'Ordered' },
      ]);
    }

    const handleAdd = (e: any) => {
      const newItem = e.detail;
      setInventory(prev => {
        // Prevent duplicates
        if (prev.find(item => item.name === newItem.name)) return prev;
        
        const updated = [{
          id: newItem.id || Date.now().toString(),
          name: newItem.name,
          category: newItem.category || 'Accessory',
          status: newItem.status || 'Researching'
        }, ...prev];
        
        localStorage.setItem('jalandharShopInventory', JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('addToInventory', handleAdd);
    return () => window.removeEventListener('addToInventory', handleAdd);
  }, []);

  const updateStatus = (id: string, newStatus: InventoryItem['status']) => {
    const updated = inventory.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
    setInventory(updated);
    localStorage.setItem('jalandharShopInventory', JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    const updated = inventory.filter(item => item.id !== id);
    setInventory(updated);
    localStorage.setItem('jalandharShopInventory', JSON.stringify(updated));
  };

  if (!isMounted) return null;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm h-full flex flex-col group/container hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover/container:scale-110 transition-transform duration-300">
            <Store size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Jalandhar Shop</h2>
        </div>
        <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 text-xs font-bold px-2 py-1 rounded-full">
          {inventory.length} Items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
        {inventory.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-sm">
            Inventory is empty.<br/>Click '+' on trending items to add them here.
          </div>
        ) : (
          inventory.map((item) => (
            <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="flex space-x-2 mt-3">
                <button 
                  onClick={() => updateStatus(item.id, 'Stocked')}
                  className={`flex-1 flex items-center justify-center py-1 rounded text-xs font-medium transition-colors ${item.status === 'Stocked' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100'}`}
                >
                  <CheckCircle2 size={12} className="mr-1" /> In Store
                </button>
                <button 
                  onClick={() => updateStatus(item.id, 'Ordered')}
                  className={`flex-1 flex items-center justify-center py-1 rounded text-xs font-medium transition-colors ${item.status === 'Ordered' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100'}`}
                >
                  <Clock size={12} className="mr-1" /> Ordered
                </button>
                <button 
                  onClick={() => updateStatus(item.id, 'Out of Stock')}
                  className={`flex-1 flex items-center justify-center py-1 rounded text-xs font-medium transition-colors ${item.status === 'Out of Stock' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100'}`}
                >
                  <PackageX size={12} className="mr-1" /> Out
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
