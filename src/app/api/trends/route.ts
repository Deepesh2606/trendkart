import { NextResponse } from 'next/server';
// @ts-ignore
import googleTrends from 'google-trends-api';

export async function GET() {
  try {
    const results = await googleTrends.dailyTrends({ geo: 'IN-PB' });
    const parsedData = JSON.parse(results);
    const trendingSearches = parsedData.default.trendingSearchesDays[0].trendingSearches;

    // Derive stable descending percentages from rank instead of Math.random()
    // This avoids ISR cache serving stale random numbers
    const trends = trendingSearches.slice(0, 6).map((item: any, index: number) => ({
      keyword: item.title.query,
      volume: item.formattedTraffic,
      trend: index < 4 ? 'up' : 'down',
      percentage: Math.max(8, 60 - index * 9),
    }));

    return NextResponse.json({ trends });
  } catch (error) {
    console.error('Google Trends API Error:', error);

    // Fallback: stable mock data for Punjab mobile accessories market
    return NextResponse.json({
      trends: [
        { keyword: 'Generic dash cam dual channel', volume: '12K+', trend: 'up',   percentage: 55 },
        { keyword: '10 inch ring light with tripod',  volume: '9K+',  trend: 'up',   percentage: 42 },
        { keyword: 'Type C to 3.5mm OTG adapter',     volume: '8K+',  trend: 'up',   percentage: 38 },
        { keyword: 'Magnetic car phone mount',         volume: '6K+',  trend: 'up',   percentage: 22 },
        { keyword: 'Wireless collar mic Type-C',       volume: '5K+',  trend: 'up',   percentage: 18 },
        { keyword: 'Flexible gorilla tripod stand',    volume: '4K+',  trend: 'down', percentage: 12 },
      ],
    });
  }
}
