'use client';
import { dismissToast, useToasts } from '@/store/toast';

/** Bottom-left slips confirming register writes. Announced politely, not modal. */
export function Toasts() {
  const toasts = useToasts();
  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismissToast(toast.id)}
          className={`bg-raised pointer-events-auto border-l-4 px-3 py-2 text-left text-sm shadow-[3px_3px_0_0_var(--rule)] ${
            toast.tone === 'ok' ? 'border-l-stamp' : 'border-l-margin-red'
          }`}
        >
          {toast.message}
        </button>
      ))}
    </div>
  );
}
