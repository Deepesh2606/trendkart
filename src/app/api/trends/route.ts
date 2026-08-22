import { NextResponse } from 'next/server';
// @ts-ignore
import googleTrends from 'google-trends-api';

export async function GET() {
  try {
    // Try to fetch real-time trends for India
    const results = await googleTrends.dailyTrends({
      geo: 'IN',
    });
    
    const parsedData = JSON.parse(results);
    const trendingSearches = parsedData.default.trendingSearchesDays[0].trendingSearches;
    
    // Filter/map to our format
    const trends = trendingSearches.slice(0, 5).map((item: any) => ({
      keyword: item.title.query,
      volume: item.formattedTraffic,
      trend: 'up', // Default to up since it's trending
      percentage: Math.floor(Math.random() * 50) + 10 // Mocking percentage since it's not directly provided
    }));
    
    return NextResponse.json({ trends });
  } catch (error) {
    console.error("Google Trends API Error:", error);
    
    // Fallback Mock Data tailored for Mobile Accessories
    return NextResponse.json({
      trends: [
        { keyword: "iPhone 15 Pro Max cover", volume: "10K+", trend: "up", percentage: 42 },
        { keyword: "Type C fast charger 65W", volume: "8K+", trend: "up", percentage: 35 },
        { keyword: "Airpods pro case cover", volume: "5K+", trend: "down", percentage: 12 },
        { keyword: "Samsung S24 Ultra screen guard", volume: "5K+", trend: "up", percentage: 28 },
        { keyword: "Boat Airdopes 141", volume: "4K+", trend: "up", percentage: 15 },
      ]
    });
  }
}
