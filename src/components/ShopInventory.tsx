'use client';
import { useEffect, useState } from 'react';
import { Store, CheckCircle2, Clock, PackageX, Trash2, X } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  status: 'Stocked' | 'Ordered' | 'Out of Stock' | 'Researching';
}

interface ShopInventoryProps {
  isOpen: boolean;
  onClose: () => void;
  onCountChange?: (count: number) => void;
}

export default function ShopInventory({ isOpen, onClose, onCountChange }: ShopInventoryProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('jalandharShopInventory');
    let initialInventory = [];
    if (saved) {
      initialInventory = JSON.parse(saved);
    } else {
      // Default sample for the shop owner
      initialInventory = [
        { id: '1', name: 'boAt Type C A325', category: 'Cables', status: 'Stocked' },
        { id: '2', name: 'Spigen Ultra Hybrid iPhone 15', category: 'Covers', status: 'Ordered' },
      ];
      localStorage.setItem('jalandharShopInventory', JSON.stringify(initialInventory));
    }
    setInventory(initialInventory);
    if (onCountChange) onCountChange(initialInventory.length);

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
        if (onCountChange) onCountChange(updated.length);
        return updated;
      });
    };

    window.addEventListener('addToInventory', handleAdd);
    return () => window.removeEventListener('addToInventory', handleAdd);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (onCountChange) onCountChange(updated.length);
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-stone-50 dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        
        <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-stone-200 dark:bg-stone-700/30 text-stone-900 dark:text-stone-100 rounded-lg">
              <Store size={20} />
            </div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">My Jalandhar Shop</h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className="bg-stone-200 text-stone-700 dark:bg-stone-700/50 dark:text-stone-300 text-xs font-bold px-2 py-1 rounded-full select-none">
              {inventory.length} Items
            </span>
            <button 
              onClick={onClose} 
              aria-label="Close Inventory Drawer"
              className="p-1.5 text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors active:scale-[0.97] custom-focus-ring"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-3">
          {inventory.length === 0 ? (
            <div className="text-center text-stone-500 py-10 text-sm flex flex-col items-center">
              <Store size={48} className="text-stone-300 dark:text-stone-700 mb-4" />
              <p>Inventory is empty.</p>
              <p className="mt-1">Click '+' on trending items to add them here.</p>
            </div>
          ) : (
            inventory.map((item) => (
              <div key={item.id} className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700/50 hover:border-stone-300 dark:hover:border-stone-700/50 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-tight">{item.name}</h3>
                    <p className="text-xs text-stone-500 mt-1">{item.category}</p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)} 
                    aria-label="Remove item"
                    className="text-stone-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded active:scale-[0.97] custom-focus-ring"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex space-x-2 mt-4 pt-3 border-t border-stone-100 dark:border-stone-700/50 select-none">
                  <button 
                    onClick={() => updateStatus(item.id, 'Stocked')}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-colors active:scale-[0.97] custom-focus-ring ${item.status === 'Stocked' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 ring-1 ring-green-500/30' : 'bg-stone-50 dark:bg-stone-700/50 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700'}`}
                  >
                    <CheckCircle2 size={14} className="mr-1.5" /> In Store
                  </button>
                  <button 
                    onClick={() => updateStatus(item.id, 'Ordered')}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-colors active:scale-[0.97] custom-focus-ring ${item.status === 'Ordered' ? 'bg-stone-200 text-stone-900 dark:bg-stone-700/40 dark:text-stone-100 ring-1 ring-stone-300/30' : 'bg-stone-50 dark:bg-stone-700/50 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700'}`}
                  >
                    <Clock size={14} className="mr-1.5" /> Ordered
                  </button>
                  <button 
                    onClick={() => updateStatus(item.id, 'Out of Stock')}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-colors active:scale-[0.97] custom-focus-ring ${item.status === 'Out of Stock' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 ring-1 ring-red-500/30' : 'bg-stone-50 dark:bg-stone-700/50 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700'}`}
                  >
                    <PackageX size={14} className="mr-1.5" /> Out
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
