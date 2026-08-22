import { NextResponse } from 'next/server';
// @ts-ignore
import googleTrends from 'google-trends-api';

export async function GET() {
  try {
    // Try to fetch real-time trends for Punjab, India
    const results = await googleTrends.dailyTrends({
      geo: 'IN-PB',
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
        { keyword: "Generic dash cam dual channel", volume: "12K+", trend: "up", percentage: 55 },
        { keyword: "10 inch ring light with tripod", volume: "9K+", trend: "up", percentage: 42 },
        { keyword: "Type C to 3.5mm jack OTG adapter", volume: "8K+", trend: "up", percentage: 38 },
        { keyword: "Universal magnetic car phone mount", volume: "6K+", trend: "up", percentage: 22 },
        { keyword: "Flexible gorilla tripod stand", volume: "5K+", trend: "down", percentage: 15 },
      ]
    });
  }
}
