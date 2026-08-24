'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'info';
}

// Singleton event bus — allows showToast() to be called from anywhere without hooks
let _toastId = 0;
type ToastListener = (toast: ToastMessage) => void;
const _listeners: ToastListener[] = [];

export function showToast(message: string, type: ToastMessage['type'] = 'success') {
  const toast: ToastMessage = { id: ++_toastId, message, type };
  _listeners.forEach(fn => fn(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (toast: ToastMessage) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3500);
    };
    _listeners.push(handler);
    return () => {
      const idx = _listeners.indexOf(handler);
      if (idx > -1) _listeners.splice(idx, 1);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-4 py-3 rounded-xl shadow-2xl border border-stone-700 dark:border-stone-200 min-w-[260px] max-w-[340px] animate-slideUp"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={17} className="text-emerald-400 dark:text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={17} className="text-amber-400 dark:text-amber-600 shrink-0" />
          )}
          <span className="text-sm font-medium flex-1 leading-snug">{toast.message}</span>
          <button
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            className="text-stone-400 hover:text-stone-200 dark:text-stone-500 dark:hover:text-stone-700 transition-colors ml-1"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
