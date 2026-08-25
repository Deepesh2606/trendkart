import type { Metadata } from 'next';
import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Condensed,
} from 'next/font/google';
import { THEME_SCRIPT } from '@/lib/theme-script';
import './globals.css';

/**
 * IBM Plex, three ways: condensed for headings and column titles, the regular
 * sans for prose, mono for every figure. One superfamily keeps the page looking
 * like a single printed form rather than three fonts arguing.
 */
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
});

const plexCondensed = IBM_Plex_Sans_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-plex-condensed',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TrendKart — rate list & stock register',
  description:
    'A rate list for a mobile-accessories counter in Jalandhar: street rates against MRP, what is trending, and what to buy next. Runs on a curated sample catalogue.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexCondensed.variable} ${plexMono.variable}`}
    >
      <head>
        {/* Runs before paint, so the theme is settled by the first frame. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
