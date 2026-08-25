import { NextResponse } from 'next/server';
import { getDataAsOf, getTrends } from '@/lib/market';

/**
 * GET /api/trends -> { asOf, trends }
 *
 * The page itself does not use this; it reads `src/lib/market.ts` directly as a
 * Server Component. The route exists so the same data has a JSON surface for
 * anything outside the app, and it is the second place to change when a live
 * feed replaces the curated catalogue.
 *
 * The old handler called `google-trends-api`'s `dailyTrends`, an endpoint Google
 * has since retired, and quietly served a hardcoded fallback whenever it threw —
 * which was always. The dependency is gone and the data is now honest about what
 * it is.
 */
export function GET() {
  return NextResponse.json(
    { asOf: getDataAsOf(), sample: true, trends: getTrends() },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
