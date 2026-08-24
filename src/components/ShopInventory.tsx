'use client';
import { useEffect, useState } from 'react';
import { Store, CheckCircle2, Clock, PackageX, Trash2, X } from 'lucide-react';
import { useInventory } from '@/context/InventoryContext';
import type { InventoryItem } from '@/types';

interface ShopInventoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShopInventory({ isOpen, onClose }: ShopInventoryProps) {
  // All state comes from shared context — no local duplication
  const { inventory, removeItem, updateStatus } = useInventory();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  // Stats derived from shared inventory state
  const stocked   = inventory.filter(i => i.status === 'Stocked').length;
  const ordered   = inventory.filter(i => i.status === 'Ordered').length;
  const outCount  = inventory.filter(i => i.status === 'Out of Stock').length;
  const research  = inventory.filter(i => i.status === 'Researching').length;

  const statusButtons: Array<{
    status: InventoryItem['status'];
    label: string;
    activeClass: string;
    Icon: typeof CheckCircle2;
  }> = [
    { status: 'Stocked',      label: 'In Store', activeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 ring-1 ring-emerald-500/30', Icon: CheckCircle2 },
    { status: 'Ordered',      label: 'Ordered',  activeClass: 'bg-stone-200 text-stone-900 dark:bg-stone-700/40 dark:text-stone-100 ring-1 ring-stone-300/30',           Icon: Clock },
    { status: 'Out of Stock', label: 'Out',       activeClass: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 ring-1 ring-red-500/30',                     Icon: PackageX },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Slide-out drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-stone-50 dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-stone-200 dark:bg-stone-700/30 text-stone-900 dark:text-stone-100 rounded-lg">
              <Store size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 leading-none">
                My Jalandhar Shop
              </h2>
              <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">
                {inventory.length} items tracked
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close inventory drawer"
            className="p-1.5 text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors active:scale-[0.97] custom-focus-ring"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick stats strip */}
        {inventory.length > 0 && (
          <div className="flex items-center divide-x divide-stone-200 dark:divide-stone-700 border-b border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60">
            {[
              { label: 'In Stock',    value: stocked,   color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Ordered',     value: ordered,   color: 'text-stone-600 dark:text-stone-300' },
              { label: 'Out',         value: outCount,  color: 'text-rose-600 dark:text-rose-400' },
              { label: 'Researching', value: research,  color: 'text-amber-600 dark:text-amber-400' },
            ].map(stat => (
              <div key={stat.label} className="flex-1 py-2.5 text-center">
                <p className={`text-xl font-black leading-none ${stat.color}`}>{stat.value}</p>
                <p className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-3">
          {inventory.length === 0 ? (
            <div className="text-center text-stone-500 py-16 flex flex-col items-center">
              <Store size={48} className="text-stone-300 dark:text-stone-700 mb-4" />
              <p className="font-semibold text-stone-700 dark:text-stone-300 text-sm">Inventory is empty</p>
              <p className="mt-2 text-xs text-stone-400 dark:text-stone-500 max-w-[200px] leading-relaxed text-center">
                Click &quot;+&quot; on any bestseller or trending keyword to start tracking it here.
              </p>
            </div>
          ) : (
            inventory.map(item => (
              <div
                key={item.id}
                className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700/50 hover:border-stone-300 dark:hover:border-stone-600 transition-colors shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{item.category}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                    className="text-stone-300 dark:text-stone-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded active:scale-[0.97] custom-focus-ring shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Status buttons */}
                <div className="flex space-x-1.5 pt-3 border-t border-stone-100 dark:border-stone-700/50 select-none">
                  {statusButtons.map(({ status, label, activeClass, Icon }) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(item.id, status)}
                      className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-[11px] font-semibold transition-colors active:scale-[0.97] custom-focus-ring ${
                        item.status === status
                          ? activeClass
                          : 'bg-stone-50 dark:bg-stone-700/50 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700'
                      }`}
                    >
                      <Icon size={13} className="mr-1" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
