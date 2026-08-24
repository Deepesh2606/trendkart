'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { InventoryItem } from '@/types';

const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'boAt Type C A325', category: 'Cables', status: 'Stocked' },
  { id: '2', name: 'Spigen Ultra Hybrid iPhone 15', category: 'Covers', status: 'Ordered' },
];

export interface AddItemInput {
  id?: string;
  name: string;
  category?: string;
  status?: InventoryItem['status'];
}

interface InventoryContextType {
  inventory: InventoryItem[];
  /** Returns true if the item was added, false if it was already in inventory */
  addItem: (item: AddItemInput) => boolean;
  removeItem: (id: string) => void;
  updateStatus: (id: string, status: InventoryItem['status']) => void;
  isTracked: (name: string) => InventoryItem | undefined;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  // Ref for synchronous reads inside addItem callback (avoids stale closures)
  const inventoryRef = useRef<InventoryItem[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    inventoryRef.current = inventory;
  }, [inventory]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('jalandharShopInventory');
      const parsed: InventoryItem[] = saved ? JSON.parse(saved) : DEFAULT_INVENTORY;
      setInventory(parsed);
      if (!saved) {
        localStorage.setItem('jalandharShopInventory', JSON.stringify(DEFAULT_INVENTORY));
      }
    } catch {
      // Corrupted localStorage — reset to defaults
      setInventory(DEFAULT_INVENTORY);
      localStorage.setItem('jalandharShopInventory', JSON.stringify(DEFAULT_INVENTORY));
    }
  }, []);

  const addItem = useCallback((item: AddItemInput): boolean => {
    // Synchronous duplicate check via ref
    if (inventoryRef.current.find(i => i.name === item.name)) return false;

    const newItem: InventoryItem = {
      id: item.id || Date.now().toString(),
      name: item.name,
      category: item.category || 'Accessory',
      status: item.status || 'Researching',
    };

    setInventory(prev => {
      // Double-check inside updater for race conditions
      if (prev.find(i => i.name === item.name)) return prev;
      const updated = [newItem, ...prev];
      localStorage.setItem('jalandharShopInventory', JSON.stringify(updated));
      return updated;
    });

    return true;
  }, []);

  const removeItem = useCallback((id: string) => {
    setInventory(prev => {
      const updated = prev.filter(i => i.id !== id);
      localStorage.setItem('jalandharShopInventory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateStatus = useCallback((id: string, status: InventoryItem['status']) => {
    setInventory(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, status } : i);
      localStorage.setItem('jalandharShopInventory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isTracked = useCallback((name: string): InventoryItem | undefined => {
    return inventory.find(i => i.name === name);
  }, [inventory]);

  return (
    <InventoryContext.Provider value={{ inventory, addItem, removeItem, updateStatus, isTracked }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory(): InventoryContextType {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within <InventoryProvider>');
  return ctx;
}
