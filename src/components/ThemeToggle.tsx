'use client';
import { Moon, Sun } from 'lucide-react';
import { toggleTheme, useTheme } from '@/store/theme';

/** Day counter or evening counter. The class is already on <html> before paint. */
export function ThemeToggle() {
  const theme = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="border-rule-strong text-ink-soft hover:text-ink hover:bg-sunk grid size-8 place-items-center border transition-colors"
    >
      {theme === 'dark' ? (
        <Sun size={15} strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Moon size={15} strokeWidth={1.75} aria-hidden="true" />
      )}
    </button>
  );
}
