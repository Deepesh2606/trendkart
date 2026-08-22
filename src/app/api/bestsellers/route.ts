import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'Cables';

  // Comprehensive Mock Database for Jalandhar Mobile Accessories Shop
  const mockDatabase: Record<string, any[]> = {
    'Cables': [
      { id: 'c1', rank: 1, name: 'boAt Type C A325', price: 299, originalPrice: 899, rating: 4.4, reviews: '1L+', link: 'https://www.flipkart.com/search?q=boAt+Type+C+A325' },
      { id: 'c2', rank: 2, name: 'Ambrane 60W Type C to Type C', price: 199, originalPrice: 499, rating: 4.2, reviews: '50K+', link: 'https://www.flipkart.com/search?q=Ambrane+60W+Type+C+to+Type+C' },
      { id: 'c3', rank: 3, name: 'Portronics Konnect L', price: 149, originalPrice: 399, rating: 4.1, reviews: '35K+', link: 'https://www.flipkart.com/search?q=Portronics+Konnect+L' },
      { id: 'c4', rank: 4, name: 'Mi 2-in-1 USB Cable (Micro USB to Type C)', price: 249, originalPrice: 399, rating: 4.3, reviews: '80K+', link: 'https://www.flipkart.com/search?q=Mi+2-in-1+USB+Cable' },
      { id: 'c5', rank: 5, name: 'OnePlus Warp Charge Type-C Cable', price: 849, originalPrice: 1099, rating: 4.6, reviews: '20K+', link: 'https://www.flipkart.com/search?q=OnePlus+Warp+Charge+Type-C+Cable' },
      { id: 'c6', rank: 6, name: 'Realme 65W SuperDart Cable', price: 499, originalPrice: 799, rating: 4.5, reviews: '15K+', link: 'https://www.flipkart.com/search?q=Realme+65W+SuperDart+Cable' },
    ],
    'Covers': [
      { id: 'co1', rank: 1, name: 'Spigen Ultra Hybrid iPhone 15', price: 1299, originalPrice: 2499, rating: 4.7, reviews: '10K+', link: 'https://www.flipkart.com/search?q=Spigen+Ultra+Hybrid+iPhone+15' },
      { id: 'co2', rank: 2, name: 'Ringke Fusion-X Samsung S24', price: 1099, originalPrice: 1999, rating: 4.5, reviews: '5K+', link: 'https://www.flipkart.com/search?q=Ringke+Fusion-X+Samsung+S24' },
      { id: 'co3', rank: 3, name: 'Kapa MagSafe Clear Case', price: 599, originalPrice: 1299, rating: 4.3, reviews: '15K+', link: 'https://www.flipkart.com/search?q=Kapa+MagSafe+Clear+Case' },
      { id: 'co4', rank: 4, name: 'TheGiftKart Silicone Case iPhone 13', price: 299, originalPrice: 999, rating: 4.1, reviews: '40K+', link: 'https://www.flipkart.com/search?q=TheGiftKart+Silicone+Case+iPhone+13' },
      { id: 'co5', rank: 5, name: 'Pikkme Back Cover for Redmi 12 5G', price: 199, originalPrice: 599, rating: 4.0, reviews: '25K+', link: 'https://www.flipkart.com/search?q=Pikkme+Back+Cover+for+Redmi+12+5G' },
      { id: 'co6', rank: 6, name: 'Amozo Autofocus Cover Poco X5', price: 249, originalPrice: 699, rating: 4.2, reviews: '12K+', link: 'https://www.flipkart.com/search?q=Amozo+Autofocus+Cover+Poco+X5' },
    ],
    'Headsets': [
      { id: 'h1', rank: 1, name: 'boAt Airdopes 141 Bluetooth TWS', price: 1299, originalPrice: 4490, rating: 4.2, reviews: '3L+', link: 'https://www.flipkart.com/search?q=boAt+Airdopes+141' },
      { id: 'h2', rank: 2, name: 'OnePlus Nord Buds 2r', price: 2199, originalPrice: 2299, rating: 4.4, reviews: '90K+', link: 'https://www.flipkart.com/search?q=OnePlus+Nord+Buds+2r' },
      { id: 'h3', rank: 3, name: 'realme TechLife Buds T100', price: 1499, originalPrice: 2999, rating: 4.3, reviews: '1.5L+', link: 'https://www.flipkart.com/search?q=realme+TechLife+Buds+T100' },
      { id: 'h4', rank: 4, name: 'Sony WH-1000XM4 Wireless', price: 22990, originalPrice: 29990, rating: 4.8, reviews: '20K+', link: 'https://www.flipkart.com/search?q=Sony+WH-1000XM4' },
      { id: 'h5', rank: 5, name: 'JBL Tune 510BT Wireless', price: 2999, originalPrice: 4499, rating: 4.3, reviews: '45K+', link: 'https://www.flipkart.com/search?q=JBL+Tune+510BT' },
      { id: 'h6', rank: 6, name: 'Apple AirPods Pro (2nd Gen)', price: 24900, originalPrice: 26900, rating: 4.7, reviews: '30K+', link: 'https://www.flipkart.com/search?q=Apple+AirPods+Pro' },
    ],
    'Chargers': [
      { id: 'ch1', rank: 1, name: 'Apple 20W USB-C Power Adapter', price: 1599, originalPrice: 1900, rating: 4.6, reviews: '1.2L+', link: 'https://www.flipkart.com/search?q=Apple+20W+USB-C+Power+Adapter' },
      { id: 'ch2', rank: 2, name: 'Ambrane 20W Fast Charger', price: 399, originalPrice: 999, rating: 4.2, reviews: '40K+', link: 'https://www.flipkart.com/search?q=Ambrane+20W+Fast+Charger' },
      { id: 'ch3', rank: 3, name: 'Samsung 25W Travel Adapter', price: 1199, originalPrice: 1699, rating: 4.5, reviews: '60K+', link: 'https://www.flipkart.com/search?q=Samsung+25W+Travel+Adapter' },
      { id: 'ch4', rank: 4, name: 'Portronics Adapto 20 Type C', price: 349, originalPrice: 799, rating: 4.1, reviews: '25K+', link: 'https://www.flipkart.com/search?q=Portronics+Adapto+20' },
      { id: 'ch5', rank: 5, name: 'Spigen 30W Super Fast Charger', price: 999, originalPrice: 1999, rating: 4.4, reviews: '10K+', link: 'https://www.flipkart.com/search?q=Spigen+30W+Super+Fast+Charger' },
      { id: 'ch6', rank: 6, name: 'boAt WCD 2.1A Dual Port Adapter', price: 299, originalPrice: 699, rating: 4.0, reviews: '80K+', link: 'https://www.flipkart.com/search?q=boAt+WCD+2.1A+Adapter' },
    ],
    'Speakers': [
      { id: 'sp1', rank: 1, name: 'boAt Stone 352 Bluetooth Speaker', price: 1499, originalPrice: 3490, rating: 4.3, reviews: '2L+', link: 'https://www.flipkart.com/search?q=boAt+Stone+352' },
      { id: 'sp2', rank: 2, name: 'JBL Go 3 Wireless Portable Speaker', price: 2999, originalPrice: 3999, rating: 4.6, reviews: '50K+', link: 'https://www.flipkart.com/search?q=JBL+Go+3' },
      { id: 'sp3', rank: 3, name: 'Mivi Play Bluetooth Speaker', price: 799, originalPrice: 1999, rating: 4.1, reviews: '80K+', link: 'https://www.flipkart.com/search?q=Mivi+Play' },
      { id: 'sp4', rank: 4, name: 'Zebronics ZEB-COUNTY Wireless', price: 549, originalPrice: 999, rating: 4.0, reviews: '1.2L+', link: 'https://www.flipkart.com/search?q=Zebronics+ZEB-COUNTY' },
      { id: 'sp5', rank: 5, name: 'Sony SRS-XB13 Portable Bluetooth', price: 3490, originalPrice: 4990, rating: 4.5, reviews: '15K+', link: 'https://www.flipkart.com/search?q=Sony+SRS-XB13' },
      { id: 'sp6', rank: 6, name: 'Tribit Upgraded MaxSound Plus', price: 4999, originalPrice: 6999, rating: 4.4, reviews: '8K+', link: 'https://www.flipkart.com/search?q=Tribit+MaxSound+Plus' },
    ],
    'Soundbars': [
      { id: 'sb1', rank: 1, name: 'boAt Aavante Bar 1500 2.1 Ch', price: 4999, originalPrice: 13990, rating: 4.4, reviews: '90K+', link: 'https://www.flipkart.com/search?q=boAt+Aavante+Bar' },
      { id: 'sb2', rank: 2, name: 'JBL Cinema SB241', price: 7499, originalPrice: 14999, rating: 4.3, reviews: '20K+', link: 'https://www.flipkart.com/search?q=JBL+Cinema+SB241' },
      { id: 'sb3', rank: 3, name: 'Zebronics Juke Bar 3900', price: 3999, originalPrice: 11999, rating: 4.1, reviews: '30K+', link: 'https://www.flipkart.com/search?q=Zebronics+Juke+Bar' },
      { id: 'sb4', rank: 4, name: 'Sony HT-S20R Real 5.1ch', price: 17990, originalPrice: 19990, rating: 4.6, reviews: '15K+', link: 'https://www.flipkart.com/search?q=Sony+HT-S20R' },
      { id: 'sb5', rank: 5, name: 'Blaupunkt SBA20 Bluetooth', price: 1299, originalPrice: 2999, rating: 4.0, reviews: '12K+', link: 'https://www.flipkart.com/search?q=Blaupunkt+SBA20' },
      { id: 'sb6', rank: 6, name: 'Samsung HW-B450/XL 2.1 ch', price: 9999, originalPrice: 16990, rating: 4.5, reviews: '8K+', link: 'https://www.flipkart.com/search?q=Samsung+HW-B450' },
    ],
    'SD Cards': [
      { id: 'sd1', rank: 1, name: 'SanDisk Ultra 64 GB MicroSDXC', price: 449, originalPrice: 1000, rating: 4.5, reviews: '3L+', link: 'https://www.flipkart.com/search?q=SanDisk+Ultra+64+GB' },
      { id: 'sd2', rank: 2, name: 'Samsung EVO Plus 128 GB MicroSD', price: 899, originalPrice: 1899, rating: 4.6, reviews: '1.5L+', link: 'https://www.flipkart.com/search?q=Samsung+EVO+Plus+128GB' },
      { id: 'sd3', rank: 3, name: 'HP 64 GB MicroSDXC', price: 399, originalPrice: 900, rating: 4.2, reviews: '50K+', link: 'https://www.flipkart.com/search?q=HP+64+GB+MicroSDXC' },
      { id: 'sd4', rank: 4, name: 'Strontium Nitro 32 GB MicroSDHC', price: 299, originalPrice: 599, rating: 4.1, reviews: '2L+', link: 'https://www.flipkart.com/search?q=Strontium+Nitro+32+GB' },
      { id: 'sd5', rank: 5, name: 'Kingston Canvas Select 128 GB', price: 849, originalPrice: 1599, rating: 4.3, reviews: '30K+', link: 'https://www.flipkart.com/search?q=Kingston+Canvas+Select+128GB' },
      { id: 'sd6', rank: 6, name: 'SanDisk Extreme 128 GB MicroSD', price: 1499, originalPrice: 3200, rating: 4.7, reviews: '40K+', link: 'https://www.flipkart.com/search?q=SanDisk+Extreme+128GB' },
    ]
  };

  const results = category === 'all' ? mockDatabase : (mockDatabase[category] || []);

  return NextResponse.json(
    { bestsellers: results },
    { headers: { 'Cache-Control': 's-maxage=14400, stale-while-revalidate' } }
  );
}
