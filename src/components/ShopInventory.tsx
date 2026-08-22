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
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Store size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">My Jalandhar Shop</h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 text-xs font-bold px-2 py-1 rounded-full">
              {inventory.length} Items
            </span>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-3">
          {inventory.length === 0 ? (
            <div className="text-center text-gray-500 py-10 text-sm flex flex-col items-center">
              <Store size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
              <p>Inventory is empty.</p>
              <p className="mt-1">Click '+' on trending items to add them here.</p>
            </div>
          ) : (
            inventory.map((item) => (
              <div key={item.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <button 
                    onClick={() => updateStatus(item.id, 'Stocked')}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-colors ${item.status === 'Stocked' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 ring-1 ring-green-500/30' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <CheckCircle2 size={14} className="mr-1.5" /> In Store
                  </button>
                  <button 
                    onClick={() => updateStatus(item.id, 'Ordered')}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-colors ${item.status === 'Ordered' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 ring-1 ring-blue-500/30' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <Clock size={14} className="mr-1.5" /> Ordered
                  </button>
                  <button 
                    onClick={() => updateStatus(item.id, 'Out of Stock')}
                    className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-colors ${item.status === 'Out of Stock' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 ring-1 ring-red-500/30' : 'bg-gray-50 dark:bg-gray-700/50 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
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
