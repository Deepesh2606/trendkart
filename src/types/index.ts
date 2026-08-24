import type { ReactNode } from 'react';

export interface Product {
  id: string;
  rank?: number;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: string;
  link: string;
  category?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  status: 'Stocked' | 'Ordered' | 'Out of Stock' | 'Researching';
}

export interface Trend {
  keyword: string;
  volume: string;
  trend: 'up' | 'down';
  percentage: number;
}

export interface InsightCard {
  id: string;
  type: 'margin' | 'revenue' | 'mover';
  title: string;
  productName: string;
  description: string;
  badgeText: string;
  badgeColor: string;
  icon: ReactNode;
  product: Product;
}

export interface ChartData {
  category: string;
  marketItems: number;
  shopItems: number;
}
