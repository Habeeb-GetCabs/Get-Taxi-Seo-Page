import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Master catalog of all tour packages, blog articles, and brand graphics
const ASSETS_TO_GENERATE = [
  // Brand
  {
    dest: 'public/images/brand/og-banner.webp',
    width: 1200,
    height: 630,
    badge: 'GET TAXI KOVAI • 24/7 TAXI SERVICE',
    title: 'Coimbatore Trusted Outstation & Drop Taxi',
    subtitle: 'Flat ₹14/km One-Way & ₹13/km Round Trips • Zero Surge Pricing',
    bgGradient: ['#0a1124', '#0f172a', '#1e293b'],
    accentColor: '#f59e0b',
    icon: '🚕'
  },
  {
    dest: 'public/images/brand/logo.webp',
    width: 512,
    height: 512,
    badge: 'GET TAXI KOVAI',
    title: 'GET TAXI',
    subtitle: 'KOVAI • 9043743777',
    bgGradient: ['#0f172a', '#1e293b'],
    accentColor: '#f59e0b',
    icon: '🚖'
  },

  // 5 Fleet Vehicles
  {
    dest: 'public/images/vehicles/hatchback.webp',
    width: 800,
    height: 600,
    badge: '4 SEATER • BUDGET TAXI',
    title: 'Hatchback (Wagon R / Tiago)',
    subtitle: 'AC • 4 Passengers • Flat ₹13/km Round Trip • ₹14/km One Way',
    bgGradient: ['#0f172a', '#1e293b', '#334155'],
    accentColor: '#38bdf8',
    icon: '🚗'
  },
  {
    dest: 'public/images/vehicles/sedan.webp',
    width: 800,
    height: 600,
    badge: '4 SEATER • PRIME COMFORT',
    title: 'Prime Sedan (Dzire / Etios)',
    subtitle: 'AC • Boot Space for 3 Luggage Bags • Smooth Highway Ride',
    bgGradient: ['#1e1b4b', '#312e81', '#4338ca'],
    accentColor: '#f59e0b',
    icon: '🚘'
  },
  {
    dest: 'public/images/vehicles/suv.webp',
    width: 800,
    height: 600,
    badge: '6 SEATER • FAMILY SPECIAL',
    title: 'Family SUV (Maruti Ertiga)',
    subtitle: 'Dual AC • 6 Passengers • Ideal for Outstation & Hills',
    bgGradient: ['#064e3b', '#065f46', '#047857'],
    accentColor: '#34d399',
    icon: '🚙'
  },
  {
    dest: 'public/images/vehicles/innova-crysta.webp',
    width: 800,
    height: 600,
    badge: '7 SEATER • EXECUTIVE LUXURY',
    title: 'Toyota Innova Crysta',
    subtitle: 'Captain Seats • Superior Suspension • VIP & Corporate Travel',
    bgGradient: ['#78350f', '#92400e', '#b45309'],
    accentColor: '#fbbf24',
    icon: '🚖'
  },
  {
    dest: 'public/images/vehicles/tempo-traveller.webp',
    width: 800,
    height: 600,
    badge: '12-16 SEATER • GROUP TOURS',
    title: 'Tempo Traveller (12/16 Seater)',
    subtitle: 'Pushback Seats • High Roof • Large Luggage Space • Family Tours',
    bgGradient: ['#172554', '#1e3a8a', '#1e40af'],
    accentColor: '#60a5fa',
    icon: '🚐'
  },

  // 7 Tour Packages
  {
    dest: 'public/images/tours/tour-isha-adiyogi.webp',
    width: 960,
    height: 540,
    badge: '1-DAY SPIRITUAL TOUR • ₹1,499 ONWARDS',
    title: 'Isha Yoga & Marudhamalai Tour',
    subtitle: '112ft Adiyogi Shiva • Dhyanalinga • Marudhamalai Hill Temple',
    bgGradient: ['#1e1b4b', '#312e81', '#4338ca'],
    accentColor: '#f59e0b',
    icon: '🕉️'
  },
  {
    dest: 'public/images/tours/tour-ooty-lake.webp',
    width: 960,
    height: 540,
    badge: '2-DAY HILL STATION TOUR • ₹4,499 ONWARDS',
    title: 'Ooty & Coonoor Queen of Hills',
    subtitle: 'Ooty Lake • Botanical Gardens • Doddabetta Peak • Sim’s Park',
    bgGradient: ['#064e3b', '#065f46', '#047857'],
    accentColor: '#34d399',
    icon: '⛰️'
  },
  {
    dest: 'public/images/tours/tour-kodaikanal-lake.webp',
    width: 960,
    height: 540,
    badge: '3-DAY VACATION TOUR • ₹7,999 ONWARDS',
    title: 'Kodaikanal Princess of Hills',
    subtitle: 'Kodai Lake • Coakers Walk • Pillar Rocks • Silver Cascade Falls',
    bgGradient: ['#1e293b', '#0f766e', '#115e59'],
    accentColor: '#2dd4bf',
    icon: '🌲'
  },
  {
    dest: 'public/images/tours/tour-valparai-tea.webp',
    width: 960,
    height: 540,
    badge: '2-DAY ECO SAFARI • ₹5,299 ONWARDS',
    title: 'Valparai Tea Estates & 40 Hairpins',
    subtitle: 'Aliyar Dam • 40 Hairpin Curves • Anamalai Tiger Reserve • Sholayar Dam',
    bgGradient: ['#14532d', '#166534', '#15803d'],
    accentColor: '#4ade80',
    icon: '🍃'
  },
  {
    dest: 'public/images/tours/tour-munnar-plantations.webp',
    width: 960,
    height: 540,
    badge: '3-DAY NATURE ESCAPE • ₹8,499 ONWARDS',
    title: 'Munnar Misty Hills & Tea Gardens',
    subtitle: 'Eravikulam National Park • Mattupetty Dam • Tea Museum • Echo Point',
    bgGradient: ['#042f2e', '#134e4a', '#0f766e'],
    accentColor: '#14b8a6',
    icon: '☕'
  },
  {
    dest: 'public/images/tours/tour-palani-murugan-temple.webp',
    width: 960,
    height: 540,
    badge: '1-DAY PILGRIMAGE SPECIAL • ₹2,499 ONWARDS',
    title: 'Palani Murugan Temple Tour',
    subtitle: 'Arulmigu Dhandayuthapani Swamy • Winch & Ropeway • Doorstep Pickup',
    bgGradient: ['#78350f', '#92400e', '#b45309'],
    accentColor: '#f59e0b',
    icon: '🛕'
  },
  {
    dest: 'public/images/tours/tour-thanjavur-big-temple.webp',
    width: 960,
    height: 540,
    badge: '1-DAY HERITAGE TOUR • ₹4,899 ONWARDS',
    title: 'Thanjavur Brihadeeswarar Big Temple',
    subtitle: '1,000-Year UNESCO Living Chola Temple • Grand Vimana Tower',
    bgGradient: ['#701a75', '#86198f', '#a21caf'],
    accentColor: '#f472b6',
    icon: '🏛️'
  },

  // 26 Blog Visuals
  {
    dest: 'public/images/blog/coimbatore-history-perur-temple.webp',
    width: 960,
    height: 540,
    badge: 'COIMBATORE HERITAGE',
    title: 'History of Coimbatore & Kongu Nadu',
    subtitle: 'From Ancient Kovan Era to the Textile & Industrial Capital of Tamil Nadu',
    bgGradient: ['#0f172a', '#1e293b', '#334155'],
    accentColor: '#f59e0b',
    icon: '📜'
  },
  {
    dest: 'public/images/blog/ooty-history-stone-house.webp',
    width: 960,
    height: 540,
    badge: 'NILGIRIS HISTORY',
    title: 'History of Ooty & John Sullivan',
    subtitle: 'How Coimbatore’s British Collector Explored the Blue Mountains in 1819',
    bgGradient: ['#064e3b', '#065f46', '#047857'],
    accentColor: '#34d399',
    icon: '🏡'
  },
  {
    dest: 'public/images/blog/isha-yoga-adiyogi-shiva.webp',
    width: 960,
    height: 540,
    badge: 'TRAVEL GUIDE',
    title: 'Isha Yoga & 112ft Adiyogi Shiva Cab Guide',
    subtitle: 'Distance, Routes, Light Show Timings, and Taxi Fares from Coimbatore',
    bgGradient: ['#1e1b4b', '#312e81', '#3730a3'],
    accentColor: '#fbbf24',
    icon: '🕉️'
  },
  {
    dest: 'public/images/blog/valparai-tea-estate-hairpins.webp',
    width: 960,
    height: 540,
    badge: 'ROAD TRIP GUIDE',
    title: 'Valparai 40 Hairpin Bends Taxi Road Trip',
    subtitle: 'Driving Through Aliyar Dam, Lion-Tailed Macaques & Misty Tea Estates',
    bgGradient: ['#14532d', '#166534', '#15803d'],
    accentColor: '#86efac',
    icon: '🚗'
  },
  {
    dest: 'public/images/blog/one-way-drop-taxi-savings.webp',
    width: 960,
    height: 540,
    badge: 'MONEY SAVING GUIDE',
    title: 'One-Way Drop Taxi vs Round Trip Billing',
    subtitle: 'Save up to 40% with Flat ₹14/km One-Way Drops and Zero Return Charges',
    bgGradient: ['#0c4a6e', '#0369a1', '#0284c7'],
    accentColor: '#38bdf8',
    icon: '💰'
  },
  {
    dest: 'public/images/blog/coimbatore-airport-cjb-terminal.webp',
    width: 960,
    height: 540,
    badge: 'AIRPORT TRANSFER',
    title: 'Coimbatore Airport (CJB) Cab Transfer Guide',
    subtitle: '24/7 Doorstep Pickup, On-Time Flight Catching, and Zero Surge Fares',
    bgGradient: ['#1e293b', '#334155', '#475569'],
    accentColor: '#f59e0b',
    icon: '✈️'
  },
  {
    dest: 'public/images/blog/kodaikanal-lake-pine-forest.webp',
    width: 960,
    height: 540,
    badge: 'SIGHTSEEING ITINERARY',
    title: 'Kodaikanal 3-Day Cab Tour & Sightseeing',
    subtitle: 'Complete Itinerary: Pillar Rocks, Pine Forests, and Kodai Boating',
    bgGradient: ['#0f766e', '#115e59', '#134e4a'],
    accentColor: '#2dd4bf',
    icon: '🚣'
  },
  {
    dest: 'public/images/blog/palani-murugan-temple-hill.webp',
    width: 960,
    height: 540,
    badge: 'PILGRIMAGE TAXI',
    title: 'Palani Murugan Temple Tour from Coimbatore',
    subtitle: 'Darshan Guide, Ropeway Timings, Route Information & Cab Packages',
    bgGradient: ['#78350f', '#92400e', '#b45309'],
    accentColor: '#fde047',
    icon: '🛕'
  },
  {
    dest: 'public/images/blog/topslip-anamalai-tiger-reserve.webp',
    width: 960,
    height: 540,
    badge: 'WILDLIFE SAFARI',
    title: 'Topslip & Anamalai Tiger Reserve Eco-Safari',
    subtitle: 'Elephant Camp, Jungle Safari, Pollachi Route & Best Cab Options',
    bgGradient: ['#1c1917', '#292524', '#44403c'],
    accentColor: '#a8a29e',
    icon: '🐘'
  },
  {
    dest: 'public/images/blog/coimbatore-junction-railway-station.webp',
    width: 960,
    height: 540,
    badge: 'LOCAL TAXI RENTALS',
    title: 'Coimbatore City Local Hourly Taxi Packages',
    subtitle: 'Flexible 4-Hour / 8-Hour Cabs for Shopping, Business & Hospital Visits',
    bgGradient: ['#1e293b', '#0f172a', '#020617'],
    accentColor: '#f59e0b',
    icon: '🚉'
  },
  {
    dest: 'public/images/blog/tiruppur-texvalley-garment-hub.webp',
    width: 960,
    height: 540,
    badge: 'BUSINESS CORRIDOR',
    title: 'Coimbatore to Tiruppur Texvalley Taxi Transfers',
    subtitle: 'Reliable Cab Connections to India’s Knitwear Capital and Industrial Parks',
    bgGradient: ['#312e81', '#3730a3', '#4338ca'],
    accentColor: '#818cf8',
    icon: '🏭'
  },
  {
    dest: 'public/images/blog/nilgiri-mountain-railway-toy-train.webp',
    width: 960,
    height: 540,
    badge: 'UNESCO HERITAGE',
    title: 'Mettupalayam Nilgiri Toy Train Taxi Transfer',
    subtitle: 'Early Morning Catch-Up Cabs for the World Famous Nilgiri Heritage Train',
    bgGradient: ['#065f46', '#047857', '#059669'],
    accentColor: '#6ee7b7',
    icon: '🚂'
  },
  {
    dest: 'public/images/blog/erode-salem-highway-transit.webp',
    width: 960,
    height: 540,
    badge: 'HIGHWAY TAXI',
    title: 'Coimbatore to Erode & Salem Highway Cab Rates',
    subtitle: 'Smooth NH544 Expressway Drops with Verified Chauffeurs & Flat Fares',
    bgGradient: ['#1e293b', '#334155', '#1e293b'],
    accentColor: '#f59e0b',
    icon: '🛣️'
  },
  {
    dest: 'public/images/blog/siruvani-waterfalls-kovai-kutralam.webp',
    width: 960,
    height: 540,
    badge: 'NATURE DAY TRIP',
    title: 'Siruvani Waterfalls & Kovai Kutralam Eco Day Trip',
    subtitle: 'Taste the World’s 2nd Sweetest Water in the Foothills of Western Ghats',
    bgGradient: ['#0369a1', '#0284c7', '#0ea5e9'],
    accentColor: '#7dd3fc',
    icon: '🌊'
  },
  {
    dest: 'public/images/blog/munnar-tea-plantations-kerala.webp',
    width: 960,
    height: 540,
    badge: 'KERALA HILL ESCAPE',
    title: 'Coimbatore to Munnar 4-Day Taxi Package Guide',
    subtitle: 'Scenic Drive via Udumalpet, Marayoor Sandalwood Forests & Tea Gardens',
    bgGradient: ['#064e3b', '#065f46', '#047857'],
    accentColor: '#34d399',
    icon: '🏞️'
  },
  {
    dest: 'public/images/blog/tidel-park-saravanampatti-it-corridor.webp',
    width: 960,
    height: 540,
    badge: 'CORPORATE CABS',
    title: 'Peelamedu & Saravanampatti IT Corridor Daily Cabs',
    subtitle: 'Punctual Corporate Taxi Rides for Techies at TIDEL Park & CHIL-SEZ',
    bgGradient: ['#1e1b4b', '#312e81', '#1e293b'],
    accentColor: '#38bdf8',
    icon: '💻'
  },
  {
    dest: 'public/images/blog/late-night-24-7-taxi-coimbatore.webp',
    width: 960,
    height: 540,
    badge: '24/7 ROUND THE CLOCK',
    title: 'Late Night & Midnight Taxi in Coimbatore',
    subtitle: 'Safe, Verified, GPS-Tracked Midnight Pickups with Zero Surge Pricing',
    bgGradient: ['#090d16', '#0f172a', '#1e293b'],
    accentColor: '#f59e0b',
    icon: '🌙'
  },
  {
    dest: 'public/images/blog/perur-pateeswarar-temple-kovai.webp',
    width: 960,
    height: 540,
    badge: 'ANCIENT TEMPLES',
    title: 'Perur Pateeswarar & Marudhamalai Heritage Tour',
    subtitle: 'Explore 1,500-Year-Old Chola Architecture & Sacred Hill Shrines in Kovai',
    bgGradient: ['#78350f', '#92400e', '#b45309'],
    accentColor: '#fbbf24',
    icon: '🛕'
  },
  {
    dest: 'public/images/blog/coimbatore-to-bangalore-highway.webp',
    width: 960,
    height: 540,
    badge: 'INTERSTATE DROP',
    title: 'Coimbatore to Bangalore One-Way Drop Taxi',
    subtitle: '360 km Highway Route via Salem & Hosur • Flat Fare with No Return Charge',
    bgGradient: ['#1e293b', '#0f172a', '#334155'],
    accentColor: '#38bdf8',
    icon: '🏙️'
  },
  {
    dest: 'public/images/blog/madurai-meenakshi-amman-temple.webp',
    width: 960,
    height: 540,
    badge: 'TEMPLE CITY TOUR',
    title: 'Coimbatore to Madurai Meenakshi Amman Temple Tour',
    subtitle: 'Fast Highway Cab via Karur and Dindigul for Temple Darshan & Sightseeing',
    bgGradient: ['#831843', '#9d174d', '#be185d'],
    accentColor: '#f472b6',
    icon: '🌸'
  },
  {
    dest: 'public/images/blog/eachanari-vinayagar-temple.webp',
    width: 960,
    height: 540,
    badge: 'SUBURBAN CONNECTIVITY',
    title: 'Eachanari, Kovaipudur & Podanur Taxi Services',
    subtitle: 'Fast Doorstep Dispatch for Coimbatore’s Southern Residential Suburbs',
    bgGradient: ['#0f172a', '#1e293b', '#334155'],
    accentColor: '#f59e0b',
    icon: '🏘️'
  },
  {
    dest: 'public/images/blog/chennai-central-highway-drop.webp',
    width: 960,
    height: 540,
    badge: 'LONG DISTANCE ONE-WAY',
    title: 'Coimbatore to Chennai Highway Drop Taxi Breakdown',
    subtitle: '500 km Route Analysis, Toll Estimates, Vehicle Rates & Savings Calculation',
    bgGradient: ['#172554', '#1e3a8a', '#1e40af'],
    accentColor: '#60a5fa',
    icon: '🏢'
  },
  {
    dest: 'public/images/blog/sims-park-coonoor-botanical-garden.webp',
    width: 960,
    height: 540,
    badge: 'NILGIRIS GEM',
    title: 'Coonoor Hill Station & Sim’s Park Sightseeing',
    subtitle: 'Lamb’s Rock, Dolphin’s Nose & Tea Factory Tours from Coimbatore',
    bgGradient: ['#064e3b', '#065f46', '#047857'],
    accentColor: '#6ee7b7',
    icon: '🌸'
  },
  {
    dest: 'public/images/blog/wedding-luxury-car-rentals-coimbatore.webp',
    width: 960,
    height: 540,
    badge: 'LUXURY & EVENTS',
    title: 'Wedding & Event Luxury Car Rentals Coimbatore',
    subtitle: 'Innova Crysta, Premium Sedans & Tempo Travellers for Marriages & VIP Events',
    bgGradient: ['#581c87', '#6b21a8', '#7e22ce'],
    accentColor: '#d8b4fe',
    icon: '💍'
  },
  {
    dest: 'public/images/blog/why-get-taxi-kovai-top-rated.webp',
    width: 960,
    height: 540,
    badge: 'WHY CHOOSE US',
    title: 'Why Get Taxi Kovai is a Top-Rated Call Taxi in Coimbatore',
    subtitle: 'Transparent Rates, 100% On-Time Record, Clean Cars & 50,000+ Happy Riders',
    bgGradient: ['#0f172a', '#1e293b', '#0a1124'],
    accentColor: '#f59e0b',
    icon: '⭐'
  },
  {
    dest: 'public/images/blog/thanjavur-brihadeeswarar-big-temple.webp',
    width: 960,
    height: 540,
    badge: 'CHOLA ARCHITECTURE',
    title: 'Thanjavur Big Temple Taxi Tour Guide from Kovai',
    subtitle: 'UNESCO Heritage Trip: History, Routes, Best Travel Times & One-Day Cab Rates',
    bgGradient: ['#701a75', '#86198f', '#a21caf'],
    accentColor: '#f472b6',
    icon: '🛕'
  }
];

// Generates an elegant, high-contrast, modern graphic with crisp typography & SVG vector accents
function createSvgGraphic(item) {
  const w = item.width;
  const h = item.height;
  const grad1 = item.bgGradient[0];
  const grad2 = item.bgGradient[1] || item.bgGradient[0];
  const grad3 = item.bgGradient[2] || grad2;
  const accent = item.accentColor;

  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${grad1}" />
        <stop offset="50%" stop-color="${grad2}" />
        <stop offset="100%" stop-color="${grad3}" />
      </linearGradient>
      <linearGradient id="glass" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.03" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="0.5" stroke-opacity="0.07" />
      </pattern>
      <radialGradient id="glow" cx="85%" cy="20%" r="40%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Background Base -->
    <rect width="${w}" height="${h}" fill="url(#bgGrad)" />
    <rect width="${w}" height="${h}" fill="url(#grid)" />
    <rect width="${w}" height="${h}" fill="url(#glow)" />

    <!-- Decorative Modern Geometric Elements -->
    <circle cx="${w - 120}" cy="120" r="180" fill="none" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.2" stroke-dasharray="8 8" />
    <circle cx="${w - 120}" cy="120" r="120" fill="none" stroke="${accent}" stroke-width="1" stroke-opacity="0.3" />

    <!-- Glass Card Container -->
    <rect x="40" y="40" width="${w - 80}" height="${h - 80}" rx="20" fill="url(#glass)" stroke="#ffffff" stroke-width="1" stroke-opacity="0.18" />

    <!-- Brand Header -->
    <g transform="translate(75, 85)">
      <!-- Badge Pill -->
      <rect x="0" y="0" width="${Math.min(360, item.badge.length * 10 + 28)}" height="32" rx="16" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="1" />
      <text x="14" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="${accent}" letter-spacing="1.5">${escapeXml(item.badge)}</text>
    </g>

    <!-- Floating Visual Icon -->
    <g transform="translate(${w - 180}, 90)">
      <circle cx="50" cy="50" r="46" fill="#0f172a" fill-opacity="0.6" stroke="${accent}" stroke-width="2" stroke-opacity="0.5" />
      <text x="50" y="62" font-size="44" text-anchor="middle">${item.icon || '🚖'}</text>
    </g>

    <!-- Main Title & Content -->
    <g transform="translate(75, 170)">
      <!-- Title -->
      <text x="0" y="45" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${w > 600 ? '36' : '26'}" font-weight="800" fill="#ffffff" letter-spacing="-0.5">
        ${escapeXml(item.title)}
      </text>

      <!-- Accent Divider Line -->
      <line x1="0" y1="75" x2="100" y2="75" stroke="${accent}" stroke-width="4" stroke-linecap="round" />

      <!-- Subtitle -->
      <text x="0" y="125" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${w > 600 ? '19' : '15'}" font-weight="500" fill="#cbd5e1">
        ${escapeXml(item.subtitle)}
      </text>
    </g>

    <!-- Footer Security & Trust Badge -->
    <g transform="translate(75, ${h - 75})">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#94a3b8">
        GET TAXI KOVAI • 24/7 BOOKING: <tspan fill="${accent}" font-weight="700">+91 90437 43777</tspan> • gettaxikovai.com
      </text>
    </g>
  </svg>
  `;
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

async function buildAllVectorAssets() {
  console.log(`Starting generation of ${ASSETS_TO_GENERATE.length} crisp WebP assets...`);
  
  for (const item of ASSETS_TO_GENERATE) {
    try {
      const destPath = path.resolve(process.cwd(), item.dest);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });

      const svgBuffer = Buffer.from(createSvgGraphic(item));
      await sharp(svgBuffer)
        .webp({ quality: 90, effort: 6 })
        .toFile(destPath);

      const stats = fs.statSync(destPath);
      console.log(`✓ Generated: ${item.dest} (${(stats.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`✗ Error generating ${item.dest}:`, err);
    }
  }
  console.log('🎉 All high-speed, crisp WebP images created successfully!');
}

buildAllVectorAssets();
