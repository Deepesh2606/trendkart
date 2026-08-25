'use client';
import { useSyncExternalStore } from 'react';

/** Brief confirmations for register writes. Same external-store shape as the rest. */

export interface Toast {
  id: number;
  message: string;
  tone: 'ok' | 'warn';
}

const LIFETIME_MS = 2600;
const EMPTY: Toast[] = [];

let snapshot: Toast[] = EMPTY;
let nextId = 1;
const listeners = new Set<() => void>();

function commit(next: Toast[]) {
  snapshot = next;
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void): () => void {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => EMPTY;

export function useToasts(): Toast[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function dismissToast(id: number): void {
  commit(snapshot.filter((toast) => toast.id !== id));
}

/** Shows a message. Called from click handlers, never during render. */
export function toast(message: string, tone: Toast['tone'] = 'ok'): void {
  const id = nextId++;
  // Two at a time is plenty; older ones would only cover the page.
  commit([...snapshot.slice(-1), { id, message, tone }]);
  setTimeout(() => dismissToast(id), LIFETIME_MS);
}
