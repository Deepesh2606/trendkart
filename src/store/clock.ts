'use client';
import { useSyncExternalStore } from 'react';

/**
 * The wall clock behind the counter.
 *
 * A ticking clock cannot be rendered on the server without a hydration mismatch,
 * and setting state from an effect is exactly the pattern the React Compiler lint
 * rules reject. So: an external store that reports 0 until it is subscribed, and
 * a caller that shows a placeholder for that one frame.
 */

let now = 0;
let timer: ReturnType<typeof setInterval> | undefined;
const listeners = new Set<() => void>();

function tick() {
  now = Date.now();
  listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void): () => void {
  listeners.add(notify);
  if (timer === undefined) {
    tick();
    timer = setInterval(tick, 1000);
  }
  return () => {
    listeners.delete(notify);
    if (listeners.size === 0 && timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => now;
const getServerSnapshot = () => 0;

/** Milliseconds since the epoch, or 0 before the first client tick. */
export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
