import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'Cables';

  // For the MVP, we use realistic mock data.
  // In a production scenario, this would either use Flipkart Affiliate API 
  // or a headless browser scraping service (like Puppeteer via a microservice)
  
  const mockDatabase: Record<string, any[]> = {
    'Cables': [
      { id: 'c1', rank: 1, name: 'boAt Type C A325 Tangle-free Cable', price: 199, originalPrice: 499, rating: 4.3, reviews: '2.5L+', link: 'https://www.flipkart.com/search?q=boAt+Type+C+cable', imageUrl: 'https://images.unsplash.com/photo-1611078716551-0a6a43875569?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'c2', rank: 2, name: 'Ambrane Unbreakable 60W / 3A Fast Charging Type C Cable', price: 179, originalPrice: 299, rating: 4.2, reviews: '1L+', link: 'https://www.flipkart.com/search?q=Ambrane+Type+C+Cable', imageUrl: 'https://images.unsplash.com/photo-1611078716551-0a6a43875569?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'c3', rank: 3, name: 'Portronics Konnect L 1.2M Fast Charging Cable', price: 149, originalPrice: 339, rating: 4.1, reviews: '50K+', link: 'https://www.flipkart.com/search?q=Portronics+Konnect+Cable', imageUrl: 'https://images.unsplash.com/photo-1611078716551-0a6a43875569?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'c4', rank: 4, name: 'Apple 20W USB-C Power Adapter Cable', price: 1599, originalPrice: 1900, rating: 4.6, reviews: '80K+', link: 'https://www.flipkart.com/search?q=Apple+USB-C+Cable', imageUrl: 'https://images.unsplash.com/photo-1611078716551-0a6a43875569?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'c5', rank: 5, name: 'Mi USB Type-C Cable', price: 249, originalPrice: 299, rating: 4.3, reviews: '90K+', link: 'https://www.flipkart.com/search?q=Mi+USB+Type-C+Cable', imageUrl: 'https://images.unsplash.com/photo-1611078716551-0a6a43875569?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'c6', rank: 6, name: 'Realme 30W Dart Charge Cable', price: 349, originalPrice: 499, rating: 4.4, reviews: '30K+', link: 'https://www.flipkart.com/search?q=Realme+Dart+Charge+Cable', imageUrl: 'https://images.unsplash.com/photo-1611078716551-0a6a43875569?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'c7', rank: 7, name: 'OnePlus Warp Charge Type-C Cable', price: 849, originalPrice: 849, rating: 4.5, reviews: '20K+', link: 'https://www.flipkart.com/search?q=OnePlus+Warp+Charge+Cable', imageUrl: 'https://images.unsplash.com/photo-1611078716551-0a6a43875569?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'c8', rank: 8, name: 'Spigen DuraSync Type C Cable', price: 499, originalPrice: 999, rating: 4.2, reviews: '15K+', link: 'https://www.flipkart.com/search?q=Spigen+Type+C+Cable', imageUrl: 'https://images.unsplash.com/photo-1611078716551-0a6a43875569?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'c9', rank: 9, name: 'AmazonBasics Double Braided Nylon Type C', price: 399, originalPrice: 700, rating: 4.1, reviews: '40K+', link: 'https://www.flipkart.com/search?q=AmazonBasics+Type+C+Cable', imageUrl: 'https://images.unsplash.com/photo-1611078716551-0a6a43875569?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'c10', rank: 10, name: 'Ptron Solero Type C Fast Charging', price: 99, originalPrice: 200, rating: 3.9, reviews: '10K+', link: 'https://www.flipkart.com/search?q=Ptron+Solero+Type+C', imageUrl: 'https://images.unsplash.com/photo-1611078716551-0a6a43875569?auto=format&fit=crop&q=80&w=150&h=150' },
    ],
    'Covers': [
      { id: 'cov1', rank: 1, name: 'Spigen Ultra Hybrid Back Cover for iPhone 15', price: 1299, originalPrice: 2499, rating: 4.6, reviews: '10K+', link: 'https://www.flipkart.com/search?q=Spigen+Ultra+Hybrid+iPhone+15', imageUrl: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'cov2', rank: 2, name: 'TheGiftKart Transparent Case for Samsung S24', price: 299, originalPrice: 599, rating: 4.1, reviews: '15K+', link: 'https://www.flipkart.com/search?q=Transparent+Case+Samsung+S24', imageUrl: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'cov3', rank: 3, name: 'Pikkme Liquid Silicone Cover for iPhone 13', price: 349, originalPrice: 999, rating: 4.3, reviews: '25K+', link: 'https://www.flipkart.com/search?q=Liquid+Silicone+Cover+iPhone+13', imageUrl: 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&q=80&w=150&h=150' },
    ],
    'Headsets': [
      { id: 'h1', rank: 1, name: 'boAt Airdopes 141 Bluetooth TWS', price: 1199, originalPrice: 4490, rating: 4.1, reviews: '5L+', link: 'https://www.flipkart.com/search?q=boAt+Airdopes+141', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'h2', rank: 2, name: 'OnePlus Nord Buds 2r', price: 1799, originalPrice: 2299, rating: 4.3, reviews: '1L+', link: 'https://www.flipkart.com/search?q=OnePlus+Nord+Buds+2r', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'h3', rank: 3, name: 'realme Buds T110', price: 1299, originalPrice: 2999, rating: 4.2, reviews: '80K+', link: 'https://www.flipkart.com/search?q=realme+Buds+T110', imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=150&h=150' },
    ],
    'Chargers': [
      { id: 'ch1', rank: 1, name: 'Apple 20W USB-C Power Adapter', price: 1599, originalPrice: 1900, rating: 4.6, reviews: '1.2L+', link: 'https://www.flipkart.com/search?q=Apple+20W+USB-C+Power+Adapter', imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'ch2', rank: 2, name: 'Ambrane 20W Fast Charger', price: 399, originalPrice: 999, rating: 4.2, reviews: '40K+', link: 'https://www.flipkart.com/search?q=Ambrane+20W+Fast+Charger', imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'ch3', rank: 3, name: 'Samsung 25W Travel Adapter', price: 1199, originalPrice: 1699, rating: 4.5, reviews: '60K+', link: 'https://www.flipkart.com/search?q=Samsung+25W+Travel+Adapter', imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=150&h=150' },
    ],
    'Speakers': [
      { id: 'sp1', rank: 1, name: 'boAt Stone 352 Bluetooth Speaker', price: 1499, originalPrice: 3490, rating: 4.3, reviews: '2L+', link: 'https://www.flipkart.com/search?q=boAt+Stone+352', imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'sp2', rank: 2, name: 'JBL Go 3 Wireless Portable Speaker', price: 2999, originalPrice: 3999, rating: 4.6, reviews: '50K+', link: 'https://www.flipkart.com/search?q=JBL+Go+3', imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'sp3', rank: 3, name: 'Mivi Play Bluetooth Speaker', price: 799, originalPrice: 1999, rating: 4.1, reviews: '80K+', link: 'https://www.flipkart.com/search?q=Mivi+Play', imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=150&h=150' },
    ],
    'Soundbars': [
      { id: 'sb1', rank: 1, name: 'boAt Aavante Bar 1500 2.1 Ch', price: 4999, originalPrice: 13990, rating: 4.4, reviews: '90K+', link: 'https://www.flipkart.com/search?q=boAt+Aavante+Bar', imageUrl: 'https://images.unsplash.com/photo-1543682704-15adeb008ac4?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'sb2', rank: 2, name: 'JBL Cinema SB241', price: 7499, originalPrice: 14999, rating: 4.3, reviews: '20K+', link: 'https://www.flipkart.com/search?q=JBL+Cinema+SB241', imageUrl: 'https://images.unsplash.com/photo-1543682704-15adeb008ac4?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'sb3', rank: 3, name: 'Zebronics Juke Bar 3900', price: 3999, originalPrice: 11999, rating: 4.1, reviews: '30K+', link: 'https://www.flipkart.com/search?q=Zebronics+Juke+Bar', imageUrl: 'https://images.unsplash.com/photo-1543682704-15adeb008ac4?auto=format&fit=crop&q=80&w=150&h=150' },
    ],
    'SD Cards': [
      { id: 'sd1', rank: 1, name: 'SanDisk Ultra 64 GB MicroSDXC', price: 449, originalPrice: 1000, rating: 4.5, reviews: '3L+', link: 'https://www.flipkart.com/search?q=SanDisk+Ultra+64+GB', imageUrl: 'https://images.unsplash.com/photo-1624514134746-8809c91b1eb7?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'sd2', rank: 2, name: 'Samsung EVO Plus 128 GB MicroSD', price: 899, originalPrice: 1899, rating: 4.6, reviews: '1.5L+', link: 'https://www.flipkart.com/search?q=Samsung+EVO+Plus+128GB', imageUrl: 'https://images.unsplash.com/photo-1624514134746-8809c91b1eb7?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'sd3', rank: 3, name: 'HP 64 GB MicroSDXC', price: 399, originalPrice: 900, rating: 4.2, reviews: '50K+', link: 'https://www.flipkart.com/search?q=HP+64+GB+MicroSDXC', imageUrl: 'https://images.unsplash.com/photo-1624514134746-8809c91b1eb7?auto=format&fit=crop&q=80&w=150&h=150' },
    ]
  };

  const data = mockDatabase[category] || mockDatabase['Cables'];
  
  // Pad the rest of the list if < 10 for MVP
  const paddedData = [...data];
  while (paddedData.length < 10) {
    const nextRank = paddedData.length + 1;
    paddedData.push({
      id: `${category.toLowerCase().substring(0, 2)}${nextRank}`,
      rank: nextRank,
      name: `Generic ${category} ${nextRank}`,
      price: 199,
      originalPrice: 399,
      rating: 4.0,
      reviews: '1K+',
      link: `https://www.flipkart.com/search?q=${category}`,
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=150&h=150'
    });
  }

  return NextResponse.json({ bestsellers: paddedData });
}
