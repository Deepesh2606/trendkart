'use client';
import React from 'react';
import { InventoryProvider } from '@/context/InventoryContext';
import { ToastContainer } from '@/components/Toast';

/** Root client-side providers — wraps the app with InventoryContext and mounts the Toast system */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <InventoryProvider>
      {children}
      <ToastContainer />
    </InventoryProvider>
  );
}
