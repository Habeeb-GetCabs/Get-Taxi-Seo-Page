export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  content: string[];
  image: string;
  fallbackImage?: string;
  author: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Complete History of Coimbatore: From Kongu Nadu to the Detroit of the South',
    slug: 'history-of-coimbatore-kongu-nadu-to-industrial-hub',
    category: 'Local History & Heritage',
    readTime: '6 min read',
    date: 'August 24, 2026',
    author: 'Get Taxi Kovai Travel Desk',
    image: '/images/blog/coimbatore-history-perur-temple.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Perur_Pateeswarar_Temple.jpg/800px-Perur_Pateeswarar_Temple.jpg',
    tags: ['Coimbatore History', 'Kongu Nadu', 'Tipu Sultan', 'Manchester of South India', 'Detroit of the South'],
    excerpt: 'Trace the fascinating historical journey of Coimbatore—from its ancient roots in Kongu Nadu under tribal chief Kovan, through Tipu Sultan’s reign, British annexation in 1799, to becoming the textile and pump capital of South India.',
    content: [
      'Coimbatore, affectionately known as Kovai, possesses a rich historical legacy that spans over two millennia. Originally settled as part of the semi-arid region known as Kongu Nadu, the area was governed by various tribal chieftains. According to local lore, the city takes its name from the Irula tribal chief "Kovan", from whom "Kovanputhur" (New city of Kovan) evolved into Coimbatore.',
      'During the 2nd century CE, Kovai was ruled by the Cholas, Cheras, and later the Pandyas, serving as an important inland trade route between the western Malabar coast and Tamilakam. The region later fell under the sovereignty of the Vijayanagara Empire and the Nayaks of Madurai, who fortified the region against rival kingdoms.',
      'In the 18th century, Coimbatore gained strategic military importance under the Mysore Kingdom. Hyder Ali and his legendary son, Tipu Sultan, captured and reinforced the Coimbatore Fort, utilizing the town as a vital defensive bastion during the Anglo-Mysore Wars.',
      'Following Tipu Sultan’s defeat in the Fourth Anglo-Mysore War, the British East India Company officially annexed Coimbatore in 1799. Under British rule, led by visionary Collectors such as John Sullivan, the region witnessed rapid agricultural and infrastructural modernization.',
      'The turning point in Coimbatore’s modern history occurred with the introduction of electricity from the Pykara hydroelectric project in the 1930s. Coupled with the fertile black soil ideal for cotton cultivation, textiling exploded—earning the city the title "Manchester of South India".',
      'Today, Get Taxi Kovai is proud to serve this bustling industrial hub. Known as the "Detroit of the South" for its booming automotive component manufacturing, wet-grinder factories, and pump manufacturing industries, Coimbatore seamlessly blends ancient Kongu heritage with modern technological innovation.'
    ]
  },
  {
    id: 'blog-2',
    title: 'The History of Ooty & John Sullivan: How a Collector Discovered the Queen of Hill Stations',
    slug: 'history-of-ooty-john-sullivan-nilgiris',
    category: 'Nilgiri Heritage',
    readTime: '5 min read',
    date: 'August 22, 2026',
    author: 'Get Taxi Kovai Mountain Desk',
    image: '/images/blog/ooty-history-stone-house.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Stone_House%2C_Ooty.jpg/800px-Stone_House%2C_Ooty.jpg',
    tags: ['Ooty History', 'John Sullivan', 'Stone House', 'Coimbatore Collector', 'Nilgiris Cab'],
    excerpt: 'Discover how John Sullivan, the British Collector of Coimbatore, explored the misty Nilgiri hills in 1819, constructed the famous Stone House, and birthed India’s most iconic hill station.',
    content: [
      'The story of Ooty (Udhagamandalam) is inextricably linked to Coimbatore. Before the 19th century, the elevated Nilgiri plateau was inhabited almost exclusively by indigenous tribes—principally the Toda, Badaga, Kota, and Kurumba communities.',
      'In January 1819, John Sullivan, then the British Collector of Coimbatore, embarked on a daring expedition into the uncharted Nilgiri mountains, driven by reports of a temperate climate reminiscent of his native England.',
      'Impressed by the lush eucalyptus forests, crisp mountain air, and rolling green meadows, Sullivan recognized the immense potential of the region as a sanatorium for soldiers suffering from tropical heat illnesses.',
      'In 1822, Sullivan purchased land from the Toda tribe and built the very first European residence in Ooty, named "Stone House" (known locally as Kal Bangala). He also commissioned the construction of a road from Mettupalayam up through the steep mountain passes, connecting Coimbatore directly to the hill kingdom.',
      'Sullivan went on to develop the iconic Ooty Lake between 1823 and 1825 by damming mountain streams, turning Ooty into the summer capital of the Madras Presidency.',
      'Today, driving from Coimbatore to Ooty via Mettupalayam and Coonoor remains one of South India’s most scenic road trips. Book Get Taxi Kovai (9043743777) for a comfortable one-way drop at ₹26/km or round-trip at ₹15/km with expert Nilgiri mountain drivers!'
    ]
  },
  {
    id: 'blog-3',
    title: 'Isha Yoga Center & 112ft Adiyogi Shiva Travel Guide: Distance, Taxi Rates & Tips',
    slug: 'isha-yoga-center-adiyogi-shiva-taxi-guide-coimbatore',
    category: 'Pilgrimage & Spiritual',
    readTime: '4 min read',
    date: 'August 20, 2026',
    author: 'Get Taxi Kovai Dispatch',
    image: '/images/blog/isha-yoga-adiyogi-shiva.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adiyogi_Shiva_statue%2C_Coimbatore.jpg/800px-Adiyogi_Shiva_statue%2C_Coimbatore.jpg',
    tags: ['Isha Yoga', 'Adiyogi Shiva', 'Coimbatore Taxi', 'Dhyanalinga', 'Get Taxi Kovai'],
    excerpt: 'Complete travel guide to visiting Isha Foundation & 112ft Adiyogi Shiva statue from Coimbatore Airport or Railway Station with Get Taxi Kovai.',
    content: [
      'Located 30 kilometers west of Coimbatore city at the foothills of the Velliangiri Mountains, the Isha Yoga Center is one of the world’s foremost spiritual and wellness destinations.',
      'The center features the awe-inspiring 112-foot Adiyogi Shiva statue, recognized by the Guinness World Records as the world’s largest bust sculpture. Visitors can also experience the consecrated Dhyanalinga, Suryakund, Nadiyakar, and Linga Bhairavi temples.',
      'How to reach Isha Yoga Center: The road trip from Coimbatore Junction Railway Station or Gandhipuram takes approximately 45–60 minutes via Thondamuthur. From Coimbatore International Airport (CJB), the distance is roughly 42 km.',
      'Get Taxi Kovai Fare Breakdown: Local cab base fare starts at ₹80 with ₹28/km, or book a hassle-free round-trip/drop package. Our drivers wait patiently during your evening Divya Darshanam laser light show at Adiyogi!',
      'Call or WhatsApp 9043743777 to reserve your clean AC Sedan or SUV for your Isha Yoga visit.'
    ]
  },
  {
    id: 'blog-4',
    title: 'Valparai Road Trip: Navigating 40 Thrilling Hairpin Bends & Tea Estate Safaris',
    slug: 'valparai-40-hairpin-bends-road-trip-taxi-guide',
    category: 'Wildlife & Nature',
    readTime: '5 min read',
    date: 'August 18, 2026',
    author: 'Get Taxi Kovai Adventure Desk',
    image: '/images/blog/valparai-tea-estate-hairpins.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Valparai_tea_estates.jpg/800px-Valparai_tea_estates.jpg',
    tags: ['Valparai', '40 Hairpin Bends', 'Aliyar Dam', 'Anamalai Tiger Reserve', 'Get Taxi Kovai'],
    excerpt: 'Plan your epic drive through Pollachi, Aliyar Dam, and the 40 hairpin bends of Valparai with Get Taxi Kovai’s experienced mountain drivers.',
    content: [
      'Nestled at an elevation of 3,500 feet in the Anamalai Hills, Valparai is a pristine hill station surrounded by sprawling emerald tea gardens and dense tropical rainforests.',
      'The highlight of the drive from Coimbatore to Valparai (105 km) is ascending the legendary 40 Hairpin Bends starting after the Aliyar Dam checkpoint. Each hairpin bend presents breathtaking panoramic views of the Aliyar reservoir below.',
      'Valparai is famous for wildlife sightings including Nilgiri Tahr, Lion-tailed Macaques, Asian Elephants, and Great Indian Hornbills.',
      'Why book Get Taxi Kovai for Valparai? Navigating 40 continuous hairpin bends requires skilled, calm driver reflexes. Get Taxi Kovai provides top-maintained SUVs (Ertiga & Innova Crysta) with seasoned hill drivers at just ₹15/km for outstation round trips (+ ₹400 driver batta).',
      'Reserve your Valparai cab today by calling 9043743777!'
    ]
  },
  {
    id: 'blog-5',
    title: 'One-Way Drop Taxi vs. Round Trip: Why You Save 50% on Outstation Travel',
    slug: 'one-way-drop-taxi-vs-round-trip-savings-coimbatore',
    category: 'Taxi Pricing Guide',
    readTime: '4 min read',
    date: 'August 15, 2026',
    author: 'Get Taxi Kovai Tariff Desk',
    image: '/images/blog/one-way-drop-taxi-savings.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    tags: ['One Way Drop Taxi', 'Coimbatore Taxi Rates', 'Save 50%', 'Get Taxi Kovai'],
    excerpt: 'Understand how one-way drop taxi billing works with Get Taxi Kovai. Learn why paying flat ₹26/km without return charges saves you thousands compared to traditional cab operators.',
    content: [
      'Traditionally, outstation taxi operators charged passengers double distance fees—forcing travelers to pay for the return journey even if they only needed a one-way drop.',
      'Get Taxi Kovai revolutionized outstation taxi booking in Coimbatore by introducing One-Way Drop Taxi services at a transparent flat rate of ₹26 per km + ₹300 driver batta.',
      'Example Savings Calculation: If you travel one-way from Coimbatore to Chennai (approx 500 km), traditional taxis charge for 1,000 km (round trip). With Get Taxi Kovai, you pay strictly for the 500 km traveled, saving up to 50% of your total travel expense!',
      'Whether heading to Bangalore, Salem, Madurai, or Trichy, Get Taxi Kovai offers zero return kilometer charges.',
      'Call or WhatsApp 9043743777 to get your instant one-way quote!'
    ]
  },
  {
    id: 'blog-6',
    title: 'Coimbatore International Airport (CJB) Cab Transfer Guide: Low Rates & 24/7 Dispatch',
    slug: 'coimbatore-airport-cjb-taxi-transfer-guide',
    category: 'Airport Transfers',
    readTime: '3 min read',
    date: 'August 12, 2026',
    author: 'Get Taxi Kovai Airport Desk',
    image: '/images/blog/coimbatore-airport-cjb-terminal.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Coimbatore_Airport_Terminal_Building.jpg/800px-Coimbatore_Airport_Terminal_Building.jpg',
    tags: ['Coimbatore Airport Cab', 'CJB Airport Taxi', 'Airport Transfer ₹100 Base', 'Get Taxi Kovai'],
    excerpt: 'Avoid airport surge pricing. Book Get Taxi Kovai for 24/7 doorstep pickup and airport drops with transparent pricing: Base ₹100 + ₹30 per km.',
    content: [
      'Coimbatore International Airport (CJB) located in Peelamedu is the primary gateway for business travelers, tourists heading to Nilgiris, and pilgrims visiting Isha Foundation.',
      'Get Taxi Kovai offers dedicated 24/7 airport taxi transfers with zero surge pricing during peak flight arrivals or late-night departures.',
      'Our Airport Rates: Base fare ₹100 + ₹30 per kilometer (airport toll charges extra as applicable).',
      'We track flight arrival times live to ensure your driver is waiting at the arrival terminal gate with a name badge, ready to assist with luggage.',
      'Book your airport cab in seconds by calling 9043743777!'
    ]
  },
  {
    id: 'blog-7',
    title: 'Kodaikanal Hill Station 3-Day Cab Sightseeing Itinerary from Coimbatore',
    slug: 'kodaikanal-3-day-cab-sightseeing-tour-itinerary',
    category: 'Tour Packages',
    readTime: '5 min read',
    date: 'August 10, 2026',
    author: 'Get Taxi Kovai Tour Desk',
    image: '/images/blog/kodaikanal-lake-pine-forest.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Kodaikanal_Lake_view.jpg/800px-Kodaikanal_Lake_view.jpg',
    tags: ['Kodaikanal Taxi', 'Princess of Hill Stations', 'Coimbatore to Kodaikanal', 'Get Taxi Kovai'],
    excerpt: 'Detailed 3-day Kodaikanal tour itinerary covering Kodai Lake, Coakers Walk, Pillar Rocks, and Berijam Lake with Get Taxi Kovai cabs.',
    content: [
      'Known as the "Princess of Hill Stations", Kodaikanal sits at 7,000 feet in the Palani Hills of Tamil Nadu, located 175 km from Coimbatore (~4.5 hours drive).',
      'Day 1: Scenic ascent via Palani or Batlagundu, check-in, evening boat ride on star-shaped Kodai Lake and walking along Coaker’s Walk.',
      'Day 2: Full-day sightseeing including Bryant Park, Pillar Rocks, Guna Caves (Devil’s Kitchen), Pine Forest, and Silver Cascade Waterfalls.',
      'Day 3: Visit Mannavanur Sheep Farm and Lake before a comfortable return drive to Coimbatore.',
      'Book Get Taxi Kovai for outstation round trip at ₹15 per km + ₹400 driver batta per day. Call 9043743777 now!'
    ]
  },
  {
    id: 'blog-8',
    title: 'Palani Murugan Temple Pilgrimage Taxi Guide: Route, Darshan & Fares from Kovai',
    slug: 'palani-murugan-temple-pilgrimage-taxi-guide-coimbatore',
    category: 'Pilgrimage & Spiritual',
    readTime: '4 min read',
    date: 'August 08, 2026',
    author: 'Get Taxi Kovai Temple Desk',
    image: '/images/blog/palani-murugan-temple-hill.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Palani_Murugan_Temple_Hill.jpg/800px-Palani_Murugan_Temple_Hill.jpg',
    tags: ['Palani Taxi', 'Murugan Temple', 'Coimbatore to Palani Cab', 'Get Taxi Kovai'],
    excerpt: 'Plan your comfortable family pilgrimage to Arulmigu Dhandayuthapani Swamy Temple in Palani from Coimbatore with Get Taxi Kovai.',
    content: [
      'Palani Murugan Temple (Arulmigu Dhandayuthapani Swamy Temple) is one of the revered Arupadai Veedu (Six Abodes of Lord Murugan), situated 108 km southeast of Coimbatore.',
      'The drive takes approximately 2.5 hours via Pollachi and Udumalpet along smooth highways.',
      'Pilgrims prefer early morning departures to attend the Winch or Rope Car ascension and avoid long darshan queues.',
      'Get Taxi Kovai provides spacious 6-seater Ertiga and Innova Crysta cabs for families, ensuring elderly passengers travel in supreme air-conditioned comfort.',
      'Call 9043743777 to book your Palani temple taxi today!'
    ]
  },
  {
    id: 'blog-9',
    title: 'Topslip & Anamalai Tiger Reserve Eco-Safari Cab Guide',
    slug: 'topslip-anamalai-tiger-reserve-eco-safari-cab-guide',
    category: 'Wildlife & Nature',
    readTime: '4 min read',
    date: 'August 05, 2026',
    author: 'Get Taxi Kovai Wildlife Desk',
    image: '/images/blog/topslip-anamalai-tiger-reserve.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Valparai_tea_estates.jpg/800px-Valparai_tea_estates.jpg',
    tags: ['Topslip', 'Anamalai Tiger Reserve', 'Pollachi Safari', 'Get Taxi Kovai'],
    excerpt: 'Explore Topslip, Parambikulam, and Sethumadai forest reserves from Coimbatore with Get Taxi Kovai’s wildlife tourist cabs.',
    content: [
      'Topslip is a picturesque forest region in the Anamalai Tiger Reserve, situated near Pollachi about 75 km from Coimbatore.',
      'Famous for elephant safaris, jungle trekking, and bird watching, Topslip offers an immersive dip into Western Ghats biodiversity.',
      'Visitors can combine Topslip with Kozhikamuthi Elephant Camp and Karianshola national park.',
      'Book Get Taxi Kovai outstation cabs (₹15/km round-trip + ₹400 batta) for a relaxing wilderness trip.',
      'Call or WhatsApp 9043743777 for weekend nature getaways!'
    ]
  },
  {
    id: 'blog-10',
    title: 'Coimbatore City Local Taxi Guide: Shopping, Business & IT Park Hourly Rentals',
    slug: 'coimbatore-city-local-hourly-taxi-rental-guide',
    category: 'Local City Travel',
    readTime: '4 min read',
    date: 'August 02, 2026',
    author: 'Get Taxi Kovai Local Desk',
    image: '/images/blog/coimbatore-junction-railway-station.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Coimbatore_Junction_Railway_Station_Entrance.jpg/800px-Coimbatore_Junction_Railway_Station_Entrance.jpg',
    tags: ['Coimbatore Local Taxi', 'Gandhipuram Shopping', 'TIDEL Park Cab', 'Base ₹80', 'Get Taxi Kovai'],
    excerpt: 'Explore Kovai’s shopping hubs in Cross Cut Road & RS Puram or commute to TIDEL Park with Get Taxi Kovai’s low local fares: Base ₹80 + ₹28/km.',
    content: [
      'Whether you are shopping for silk sarees in Gandhipuram, exploring textile showrooms in Cross Cut Road, dining in RS Puram, or commuting to Saravanampatti IT Parks, local travel in Coimbatore demands reliable transit.',
      'Get Taxi Kovai offers unbeatable local city fares: Base fare ₹80 + ₹28 per kilometer.',
      'We also provide flexible hourly rental packages (4 Hours/40 KM, 8 Hours/80 KM, 12 Hours/120 KM) allowing you to retain the same cab and driver for multiple meetings or shopping stops.',
      'Enjoy clean AC rides, polite drivers, and instant doorstep pickup.',
      'For immediate local cab bookings, call 9043743777!'
    ]
  },
  {
    id: 'blog-11',
    title: 'Coimbatore to Tiruppur Texvalley Taxi Services: Garment Hub Business Travel Guide',
    slug: 'coimbatore-to-tiruppur-texvalley-garment-hub-taxi-guide',
    category: 'Corporate & IT Transit',
    readTime: '5 min read',
    date: 'August 01, 2026',
    author: 'Get Taxi Kovai Business Desk',
    image: '/images/blog/tiruppur-texvalley-garment-hub.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    tags: ['Tiruppur Taxi', 'Texvalley Cabs', 'Coimbatore to Tiruppur', 'Dollar City', 'Get Taxi Kovai'],
    excerpt: 'Seamless business cab transfers between Coimbatore Airport or City and Tiruppur garment industrial parks, Texvalley, and knitwear manufacturing centers.',
    content: [
      'Tiruppur, world-renowned as India’s Dollar City and knitwear capital, is located just 55 km east of Coimbatore. Thousands of international buyers, textile exporters, and factory executives commute daily between Coimbatore International Airport (CJB) and Tiruppur.',
      'Key destinations in Tiruppur include Texvalley International Textile Market at Gangapuram, Netaji Apparel Park, Avinashi Road industrial units, and Tiruppur Junction Railway Station.',
      'Why Choose Get Taxi Kovai for Tiruppur Commutes? We offer dedicated AC Executive Sedans (Dzire, Etios) and 6-Seater SUVs with punctual drivers familiar with all industrial bypasses.',
      'Pricing & Tariff: Travel one-way drop at ₹26/km (+ ₹300 driver batta) with ZERO return kilometer charges, or choose a full-day round-trip package at ₹15/km (+ ₹400 driver batta).',
      'Reserve your executive business cab by calling or messaging 9043743777.'
    ]
  },
  {
    id: 'blog-12',
    title: 'Mettupalayam Nilgiri Mountain Railway Junction Taxi Transfer Guide',
    slug: 'mettupalayam-nilgiri-mountain-railway-toy-train-taxi-transfer',
    category: 'Nilgiri Heritage',
    readTime: '4 min read',
    date: 'July 29, 2026',
    author: 'Get Taxi Kovai Mountain Desk',
    image: '/images/blog/nilgiri-mountain-railway-toy-train.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Nilgiri_Mountain_Railway_Steam_Locomotive.jpg/800px-Nilgiri_Mountain_Railway_Steam_Locomotive.jpg',
    tags: ['Mettupalayam Taxi', 'Toy Train Cab', 'Nilgiri Mountain Railway', 'Black Thunder Cab', 'Get Taxi Kovai'],
    excerpt: 'Catch the early morning UNESCO Nilgiri Mountain Railway Toy Train at Mettupalayam with prompt on-time doorstep taxi pickups from Coimbatore.',
    content: [
      'Mettupalayam is the gateway town situated at the foot of the Nilgiri hills, 35 km north of Coimbatore. It is famous for being the starting point of the UNESCO World Heritage Nilgiri Mountain Railway (NMR) Toy Train that departs daily at 7:10 AM for Ooty.',
      'Because the NMR train departs early in the morning, travelers arriving at Coimbatore Junction Railway Station or Airport need a bulletproof, 100% reliable 5:30 AM taxi pickup to ensure they never miss their train.',
      'Additionally, Mettupalayam houses popular attractions like Black Thunder Water Theme Park and the scenic Vanabhadrakali Amman Temple along the Bhavani River.',
      'Get Taxi Kovai Fare Transparency: Local point-to-point transfers from Kovai to Mettupalayam take under 50 minutes. Rates start at flat ₹26/km for one-way drops.',
      'Book your prompt early morning Mettupalayam cab by calling 9043743777!'
    ]
  },
  {
    id: 'blog-13',
    title: 'Coimbatore to Erode & Salem Highway Cab Rates: Business & Turmeric Market Transit',
    slug: 'coimbatore-to-erode-salem-highway-cab-rates-turmeric-market',
    category: 'Highway & Outstation Drops',
    readTime: '5 min read',
    date: 'July 26, 2026',
    author: 'Get Taxi Kovai Tariff Desk',
    image: '/images/blog/erode-salem-highway-transit.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    tags: ['Erode Taxi', 'Salem Drop Cab', 'NH544 Highway Taxi', 'Turmeric City', 'Get Taxi Kovai'],
    excerpt: 'Affordable, hassle-free outstation cab drops from Coimbatore to Erode (100 km) and Salem (165 km) along the NH544 expressway.',
    content: [
      'The NH544 six-lane highway connects Coimbatore to Erode (Yellow City/Turmeric City) and Salem (Steel City). This corridor handles immense daily business traffic for textiles, steel works, agriculture, and educational institutions.',
      'Distance & Travel Time: Coimbatore to Erode is ~100 km (2 hours drive via Avinashi & Perundurai), while Salem is ~165 km (3 hours drive).',
      'One-Way Drop vs. Bus Commute: Taking a private Get Taxi Kovai cab offers luggage space, doorstep pickup from your hotel or home in Kovai, direct drop at Erode Railway Station or Salem Steel Plant, and zero stress.',
      'Transparent Fare Breakdown: One-way drop at ₹26/km + ₹300 driver batta. Round trip at ₹15/km + ₹400 driver batta.',
      'Call 9043743777 for instant 24/7 Erode and Salem cab reservations.'
    ]
  },
  {
    id: 'blog-14',
    title: 'Siruvani Waterfalls & Kovai Kutralam Eco Taxi Day Trip Guide',
    slug: 'siruvani-waterfalls-kovai-kutralam-eco-taxi-day-trip-guide',
    category: 'Wildlife & Nature',
    readTime: '4 min read',
    date: 'July 24, 2026',
    author: 'Get Taxi Kovai Nature Desk',
    image: '/images/blog/siruvani-waterfalls-kovai-kutralam.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Siruvani_Waterfalls_Coimbatore.jpg/800px-Siruvani_Waterfalls_Coimbatore.jpg',
    tags: ['Siruvani Waterfalls', 'Kovai Kutralam', 'Second Tastiest Water', 'Coimbatore Eco Trip', 'Get Taxi Kovai'],
    excerpt: 'Visit the legendary Siruvani Dam and Kovai Kutralam waterfalls—home to the world’s second tastiest natural drinking water.',
    content: [
      'Siruvani Waterfalls, locally referred to as Kovai Kutralam, is situated in the Western Ghats mountain range, approximately 36 km west of Coimbatore city.',
      'The water of Siruvani is globally famous for its incredible taste and mineral purity, scientifically recognized as the world’s second tastiest water after Switzerland’s Nile river source.',
      'The drive leads through lush forest checkposts managed by the Tamil Nadu Forest Department, surrounded by bamboo groves and cool mountain breezes.',
      'Day Trip Recommendations: Combine Siruvani with Sadivayal forest checkpost and Karunya Nagar. Forest department buses carry tourists from the gate to the waterfalls.',
      'Get Taxi Kovai provides comfortable local day packages (₹375 for first 2 hours + ₹350/hr) or customized round-trip taxi drops. Book now at 9043743777!'
    ]
  },
  {
    id: 'blog-15',
    title: 'Coimbatore to Munnar Hill Station 4-Day Taxi Package & Route Guide',
    slug: 'coimbatore-to-munnar-hill-station-4-day-taxi-package-guide',
    category: 'Tour Packages',
    readTime: '6 min read',
    date: 'July 21, 2026',
    author: 'Get Taxi Kovai Tour Desk',
    image: '/images/blog/munnar-tea-plantations-kerala.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Munnar_tea_plantations_Kerala.jpg/800px-Munnar_tea_plantations_Kerala.jpg',
    tags: ['Munnar Taxi', 'Coimbatore to Munnar', 'Tea Garden Safari', 'Anamalai Route', 'Get Taxi Kovai'],
    excerpt: 'Plan an unforgettable 4-day mountain getaway from Coimbatore to Munnar across tea plantations, Eravikulam National Park, and Mattupetty Dam.',
    content: [
      'Munnar, Kerala’s premier hill station, is located 160 km southwest of Coimbatore. The route takes travelers through Pollachi, Udumalpet, Chinnar Wildlife Sanctuary, and Marayoor sandal forests.',
      'Route Highlights: Driving through Chinnar Wildlife Sanctuary offers chances to spot wild elephants, spotted deer, and star tortoises along the highway.',
      'Munnar Attractions: Eravikulam National Park (home to Nilgiri Tahr), Tea Museum, Mattupetty Dam, Kundala Lake, and Top Station.',
      'Why Book Get Taxi Kovai for Munnar? Interstate permits (Tamil Nadu to Kerala), expert mountain drivers, clean AC Ertiga/Innova Crysta, and transparent billing at ₹15/km + ₹400 driver batta per day.',
      'Call 9043743777 to reserve your Coimbatore-Munnar holiday cab!'
    ]
  },
  {
    id: 'blog-16',
    title: 'Peelamedu & Saravanampatti IT Corridor Daily Taxi Rentals for Techies',
    slug: 'peelamedu-saravanampatti-it-corridor-daily-taxi-rentals-techies',
    category: 'Corporate & IT Transit',
    readTime: '4 min read',
    date: 'July 18, 2026',
    author: 'Get Taxi Kovai Corporate Desk',
    image: '/images/blog/tidel-park-saravanampatti-it-corridor.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/TIDEL_Park_Coimbatore_Building.jpg/800px-TIDEL_Park_Coimbatore_Building.jpg',
    tags: ['Saravanampatti Cab', 'TIDEL Park Taxi', 'Peelamedu Techies', 'Coimbatore IT Park', 'Get Taxi Kovai'],
    excerpt: 'Punctual, comfortable corporate cab rentals and daily rides for IT professionals commuting to TIDEL Park, CHIL SEZ, and Keeranatham IT corridor.',
    content: [
      'Coimbatore has rapidly emerged as Tamil Nadu’s second largest IT and tech hub. The Saravanampatti-Keeranatham corridor (CHIL SEZ) and Peelamedu (TIDEL Park Coimbatore) house top multinational tech companies.',
      'For IT professionals, client delegates, and corporate teams, reliable doorstep transit is vital during peak morning shifts and late-night office drops.',
      'Get Taxi Kovai Corporate Offerings: Flexible daily rides starting at base ₹80 + ₹28/km, or custom monthly corporate accounts with itemized GST invoices.',
      'Clean sanitized cars, GPS tracking, and polite professional drivers who arrive 5 minutes before scheduled pickup.',
      'Contact Get Taxi Kovai Corporate Desk at 9043743777 to set up your hassle-free IT commute!'
    ]
  },
  {
    id: 'blog-17',
    title: 'Late-Night & 24/7 Midnight Taxi Availability in Coimbatore: Safety & Zero Surge Fares',
    slug: 'late-night-24-7-midnight-taxi-coimbatore-safety-zero-surge',
    category: 'Suburban Travel & Taxi Safety',
    readTime: '4 min read',
    date: 'July 15, 2026',
    author: 'Get Taxi Kovai Operations',
    image: '/images/blog/late-night-24-7-taxi-coimbatore.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    tags: ['Night Taxi Coimbatore', '24/7 Cab Service', 'Midnight Airport Drop', 'Zero Surge', 'Get Taxi Kovai'],
    excerpt: 'Arriving in Kovai at 2 AM? Count on Get Taxi Kovai for safe, verified 24/7 midnight pickups across Coimbatore with zero surge pricing.',
    content: [
      'Finding a safe and fairly priced cab at 2 AM or 4 AM in Coimbatore can be stressful. App-based aggregators often slap 2x to 3x surge multipliers or leave passengers stranded with sudden driver cancellations.',
      'Get Taxi Kovai provides 24/7 365-day midnight taxi availability across Coimbatore Junction, Peelamedu Airport, Singanallur, Ukkadam, and Gandhipuram.',
      'Zero Surge Pricing: Unlike ride-hailing apps, Get Taxi Kovai charges fixed, transparent rates regardless of weather, flight delays, or peak midnight hours.',
      'Safety First: All Get Taxi Kovai vehicles are equipped with active GPS tracking and verified local drivers who undergo background checks.',
      'Save our 24/7 emergency hotline on your phone: 9043743777!'
    ]
  },
  {
    id: 'blog-18',
    title: 'Perur Pateeswarar Temple & Marudhamalai Murugan Heritage Taxi Tour',
    slug: 'perur-pateeswarar-marudhamalai-murugan-temple-heritage-taxi-tour',
    category: 'Pilgrimage & Spiritual',
    readTime: '5 min read',
    date: 'July 12, 2026',
    author: 'Get Taxi Kovai Temple Desk',
    image: '/images/blog/perur-pateeswarar-temple-kovai.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Perur_Pateeswarar_Temple.jpg/800px-Perur_Pateeswarar_Temple.jpg',
    tags: ['Perur Temple', 'Marudhamalai Taxi', 'Coimbatore Temple Tour', 'Kanaka Sabha', 'Get Taxi Kovai'],
    excerpt: 'Explore Kovai’s 1,500-year-old Chola architecture at Perur Pateeswarar Temple and the hill shrine of Marudhamalai Murugan with Get Taxi Kovai.',
    content: [
      'Coimbatore is steeped in spiritual heritage, boasting ancient temples that date back over a thousand years.',
      'Perur Pateeswarar Temple: Situated on the banks of the Noyyal River, 7 km west of Coimbatore, this temple built by Chola kings features the sublime Kanaka Sabha (Golden Hall) with intricate stone carved pillars depicting 36 manifestations of Lord Shiva.',
      'Marudhamalai Murugan Temple: Perched atop a verdant hill 12 km west of Coimbatore, Marudhamalai is dedicated to Lord Murugan (Subramanya Swamy) and is surrounded by medicinal herbs.',
      'Heritage Day Tour Package: Book Get Taxi Kovai local package (₹375 for first 2 hours + ₹350/hr) to conveniently visit Perur, Marudhamalai, Eachanari, and Dhyanalinga in a single relaxing trip.',
      'Call 9043743777 to book your spiritual Kovai cab tour!'
    ]
  },
  {
    id: 'blog-19',
    title: 'Coimbatore to Bangalore (Bengaluru) One-Way Drop Taxi Fares & Highway Guide',
    slug: 'coimbatore-to-bangalore-bengaluru-one-way-drop-taxi-fares-guide',
    category: 'Highway & Outstation Drops',
    readTime: '5 min read',
    date: 'July 09, 2026',
    author: 'Get Taxi Kovai Tariff Desk',
    image: '/images/blog/coimbatore-to-bangalore-highway.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Vidhana_Soudha_Bangalore.jpg/800px-Vidhana_Soudha_Bangalore.jpg',
    tags: ['Coimbatore to Bangalore Taxi', 'Bengaluru Drop Cab', 'NH44 Highway Taxi', 'Zero Return Fare', 'Get Taxi Kovai'],
    excerpt: 'Travel comfortably from Coimbatore to Bangalore (360 km) via Salem & Hosur with flat ₹26/km one-way drop taxis and zero return charges.',
    content: [
      'The 360 km journey from Coimbatore to Bengaluru via Salem, Dharmapuri, and Hosur along the NH44 expressway is one of South India’s smoothest highway routes (~6 to 7 hours drive time).',
      'Whether heading to Kempegowda International Airport (BLR), Electronic City, Whitefield, or Koramangala, private taxi drops eliminate bus transfer hassles.',
      'Cost Breakdown: Traditional taxis charge for 720 km (round trip). With Get Taxi Kovai One-Way Drop Taxi, you pay strictly for the 360 km traveled at ₹26/km + ₹300 driver batta.',
      'Vehicles Available: Comfortable Hatchbacks, Sedan (Swift Dzire, Etios), 6-Seater Ertiga, and Luxury 7-Seater Innova Crysta with experienced highway captains.',
      'Book your Bangalore drop taxi by calling 9043743777!'
    ]
  },
  {
    id: 'blog-20',
    title: 'Coimbatore to Madurai Meenakshi Amman Temple Highway Cab Tour',
    slug: 'coimbatore-to-madurai-meenakshi-amman-temple-highway-cab-tour',
    category: 'Pilgrimage & Spiritual',
    readTime: '5 min read',
    date: 'July 05, 2026',
    author: 'Get Taxi Kovai Temple Desk',
    image: '/images/blog/madurai-meenakshi-amman-temple.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Madurai_Meenakshi_Amman_Temple_Gopuram.jpg/800px-Madurai_Meenakshi_Amman_Temple_Gopuram.jpg',
    tags: ['Madurai Taxi', 'Meenakshi Temple Cab', 'Coimbatore to Madurai', 'Get Taxi Kovai'],
    excerpt: 'Embark on a cultural pilgrimage from Kovai to Madurai (215 km) via Karur or Palladam with Get Taxi Kovai outstation cabs.',
    content: [
      'Madurai, the cultural capital of Tamil Nadu and home to the world-renowned Meenakshi Sundareswarar Temple, lies 215 km southeast of Coimbatore (~4 hours drive).',
      'Route Options: Travelers can take the smooth route via Palladam, Dharapuram, and Oddanchatram, or travel via Karur and Dindigul.',
      'Sightseeing Highlights: Meenakshi Amman Temple, Thirumalai Nayakkar Mahal, Gandhi Memorial Museum, and tasting authentic Madurai Jigarthanda.',
      'Fare Tariff: Outstation round-trip package at ₹15 per km + ₹400 driver batta per day, or one-way drop at ₹26/km + ₹300 batta.',
      'Call 9043743777 to plan your Madurai temple cab trip today!'
    ]
  },
  {
    id: 'blog-21',
    title: 'Eachanari Vinayagar & Kovaipudur Suburban Taxi Services in Coimbatore',
    slug: 'eachanari-vinayagar-kovaipudur-suburban-taxi-services-coimbatore',
    category: 'Suburban Travel & Taxi Safety',
    readTime: '4 min read',
    date: 'July 02, 2026',
    author: 'Get Taxi Kovai Suburban Desk',
    image: '/images/blog/eachanari-vinayagar-temple.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Eachanari_Vinayagar_Temple_Entrance.jpg/800px-Eachanari_Vinayagar_Temple_Entrance.jpg',
    tags: ['Eachanari Taxi', 'Kovaipudur Cab', 'Suburban Taxi Kovai', 'Podanur Cab', 'Get Taxi Kovai'],
    excerpt: 'Fast doorstep cab dispatch for Coimbatore’s expanding suburbs including Kovaipudur, Eachanari, Malumichampatti, BK Pudur, and Sundarapuram.',
    content: [
      'As Coimbatore expands, suburban townships like Kovaipudur (Little Ooty of Kovai), Eachanari, Sundarapuram, Malumichampatti, and Kinathukadavu have grown exponentially with residential enclaves and colleges.',
      'Residents often struggle with auto-rickshaws refusing rides or overcharging for suburban trips.',
      'Get Taxi Kovai extends full 24/7 suburban coverage with zero extra pickup location fees.',
      'Whether visiting the famous 6-foot Eachanari Vinayagar Temple or catching a train from Podanur Junction, enjoy transparent base fare ₹80 + ₹28/km rides.',
      'Call 9043743777 for quick suburban cab pickup within 10-15 minutes!'
    ]
  },
  {
    id: 'blog-22',
    title: 'Coimbatore to Chennai Highway Drop Taxi: Distance, Tolls & Cost Breakdown',
    slug: 'coimbatore-to-chennai-highway-drop-taxi-distance-tolls-cost-breakdown',
    category: 'Highway & Outstation Drops',
    readTime: '5 min read',
    date: 'June 28, 2026',
    author: 'Get Taxi Kovai Tariff Desk',
    image: '/images/blog/chennai-central-highway-drop.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Chennai_Central_Railway_Station_building.jpg/800px-Chennai_Central_Railway_Station_building.jpg',
    tags: ['Coimbatore to Chennai Taxi', 'Chennai One Way Drop', 'Save 50% Fare', 'Get Taxi Kovai'],
    excerpt: 'Detailed cost breakdown for traveling from Coimbatore to Chennai (500 km) via Salem and Ulundurpet with Get Taxi Kovai One-Way Drops.',
    content: [
      'Traveling the 500 km distance between Coimbatore and Chennai takes approximately 8 to 9 hours along the smooth NH544 and NH38 National Highways.',
      'Why Choose a One-Way Taxi over Flights or Trains? When traveling with family or heavy luggage, last-minute flight tickets can cost over ₹15,000. Trains are frequently sold out weeks in advance.',
      'Get Taxi Kovai One-Way Drop Fare: 500 km @ ₹26/km = ₹13,000 + ₹300 driver batta = total ₹13,300 for the ENTIRE vehicle (up to 4 passengers in Sedan or 7 in SUV).',
      'Doorstep pickup from your home in Kovai directly to Chennai Central, Airport, OMR, or ECR without changing transport.',
      'Book your Chennai highway cab by calling 9043743777!'
    ]
  },
  {
    id: 'blog-23',
    title: 'Coonoor Hill Station Tea Tasting & Sim’s Park Cab Sightseeing Guide',
    slug: 'coonoor-hill-station-tea-tasting-sims-park-cab-sightseeing-guide',
    category: 'Nilgiri Heritage',
    readTime: '4 min read',
    date: 'June 24, 2026',
    author: 'Get Taxi Kovai Mountain Desk',
    image: '/images/blog/sims-park-coonoor-botanical-garden.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Sims_Park_Coonoor_Botanical_Garden.jpg/800px-Sims_Park_Coonoor_Botanical_Garden.jpg',
    tags: ['Coonoor Taxi', 'Sims Park Cab', 'Lambs Rock', 'Nilgiris Sightseeing', 'Get Taxi Kovai'],
    excerpt: 'Discover Coonoor (68 km from Kovai)—the quieter, picturesque Nilgiri gem famous for Sim’s Park, Lamb’s Rock, and Highfield Tea Factory.',
    content: [
      'Located at an altitude of 6,000 feet, Coonoor is the second largest hill station in the Nilgiri hills, situated 68 km north of Coimbatore (~2.5 hours drive via Mettupalayam).',
      'Unlike bustling Ooty, Coonoor offers a serene, unhurried atmosphere amidst sprawling green tea estates.',
      'Must-Visit Attractions: Sim’s Park (12-hectare botanical garden with rare plant species), Lamb’s Rock (panoramic views of Coimbatore plains), Dolphin’s Nose viewpoint, and tea tasting at Highfield Tea Factory.',
      'Get Taxi Kovai Offer: Hire an outstation round-trip cab at ₹15/km (+ ₹400 batta) with expert mountain drivers experienced in navigating Coonoor’s winding roads.',
      'Call 9043743777 to reserve your Coonoor day tour!'
    ]
  },
  {
    id: 'blog-24',
    title: 'Wedding & Event Luxury Car Rentals in Coimbatore: Sedan & SUV Fleet Guide',
    slug: 'wedding-event-luxury-car-rentals-coimbatore-sedan-suv-fleet-guide',
    category: 'Corporate & IT Transit',
    readTime: '4 min read',
    date: 'June 20, 2026',
    author: 'Get Taxi Kovai Fleet Desk',
    image: '/images/blog/wedding-luxury-car-rentals-coimbatore.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    tags: ['Coimbatore Wedding Taxi', 'Innova Crysta Rental', 'Marriage Fleet Kovai', 'Get Taxi Kovai'],
    excerpt: 'Bulk cab bookings, wedding guest airport transfers, and VIP Innova Crysta rentals for Coimbatore marriages, conventions, and corporate events.',
    content: [
      'Coimbatore is a premier destination for grand Tamil weddings, corporate summits at CODISSIA Trade Fair Complex, and industrial expos.',
      'Managing guest logistics between Coimbatore Airport, Railway Station, marriage halls, and luxury hotels requires a coordinated fleet.',
      'Get Taxi Kovai Event Solutions: Dedicated fleet of Toyota Innova Crysta (7-seater), Maruti Ertiga (6-seater), Swift Dzire, and 14-Seater Tempo Travellers.',
      'Uniformed drivers, clean pristine vehicles, floral decoration options for bridal cars, and dedicated event transport managers.',
      'Call 9043743777 to discuss your wedding or event fleet requirements!'
    ]
  },
  {
    id: 'blog-25',
    title: 'Why Get Taxi Kovai is a Top-Rated Call Taxi in Coimbatore: 10 Key Reasons',
    slug: 'why-get-taxi-kovai-is-rated-1-call-taxi-coimbatore-10-reasons',
    category: 'Taxi Pricing Guide',
    readTime: '4 min read',
    date: 'June 15, 2026',
    author: 'Get Taxi Kovai Editorial',
    image: '/images/blog/why-get-taxi-kovai-top-rated.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80',
    tags: ['Top Taxi Coimbatore', 'Top Rated Taxi', 'Get Taxi Kovai 9043743777', 'No Hidden Fees'],
    excerpt: 'Discover why over 50,000 passengers trust Get Taxi Kovai as the most transparent, affordable, and reliable taxi service in Coimbatore.',
    content: [
      '1. Unbeatable Transparent Pricing: Local rides start at Base ₹80 + ₹28/km; One-Way Outstation drops at flat ₹26/km; Round Trips at ₹15/km; Airport transfers at Base ₹100 + ₹30/km.',
      '2. Zero Return Kilometer Fee: Save up to 50% on outstation drop journeys across Tamil Nadu, Karnataka, and Kerala.',
      '3. Local Package Tariff Rule: ₹375 for the first 2 hours, and just ₹350/hr for additional hours.',
      '4. Flat ₹3,500 Ooty One-Way Rate: Transparent flat fare to Ooty with zero hidden bill surprises.',
      '5. 24/7 Hotline 9043743777: Speak directly with friendly local dispatchers anytime day or night.',
      '6. Instant Doorstep Pickup in 5-15 Minutes across Gandhipuram, Peelamedu, RS Puram, Saravanampatti, and Kovai suburbs.',
      '7. Expert Nilgiri Mountain Drivers: Seasoned captains skilled in handling 40 hairpin bends to Valparai and steep ghat roads to Ooty/Kodaikanal.',
      '8. Clean, Sanitized AC Fleet: Well-maintained Hatchbacks, Executive Sedans, 6-Seater Ertigas, Premium Innova Crystas, and 14-Seater Tempo Travellers.',
      '9. Flight & Train Tracking: Automated flight monitoring for seamless airport pickups.',
      '10. Trusted by 50,000+ Happy Riders with a 4.9-star rating!',
      'Experience the difference today by calling or messaging 9043743777.'
    ]
  },
  {
    id: 'blog-26',
    title: 'Thanjavur (Tanjore) Brihadeeswarar Big Temple Taxi Tour Guide from Coimbatore',
    slug: 'thanjavur-tanjore-brihadeeswarar-big-temple-taxi-tour-guide-coimbatore',
    category: 'Pilgrimage & Spiritual',
    readTime: '5 min read',
    date: 'June 10, 2026',
    author: 'Get Taxi Kovai Temple Desk',
    image: '/images/blog/thanjavur-brihadeeswarar-big-temple.webp',
    fallbackImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Thanjavur_Brihadeeswarar_Temple_at_dusk.jpg/800px-Thanjavur_Brihadeeswarar_Temple_at_dusk.jpg',
    tags: ['Thanjavur Big Temple', 'Tanjore Taxi', 'Brihadeeswarar Temple', 'Great Living Chola Temple', 'Get Taxi Kovai'],
    excerpt: 'Explore the 1,000-year-old UNESCO World Heritage Brihadeeswarar Temple in Thanjavur (Tanjore) from Coimbatore with Get Taxi Kovai private AC cabs.',
    content: [
      'Thanjavur (Tanjore), the ancient capital of the Chola Empire, is home to the world-famous Brihadeeswarar Temple (known locally as Periya Kovil or Big Temple). Located ~230 km east of Coimbatore, this 1,000-year-old granitic marvel is a UNESCO World Heritage site built by Emperor Rajaraja Chola I in 1010 CE.',
      'Architectural Wonders of Tanjore Big Temple: The temple features a towering 216-foot Vimana tower capped by a massive 80-ton single stone granite Kumbam, a colossal 20-ton monolithic Nandi bull statue carved from a single rock, and vibrant Chola fresco paintings.',
      'Other Tanjore Attractions: Combine your temple visit with the Thanjavur Maratha Palace, Saraswathi Mahal Library (one of Asia’s oldest manuscript libraries), and the Tanjore Art Gallery featuring ancient Chola bronze sculptures.',
      'Distance & Route: The drive from Coimbatore to Thanjavur takes ~4.5 hours via Karur and Trichy. You can also visit Srirangam Ranganathaswamy Temple en-route near Trichy.',
      'Get Taxi Kovai Taxi Tariff: Travel in supreme comfort with one-way drop at ₹26/km (+ ₹300 batta) or round-trip at ₹15/km (+ ₹400 batta) with courteous drivers who wait until your darshan is complete.',
      'Book your Tanjore Big Temple cab today by calling 9043743777!'
    ]
  }
];
