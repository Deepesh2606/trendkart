'use client';
import { useSyncExternalStore } from 'react';
import { THEME_KEY } from '@/lib/theme-script';

/**
 * Light or dark, kept in localStorage and mirrored onto `<html class="dark">`.
 *
 * The class itself is set by a blocking script in the document head, before the
 * first paint, so there is no flash of the wrong theme. This store only reads
 * that state back and flips it — it never has to guess on the server, because
 * `getServerSnapshot` reports light and the class is authoritative on the client.
 */

export type Theme = 'light' | 'dark';

let snapshot: Theme = 'light';
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void): () => void {
  if (!hydrated) {
    hydrated = true;
    snapshot = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
  }
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = (): Theme => 'light';

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setTheme(next: Theme): void {
  snapshot = next;
  const root = document.documentElement;
  root.classList.toggle('dark', next === 'dark');
  root.style.colorScheme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // Storage denied: the choice still applies for this session.
  }
  emit();
}

export function toggleTheme(): void {
  setTheme(snapshot === 'dark' ? 'light' : 'dark');
}
