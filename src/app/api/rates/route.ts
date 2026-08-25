import { NextResponse } from 'next/server';
import { CATEGORIES, type Category } from '@/types';
import {
  MARGIN_NOTE,
  getDataAsOf,
  getProducts,
  getProductsByCategory,
} from '@/lib/market';

/**
 * GET /api/rates            -> every line
 * GET /api/rates?category=X -> one category
 *
 * Replaces /api/bestsellers, which returned an object keyed by category for
 * `all` and a bare array for anything else — so every caller had to branch on
 * the shape. This always returns `{ asOf, category, count, products }` with
 * `products` as an array, and rejects an unknown category instead of quietly
 * returning nothing.
 */
export function GET(request: Request) {
  const asked = new URL(request.url).searchParams.get('category');

  if (asked === null || asked === 'all') {
    const products = getProducts();
    return NextResponse.json(
      {
        asOf: getDataAsOf(),
        sample: true,
        marginNote: MARGIN_NOTE,
        category: 'all',
        count: products.length,
        products,
      },
      { headers: { 'Cache-Control': 'public, max-age=3600' } },
    );
  }

  if (!CATEGORIES.includes(asked as Category)) {
    return NextResponse.json(
      { error: `Unknown category "${asked}".`, categories: CATEGORIES },
      { status: 400 },
    );
  }

  const products = getProductsByCategory(asked as Category);
  return NextResponse.json(
    {
      asOf: getDataAsOf(),
      sample: true,
      marginNote: MARGIN_NOTE,
      category: asked,
      count: products.length,
      products,
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  );
}
