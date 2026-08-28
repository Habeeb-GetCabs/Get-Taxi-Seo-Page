import { Review } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Karthik Subramanian',
    location: 'Peelamedu, Coimbatore',
    rating: 5,
    tripTitle: 'Coimbatore to Ooty 2-Day Trip',
    comment: 'Booked an Innova Crysta for our family trip to Ooty with Get Taxi Kovai. The driver (Ramesh) was extremely professional on the 36 hairpin bends. Car was spotless clean and price was exactly flat ₹15/km + ₹400 driver batta as advertised!',
    date: 'August 18, 2026',
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'Priya Sundaram',
    location: 'Bangalore (Visiting Isha Yoga)',
    rating: 5,
    tripTitle: 'Airport to Isha Foundation & Marudhamalai',
    comment: 'Punctual pickup right at CJB airport arrival gates. Driver helped with luggage and waited patiently while we visited Adiyogi and Dhyanalinga. Base fare ₹100 + ₹30/km was completely transparent! Call 9043743777 recommended.',
    date: 'August 12, 2026',
    verified: true,
  },
  {
    id: 'rev-3',
    name: 'Dr. Anand Kumar',
    location: 'Gandhipuram, Coimbatore',
    rating: 5,
    tripTitle: 'One-Way Drop to Chennai',
    comment: 'Needed an urgent night drop cab to Chennai. Sedan arrived within 15 minutes of WhatsApp booking (9043743777). Charged exact flat ₹26/km + ₹300 driver batta with zero return km fee. Excellent service!',
    date: 'August 04, 2026',
    verified: true,
  },
  {
    id: 'rev-4',
    name: 'Meenakshi & Family',
    location: 'Tiruppur',
    rating: 5,
    tripTitle: 'Valparai 40 Hairpin Bend Tour',
    comment: 'Great 14-seater Tempo Traveller experience for our family reunion with Get Taxi Kovai. Clean AC, great music system, and the driver knew every secret viewpoint near Aliyar dam.',
    date: 'July 29, 2026',
    verified: true,
  },
];

export interface RouteCard {
  id: string;
  route: string;
  distance: string;
  fare: number;
  description: string;
  attractions: string[];
}

export const FIXED_ROUTE_CARDS: RouteCard[] = [
  {
    id: 'r1',
    route: 'Annur',
    distance: '30 KM',
    fare: 1100,
    description: 'Industrial & agricultural hub on Kovai-Sathy road famed for ancient Lord Manneeswarar Temple.',
    attractions: ['Manneeswarar Temple', 'Sathy Highway Corridor', 'Textile & Poultry Units'],
  },
  {
    id: 'r2',
    route: 'Isha Yoga Center',
    distance: '33 KM',
    fare: 1100,
    description: 'World-famous spiritual sanctuary at Velliangiri Foothills housing the iconic 112ft Adiyogi Shiva Statue.',
    attractions: ['112ft Adiyogi Statue', 'Dhyanalinga', 'Suryakund & Chandrakund', 'Divya Darshanam'],
  },
  {
    id: 'r3',
    route: 'Anaikatti',
    distance: '30 KM',
    fare: 1300,
    description: 'Scenic Western Ghats forest valley along the Siruvani River, bordering Tamil Nadu & Kerala.',
    attractions: ['Siruvani River Valley', 'Elephant Corridors', 'Eco-Resorts & Retreats', 'Western Ghats Drive'],
  },
  {
    id: 'r4',
    route: 'Mettupalayam',
    distance: '37 KM',
    fare: 1400,
    description: 'Bhavani riverbank town and official foothill gateway for the UNESCO Nilgiri Mountain Toy Train.',
    attractions: ['Nilgiri Toy Train Railway', 'Black Thunder Water Park', 'Bhavani River', 'Vana Bathrakali Kovil'],
  },
  {
    id: 'r5',
    route: 'Palladam / Sirumugai',
    distance: '39 - 40 KM',
    fare: 1500,
    description: 'Palladam is India’s poultry capital while Sirumugai is world-renowned for exquisite soft silk sarees.',
    attractions: ['Sirumugai Soft Silk Sarees', 'Palladam Poultry Hub', 'Hi-Way Food Plazas'],
  },
  {
    id: 'r6',
    route: 'Avinashi / Pollachi / MTP Vana Bathrakaliamman Kovil',
    distance: '42 - 43 KM',
    fare: 1600,
    description: 'Heritage temple hubs, coconut capital Pollachi, and powerful riverbank shrine in Mettupalayam.',
    attractions: ['Avinashiappar Temple (7th C.)', 'Pollachi Coconut Groves', 'Vana Bathrakali Amman Shrine'],
  },
  {
    id: 'r7',
    route: 'Airport to Tiruppur',
    distance: '46 KM',
    fare: 1700,
    description: 'Direct executive transfer from CJB Airport directly to India’s Dollar City & Garment Export Hub.',
    attractions: ['Garment Export Hubs', 'Executive Business Hotels', 'Avinashi Road Express'],
  },
  {
    id: 'r8',
    route: 'Puliyampatti',
    distance: '49 KM',
    fare: 1800,
    description: 'Historic trade junction connecting Kovai, Sathy & Erode, famous for traditional weekly markets.',
    attractions: ['Weekly Cattle & Produce Market', 'Sathy Highway Corridor', 'Agricultural Trade Center'],
  },
  {
    id: 'r9',
    route: 'Palakkad / Tiruppur Town',
    distance: '52 - 55 KM',
    fare: 1900,
    description: 'Palakkad Gap gateway to Kerala with Tipu Sultan Fort, and Tiruppur central textile bazars.',
    attractions: ['Palakkad Fort (Tipu Fort)', 'Kalpathy Heritage Village', 'Tiruppur Textile Markets'],
  },
  {
    id: 'r10',
    route: 'Airport to Palakkad',
    distance: '61 KM',
    fare: 2200,
    description: 'Fast inter-state taxi transfer from Coimbatore Airport across Walayar border into Kerala.',
    attractions: ['Walayar Forest Checkpost', 'Malampuzha Dam & Gardens', 'Kerala Inter-State Gateway'],
  },
  {
    id: 'r11',
    route: 'Sathyamangalam / Kangeyam / Udumalpet',
    distance: '70 KM',
    fare: 2500,
    description: 'Tiger Reserve foothills, native Kangeyam bull breeding country, and scenic Udumalpet dam.',
    attractions: ['Bannari Amman Temple', 'Kangeyam Bull Farms', 'Amaravathi Dam', 'Sathy Tiger Reserve'],
  },
  {
    id: 'r12',
    route: 'Perundurai / Gobi / Kotagiri / Coonoor',
    distance: '70 - 83 KM',
    fare: 2900,
    description: 'SIPCOT industrial park, green Gobi countryside, and serene tea estates of Nilgiri hills.',
    attractions: ['Sims Park Coonoor', 'Catherine Falls Kotagiri', 'Gobi Paddy Fields', 'Perundurai SIPCOT'],
  },
  {
    id: 'r13',
    route: 'Dharapuram',
    distance: '85 KM',
    fare: 2800,
    description: 'Ancient Kongu town on Amaravathi riverbank famed for Bhagavan Sri Uthara Kavu Temple.',
    attractions: ['Amaravathi River Front', 'Windmill Farms Corridor', 'Uthara Kavu Temple', 'Kongu Heritage'],
  },
  {
    id: 'r14',
    route: 'Erode',
    distance: '100 KM',
    fare: 3000,
    description: 'Major commercial hub on Kaveri river, globally celebrated as the Turmeric City & Textile Capital.',
    attractions: ['Bhavani Sangameshwarar (Kooduthurai)', 'Erode Turmeric Market', 'Texvalley Garment Mall', 'Kaveri River Front'],
  },
  {
    id: 'r15',
    route: 'Ooty Bus Stand Only',
    distance: '87 KM',
    fare: 3500,
    description: 'Queen of Hill Stations drop service navigating 36 scenic Nilgiri hairpin bends directly to Ooty center.',
    attractions: ['Ooty Lake & Boathouse', 'Botanical Gardens', 'Rose Garden', 'Doddabetta Peak'],
  },
  {
    id: 'r16',
    route: 'Palani',
    distance: '110 KM',
    fare: 3500,
    description: 'Holy pilgrimage shrine housing the sacred hill temple of Lord Dhandayuthapani Swamy (Murugan).',
    attractions: ['Palani Hill Temple (3rd Abode)', 'Rope Car & Winch Cable', 'Panchamirtham Prasadam', 'Saravana Poigai'],
  },
];

export const TARIFF_POLICIES = [
  {
    title: 'Distance-Based Round Trip & Long Drop Rules',
    points: [
      'Oneway drops under 100 KM: Calculated at round-trip mileage @ ₹30/ KM (Go + Return).',
      'Oneway drops over 130 KM: Calculated at round-trip mileage @ ₹15 / KM (Go + Return) plus ₹500 Driver Batta.',
      'Tollgate fees, State Permit (for Kerala/Karnataka) and parking charges extra if applicable.',
      'Doorstep pickup and dispatch in 15 minutes across Coimbatore.',
    ],
  },
  {
    title: 'One-Way Drop Taxi Rules',
    points: [
      'Calculated at transparent flat rates per kilometer.',
      'Driver Batta applied per trip as applicable.',
      'Tollgate fees, State Permit and parking charges extra if applicable.',
      'Zero return kilometer charges for long distance drops!',
    ],
  },
  {
    title: 'Outstation Round Trip Rules',
    points: [
      'Standard round-trip mileage rate per kilometer.',
      'Driver Batta applied per day.',
      'Ghat road & Nilgiri hill station driving charges included.',
      'Tollgate fees, State Permit and parking charges extra if applicable.',
    ],
  },
  {
    title: 'Local City & Airport Rules',
    points: [
      'Local City Base fare & Per km charges apply.',
      'Airport transfers servicing all drops to and from CJB Airport.',
      'Hourly Packages available for 4 Hrs / 40 KM, 8 Hrs / 80 KM, and 12 Hrs / 120 KM.',
      '24/7 flight tracking and instant doorstep pickup.',
    ],
  },
];

export const FAQS = [
  {
    question: 'How is the fare calculated for outstation one-way drop taxis with Get Taxi Kovai?',
    answer: 'For one-way drops, you only pay for the distance from pickup to drop location at a flat rate of ₹26 per km + ₹300 driver batta (minimum 130 km applies). Tolls, permits, and parking are extra if applicable. There are NO return kilometer fees charged!',
  },
  {
    question: 'What is the fare for outstation round trips?',
    answer: 'Outstation round trips are charged at ₹15 per km + ₹400 driver batta per day (minimum 250 km/day applies). Hill station driving to Ooty, Coonoor, Kodaikanal, and Valparai is included.',
  },
  {
    question: 'What are Get Taxi Kovai local ride and airport transfer rates?',
    answer: 'Local rides are priced at Base fare ₹80 + ₹28 per km. Airport transfers to Coimbatore International Airport (CJB) are priced at Base fare ₹100 + ₹30 per km (airport tolls extra).',
  },
  {
    question: 'How do I book or call Get Taxi Kovai?',
    answer: 'You can instantly book by calling or sending a WhatsApp message to 9043743777. Our dispatch desk operates 24/7 with a 15-minute doorstep pickup guarantee in Coimbatore.',
  },
  {
    question: 'Are there any hidden hill station charges for Ooty or Valparai?',
    answer: 'No hidden fees! All hill station travel tariffs follow our transparent ₹26/km (one-way + ₹300 batta) or ₹15/km (round trip + ₹400 batta) rate card.',
  },
];

