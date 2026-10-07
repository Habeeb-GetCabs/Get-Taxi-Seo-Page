import fs from 'fs';
import path from 'path';

// Load .env variables if present
if (!process.env.VITE_GOOGLE_MAPS_API_KEY) {
  try {
    if (fs.existsSync('.env')) {
      const envContent = fs.readFileSync('.env', 'utf8');
      const match = envContent.match(/VITE_GOOGLE_MAPS_API_KEY=(.*)/);
      if (match && match[1]) {
        process.env.VITE_GOOGLE_MAPS_API_KEY = match[1].trim().replace(/^['"]|['"]$/g, '');
      }
    }
  } catch (e) {}
}

import { TOUR_PACKAGES } from './src/data/tours.ts';
import { BLOG_POSTS } from './src/data/blogs.ts';
import { FIXED_ROUTE_CARDS, TARIFF_POLICIES, FAQS, INITIAL_REVIEWS } from './src/data/tariffs.ts';
import { POPULAR_LOCATIONS, VEHICLES } from './src/data/locations.ts';
import { SITE_URL, PHONE_NUMBER, PHONE_DISPLAY, PHONE_HREF, WHATSAPP_URL, generateHtmlPage } from './build-static-site.js';
import { writeLegalPages } from './create-legal-pages.js';

const ROOT_DIR = process.cwd();

// Map tour ID to filename
const TOUR_PAGE_MAP = {
  'isha-spiritual-day-tour': 'tour-isha-yoga.html',
  'ooty-coonoor-2day-tour': 'tour-ooty-coonoor.html',
  'kodaikanal-3day-escape': 'tour-kodaikanal.html',
  'valparai-anamalai-2day': 'tour-valparai.html',
  'munnar-3day-greenery': 'tour-munnar.html',
  'palani-murugan-1day': 'tour-palani.html',
  'thanjavur-tanjore-big-temple-tour': 'tour-thanjavur.html',
};

// Map blog slug to filename
function getBlogFilename(post) {
  return `blog-${post.slug}.html`;
}

console.log('=== GENERATING ALL STATIC HTML PAGES & SITEMAP ===');

// ==========================================
// 1. GENERATE INDEX.HTML (HOMEPAGE)
// ==========================================
function generateHomePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    "name": "Get Taxi Kovai",
    "image": "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80",
    "@id": `${SITE_URL}/#taxiservice`,
    "url": SITE_URL,
    "telephone": `+91${PHONE_NUMBER}`,
    "priceRange": "₹80 - ₹4800",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Cross Cut Road, Gandhipuram",
      "addressLocality": "Coimbatore",
      "addressRegion": "Tamil Nadu",
      "postalCode": "641012",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 11.0168,
      "longitude": 76.9558
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    },
    "areaServed": ["Coimbatore", "Ooty", "Coonoor", "Kodaikanal", "Valparai", "Isha Yoga Center", "Pollachi", "Tiruppur", "Salem", "Madurai", "Bangalore", "Chennai"]
  };

  const bodyContent = `
  <!-- Hero Section with Fare Estimator -->
  <section class="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-20 overflow-hidden">
    <div class="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#facc15_1px,transparent_1px)] [background-size:24px_24px]"></div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- Hero Text & USPs -->
        <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide uppercase">
            <span>✨ Trusted Call Taxi In Coimbatore • 24/7 Service</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Call Taxi In Coimbatore <br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">Fast 10-Min Doorstep Pickup*</span>
          </h1>

          <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Experience reliable, transparent taxi travel with Coimbatore’s premier call taxi service. Round-Trip from ₹13–15/km | One-Way Drop from ₹14–26/km | Hourly Rentals at ₹350/hr. 6,000+ satisfied customers, verified drivers, and zero hidden charges.
            <span class="block text-xs text-slate-400 mt-1">*Within Coimbatore Municipal Corporation limits, subject to peak traffic and vehicle availability.</span>
          </p>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <a href="${PHONE_HREF}" data-conversion-intent="call" class="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-base shadow-lg shadow-amber-400/20 hover:scale-[1.02] transition">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z"/></svg>
              Call 9043743777
            </a>
            <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" data-conversion-intent="whatsapp" class="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              WhatsApp 24/7
            </a>
          </div>

          <!-- Trust Badges -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 text-left">
            <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <p class="text-amber-400 font-extrabold text-sm">Zero Advance</p>
              <p class="text-xs text-slate-400">Required</p>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <p class="text-amber-400 font-extrabold text-sm">Pay After Ride</p>
              <p class="text-xs text-slate-400">Cash / UPI</p>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <p class="text-amber-400 font-extrabold text-sm">Free Cancel</p>
              <p class="text-xs text-slate-400">Anytime</p>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <p class="text-amber-400 font-extrabold text-sm">10 Mins</p>
              <p class="text-xs text-slate-400">Doorstep Pickup*</p>
            </div>
          </div>
        </div>

        <!-- Interactive Live Fare Estimator Card -->
        <div class="lg:col-span-5">
          <div class="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 class="text-lg font-black text-slate-900 tracking-tight">Call Taxi In Coimbatore Booking</h3>
                <p class="text-xs text-slate-500">Fast 10-minute doorstep pickup across Coimbatore</p>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">24/7 Live</span>
            </div>

            <!-- Ride Type Selector Tabs: Local 1st, Hourly Rental 2nd, One-Way 3rd, Outstation 4th -->
            <div class="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold" id="ride-type-tabs">
              <button type="button" class="tab-btn py-2 px-1 rounded-lg text-center bg-white text-slate-900 shadow-xs transition" data-type="local">Local Ride</button>
              <button type="button" class="tab-btn py-2 px-1 rounded-lg text-center text-slate-600 hover:text-slate-900 transition" data-type="hourly">Hourly Rental</button>
              <button type="button" class="tab-btn py-2 px-1 rounded-lg text-center text-slate-600 hover:text-slate-900 transition" data-type="oneway">One-Way</button>
              <button type="button" class="tab-btn py-2 px-1 rounded-lg text-center text-slate-600 hover:text-slate-900 transition" data-type="outstation">Outstation</button>
            </div>

            <!-- Form Inputs (No dropdown suggestions or preloaded destinations) -->
            <div class="space-y-3 text-sm">
              <!-- Pickup Field (Open text input, no preloaded destination) -->
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1" id="lbl-pickup">Pickup Address / Area in Coimbatore</label>
                <input type="text" id="calc-pickup" placeholder="Enter Pickup Location in Coimbatore" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" />
              </div>

              <!-- Drop Field (Open text input, no preloaded destination or dropdown) -->
              <div id="drop-container">
                <label class="block text-xs font-bold text-slate-700 mb-1" id="lbl-drop">Drop Location in Coimbatore</label>
                <input type="text" id="calc-drop" placeholder="Enter Drop Location" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" />
              </div>

              <!-- Hourly Package Selector (Shown only when Hourly Rental tab is selected) -->
              <div id="hourly-container" class="hidden">
                <label class="block text-xs font-bold text-slate-700 mb-1">Rental Package Duration</label>
                <select id="calc-hourly-pkg" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none font-semibold text-slate-900">
                  <option value="2">2 Hours (20 KM Free Included)</option>
                  <option value="3">3 Hours (30 KM Free Included)</option>
                  <option value="4" selected>4 Hours (40 KM Free Included)</option>
                  <option value="6">6 Hours (60 KM Free Included)</option>
                  <option value="8">8 Hours (80 KM Free Included)</option>
                  <option value="10">10 Hours (100 KM Free Included)</option>
                  <option value="12">12 Hours (120 KM Free Included)</option>
                </select>
                <p class="text-[11px] text-slate-500 mt-1">₹350 per hour with 10 km free per hour.</p>
              </div>

              <!-- Outstation Days Selector (Shown only when Outstation tab is selected) -->
              <div id="outstation-container" class="hidden">
                <label class="block text-xs font-bold text-slate-700 mb-1">Trip Duration</label>
                <select id="calc-days" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none">
                  <option value="1">1 Day Round Trip</option>
                  <option value="2" selected>2 Days Round Trip</option>
                  <option value="3">3 Days Round Trip</option>
                  <option value="4">4 Days Round Trip</option>
                  <option value="5">5+ Days Tour</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1" for="calc-vehicle">Select Vehicle Class</label>
                <select id="calc-vehicle" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none">
                  <option value="sedan" selected>Executive Sedan (Dzire / Etios) - 4 Seater AC</option>
                  <option value="suv">Family SUV (Ertiga) - 6 Seater AC</option>
                  <option value="crysta">Innova Crysta - 7 Seater Luxury AC</option>
                </select>
              </div>

              <!-- Live Estimate Display Box -->
              <div class="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-slate-900 mt-2">
                <div class="flex justify-between items-center">
                  <div>
                    <span class="text-xs text-slate-600 block" id="calc-dist-label">Trip Details</span>
                    <span class="text-sm font-extrabold text-slate-900" id="calc-dist-display">Awaiting Location</span>
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-slate-600 block">Calculated Total Fare</span>
                    <span class="text-2xl font-black text-amber-600" id="calc-fare-display">—</span>
                  </div>
                </div>
                <p class="text-[11px] text-slate-500 mt-1.5" id="calc-fare-breakdown">*Enter pickup & drop locations above to view live fare</p>
              </div>

              <!-- Quick Book Trigger -->
              <div class="pt-1 flex gap-2">
                <a id="calc-whatsapp-btn" href="${WHATSAPP_URL}" target="_blank" rel="noopener" data-conversion-intent="whatsapp" class="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm text-center flex items-center justify-center gap-2 transition shadow-sm">
                  <span>Book on WhatsApp</span>
                </a>
                <a href="${PHONE_HREF}" data-conversion-intent="call" class="py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm text-center flex items-center justify-center gap-1 transition">
                  <span>Call</span>
                </a>
              </div>

              <!-- Local Landing Area Chips -->
              <div class="pt-4 border-t border-slate-100">
                <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Popular Coimbatore Hubs:</p>
                <div class="flex flex-wrap gap-1.5">
                  <button type="button" class="hub-chip text-[11px] font-semibold bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 px-2.5 py-1 rounded-lg border border-slate-200 transition" data-hub="Gandhipuram Central Bus Stand, Coimbatore">Gandhipuram</button>
                  <button type="button" class="hub-chip text-[11px] font-semibold bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 px-2.5 py-1 rounded-lg border border-slate-200 transition" data-hub="Coimbatore International Airport (CJB)">CJB Airport</button>
                  <button type="button" class="hub-chip text-[11px] font-semibold bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 px-2.5 py-1 rounded-lg border border-slate-200 transition" data-hub="Coimbatore Junction Railway Station (CBE)">Railway Jn</button>
                  <button type="button" class="hub-chip text-[11px] font-semibold bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 px-2.5 py-1 rounded-lg border border-slate-200 transition" data-hub="RS Puram, DB Road, Coimbatore">RS Puram</button>
                  <button type="button" class="hub-chip text-[11px] font-semibold bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 px-2.5 py-1 rounded-lg border border-slate-200 transition" data-hub="Peelamedu, Avinashi Road, Coimbatore">Peelamedu</button>
                  <button type="button" class="hub-chip text-[11px] font-semibold bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 px-2.5 py-1 rounded-lg border border-slate-200 transition" data-hub="Saravanampatti IT Corridor, Coimbatore">Saravanampatti</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Key Fare Highlights / Tariff Overview Grid -->
  <section class="py-16 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Coimbatore Taxi Services & Packages</h2>
        <p class="text-base text-slate-600 mt-2">Dependable call taxi solutions with transparent calculated fares and zero surge pricing.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Card 1: Local City Rides -->
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-amber-400 hover:shadow-md transition">
          <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl mb-4">
            🏙️
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">Local City Cabs</h3>
          <p class="text-xs text-slate-500 mb-4">Gandhipuram, RS Puram, Peelamedu, IT Parks</p>
          <div class="space-y-2 text-sm border-t border-slate-200 pt-3">
            <div class="flex justify-between"><span class="text-slate-600">Doorstep Pickup:</span> <strong class="text-slate-900">15 Mins</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Surge Pricing:</span> <strong class="text-emerald-700 font-bold">ZERO Surge</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Air Conditioning:</span> <strong class="text-slate-900">100% AC Fleet</strong></div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-200">
            <a href="tariffs.html" class="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">View Local Services &rarr;</a>
          </div>
        </div>

        <!-- Card 2: Hourly Rentals -->
        <div class="bg-amber-50/50 rounded-2xl p-6 border-2 border-amber-300 hover:shadow-md transition relative">
          <span class="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">Most Flexible</span>
          <div class="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl mb-4">
            ⏱️
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">Hourly Rentals</h3>
          <p class="text-xs text-slate-500 mb-4">₹350 / hr with 10 KM free per hour</p>
          <div class="space-y-2 text-sm border-t border-amber-200 pt-3">
            <div class="flex justify-between"><span class="text-slate-600">Base Hourly Rate:</span> <strong class="text-slate-900">₹350 / hour</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Included Distance:</span> <strong class="text-emerald-700 font-bold">10 KM Free / hr</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Vehicle Retention:</span> <strong class="text-slate-900">Dedicated Cab</strong></div>
          </div>
          <div class="mt-4 pt-3 border-t border-amber-200">
            <a href="tariffs.html" class="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1">View Rental Packages &rarr;</a>
          </div>
        </div>

        <!-- Card 3: One-Way Drop Taxi -->
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-amber-400 hover:shadow-md transition">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl mb-4">
            🚀
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">One-Way Drop Taxi</h3>
          <p class="text-xs text-slate-500 mb-4">Save 50% on return km across TN & Bangalore</p>
          <div class="space-y-2 text-sm border-t border-slate-200 pt-3">
            <div class="flex justify-between"><span class="text-slate-600">Return KM Fee:</span> <strong class="text-emerald-700 font-bold">ZERO Charge</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Coverage:</span> <strong class="text-slate-900">All South India</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Billing:</span> <strong class="text-slate-900">Drop-only Tolls</strong></div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-200">
            <a href="tariffs.html" class="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">Calculate Drop Fares &rarr;</a>
          </div>
        </div>

        <!-- Card 4: Outstation Round Trips -->
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-amber-400 hover:shadow-md transition">
          <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl mb-4">
            ⛰️
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">Outstation Round Trips</h3>
          <p class="text-xs text-slate-500 mb-4">Ooty, Kodaikanal, Valparai, Munnar Holidays</p>
          <div class="space-y-2 text-sm border-t border-slate-200 pt-3">
            <div class="flex justify-between"><span class="text-slate-600">Mountain Driving:</span> <strong class="text-slate-900">Expert Drivers</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Hill Climbs:</span> <strong class="text-emerald-700 font-bold">Included</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Vehicle Classes:</span> <strong class="text-slate-900">Sedan, SUV, Crysta</strong></div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-200">
            <a href="tours.html" class="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">View Tour Packages &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Popular Fixed Cab Routes Table (Dark High-Contrast Showcase) -->
  <section class="py-16 bg-[#080e1a] text-white border-b border-slate-800 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold mb-2">
            ⭐ Fixed Distance Package Rates
          </div>
          <h2 class="text-3xl font-extrabold text-white tracking-tight">Popular Fixed Cab Routes</h2>
          <p class="text-base text-slate-300 mt-1">Direct point-to-point transfers from Coimbatore with transparent package fares & zero hidden extras.</p>
        </div>
        <a href="tariffs.html" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 text-xs font-bold hover:bg-slate-800 hover:text-amber-300 transition shadow-sm">
          <span>View All 16 Fixed Routes</span>
          <span>&rarr;</span>
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${FIXED_ROUTE_CARDS.slice(0, 6).map(rc => `
        <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xl hover:border-amber-400 hover:shadow-amber-400/10 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-bold text-slate-950 group-hover:text-amber-600 transition-colors">${rc.route}</h3>
              <span class="px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300/80 text-amber-950 font-black text-sm">₹${rc.fare}</span>
            </div>
            <p class="text-xs text-slate-500 font-semibold mb-2 flex items-center gap-1">
              <span class="text-amber-600 font-bold">📍</span> Distance: ${rc.distance}
            </p>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">${rc.description}</p>
            <div class="flex flex-wrap gap-1.5 mb-4">
              ${rc.attractions.map(att => `<span class="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-medium">• ${att}</span>`).join('')}
            </div>
          </div>
          <a href="https://wa.me/91${PHONE_NUMBER}?text=Hello%20Get%20Taxi%20Kovai%2C%20I%20would%20like%20to%20book%20a%20cab%20for%20route%20${encodeURIComponent(rc.route)}%20(Fare%20₹${rc.fare})" target="_blank" rel="noopener" class="block w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-center font-black text-xs shadow-md transition font-syne uppercase tracking-wider">
            Book Route on WhatsApp
          </a>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Featured Holiday Tour Packages -->
  <section class="py-16 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <span class="text-xs font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">Curated Itineraries</span>
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">Hill Station & Spiritual Tours</h2>
        <p class="text-base text-slate-600 mt-2">Private air-conditioned cabs with dedicated drivers for Nilgiris, Isha Yoga, and Tamil Nadu heritage.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${TOUR_PACKAGES.slice(0, 3).map(tour => {
          const pageUrl = TOUR_PAGE_MAP[tour.id] || 'tours.html';
          return `
          <div class="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition flex flex-col">
            <div class="relative h-48 overflow-hidden bg-slate-200">
              <img src="${tour.coverImage}" alt="${tour.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80'" />
              <span class="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs text-amber-400 font-bold text-xs">
                ${tour.durationDays} Day${tour.durationDays > 1 ? 's' : ''} ${tour.durationNights > 0 ? `• ${tour.durationNights} Night` : ''}
              </span>
            </div>
            <div class="p-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 class="text-lg font-bold text-slate-900 leading-snug mb-1">${tour.title}</h3>
                <p class="text-xs text-slate-500 mb-3">${tour.subtitle}</p>
                <div class="space-y-1.5 text-xs text-slate-600 mb-4">
                  ${tour.destinationsCovered.slice(0, 3).map(dest => `<div class="flex items-center gap-1.5"><span class="text-amber-500">✓</span> <span>${dest}</span></div>`).join('')}
                </div>
              </div>
              <div class="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span class="text-[11px] text-slate-500 block">Starting From</span>
                  <span class="text-xl font-black text-slate-900">₹${tour.startingPrice.toLocaleString()}</span>
                </div>
                <a href="${pageUrl}" class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition">
                  View Details &rarr;
                </a>
              </div>
            </div>
          </div>
          `;
        }).join('')}
      </div>

      <div class="text-center mt-10">
        <a href="tours.html" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition">
          <span>Explore All 7 Tour Packages</span>
          <span>&rarr;</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Clean Fleet Showcase (Dark High-Contrast Cards) -->
  <section class="py-16 bg-[#0a1124] text-white border-b border-slate-800 relative overflow-hidden">
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold mb-2">
          🚗 Clean Commercial AC Fleet
        </div>
        <h2 class="text-3xl font-extrabold text-white tracking-tight">Our Well-Maintained Fleet</h2>
        <p class="text-base text-slate-300 mt-2">100% Air-conditioned, sanitized vehicles driven by polite, verified local drivers with ghat road experience.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${VEHICLES.map(v => `
        <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xl hover:border-amber-400 hover:shadow-amber-400/10 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-lg font-bold text-slate-950 group-hover:text-amber-600 transition-colors">${v.name}</h3>
                <p class="text-xs text-slate-500 mt-0.5">${v.models}</p>
              </div>
              <span class="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">👤 ${v.passengers} Seats</span>
            </div>
            <p class="text-xs text-slate-600 mb-4">${v.popularFor}</p>
            <div class="bg-slate-50 rounded-xl p-3.5 space-y-1.5 text-xs border border-slate-200/80 mb-5">
              <div class="flex justify-between"><span class="text-slate-500">One-Way Drop:</span> <strong class="text-slate-950 font-bold">₹${v.ratePerKmOneWay} / KM</strong></div>
              <div class="flex justify-between"><span class="text-slate-500">Round Trip:</span> <strong class="text-slate-950 font-bold">₹${v.ratePerKmRoundTrip} / KM</strong></div>
              <div class="flex justify-between"><span class="text-slate-500">Driver Batta:</span> <strong class="text-slate-700 font-semibold">₹${v.driverBataPerDay} / day</strong></div>
            </div>
          </div>
          <a href="https://wa.me/91${PHONE_NUMBER}?text=Hello%2C%20I%20want%20to%20book%20a%20${encodeURIComponent(v.name)}" target="_blank" rel="noopener" class="block w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs text-center shadow-md transition font-syne uppercase tracking-wider">
            Book ${v.name}
          </a>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Corporate & Executive Travel Solutions -->
  <section class="py-16 bg-slate-900 text-white border-b border-slate-800" id="corporate-travel">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold mb-3">
          🏢 Business Class Mobility
        </div>
        <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight">Corporate & Executive Travel Solutions</h2>
        <p class="text-base text-slate-300 mt-3">Punctual airport transfers, factory and client visits across Coimbatore, Tiruppur, and Erode with 100% transparent pricing and GST invoicing.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:border-amber-400/50 transition">
          <div class="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-2xl font-bold mb-4">🧾</div>
          <h3 class="text-lg font-bold text-white mb-2">GST Tax Invoicing</h3>
          <p class="text-sm text-slate-300">Automated digital tax bills with company GST numbers for hassle-free corporate expense claims and compliance.</p>
        </div>
        <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:border-amber-400/50 transition">
          <div class="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-2xl font-bold mb-4">👔</div>
          <h3 class="text-lg font-bold text-white mb-2">Dedicated Direct Driver</h3>
          <p class="text-sm text-slate-300">Zero call center delays. Direct chauffeur coordination with prompt doorstep reporting 15 mins ahead of pickup.</p>
        </div>
        <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:border-amber-400/50 transition">
          <div class="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-2xl font-bold mb-4">🚘</div>
          <h3 class="text-lg font-bold text-white mb-2">Pristine AC Sedans & SUVs</h3>
          <p class="text-sm text-slate-300">Clean, commercial yellow-board DZire, Etios, and Innova Crysta cabs maintained to the highest hygiene standards.</p>
        </div>
      </div>

      <!-- Pricing Matrix -->
      <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-300 min-w-[600px]">
          <thead>
            <tr class="border-b border-slate-700 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <th class="py-3 px-4">Service Category</th>
              <th class="py-3 px-4">Included Distance & Time</th>
              <th class="py-3 px-4">Base Package Fare</th>
              <th class="py-3 px-4">Extra Distance</th>
              <th class="py-3 px-4">Extra Time</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50 text-xs sm:text-sm">
            <tr>
              <td class="py-3.5 px-4 font-bold text-white">Local Executive Rental</td>
              <td class="py-3.5 px-4">8 Hours / 80 Kms</td>
              <td class="py-3.5 px-4 font-extrabold text-amber-400">₹2,400</td>
              <td class="py-3.5 px-4">₹14 / km</td>
              <td class="py-3.5 px-4">₹150 / hr</td>
            </tr>
            <tr>
              <td class="py-3.5 px-4 font-bold text-white">Airport Executive Transfer</td>
              <td class="py-3.5 px-4">City limits to CJB Airport</td>
              <td class="py-3.5 px-4 font-extrabold text-amber-400">₹699 Flat</td>
              <td class="py-3.5 px-4">Toll extra if any</td>
              <td class="py-3.5 px-4">Free 30m wait</td>
            </tr>
            <tr>
              <td class="py-3.5 px-4 font-bold text-white">Tiruppur / Erode Business Day</td>
              <td class="py-3.5 px-4">12 Hours / 150 Kms</td>
              <td class="py-3.5 px-4 font-extrabold text-amber-400">₹3,200</td>
              <td class="py-3.5 px-4">₹14 / km</td>
              <td class="py-3.5 px-4">₹150 / hr</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mt-8 text-center">
        <a href="https://wa.me/91${PHONE_NUMBER}?text=Hi%2C%20I%20need%20a%20corporate%20cab%20booking%20with%20GST%20invoice." target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition">
          <span>Book Corporate Cab with GST Invoice</span>
          <span>&rarr;</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Customer Reviews / Social Proof -->
  <section class="py-16 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <div class="inline-flex items-center gap-1 text-amber-500 text-sm font-bold mb-2">
          ⭐⭐⭐⭐⭐ 4.9 / 5.0 Star Rating
        </div>
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Trusted by 6,000+ Satisfied Customers</h2>
        <p class="text-base text-slate-600 mt-2">See why Coimbatore chooses Get Taxi Kovai for prompt doorstep pickups, transparent fares, and professional chauffeurs.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        ${INITIAL_REVIEWS.map(r => `
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <div class="text-amber-400 text-sm mb-2">★★★★★</div>
            <h4 class="font-bold text-sm text-slate-900 mb-1">${r.tripTitle}</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">"${r.comment}"</p>
          </div>
          <div class="pt-3 border-t border-slate-200">
            <p class="text-xs font-bold text-slate-900">${r.name}</p>
            <p class="text-[11px] text-slate-500">${r.location}</p>
          </div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Coimbatore Travel & Local Heritage Blog (Home Page Showcase) -->
  <section class="py-16 bg-slate-50 border-b border-slate-200" id="travel-guides">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-900 text-xs font-bold mb-2">
          📖 26 Local Guides & History Articles
        </div>
        <h2 class="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">Coimbatore Travel & Local Heritage Blog</h2>
        <p class="text-base text-slate-600 mt-2">Discover Kongu Nadu history, Nilgiri hill getaways, Isha Yoga routes, Ooty & Valparai road trips, and outstation taxi fare savings.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${BLOG_POSTS.slice(0, 6).map(post => {
          const pageUrl = getBlogFilename(post);
          return `
          <article class="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-amber-400/80 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div class="relative h-48 overflow-hidden bg-slate-100">
                <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" onerror="this.src='${post.fallbackImage || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80'}'" />
                <span class="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs text-amber-400 font-bold text-xs">
                  ${post.category}
                </span>
              </div>
              <div class="p-6">
                <div class="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                  <span>${post.date}</span>
                  <span>•</span>
                  <span>${post.readTime}</span>
                </div>
                <h3 class="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-amber-600 transition-colors">
                  <a href="${pageUrl}">${post.title}</a>
                </h3>
                <p class="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">${post.excerpt}</p>
              </div>
            </div>

            <div class="p-6 pt-0">
              <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div class="flex flex-wrap gap-1">
                  ${post.tags.slice(0, 2).map(tag => `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">${tag}</span>`).join('')}
                </div>
                <a href="${pageUrl}" class="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group-hover:underline">
                  Read Guide &rarr;
                </a>
              </div>
            </div>
          </article>
          `;
        }).join('')}
      </div>

      <div class="text-center mt-12">
        <a href="blog.html" class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition">
          <span>Explore All 26 Travel Guides & Articles</span>
          <span>&rarr;</span>
        </a>
      </div>
    </div>
  </section>

  <!-- FAQ Accordion Section -->
  <section class="py-16 bg-slate-50 border-b border-slate-200">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        <p class="text-base text-slate-600 mt-2">Everything you need to know about booking cabs with Get Taxi Kovai.</p>
      </div>

      <div class="space-y-4">
        ${FAQS.map((faq, idx) => `
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <button type="button" class="faq-toggle w-full p-5 text-left font-bold text-slate-900 flex justify-between items-center hover:bg-slate-50 transition">
            <span>${faq.question}</span>
            <span class="faq-icon text-amber-500 font-extrabold text-xl ml-4">${idx === 0 ? '−' : '+'}</span>
          </button>
          <div class="faq-content p-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 ${idx === 0 ? '' : 'hidden'}">
            ${faq.answer}
          </div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Popular Route Silos (SEO Matrix) -->
  <section class="py-16 bg-white border-b border-slate-200" id="route-silos">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-2">
          🗺️ Direct Outstation & Local Corridors
        </div>
        <h2 class="text-3xl font-black text-slate-950 tracking-tight">Popular Taxi Routes & Fares from Coimbatore</h2>
        <p class="text-base text-slate-600 mt-2">Transparent one-way drop rates and round-trip packages across Tamil Nadu and neighbouring states.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Silo 1 -->
        <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <h3 class="text-base font-black text-slate-900 mb-1 flex items-center gap-1.5">
            <span class="text-amber-500">📍</span> Coimbatore City & Airport
          </h3>
          <p class="text-xs text-slate-500 mb-4">Local transit & CJB terminal dispatches</p>
          <ul class="space-y-2.5 text-xs">
            <li>
              <a href="blog-coimbatore-airport-cjb-taxi-transfer-guide.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Airport Taxi (CJB)</span>
                <span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold text-[10px]">24/7 Pickup</span>
              </a>
            </li>
            <li>
              <a href="tariffs.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Railway Station Drop</span>
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">CBE Junction</span>
              </a>
            </li>
            <li>
              <a href="blog-coimbatore-city-local-hourly-taxi-rental-guide.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Hourly City Rental</span>
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">₹350/hr</span>
              </a>
            </li>
            <li>
              <a href="tour-isha-yoga.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Isha Yoga Adiyogi</span>
                <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">₹1,100</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Silo 2 -->
        <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <h3 class="text-base font-black text-slate-900 mb-1 flex items-center gap-1.5">
            <span class="text-amber-500">🏭</span> Western Hub Drop Taxi
          </h3>
          <p class="text-xs text-slate-500 mb-4">Textile & industrial highway drops</p>
          <ul class="space-y-2.5 text-xs">
            <li>
              <a href="tariffs.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Coimbatore to Pollachi</span>
                <span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold text-[10px]">From ₹1,199</span>
              </a>
            </li>
            <li>
              <a href="blog-coimbatore-to-tiruppur-texvalley-garment-hub-taxi-guide.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Coimbatore to Tiruppur</span>
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">55 km</span>
              </a>
            </li>
            <li>
              <a href="blog-coimbatore-to-erode-salem-highway-cab-rates-turmeric-market.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Coimbatore to Erode</span>
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">100 km</span>
              </a>
            </li>
            <li>
              <a href="blog-coimbatore-to-erode-salem-highway-cab-rates-turmeric-market.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Coimbatore to Salem</span>
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">165 km</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Silo 3 -->
        <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <h3 class="text-base font-black text-slate-900 mb-1 flex items-center gap-1.5">
            <span class="text-amber-500">⛰️</span> Hill Station Getaways
          </h3>
          <p class="text-xs text-slate-500 mb-4">Nilgiri mountain & hairpin bend tours</p>
          <ul class="space-y-2.5 text-xs">
            <li>
              <a href="tour-ooty-coonoor.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Coimbatore to Ooty</span>
                <span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold text-[10px]">Flat ₹3,500</span>
              </a>
            </li>
            <li>
              <a href="tour-kodaikanal.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Coimbatore to Kodaikanal</span>
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">3-Day Tour</span>
              </a>
            </li>
            <li>
              <a href="blog-coonoor-hill-station-tea-tasting-sims-park-cab-sightseeing-guide.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Coimbatore to Coonoor</span>
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">70 km</span>
              </a>
            </li>
            <li>
              <a href="tour-valparai.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Coimbatore to Valparai</span>
                <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">40 Bends</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Silo 4 -->
        <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <h3 class="text-base font-black text-slate-900 mb-1 flex items-center gap-1.5">
            <span class="text-amber-500">🛕</span> South & Central TN Transfers
          </h3>
          <p class="text-xs text-slate-500 mb-4">Temple pilgrimages & highway drops</p>
          <ul class="space-y-2.5 text-xs">
            <li>
              <a href="blog-coimbatore-to-madurai-meenakshi-amman-temple-highway-cab-tour.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Coimbatore to Madurai</span>
                <span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold text-[10px]">215 km</span>
              </a>
            </li>
            <li>
              <a href="tour-palani.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Coimbatore to Palani</span>
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">Murugan Darshan</span>
              </a>
            </li>
            <li>
              <a href="tour-thanjavur.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Coimbatore to Thanjavur</span>
                <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">Big Temple</span>
              </a>
            </li>
            <li>
              <a href="blog-coimbatore-to-bangalore-bengaluru-one-way-drop-taxi-fares-guide.html" class="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition group">
                <span class="font-bold text-slate-800 group-hover:text-amber-600">Coimbatore to Bangalore</span>
                <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">₹15/km</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Banner -->
  <section class="py-16 bg-slate-950 text-white text-center relative overflow-hidden">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Ride? Book Your Cab in 60 Seconds</h2>
      <p class="text-slate-300 text-base max-w-2xl mx-auto">Call or WhatsApp our 24/7 booking desk at <strong>9043743777</strong> for prompt 24/7 doorstep dispatch anywhere in Coimbatore.</p>
      <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
        <a href="tel:${PHONE_NUMBER}" class="px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-base shadow-lg transition">
          📞 Call 9043743777
        </a>
        <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" class="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-lg transition">
          💬 WhatsApp Booking
        </a>
      </div>
    </div>
  </section>

  <!-- Interactive Script for Calculator on Homepage -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {\n      // Coimbatore Coordinates & Hub Matrix for High-Accuracy Distance Fallbacks\n      const COIMBATORE_LOCATIONS = [\n        { key: 'mayileripalayam', name: 'Mayileripalayam', lat: 10.8931, lng: 76.9942 },\n        { key: 'perur', name: 'Perur', lat: 10.9708, lng: 76.9077 },\n        { key: 'selvapuram', name: 'Selvapuram', lat: 10.9856, lng: 76.9388 },\n        { key: 'airport', name: 'Coimbatore Airport (CJB)', lat: 11.0298, lng: 77.0434 },\n        { key: 'cjb', name: 'Coimbatore Airport (CJB)', lat: 11.0298, lng: 77.0434 },\n        { key: 'peelamedu', name: 'Peelamedu', lat: 11.0240, lng: 77.0120 },\n        { key: 'railway', name: 'Coimbatore Railway Junction', lat: 10.9998, lng: 76.9634 },\n        { key: 'junction', name: 'Coimbatore Railway Junction', lat: 10.9998, lng: 76.9634 },\n        { key: 'station', name: 'Coimbatore Railway Junction', lat: 10.9998, lng: 76.9634 },\n        { key: 'gandhipuram', name: 'Gandhipuram', lat: 11.0183, lng: 76.9644 },\n        { key: 'rs puram', name: 'RS Puram', lat: 11.0084, lng: 76.9458 },\n        { key: 'r.s. puram', name: 'RS Puram', lat: 11.0084, lng: 76.9458 },\n        { key: 'saravanampatti', name: 'Saravanampatti', lat: 11.0797, lng: 76.9997 },\n        { key: 'singanallur', name: 'Singanallur', lat: 10.9972, lng: 77.0250 },\n        { key: 'ukkadam', name: 'Ukkadam', lat: 10.9880, lng: 76.9610 },\n        { key: 'vadavalli', name: 'Vadavalli', lat: 11.0242, lng: 76.8998 },\n        { key: 'thudiyalur', name: 'Thudiyalur', lat: 11.0805, lng: 76.9392 },\n        { key: 'kovaipudur', name: 'Kovaipudur', lat: 10.9328, lng: 76.9381 },\n        { key: 'podanur', name: 'Podanur', lat: 10.9636, lng: 76.9961 },\n        { key: 'eachanari', name: 'Eachanari', lat: 10.9348, lng: 76.9757 },\n        { key: 'malumichampatti', name: 'Malumichampatti', lat: 10.9150, lng: 76.9850 },\n        { key: 'kinathukadavu', name: 'Kinathukadavu', lat: 10.8173, lng: 77.0195 },\n        { key: 'pollachi', name: 'Pollachi', lat: 10.6609, lng: 77.0048 },\n        { key: 'mettupalayam', name: 'Mettupalayam', lat: 11.3005, lng: 76.9450 },\n        { key: 'karamadai', name: 'Karamadai', lat: 11.2427, lng: 76.9587 },\n        { key: 'sulur', name: 'Sulur', lat: 11.0287, lng: 77.1264 },\n        { key: 'annur', name: 'Annur', lat: 11.2335, lng: 77.1352 },\n        { key: 'marudhamalai', name: 'Marudhamalai', lat: 11.0456, lng: 76.8523 },\n        { key: 'isha', name: 'Isha Yoga Center', lat: 10.9763, lng: 76.7344 },\n        { key: 'adiyogi', name: 'Isha Yoga Adiyogi', lat: 10.9763, lng: 76.7344 },\n        { key: 'ooty', name: 'Ooty', lat: 11.4102, lng: 76.6950 },\n        { key: 'coonoor', name: 'Coonoor', lat: 11.3530, lng: 76.7959 },\n        { key: 'kodaikanal', name: 'Kodaikanal', lat: 10.2381, lng: 77.4892 },\n        { key: 'valparai', name: 'Valparai', lat: 10.3267, lng: 76.9554 },\n        { key: 'palani', name: 'Palani', lat: 10.4504, lng: 77.5186 },\n        { key: 'munnar', name: 'Munnar', lat: 10.0889, lng: 77.0595 },\n        { key: 'bangalore', name: 'Bangalore', lat: 12.9716, lng: 77.5946 },\n        { key: 'bengaluru', name: 'Bangalore', lat: 12.9716, lng: 77.5946 },\n        { key: 'chennai', name: 'Chennai', lat: 13.0827, lng: 80.2707 },\n        { key: 'salem', name: 'Salem', lat: 11.6643, lng: 78.1460 },\n        { key: 'tiruppur', name: 'Tiruppur', lat: 11.1085, lng: 77.3411 },\n        { key: 'erode', name: 'Erode', lat: 11.3410, lng: 77.7172 },\n        { key: 'madurai', name: 'Madurai', lat: 9.9252, lng: 78.1198 },\n        { key: 'trichy', name: 'Trichy', lat: 10.7905, lng: 78.7047 }\n      ];\n\n      // Exact verified road distances between primary Coimbatore corridors\n      const ROUTE_PAIR_OVERRIDES = {\n        'airport-perur': 19,\n        'perur-airport': 19,\n        'airport-selvapuram': 14,\n        'selvapuram-airport': 14,\n        'mayileripalayam-railway': 19,\n        'railway-mayileripalayam': 19,\n        'mayileripalayam-station': 19,\n        'station-mayileripalayam': 19,\n        'mayileripalayam-junction': 19,\n        'junction-mayileripalayam': 19,\n        'mayileripalayam-gandhipuram': 21,\n        'gandhipuram-mayileripalayam': 21,\n        'mayileripalayam-airport': 24,\n        'airport-mayileripalayam': 24,\n        'mayileripalayam-perur': 16,\n        'perur-mayileripalayam': 16,\n        'mayileripalayam-selvapuram': 14,\n        'selvapuram-mayileripalayam': 14,\n        'airport-railway': 12,\n        'railway-airport': 12,\n        'airport-gandhipuram': 11,\n        'gandhipuram-airport': 11,\n        'airport-rspuram': 14,\n        'rspuram-airport': 14,\n        'perur-gandhipuram': 9,\n        'gandhipuram-perur': 9,\n        'selvapuram-gandhipuram': 6,\n        'gandhipuram-selvapuram': 6,\n        'isha-airport': 40,\n        'airport-isha': 40,\n        'isha-gandhipuram': 30,\n        'gandhipuram-isha': 30,\n        'ooty-coimbatore': 86,\n        'coimbatore-ooty': 86\n      };\n\n      let activeRideType = 'local';\n      let activeVehicle = 'suv'; // 'suv' = Family SUV Ertiga, 'crysta' = Innova Crysta\n      let currentDrivingKm = null;\n      let pickupCoords = null;\n      let dropCoords = null;\n\n      const tabs = document.querySelectorAll('#ride-type-tabs .tab-btn');\n      const pickupInput = document.getElementById('calc-pickup');\n      const dropContainer = document.getElementById('drop-container');\n      const dropInput = document.getElementById('calc-drop');\n      const lblDrop = document.getElementById('lbl-drop');\n      const hourlyContainer = document.getElementById('hourly-container');\n      const hourlyPkgSelect = document.getElementById('calc-hourly-pkg');\n      const outstationContainer = document.getElementById('outstation-container');\n      const daysSelect = document.getElementById('calc-days');\n      const distLabel = document.getElementById('calc-dist-label');\n      const distDisp = document.getElementById('calc-dist-display');\n      const fareDisp = document.getElementById('calc-fare-display');\n      const breakdownDisp = document.getElementById('calc-fare-breakdown');\n      const whatsappBtn = document.getElementById('calc-whatsapp-btn');\n      const vehSelect = document.getElementById('calc-vehicle');\n      if (vehSelect) {\n        vehSelect.addEventListener('change', updateCalculation);\n      }\n\n      function switchTab(type) {\n        activeRideType = type;\n        tabs.forEach(t => {\n          if (t.dataset.type === type) {\n            t.classList.add('bg-white', 'text-slate-900', 'shadow-xs');\n            t.classList.remove('text-slate-600');\n          } else {\n            t.classList.remove('bg-white', 'text-slate-900', 'shadow-xs');\n            t.classList.add('text-slate-600');\n          }\n        });\n\n        if (type === 'local') {\n          dropContainer.classList.remove('hidden');\n          lblDrop.textContent = 'Drop Location in Coimbatore';\n          dropInput.placeholder = 'Enter Drop Location in Coimbatore';\n          hourlyContainer.classList.add('hidden');\n          outstationContainer.classList.add('hidden');\n        } else if (type === 'hourly') {\n          dropContainer.classList.add('hidden');\n          hourlyContainer.classList.remove('hidden');\n          outstationContainer.classList.add('hidden');\n        } else if (type === 'oneway') {\n          dropContainer.classList.remove('hidden');\n          lblDrop.textContent = 'Destination / Drop City';\n          dropInput.placeholder = 'Enter Outstation Drop City (e.g. Ooty, Chennai, Bangalore)';\n          hourlyContainer.classList.add('hidden');\n          outstationContainer.classList.add('hidden');\n        } else if (type === 'outstation') {\n          dropContainer.classList.remove('hidden');\n          lblDrop.textContent = 'Outstation Destination';\n          dropInput.placeholder = 'Enter Outstation Destination';\n          hourlyContainer.classList.add('hidden');\n          outstationContainer.classList.remove('hidden');\n        }\n\n        requestRealDistance();\n      }\n\n      // Helper: Haversine distance with real-world road winding factor\n      function getHaversineDrivingKm(lat1, lon1, lat2, lon2) {\n        const R = 6371;\n        const dLat = (lat2 - lat1) * Math.PI / 180;\n        const dLon = (lon2 - lon1) * Math.PI / 180;\n        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +\n                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *\n                  Math.sin(dLon / 2) * Math.sin(dLon / 2);\n        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));\n        const straight = R * c;\n        // Coimbatore urban/suburban road curvature multiplier is ~1.28x\n        return Math.max(2, Math.round(straight * 1.28));\n      }\n\n      // Match freeform text to Coimbatore location registry\n      function findLocationInText(text) {\n        if (!text) return null;\n        const lower = text.toLowerCase().replace(/[^a-z0-9]/g, ' ');\n        for (const loc of COIMBATORE_LOCATIONS) {\n          if (lower.includes(loc.key)) return loc;\n        }\n        return null;\n      }\n\n      // Check route pair overrides for exact known Coimbatore journeys\n      function getOverrideKm(pText, dText) {\n        const pLoc = findLocationInText(pText);\n        const dLoc = findLocationInText(dText);\n        if (pLoc && dLoc) {\n          const directKey = pLoc.key + '-' + dLoc.key;\n          if (ROUTE_PAIR_OVERRIDES[directKey]) {\n            return ROUTE_PAIR_OVERRIDES[directKey];\n          }\n          // Compute using exact coordinates\n          return getHaversineDrivingKm(pLoc.lat, pLoc.lng, dLoc.lat, dLoc.lng);\n        }\n        // Fallback for long outstation cities\n        if (dLoc && ['ooty', 'coonoor', 'kodaikanal', 'valparai', 'palani', 'munnar', 'bangalore', 'bengaluru', 'chennai', 'salem', 'tiruppur', 'erode', 'madurai', 'trichy', 'pollachi', 'mettupalayam'].includes(dLoc.key)) {\n          const COV_CENTER = { lat: 11.0168, lng: 76.9558 };\n          return getHaversineDrivingKm(COV_CENTER.lat, COV_CENTER.lng, dLoc.lat, dLoc.lng);\n        }\n        return null;\n      }\n\n      // Real Google Maps Distance Matrix / Directions resolver\n      let debounceTimer = null;\n      function requestRealDistance() {\n        clearTimeout(debounceTimer);\n        debounceTimer = setTimeout(() => {\n          calculateDistanceWithGoogleMaps();\n        }, 150);\n      }\n\n      function calculateDistanceWithGoogleMaps() {\n        const pText = (pickupInput.value || '').trim();\n        const dText = (dropInput.value || '').trim();\n\n        if (activeRideType === 'hourly') {\n          updateCalculation();\n          return;\n        }\n\n        if (!pText || !dText) {\n          currentDrivingKm = null;\n          updateCalculation();\n          return;\n        }\n\n        // 1. Check known pair overrides first for instantaneous display\n        const knownKm = getOverrideKm(pText, dText);\n        if (knownKm) {\n          currentDrivingKm = knownKm;\n        }\n\n        // 2. Query Google Maps DistanceMatrixService if available\n        if (window.google && window.google.maps && window.google.maps.DistanceMatrixService) {\n          try {\n            const matrix = new google.maps.DistanceMatrixService();\n            const originParam = pickupCoords \n              ? new google.maps.LatLng(pickupCoords.lat, pickupCoords.lng) \n              : (pText.includes('Tamil Nadu') ? pText : pText + ', Coimbatore, Tamil Nadu, India');\n            const destParam = dropCoords \n              ? new google.maps.LatLng(dropCoords.lat, dropCoords.lng) \n              : (dText.includes('Tamil Nadu') ? dText : dText + ', Coimbatore, Tamil Nadu, India');\n\n            matrix.getDistanceMatrix({\n              origins: [originParam],\n              destinations: [destParam],\n              travelMode: google.maps.TravelMode.DRIVING,\n              unitSystem: google.maps.UnitSystem.METRIC,\n            }, (response, status) => {\n              if (status === 'OK' && response && response.rows && response.rows[0] && response.rows[0].elements && response.rows[0].elements[0] && response.rows[0].elements[0].status === 'OK') {\n                const meters = response.rows[0].elements[0].distance.value;\n                currentDrivingKm = Math.max(1, Math.round(meters / 1000));\n                updateCalculation();\n              } else {\n                // Fallback to DirectionsService\n                tryDirectionsService(originParam, destParam);\n              }\n            });\n            return;\n          } catch(err) {\n            console.log('DistanceMatrix fallback:', err);\n          }\n        }\n\n        // If Google Maps not available or error, calculate from coords or knownKm\n        if (pickupCoords && dropCoords) {\n          currentDrivingKm = getHaversineDrivingKm(pickupCoords.lat, pickupCoords.lng, dropCoords.lat, dropCoords.lng);\n        } else if (!currentDrivingKm) {\n          currentDrivingKm = activeRideType === 'local' ? 12 : 130;\n        }\n        updateCalculation();\n      }\n\n      function tryDirectionsService(origin, dest) {\n        if (window.google && window.google.maps && window.google.maps.DirectionsService) {\n          const dir = new google.maps.DirectionsService();\n          dir.route({\n            origin: origin,\n            destination: dest,\n            travelMode: google.maps.TravelMode.DRIVING\n          }, (res, status) => {\n            if (status === 'OK' && res && res.routes && res.routes[0] && res.routes[0].legs && res.routes[0].legs[0]) {\n              const meters = res.routes[0].legs[0].distance.value;\n              currentDrivingKm = Math.max(1, Math.round(meters / 1000));\n            }\n            updateCalculation();\n          });\n        } else {\n          updateCalculation();\n        }\n      }\n\n      function updateCalculation() {\n        const vehSelect = document.getElementById('calc-vehicle');\n        const activeVehicle = vehSelect ? vehSelect.value : 'sedan';\n        const pickupText = (pickupInput.value || '').trim();\n        const dropText = (dropInput.value || '').trim();\n        const isCrysta = activeVehicle === 'crysta';\n        const isSedan = activeVehicle === 'sedan';\n        const vehName = isCrysta \n          ? 'Innova Crysta - 7 Seater Luxury AC' \n          : (isSedan ? 'Executive Sedan (Dzire / Etios) - 4 Seater AC' : 'Family SUV (Ertiga) - 6 Seater AC');\n\n        let distText = '';\n        let estimatedFare = 0;\n        let breakdownText = '';\n        let bookingSummary = '';\n\n        if (activeRideType === 'local') {\n          distLabel.textContent = 'Trip Coverage';\n          if (!pickupText || !dropText) {\n            distDisp.textContent = !pickupText && !dropText ? 'Awaiting Location' : (!pickupText ? 'Enter Pickup' : 'Enter Drop');\n            fareDisp.textContent = '—';\n            breakdownDisp.textContent = '*Type pickup & drop address using Google autocomplete to calculate exact fare';\n            const msg = encodeURIComponent(\n              'Hello Get Taxi Kovai, I want to book a cab in Coimbatore:\n\n' +\n              '• Trip: Local Ride\n' +\n              (pickupText ? '• Pickup: ' + pickupText + '\n' : '') +\n              (dropText ? '• Drop: ' + dropText + '\n' : '') +\n              '• Vehicle: ' + vehName + '\n\n' +\n              (isCrysta ? 'Please share the best price quote for Innova Crysta.' : 'Please confirm booking & 10 mins pickup.')\n            );\n            whatsappBtn.href = 'https://wa.me/919043743777?text=' + msg;\n            return;\n          }\n\n          const km = currentDrivingKm || 12;\n          distText = '~' + km + ' KM Local';\n          bookingSummary = 'Local Ride from ' + pickupText + ' to ' + dropText;\n\n          if (isCrysta) {\n            breakdownText = '*Premium 7-Seater Toyota Innova Crysta AC • Call or WhatsApp for guaranteed best custom quote!';\n          } else if (isSedan) {\n            // Executive Sedan (Dzire/Etios): Base ₹80 + ₹26/km\n            estimatedFare = Math.round(80 + (km * 26));\n            breakdownText = '*Executive Sedan (Dzire / Etios - 4 Seater AC) • Fast doorstep pickup across Coimbatore • Zero surge • 100% AC';\n          } else {\n            // Family SUV (Ertiga 6-Seater): Base ₹100 + ₹40/km\n            estimatedFare = Math.round(100 + (km * 40));\n            breakdownText = '*Family SUV (Ertiga 6-Seater AC) • Base fare ₹100 + ₹40/km • Zero surge • 100% AC';\n          }\n        } else if (activeRideType === 'hourly') {\n          distLabel.textContent = 'Rental Package';\n          const hours = parseInt(hourlyPkgSelect.value, 10) || 4;\n          const freeKm = hours * 10;\n          distText = hours + ' Hours (' + freeKm + ' KM Free)';\n          bookingSummary = 'Hourly Rental (' + hours + ' Hours / ' + freeKm + ' KM Free) from ' + (pickupText || 'Coimbatore');\n\n          if (!pickupText) {\n            distDisp.textContent = distText;\n            fareDisp.textContent = isCrysta ? 'Contact Us for Best Price' : '—';\n            breakdownDisp.textContent = '*Enter pickup location in Coimbatore to view package booking details';\n            const msg = encodeURIComponent(\n              'Hello Get Taxi Kovai, I want to book an hourly rental cab (' + hours + ' Hours / ' + freeKm + ' KM Free) in Coimbatore.\n' +\n              '• Vehicle: ' + vehName + '\n\n' +\n              (isCrysta ? 'Please share best package price quote for Innova Crysta.' : 'Please confirm driver availability.')\n            );\n            whatsappBtn.href = 'https://wa.me/919043743777?text=' + msg;\n            return;\n          }\n\n          if (isCrysta) {\n            breakdownText = '*Innova Crysta 7-Seater Luxury Hourly Rental • Contact us for exclusive package pricing';\n          } else if (isSedan) {\n            // Executive Sedan: ₹350/hr package\n            estimatedFare = hours * 350;\n            breakdownText = '*₹350/hr with 10 KM free per hour included • Dedicated Executive AC Sedan';\n          } else {\n            // Family SUV (Ertiga): ₹400/hr package\n            estimatedFare = hours * 400;\n            breakdownText = '*₹400/hr with 10 KM free per hour included • Dedicated 6-seater AC SUV';\n          }\n        } else if (activeRideType === 'oneway') {\n          distLabel.textContent = 'One-Way Distance';\n          if (!dropText || !pickupText) {\n            distDisp.textContent = !dropText ? 'Enter Destination City' : 'Enter Pickup Location';\n            fareDisp.textContent = '—';\n            breakdownDisp.textContent = '*Enter pickup location and destination city to calculate one-way trip';\n            const msg = encodeURIComponent(\n              'Hello Get Taxi Kovai, I want to book a one-way drop cab:\n\n' +\n              (pickupText ? '• Pickup: ' + pickupText + '\n' : '') +\n              (dropText ? '• Destination: ' + dropText + '\n' : '') +\n              '• Vehicle: ' + vehName + '\n\n' +\n              (isCrysta ? 'Please provide best discounted price quote for Innova Crysta.' : 'Please provide one-way fare quote and confirm.')\n            );\n            whatsappBtn.href = 'https://wa.me/919043743777?text=' + msg;\n            return;\n          }\n\n          const km = currentDrivingKm || 130;\n          const chargedKm = Math.max(km, 130);\n          distText = chargedKm + ' KM Coverage';\n          bookingSummary = 'One-Way Drop to ' + dropText + ' from ' + pickupText;\n\n          if (isCrysta) {\n            breakdownText = '*Toyota Innova Crysta Luxury One-Way Drop • Contact us for guaranteed best rates';\n          } else if (isSedan) {\n            // Executive Sedan: ₹15/km (min 130 km) + ₹500 batta\n            estimatedFare = (chargedKm * 15) + 500;\n            breakdownText = '*One-way Sedan tariff: ₹15/km (min 130 km coverage) + ₹500 driver batta • Zero return fee';\n          } else {\n            // Family SUV (Ertiga): ₹18/km (min 130 km) + ₹500 batta\n            estimatedFare = (chargedKm * 18) + 500;\n            breakdownText = '*One-way SUV tariff: ₹18/km (min 130 km coverage) + ₹500 driver batta • Zero return fee';\n          }\n        } else if (activeRideType === 'outstation') {\n          distLabel.textContent = 'Round Trip Total';\n          const days = parseInt(daysSelect.value, 10) || 2;\n          if (!dropText || !pickupText) {\n            distDisp.textContent = !dropText ? 'Enter Destination' : 'Enter Pickup Location';\n            fareDisp.textContent = '—';\n            breakdownDisp.textContent = '*Enter pickup location and outstation destination to calculate tour';\n            const msg = encodeURIComponent(\n              'Hello Get Taxi Kovai, I want to book an outstation round trip:\n\n' +\n              '• Trip: Outstation Round Trip (' + days + ' Days)\n' +\n              (pickupText ? '• Pickup: ' + pickupText + '\n' : '') +\n              (dropText ? '• Destination: ' + dropText + '\n' : '') +\n              '• Vehicle: ' + vehName + '\n\n' +\n              (isCrysta ? 'Please share best package quote for Innova Crysta.' : 'Please provide round trip fare quote.')\n            );\n            whatsappBtn.href = 'https://wa.me/919043743777?text=' + msg;\n            return;\n          }\n\n          const km = currentDrivingKm || 130;\n          const totalKm = Math.max(km * 2, days * 250);\n          distText = totalKm + ' KM (' + days + ' Days)';\n          bookingSummary = 'Outstation Tour to ' + dropText + ' (' + days + ' Days) from ' + pickupText;\n\n          if (isCrysta) {\n            breakdownText = '*Innova Crysta 7-Seater Luxury Tour • Ghat road driving included • Call/WhatsApp for best price';\n          } else if (isSedan) {\n            // Executive Sedan: ₹15/km + ₹500/day batta\n            estimatedFare = Math.round((totalKm * 15) + (days * 500));\n            breakdownText = '*Includes ' + days + ' days round trip travel in 4-seater AC Sedan • Professional chauffeur';\n          } else {\n            // Family SUV (Ertiga): ₹18/km + ₹500/day batta\n            estimatedFare = Math.round((totalKm * 18) + (days * 500));\n            breakdownText = '*Includes ' + days + ' days round trip travel in 6-seater AC Ertiga SUV • Professional chauffeur';\n          }\n        }\n\n        distDisp.textContent = distText;\n\n        // Pricing Display Logic: Strictly HIDE price for Innova Crysta!\n        if (isCrysta) {\n          fareDisp.innerHTML = '<span class="text-sm sm:text-base font-black text-amber-600 block leading-tight">Contact Us for Best Price</span>';\n        } else {\n          fareDisp.textContent = '₹' + estimatedFare.toLocaleString('en-IN') + '*';\n        }\n        breakdownDisp.textContent = breakdownText;\n\n        const msgText = isCrysta\n          ? 'Hello Get Taxi Kovai, I want to book an Innova Crysta (7-Seater Luxury AC):\n\n' +\n            '• Trip: ' + (bookingSummary || 'Call Taxi In Coimbatore') + '\n' +\n            '• Pickup: ' + (pickupText || 'Coimbatore Doorstep') + '\n' +\n            '• Drop: ' + (dropText || 'As requested') + '\n' +\n            (distText ? '• Distance/Duration: ' + distText + '\n' : '') +\n            '• Vehicle: Innova Crysta (7-Seater Luxury AC)\n\n' +\n            'Please share your best discounted price and confirm driver availability.'\n          : 'Hello Get Taxi Kovai, I want to book a taxi:\n\n' +\n            '• Trip: ' + (bookingSummary || 'Call Taxi In Coimbatore') + '\n' +\n            '• Pickup: ' + (pickupText || 'Coimbatore Doorstep') + '\n' +\n            '• Drop: ' + (dropText || 'As requested') + '\n' +\n            (distText ? '• Coverage: ' + distText + '\n' : '') +\n            '• Vehicle: ' + vehName + '\n' +\n            '• Estimated Fare: ₹' + estimatedFare.toLocaleString('en-IN') + '\n\n' +\n            'Please confirm driver availability and prompt doorstep pickup.';\n\n        whatsappBtn.href = 'https://wa.me/919043743777?text=' + encodeURIComponent(msgText);\n      }\n\n      tabs.forEach(tab => {\n        tab.addEventListener('click', () => {\n          switchTab(tab.dataset.type);\n        });\n      });\n\n      pickupInput.addEventListener('input', () => {\n        pickupCoords = null;\n        requestRealDistance();\n      });\n      dropInput.addEventListener('input', () => {\n        dropCoords = null;\n        requestRealDistance();\n      });\n      hourlyPkgSelect.addEventListener('change', updateCalculation);\n      daysSelect.addEventListener('change', requestRealDistance);\n\n      // Hub chips handler with instant exact coordinate binding\n      document.querySelectorAll('.hub-chip').forEach(chip => {\n        chip.addEventListener('click', () => {\n          const hub = chip.dataset.hub;\n          const loc = findLocationInText(hub);\n          if (!pickupInput.value) {\n            pickupInput.value = hub;\n            if (loc) pickupCoords = { lat: loc.lat, lng: loc.lng };\n          } else {\n            dropInput.value = hub;\n            if (loc) dropCoords = { lat: loc.lat, lng: loc.lng };\n          }\n          requestRealDistance();\n        });\n      });\n\n      // Initialize Google Places Autocomplete with geometry extraction\n      function initGooglePlaces() {\n        if (window.google && window.google.maps && window.google.maps.places) {\n          try {\n            const pAuto = new google.maps.places.Autocomplete(pickupInput, {\n              componentRestrictions: { country: 'in' },\n              fields: ['formatted_address', 'name', 'geometry']\n            });\n            pAuto.addListener('place_changed', () => {\n              const p = pAuto.getPlace();\n              if (p) {\n                pickupInput.value = p.formatted_address || p.name || pickupInput.value;\n                if (p.geometry && p.geometry.location) {\n                  pickupCoords = { lat: p.geometry.location.lat(), lng: p.geometry.location.lng() };\n                }\n                requestRealDistance();\n              }\n            });\n\n            const dAuto = new google.maps.places.Autocomplete(dropInput, {\n              componentRestrictions: { country: 'in' },\n              fields: ['formatted_address', 'name', 'geometry']\n            });\n            dAuto.addListener('place_changed', () => {\n              const p = dAuto.getPlace();\n              if (p) {\n                dropInput.value = p.formatted_address || p.name || dropInput.value;\n                if (p.geometry && p.geometry.location) {\n                  dropCoords = { lat: p.geometry.location.lat(), lng: p.geometry.location.lng() };\n                }\n                requestRealDistance();\n              }\n            });\n          } catch(e) { console.log('Places Autocomplete ready'); }\n        } else {\n          setTimeout(initGooglePlaces, 300);\n        }\n      }\n      initGooglePlaces();\n\n      // Initial run\n      switchTab('local');
    });
  </script>
  `;

  return generateHtmlPage({
    title: 'Call Taxi In Coimbatore | Get Taxi Kovai 9043743777 | Fast Pickup',
    description: 'Book Call Taxi In Coimbatore with Get Taxi Kovai. Prompt doorstep pickup across Coimbatore, 6,000+ satisfied customers, Hourly rentals at ₹350/hr with 10km free, and One-Way drops at ₹15/km. Call 9043743777!',
    keywords: 'Call Taxi In Coimbatore, Get Taxi Kovai, taxi in Coimbatore, Coimbatore airport cab, Ooty drop taxi, outstation cabs Coimbatore, hourly rental cab Coimbatore, Kovai call taxi 9043743777',
    canonicalUrl: `${SITE_URL}/`,
    activeNav: 'home',
    bodyContent,
    schemaJson: schema
  });
}

// ==========================================
// 2. GENERATE TARIFFS.HTML (TARIFFS & RATE CARD)
// ==========================================
function generateTariffsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Call Taxi In Coimbatore Tariffs & Rate Card - Get Taxi Kovai",
    "description": "Transparent One-Way taxi tariff at ₹15 per km, minimum 130 km coverage, and ₹500 driver batta. Hourly rentals at ₹350/hr with 10 km free per hour.",
    "url": `${SITE_URL}/tariffs.html`
  };

  const bodyContent = `
  <section class="bg-slate-900 text-white py-14 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span class="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">100% Transparent Billing</span>
      <h1 class="text-4xl sm:text-5xl font-black tracking-tight mt-3 text-white">Call Taxi In Coimbatore - Tariff Details</h1>
      <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mt-3">Upfront transparent pricing, fast doorstep pickup across Coimbatore, and 6,000+ satisfied customers.</p>
    </div>
  </section>

  <!-- Official One-Way Drop Taxi Tariff Card (Explicitly Disclosed) -->
  <section class="py-14 bg-white border-b border-slate-200">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 sm:p-10 text-slate-950 shadow-xl border border-amber-400">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/10 border border-slate-950/20 text-slate-950 text-xs font-black uppercase tracking-wider mb-4">
          <span>⭐ Official Tariff Card</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">One-Way Drop Taxi Tariff</h2>
        <p class="text-sm sm:text-base text-slate-900 mt-2 font-medium">Clear, upfront rates for intercity one-way drops across Tamil Nadu, Kerala, and Karnataka with zero return kilometer fees.</p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 bg-white/90 backdrop-blur-xs p-6 rounded-2xl border border-amber-300 shadow-sm text-center">
          <div class="p-3">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-600 block">Rate Per KM</span>
            <span class="text-3xl sm:text-4xl font-black text-amber-600 mt-1 block">₹15 <span class="text-base font-bold text-slate-700">/ KM</span></span>
            <span class="text-[11px] text-slate-500 mt-1 block">Clean AC Sedan / Cab</span>
          </div>
          <div class="p-3 border-y sm:border-y-0 sm:border-x border-slate-200">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-600 block">Minimum Coverage</span>
            <span class="text-3xl sm:text-4xl font-black text-slate-950 mt-1 block">130 <span class="text-base font-bold text-slate-700">KM</span></span>
            <span class="text-[11px] text-slate-500 mt-1 block">Direct one-way drop</span>
          </div>
          <div class="p-3">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-600 block">Driver Batta</span>
            <span class="text-3xl sm:text-4xl font-black text-emerald-700 mt-1 block">₹500</span>
            <span class="text-[11px] text-slate-500 mt-1 block">Per trip fixed batta</span>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-amber-400/60 text-xs sm:text-sm font-semibold text-slate-900">
          <div class="flex items-center gap-2">
            <span>✓ Minimum Starting Fare: <strong>₹2,450</strong> (130 KM × ₹15 + ₹500 Batta)</span>
          </div>
          <div class="flex items-center gap-2">
            <span>✓ Fast 10-Min Doorstep Pickup across Coimbatore</span>
          </div>
        </div>

        <div class="mt-8 flex flex-wrap gap-3">
          <a href="https://wa.me/91${PHONE_NUMBER}?text=Hello%20Get%20Taxi%20Kovai%2C%20I%20want%20to%20book%20a%20One-Way%20Drop%20Taxi%20at%20₹15/km" target="_blank" rel="noopener" class="flex-1 py-4 px-6 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm text-center shadow-lg transition">
            Book One-Way Taxi on WhatsApp
          </a>
          <a href="tel:${PHONE_NUMBER}" class="py-4 px-6 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm text-center shadow-sm transition">
            Call 9043743777
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Service Categories & Fleet Overview (Dark High-Contrast Showcase) -->
  <section class="py-14 bg-[#0a1124] text-white border-b border-slate-800 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="mb-8 text-center max-w-3xl mx-auto">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold mb-2">
          🚗 Clean Commercial AC Fleet
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Fleet & Service Options</h2>
        <p class="text-sm text-slate-300 mt-1">Book clean, air-conditioned vehicles with professional chauffeurs. Instant automatic quote on WhatsApp.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${VEHICLES.map(v => {
          return `
          <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xl flex flex-col justify-between hover:border-amber-400 hover:shadow-amber-400/10 transition-all duration-300 group">
            <div>
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="text-lg font-black text-slate-950 group-hover:text-amber-600 transition-colors">${v.name}</h3>
                  <p class="text-xs text-slate-500 mt-0.5">${v.models}</p>
                </div>
                <span class="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold">100% AC</span>
              </div>
              <ul class="space-y-2 text-xs text-slate-600 mt-4 mb-6">
                <li class="flex items-center gap-2"><span class="text-amber-500 font-bold">✓</span> <span>Capacity: <strong class="text-slate-900">${v.passengers} Passengers + ${v.luggage} Bags</strong></span></li>
                <li class="flex items-center gap-2"><span class="text-amber-500 font-bold">✓</span> <span>Fast 10-min doorstep pickup</span></li>
                <li class="flex items-center gap-2"><span class="text-amber-500 font-bold">✓</span> <span>Zero surge pricing policy</span></li>
                <li class="flex items-center gap-2"><span class="text-amber-500 font-bold">✓</span> <span>Hourly rental at ₹350/hr with 10 km free</span></li>
              </ul>
            </div>
            <a href="https://wa.me/91${PHONE_NUMBER}?text=Hello%20Get%20Taxi%20Kovai%2C%20I%20want%20to%20get%20a%20fare%20quote%20for%20a%20${encodeURIComponent(v.name)}" target="_blank" rel="noopener" class="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs text-center shadow-md transition font-syne uppercase tracking-wider">
              Get Instant Quote on WhatsApp
            </a>
          </div>
          `;
        }).join('')}
      </div>
    </div>
  </section>

  <!-- Complete 16 Fixed Route Tariff Cards (Dark High-Contrast Showcase) -->
  <section class="py-14 bg-[#080e1a] text-white border-b border-slate-800 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center max-w-3xl mx-auto mb-10">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold mb-2">
          ⭐ Fixed Point-to-Point Package Fares
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">16 Fixed Point-to-Point Package Fares</h2>
        <p class="text-sm text-slate-300 mt-1">Transparent package rates with doorstep pickup across Coimbatore.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        ${FIXED_ROUTE_CARDS.map(rc => `
        <div class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xl hover:border-amber-400 hover:shadow-amber-400/10 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-slate-950 group-hover:text-amber-600 transition-colors text-base">${rc.route}</h3>
              <span class="px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300/80 text-amber-950 font-extrabold text-sm">₹${rc.fare}</span>
            </div>
            <p class="text-xs text-slate-500 font-medium mb-2">Distance: ${rc.distance}</p>
            <p class="text-xs text-slate-600 leading-relaxed mb-3">${rc.description}</p>
          </div>
          <a href="https://wa.me/91${PHONE_NUMBER}?text=Hello%20Get%20Taxi%20Kovai%2C%20I%20want%20to%20book%20the%20${encodeURIComponent(rc.route)}%20cab%20package%20(Fare%20₹${rc.fare})" target="_blank" rel="noopener" class="block w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-center font-bold text-xs shadow-md transition font-syne uppercase tracking-wider">
            Book Route on WhatsApp
          </a>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Tariff Rules & Policies -->
  <section class="py-14 bg-slate-50 border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center max-w-3xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Tariff Policy & Booking Rules</h2>
        <p class="text-sm text-slate-600 mt-1">Clear operational guidelines to ensure complete clarity before your trip starts.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        ${TARIFF_POLICIES.map(tp => `
        <div class="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 class="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span class="text-amber-500">📋</span>
            <span>${tp.title}</span>
          </h3>
          <ul class="space-y-2 text-xs sm:text-sm text-slate-600">
            ${tp.points.map(pt => `<li class="flex items-start gap-2"><span class="text-amber-500 font-bold">•</span> <span>${pt}</span></li>`).join('')}
          </ul>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- CTA Banner -->
  <section class="py-12 bg-slate-950 text-white text-center">
    <div class="max-w-3xl mx-auto px-4 space-y-4">
      <h3 class="text-2xl font-bold">Have custom travel requirements or bulk fleet needs?</h3>
      <p class="text-sm text-slate-400">Speak directly with our Call Taxi In Coimbatore dispatch desk for instant customized quotes.</p>
      <div class="flex justify-center gap-3 pt-2">
        <a href="tel:${PHONE_NUMBER}" class="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition">Call 9043743777</a>
        <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition">WhatsApp Us</a>
      </div>
    </div>
  </section>
  `;

  return generateHtmlPage({
    title: 'Call Taxi In Coimbatore Tariffs & Rate Card | Get Taxi Kovai 9043743777',
    description: 'One-Way Drop taxi tariff at ₹15 per km, minimum 130 km coverage, and ₹500 driver batta. Hourly rentals at ₹350/hr with 10 km free. Prompt doorstep pickup across Coimbatore.',
    keywords: 'Call Taxi In Coimbatore tariff, Coimbatore taxi rate card, Ooty drop taxi price, one way taxi Coimbatore rate card, outstation cab tariff Coimbatore, Kovai call taxi 9043743777',
    canonicalUrl: `${SITE_URL}/tariffs.html`,
    activeNav: 'tariffs',
    bodyContent,
    schemaJson: schema
  });
}

// ==========================================
// 3. GENERATE TOURS.HTML (TOUR PACKAGES DIRECTORY)
// ==========================================
function generateToursDirectoryPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Coimbatore Holiday Tour Packages & Pilgrimage Cabs",
    "itemListElement": TOUR_PACKAGES.map((t, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": t.title,
      "url": `${SITE_URL}/${TOUR_PAGE_MAP[t.id] || 'tours.html'}`
    }))
  };

  const bodyContent = `
  <section class="bg-slate-900 text-white py-14 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span class="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">Private AC Holiday Cabs</span>
      <h1 class="text-4xl sm:text-5xl font-black tracking-tight mt-3 text-white">Holiday Tour Packages from Coimbatore</h1>
      <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mt-3">Handcrafted hill station road trips, spiritual temple circuits, and wildlife getaways with experienced local mountain drivers.</p>
    </div>
  </section>

  <section class="py-14 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${TOUR_PACKAGES.map(tour => {
          const pageUrl = TOUR_PAGE_MAP[tour.id] || 'tours.html';
          return `
          <div class="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition flex flex-col justify-between group">
            <div>
              <div class="relative h-52 overflow-hidden bg-slate-200">
                <img src="${tour.coverImage}" alt="${tour.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80'" />
                <span class="absolute top-3 left-3 px-3 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs text-amber-400 font-bold text-xs">
                  ${tour.durationDays} Day${tour.durationDays > 1 ? 's' : ''} ${tour.durationNights > 0 ? `• ${tour.durationNights} Night` : ''}
                </span>
                <span class="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-white/90 text-slate-900 font-bold text-xs capitalize">
                  ${tour.category}
                </span>
              </div>
              <div class="p-6">
                <h3 class="text-xl font-bold text-slate-900 leading-snug mb-1 group-hover:text-amber-600 transition">${tour.title}</h3>
                <p class="text-xs text-slate-500 mb-4">${tour.subtitle}</p>

                <div class="space-y-1.5 text-xs text-slate-600 mb-5">
                  ${tour.destinationsCovered.map(dest => `<div class="flex items-center gap-2"><span class="text-amber-500 font-bold">✓</span> <span>${dest}</span></div>`).join('')}
                </div>
              </div>
            </div>

            <div class="p-6 pt-0">
              <div class="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span class="text-xs text-slate-500 block">Starting Fare</span>
                  <span class="text-2xl font-black text-slate-900">₹${tour.startingPrice.toLocaleString()}</span>
                </div>
                <div class="flex gap-2">
                  <a href="${pageUrl}" class="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition">
                    View Package
                  </a>
                </div>
              </div>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    </div>
  </section>
  `;

  return generateHtmlPage({
    title: 'Tour Packages from Coimbatore | Ooty, Isha Yoga, Valparai, Kodaikanal | Get Taxi Kovai',
    description: 'Explore 7 curated holiday tour packages from Coimbatore. Ooty 2-day trip, Isha Yoga 1-day tour, Valparai 40 hairpin bends safari, Kodaikanal, Munnar & Palani pilgrimage cabs.',
    keywords: 'Coimbatore tour packages, Ooty cab package, Isha Yoga taxi package, Valparai tour package, Kodaikanal cab from Coimbatore, Munnar taxi package, Palani temple cab',
    canonicalUrl: `${SITE_URL}/tours.html`,
    activeNav: 'tours',
    bodyContent,
    schemaJson: schema
  });
}

// ==========================================
// 4. GENERATE INDIVIDUAL TOUR DETAIL PAGES
// ==========================================
function generateIshaYogaTourPage() {
  const canonicalUrl = `${SITE_URL}/tour-isha-yoga.html`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": "Isha Yoga & Adiyogi Private Cab Tour Packages from Coimbatore",
    "description": "Private full-day cab tour packages from Coimbatore to Isha Yoga Center & Adiyogi. Option 1: Spiritual & Heritage Tour (₹3,000 / 10 Hrs / 100 KM). Option 2: Adiyogi + Evening Light Show Tour (₹3,500 / 12 Hrs / 120 KM).",
    "touristType": "pilgrimage",
    "offers": [
      {
        "@type": "Offer",
        "name": "Option 1: Spiritual & Heritage Tour",
        "price": "3000",
        "priceCurrency": "INR",
        "description": "Private Cab, Up to 10 Hours, Up to 100 KM. Coimbatore pickup, Perur Pateeswarar Temple, Marudhamalai Temple, Isha Yoga Center, Coimbatore drop. Extra KM: ₹20/km, Extra hour: ₹150/hr."
      },
      {
        "@type": "Offer",
        "name": "Option 2: Adiyogi + Light Show Tour",
        "price": "3500",
        "priceCurrency": "INR",
        "description": "Private Cab, Up to 12 Hours, Up to 120 KM. Coimbatore pickup, Isha Yoga Center, Adiyogi, Evening Light Show, Post-show Coimbatore destination drop. Extra KM: ₹20/km, Extra hour: ₹150/hr."
      }
    ],
    "itinerary": [
      {
        "@type": "ItemList",
        "name": "Option 1: Spiritual & Heritage Tour Route",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Coimbatore Doorstep Pickup" },
          { "@type": "ListItem", "position": 2, "name": "Perur Pateeswarar Temple" },
          { "@type": "ListItem", "position": 3, "name": "Marudhamalai Temple" },
          { "@type": "ListItem", "position": 4, "name": "Isha Yoga Center & Adiyogi" },
          { "@type": "ListItem", "position": 5, "name": "Coimbatore Destination Drop" }
        ]
      },
      {
        "@type": "ItemList",
        "name": "Option 2: Adiyogi + Light Show Tour Route",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Coimbatore Doorstep Pickup" },
          { "@type": "ListItem", "position": 2, "name": "Isha Yoga Center" },
          { "@type": "ListItem", "position": 3, "name": "112 ft Adiyogi Statue" },
          { "@type": "ListItem", "position": 4, "name": "Evening Light Show" },
          { "@type": "ListItem", "position": 5, "name": "Post-Show Coimbatore Destination Drop" }
        ]
      }
    ]
  };

  const bodyContent = `
  <!-- Tour Header / Banner -->
  <section class="relative bg-slate-950 text-white py-16 overflow-hidden">
    <div class="absolute inset-0 opacity-25">
      <img src="/images/tours/tour-isha-adiyogi.webp" alt="Isha Yoga & Adiyogi Tour Packages from Coimbatore" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="max-w-4xl">
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <a href="tours.html" class="text-xs text-amber-400 hover:underline">← All Tour Packages</a>
          <span class="text-slate-500">•</span>
          <span class="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">Private Full-Day Tour Package</span>
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
          Isha Yoga & Adiyogi Tour Packages from Coimbatore
        </h1>
        <p class="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
          Dedicated private AC cab tours with transparent upfront pricing. Choose our 10-Hour Spiritual & Heritage Circuit or the extended 12-Hour Adiyogi Evening Light Show Tour with doorstep Coimbatore pickup and drop.
        </p>
        
        <!-- Package Badges Quick Overview -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 max-w-2xl">
          <div class="bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div>
              <span class="text-[11px] font-bold text-amber-400 uppercase tracking-wide">Option 1 • Spiritual & Heritage</span>
              <span class="text-xs text-slate-300 block mt-0.5">10 Hours • 100 KM Included</span>
            </div>
            <span class="text-2xl font-black text-white">₹3,000</span>
          </div>
          <div class="bg-gradient-to-r from-amber-500/20 to-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-amber-400/50 flex items-center justify-between shadow-md">
            <div>
              <span class="text-[11px] font-bold text-amber-300 uppercase tracking-wide">Option 2 • Adiyogi + Light Show</span>
              <span class="text-xs text-slate-300 block mt-0.5">12 Hours • 120 KM Included</span>
            </div>
            <span class="text-2xl font-black text-amber-400">₹3,500</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-4 mt-6 items-center">
          <a href="#choose-tour" class="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg transition shadow-amber-400/20">
            <span>View & Choose Packages ↓</span>
          </a>
          <a href="https://wa.me/91${PHONE_NUMBER}?text=I%20would%20like%20to%20enquire%20about%20Isha%20Yoga%20Tour%20Packages%20from%20Coimbatore." target="_blank" rel="noopener" class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            <span>WhatsApp Us</span>
          </a>
          <a href="tel:${PHONE_NUMBER}" class="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center gap-2 border border-slate-700 shadow-md transition">
            <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z"/></svg>
            <span>Call 9043743777</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Commercial Positioning Banner -->
  <section class="bg-amber-500/10 border-b border-amber-500/20 py-4">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-center justify-between gap-4 text-slate-900 text-xs sm:text-sm font-semibold">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          <span><strong>PRIVATE FULL-DAY CAB TOUR:</strong> Dedicated cab for your family/group with flexible start time.</span>
        </div>
        <div class="flex items-center gap-4 text-slate-700">
          <span>Extra KM: <strong>₹20 / km</strong></span>
          <span>•</span>
          <span>Extra Time: <strong>₹150 / hour</strong></span>
        </div>
      </div>
    </div>
  </section>

  <!-- Main Tour Section -->
  <section id="choose-tour" class="py-16 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Title -->
      <div class="text-center max-w-3xl mx-auto mb-12">
        <span class="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full shadow-xs">
          Transparent Private Tour Packages
        </span>
        <h2 class="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight mt-3">
          Choose Your Isha Yoga Tour
        </h2>
        <p class="text-slate-600 text-sm sm:text-base mt-2">
          Select between our comprehensive 10-Hour Spiritual & Heritage Circuit or the extended 12-Hour Adiyogi Evening Light Show Tour. Both options include dedicated private cab, fuel, driver bata, and doorstep Coimbatore pickup/drop.
        </p>
      </div>

      <!-- TWO PACKAGE CARDS GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-16">
        
        <!-- OPTION 1 CARD -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg hover:shadow-xl transition flex flex-col justify-between">
          <div>
            <!-- Header Badge -->
            <div class="flex items-center justify-between gap-2 mb-4">
              <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wider border border-slate-200">
                OPTION 1 • HERITAGE & SPIRITUAL
              </span>
              <span class="text-xs font-bold text-slate-500">Day Circuit</span>
            </div>

            <h3 class="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-2">
              Spiritual & Heritage Tour
            </h3>
            <p class="text-slate-600 text-sm mb-6 leading-relaxed">
              Private full-day cab tour from Coimbatore covering ancient Kongu architectural temples and the iconic Isha Yoga Center with doorstep pickup and drop.
            </p>

            <!-- Price Box -->
            <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6">
              <div class="flex items-baseline justify-between mb-3">
                <div>
                  <span class="text-3xl sm:text-4xl font-black text-slate-950">₹3,000</span>
                  <span class="text-xs text-slate-500 font-semibold block">All-Inclusive Private Cab Package</span>
                </div>
                <span class="px-3 py-1 rounded-lg bg-slate-900 text-amber-400 font-extrabold text-xs">
                  Fixed Package
                </span>
              </div>

              <!-- Main Highlights Badges -->
              <div class="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 text-xs font-bold text-slate-800">
                <div class="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200">
                  <span class="text-amber-600 text-sm">⏱️</span>
                  <span>Up to 10 Hours</span>
                </div>
                <div class="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200">
                  <span class="text-amber-600 text-sm">🛣️</span>
                  <span>Up to 100 KM</span>
                </div>
              </div>
            </div>

            <!-- Destinations Flow -->
            <div class="mb-6">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">Major Destinations Flow:</h4>
              <div class="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-slate-800 space-y-1.5 font-medium">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-[10px]">1</span>
                  <span>Coimbatore Doorstep Pickup</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-[10px]">2</span>
                  <span>Perur Pateeswarar Temple (1000-Yr Chola Art)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-[10px]">3</span>
                  <span>Marudhamalai Hill Temple (Lord Murugan)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-[10px]">4</span>
                  <span>Isha Yoga Center & 112ft Adiyogi Shiva</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-[10px]">5</span>
                  <span>Coimbatore Destination Drop</span>
                </div>
              </div>
            </div>

            <!-- Included Checklist -->
            <div class="mb-6">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">Package Inclusions:</h4>
              <ul class="space-y-2 text-xs sm:text-sm text-slate-700">
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald-600 font-bold text-base">✓</span>
                  <span><strong>Dedicated Private AC Cab:</strong> Not a shared taxi. Dedicated exclusively to your party.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald-600 font-bold text-base">✓</span>
                  <span><strong>Up to 10 Hours:</strong> Relaxed, unhurried time at every temple and meditation hall.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald-600 font-bold text-base">✓</span>
                  <span><strong>Up to 100 KM Allowance:</strong> Covers Coimbatore city, Perur, Marudhamalai & Isha.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald-600 font-bold text-base">✓</span>
                  <span><strong>Coimbatore Pickup & Drop:</strong> Doorstep pickup from any hotel, residence, station or CJB airport.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald-600 font-bold text-base">✓</span>
                  <span><strong>Fuel & Driver Allowance:</strong> Complete driver bata & parking assistance included.</span>
                </li>
              </ul>
            </div>

            <!-- Additional Charges Box -->
            <div class="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 mb-6">
              <span class="font-bold text-slate-900 block mb-1">Additional Charges (if exceeded):</span>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span>Extra distance: <strong>₹20 / km</strong></span>
                <span>Extra time: <strong>₹150 / hour</strong> (beyond 10 hours)</span>
              </div>
            </div>
          </div>

          <!-- CTAs -->
          <div class="space-y-2.5 pt-4 border-t border-slate-100">
            <a href="https://wa.me/91${PHONE_NUMBER}?text=I%20would%20like%20to%20book%20the%20Spiritual%20%26%20Heritage%20Tour%20%E2%80%93%20%E2%82%B93%2C000%20%2F%2010%20Hours%20%2F%20100%20KM." target="_blank" rel="noopener" class="w-full py-3.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-center text-sm flex items-center justify-center gap-2 shadow-md transition">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              <span>Book Option 1 (₹3,000)</span>
            </a>
            <a href="tel:${PHONE_NUMBER}" class="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-center text-xs flex items-center justify-center gap-2 transition">
              <svg class="w-3.5 h-3.5 text-slate-600" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z"/></svg>
              <span>Call to Book Option 1</span>
            </a>
          </div>
        </div>

        <!-- OPTION 2 CARD (EXTENDED LIGHT SHOW PACKAGE) -->
        <div class="bg-gradient-to-b from-amber-500/10 via-white to-amber-50/40 rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-2xl relative flex flex-col justify-between ring-4 ring-amber-400/20">
          <div>
            <!-- Top Ribbon -->
            <div class="flex items-center justify-between gap-2 mb-4">
              <span class="px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm">
                ⭐ OPTION 2 • LIGHT SHOW INCLUDED
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                Most Popular
              </span>
            </div>

            <h3 class="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-2">
              Adiyogi + Light Show Tour
            </h3>
            <p class="text-slate-600 text-sm mb-6 leading-relaxed">
              Extended evening package including the Isha campus, Dhyanalinga, 112ft Adiyogi, and the breathtaking <strong>Evening Light Show</strong> with post-show drop to your Coimbatore destination.
            </p>

            <!-- Price Box -->
            <div class="bg-white rounded-2xl p-5 border-2 border-amber-300 shadow-sm mb-6">
              <div class="flex items-baseline justify-between mb-3">
                <div>
                  <span class="text-3xl sm:text-4xl font-black text-amber-600">₹3,500</span>
                  <span class="text-xs text-slate-500 font-semibold block">Extended Evening Private Cab Package</span>
                </div>
                <span class="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs">
                  Extended 12-Hour
                </span>
              </div>

              <!-- Main Highlights Badges -->
              <div class="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 text-xs font-bold text-slate-800">
                <div class="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-50/80 border border-amber-200 text-center">
                  <span class="text-amber-600 text-sm">⏱️</span>
                  <span class="text-[11px] mt-0.5">Up to 12 Hours</span>
                </div>
                <div class="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-50/80 border border-amber-200 text-center">
                  <span class="text-amber-600 text-sm">🛣️</span>
                  <span class="text-[11px] mt-0.5">Up to 120 KM</span>
                </div>
                <div class="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-100 border border-amber-300 text-center">
                  <span class="text-amber-700 text-sm">✨</span>
                  <span class="text-[11px] mt-0.5 text-amber-950 font-black">Light Show</span>
                </div>
              </div>
            </div>

            <!-- Destinations Flow -->
            <div class="mb-6">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">Major Destinations & Experience Flow:</h4>
              <div class="p-3.5 rounded-2xl bg-amber-100/70 border border-amber-300 text-xs text-slate-900 space-y-1.5 font-semibold">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-slate-950 text-amber-400 font-black flex items-center justify-center text-[10px]">1</span>
                  <span>Coimbatore Doorstep Pickup</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-slate-950 text-amber-400 font-black flex items-center justify-center text-[10px]">2</span>
                  <span>Isha Yoga Center (Dhyanalinga & Linga Bhairavi)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-slate-950 text-amber-400 font-black flex items-center justify-center text-[10px]">3</span>
                  <span>112 ft Adiyogi Shiva Statue & Suryakund</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-[10px]">4</span>
                  <span>Evening Light Show Spectacle (Adiyogi Divya Darshanam)</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded-full bg-slate-950 text-amber-400 font-black flex items-center justify-center text-[10px]">5</span>
                  <span>Post-Show Drop to your Coimbatore Destination</span>
                </div>
              </div>
            </div>

            <!-- Included Checklist -->
            <div class="mb-6">
              <h4 class="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">Package Inclusions:</h4>
              <ul class="space-y-2 text-xs sm:text-sm text-slate-800">
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald-600 font-bold text-base">✓</span>
                  <span><strong>Dedicated Private AC Cab:</strong> Reserved exclusively for your group throughout the tour.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald-600 font-bold text-base">✓</span>
                  <span><strong>Up to 12 Hours Duration:</strong> Ample time for afternoon exploration and evening meditation.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald-600 font-bold text-base">✓</span>
                  <span><strong>Up to 120 KM Allowance:</strong> Full coverage for all Coimbatore city pickups and Isha round trip.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald-600 font-bold text-base">✓</span>
                  <span><strong>Evening Light Show Included:</strong> Cab waits till the complete conclusion of the light show.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-emerald-600 font-bold text-base">✓</span>
                  <span><strong>Post-Show Coimbatore Drop:</strong> Safe, hassle-free return drop directly to your hotel or residence.</span>
                </li>
              </ul>
            </div>

            <!-- Additional Charges Box -->
            <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-700 mb-6">
              <span class="font-bold text-slate-900 block mb-1">Additional Charges (if exceeded):</span>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span>Extra distance: <strong>₹20 / km</strong></span>
                <span>Extra time: <strong>₹150 / hour</strong> (beyond 12 hours)</span>
              </div>
            </div>
          </div>

          <!-- CTAs -->
          <div class="space-y-2.5 pt-4 border-t border-amber-200">
            <a href="https://wa.me/91${PHONE_NUMBER}?text=I%20would%20like%20to%20book%20the%20Adiyogi%20%2B%20Light%20Show%20Tour%20%E2%80%93%20%E2%82%B93%2C500%20%2F%2012%20Hours%20%2F%20120%20KM." target="_blank" rel="noopener" class="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-center text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              <span>Book Option 2 (₹3,500)</span>
            </a>
            <a href="tel:${PHONE_NUMBER}" class="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-center text-xs flex items-center justify-center gap-2 transition">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z"/></svg>
              <span>Call to Book Option 2</span>
            </a>
          </div>
        </div>

      </div>

      <!-- PACKAGE COMPARISON TABLE SECTION -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md mb-16">
        <h3 class="text-xl sm:text-2xl font-black text-slate-950 mb-2">Package Comparison Summary</h3>
        <p class="text-slate-600 text-xs sm:text-sm mb-6">Quick side-by-side comparison to help you choose the ideal tour for your trip.</p>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr class="border-b-2 border-slate-200">
                <th class="py-3.5 px-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Feature / Parameter</th>
                <th class="py-3.5 px-4 font-extrabold text-slate-900 bg-slate-50 rounded-t-xl">
                  Option 1: Spiritual & Heritage
                </th>
                <th class="py-3.5 px-4 font-black text-amber-700 bg-amber-50 rounded-t-xl">
                  Option 2: Adiyogi + Light Show
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td class="py-3.5 px-4 font-semibold text-slate-900">Package Fare</td>
                <td class="py-3.5 px-4 font-black text-slate-950 bg-slate-50 text-base">₹3,000</td>
                <td class="py-3.5 px-4 font-black text-amber-600 bg-amber-50 text-base">₹3,500</td>
              </tr>
              <tr>
                <td class="py-3.5 px-4 font-semibold text-slate-900">Included Duration</td>
                <td class="py-3.5 px-4 bg-slate-50 font-bold">Up to 10 Hours</td>
                <td class="py-3.5 px-4 bg-amber-50 font-bold text-slate-950">Up to 12 Hours</td>
              </tr>
              <tr>
                <td class="py-3.5 px-4 font-semibold text-slate-900">Included Distance</td>
                <td class="py-3.5 px-4 bg-slate-50 font-bold">Up to 100 KM</td>
                <td class="py-3.5 px-4 bg-amber-50 font-bold text-slate-950">Up to 120 KM</td>
              </tr>
              <tr>
                <td class="py-3.5 px-4 font-semibold text-slate-900">Evening Light Show</td>
                <td class="py-3.5 px-4 bg-slate-50 text-slate-500">Not Included (Day Tour)</td>
                <td class="py-3.5 px-4 bg-amber-50 font-black text-emerald-700">✨ Included (Cab waits for show)</td>
              </tr>
              <tr>
                <td class="py-3.5 px-4 font-semibold text-slate-900">Destinations Covered</td>
                <td class="py-3.5 px-4 bg-slate-50">Perur + Marudhamalai + Isha</td>
                <td class="py-3.5 px-4 bg-amber-50">Isha + Adiyogi + Evening Light Show</td>
              </tr>
              <tr>
                <td class="py-3.5 px-4 font-semibold text-slate-900">Extra Distance Charge</td>
                <td class="py-3.5 px-4 bg-slate-50 font-semibold">₹20 / km</td>
                <td class="py-3.5 px-4 bg-amber-50 font-semibold">₹20 / km</td>
              </tr>
              <tr>
                <td class="py-3.5 px-4 font-semibold text-slate-900">Extra Time Charge</td>
                <td class="py-3.5 px-4 bg-slate-50 font-semibold">₹150 / hour</td>
                <td class="py-3.5 px-4 bg-amber-50 font-semibold">₹150 / hour</td>
              </tr>
              <tr>
                <td class="py-3.5 px-4 font-semibold text-slate-900">Pickup & Final Drop</td>
                <td class="py-3.5 px-4 bg-slate-50">Doorstep Coimbatore Pickup & Drop</td>
                <td class="py-3.5 px-4 bg-amber-50">Doorstep Coimbatore Pickup & Drop</td>
              </tr>
              <tr>
                <td class="py-3.5 px-4 font-semibold text-slate-900">Best Suited For</td>
                <td class="py-3.5 px-4 bg-slate-50">Temple lovers & morning travelers</td>
                <td class="py-3.5 px-4 bg-amber-50 font-medium text-slate-900">Deep Isha meditation & light-show experience</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- SIMPLIFIED ITINERARY & EXPERIENCE FLOW -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        
        <!-- Option 1 Flow -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-3 py-1 rounded-lg bg-slate-900 text-amber-400 font-extrabold text-xs">OPTION 1 ITINERARY</span>
            <h3 class="text-xl font-bold text-slate-900">Spiritual & Heritage Flow</h3>
          </div>
          <p class="text-xs sm:text-sm text-slate-600 mb-6">
            A suggested destination sequence with complete flexibility. No rigid hour-by-hour deadlines; your driver follows your group's pace.
          </p>

          <div class="space-y-4 border-l-2 border-amber-300 ml-3 pl-4 text-xs sm:text-sm">
            <div class="relative">
              <span class="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white"></span>
              <h4 class="font-bold text-slate-900">1. Coimbatore Doorstep Pickup</h4>
              <p class="text-slate-600 text-xs mt-0.5">Your private cab arrives at your designated Coimbatore hotel, home, railway station, or airport at your requested morning start time.</p>
            </div>

            <div class="relative">
              <span class="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white"></span>
              <h4 class="font-bold text-slate-900">2. Perur Pateeswarar Temple</h4>
              <p class="text-slate-600 text-xs mt-0.5">Visit the 1,500-year-old temple on the banks of Noyyal River, celebrated for its Kanaka Sabha stone carvings and tranquil ambiance.</p>
            </div>

            <div class="relative">
              <span class="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white"></span>
              <h4 class="font-bold text-slate-900">3. Marudhamalai Murugan Temple</h4>
              <p class="text-slate-600 text-xs mt-0.5">Drive up the lush hill shrine dedicated to Lord Subramanya, enjoying panoramic vistas of the Western Ghats mountain range.</p>
            </div>

            <div class="relative">
              <span class="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white"></span>
              <h4 class="font-bold text-slate-900">4. Isha Yoga Center & Adiyogi</h4>
              <p class="text-slate-600 text-xs mt-0.5">Reach the Velliangiri foothills for peaceful meditation at Dhyanalinga, Linga Bhairavi shrine, and darshan at the majestic 112ft Adiyogi Shiva Statue.</p>
            </div>

            <div class="relative">
              <span class="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white"></span>
              <h4 class="font-bold text-slate-900">5. Coimbatore Destination Drop</h4>
              <p class="text-slate-600 text-xs mt-0.5">Comfortable return journey back to your Coimbatore drop destination within the 10-hour tour window.</p>
            </div>
          </div>
        </div>

        <!-- Option 2 Flow -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs">OPTION 2 ITINERARY</span>
            <h3 class="text-xl font-bold text-slate-900">Adiyogi & Light Show Flow</h3>
          </div>
          <p class="text-xs sm:text-sm text-slate-600 mb-6">
            Tailored specifically for an immersive Isha experience and witnessing the evening laser projection show without any rush.
          </p>

          <div class="space-y-4 border-l-2 border-amber-400 ml-3 pl-4 text-xs sm:text-sm">
            <div class="relative">
              <span class="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-slate-950 border-2 border-amber-400"></span>
              <h4 class="font-bold text-slate-900">1. Coimbatore Doorstep Pickup</h4>
              <p class="text-slate-600 text-xs mt-0.5">Flexible start time scheduled with your driver to ensure effortless arrival at Isha ahead of evening events.</p>
            </div>

            <div class="relative">
              <span class="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-slate-950 border-2 border-amber-400"></span>
              <h4 class="font-bold text-slate-900">2. Isha Yoga Center & Theerthakunds</h4>
              <p class="text-slate-600 text-xs mt-0.5">Experience energized sacred water dips at Suryakund/Chandrakund, followed by profound silent meditation inside Dhyanalinga dome.</p>
            </div>

            <div class="relative">
              <span class="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-slate-950 border-2 border-amber-400"></span>
              <h4 class="font-bold text-slate-900">3. 112 ft Adiyogi Shiva Statue</h4>
              <p class="text-slate-600 text-xs mt-0.5">Visit the world's largest bust sculpture, offer consecrated prayers at the Yogeshwar Linga, and enjoy the surrounding scenic mountain vistas.</p>
            </div>

            <div class="relative">
              <span class="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-slate-950"></span>
              <h4 class="font-bold text-amber-700">4. Evening Light Show (Adiyogi Divya Darshanam)</h4>
              <p class="text-slate-600 text-xs mt-0.5">Witness the iconic 3D laser projection and sound spectacle projected onto the 112-foot Adiyogi statue. Your cab and driver patiently wait on-site.</p>
            </div>

            <div class="relative">
              <span class="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-slate-950 border-2 border-amber-400"></span>
              <h4 class="font-bold text-slate-900">5. Post-Show Coimbatore Destination Drop</h4>
              <p class="text-slate-600 text-xs mt-0.5">After the show concludes and you exit the venue, your driver drives you comfortably back to your Coimbatore destination.</p>
            </div>
          </div>
        </div>

      </div>

      <!-- INCLUSIONS & EXCLUSIONS -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div class="bg-emerald-50/80 rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xs">
          <h3 class="text-lg font-bold text-emerald-950 mb-4 flex items-center gap-2">
            <span class="text-xl">✅</span> <span>What Is Included in Both Packages</span>
          </h3>
          <ul class="space-y-2.5 text-xs sm:text-sm text-emerald-900">
            <li class="flex items-start gap-2"><span>•</span> <span><strong>Private AC Cab:</strong> Dedicated vehicle strictly for your family/group.</span></li>
            <li class="flex items-start gap-2"><span>•</span> <span><strong>Defined Coverage:</strong> Option 1 (10h/100km) or Option 2 (12h/120km).</span></li>
            <li class="flex items-start gap-2"><span>•</span> <span><strong>Doorstep Pickup & Drop:</strong> Within Coimbatore city, hotels, railway stations, or CJB airport.</span></li>
            <li class="flex items-start gap-2"><span>•</span> <span><strong>Driver & Fuel Included:</strong> Driver allowance, fuel, and temple parking assistance included.</span></li>
            <li class="flex items-start gap-2"><span>•</span> <span><strong>Zero Advance Required:</strong> Pay transparently after the ride is completed via Cash or UPI.</span></li>
          </ul>
        </div>

        <div class="bg-rose-50/80 rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-xs">
          <h3 class="text-lg font-bold text-rose-950 mb-4 flex items-center gap-2">
            <span class="text-xl">❌</span> <span>Additional Charges & Exclusions</span>
          </h3>
          <ul class="space-y-2.5 text-xs sm:text-sm text-rose-900">
            <li class="flex items-start gap-2"><span>•</span> <span><strong>Extra Kilometres:</strong> Charged transparently at ₹20 / km if exceeded.</span></li>
            <li class="flex items-start gap-2"><span>•</span> <span><strong>Extra Hours:</strong> Charged transparently at ₹150 / hour if exceeded.</span></li>
            <li class="flex items-start gap-2"><span>•</span> <span><strong>Personal Expenses:</strong> Food, refreshments, and special temple darshan tickets if any.</span></li>
            <li class="flex items-start gap-2"><span>•</span> <span><strong>Outstation Extensions:</strong> Trips going beyond Coimbatore limits quoted separately.</span></li>
          </ul>
        </div>
      </div>

      <!-- FAQ ACCORDION -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <h3 class="text-xl sm:text-2xl font-black text-slate-950 mb-2">Frequently Asked Questions</h3>
        <p class="text-slate-600 text-xs sm:text-sm mb-6">Common questions about our Isha Yoga and Adiyogi private cab tour packages.</p>

        <div class="space-y-3">
          <div class="border border-slate-200 rounded-2xl overflow-hidden">
            <button class="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 font-bold text-sm text-slate-900 flex justify-between items-center faq-toggle">
              <span>What is the difference between Option 1 and Option 2?</span>
              <span class="faq-icon text-lg text-amber-600 font-black">+</span>
            </button>
            <div class="p-4 text-xs sm:text-sm text-slate-600 bg-white border-t border-slate-100 hidden">
              Option 1 (₹3,000) is a 10-Hour / 100 KM day circuit covering Perur Pateeswarar Temple, Marudhamalai Temple, and Isha Yoga Center. Option 2 (₹3,500) is an extended 12-Hour / 120 KM evening tour designed specifically to let you spend extended time at Isha and witness the Adiyogi Evening Light Show with post-show drop.
            </div>
          </div>

          <div class="border border-slate-200 rounded-2xl overflow-hidden">
            <button class="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 font-bold text-sm text-slate-900 flex justify-between items-center faq-toggle">
              <span>Can we choose our pickup time and pickup location?</span>
              <span class="faq-icon text-lg text-amber-600 font-black">+</span>
            </button>
            <div class="p-4 text-xs sm:text-sm text-slate-600 bg-white border-t border-slate-100 hidden">
              Yes! Because these are 100% private cab tour packages, you choose your preferred start time when reserving. Pickup is available anywhere within Coimbatore city limits, including hotels, private residences, Coimbatore Junction/North railway stations, and Coimbatore International Airport (CJB).
            </div>
          </div>

          <div class="border border-slate-200 rounded-2xl overflow-hidden">
            <button class="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 font-bold text-sm text-slate-900 flex justify-between items-center faq-toggle">
              <span>Does Option 2 include waiting for the Adiyogi Evening Light Show?</span>
              <span class="faq-icon text-lg text-amber-600 font-black">+</span>
            </button>
            <div class="p-4 text-xs sm:text-sm text-slate-600 bg-white border-t border-slate-100 hidden">
              Yes, Option 2 is designed with 12 hours of duration and 120 km allowance specifically so that you can enjoy the full Evening Light Show without rushing. The cab waits on-site in the parking area, and your driver will drop you back to your Coimbatore destination post-show.
            </div>
          </div>

          <div class="border border-slate-200 rounded-2xl overflow-hidden">
            <button class="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 font-bold text-sm text-slate-900 flex justify-between items-center faq-toggle">
              <span>How are extra kilometres and hours charged?</span>
              <span class="faq-icon text-lg text-amber-600 font-black">+</span>
            </button>
            <div class="p-4 text-xs sm:text-sm text-slate-600 bg-white border-t border-slate-100 hidden">
              If your journey exceeds the included package allowance, extra distance is charged at ₹20 per km, and extra time is charged at ₹150 per hour. All charges are calculated transparently based on actual odometer and trip duration.
            </div>
          </div>

          <div class="border border-slate-200 rounded-2xl overflow-hidden">
            <button class="w-full text-left p-4 bg-slate-50 hover:bg-slate-100 font-bold text-sm text-slate-900 flex justify-between items-center faq-toggle">
              <span>Do I need to pay an advance to book?</span>
              <span class="faq-icon text-lg text-amber-600 font-black">+</span>
            </button>
            <div class="p-4 text-xs sm:text-sm text-slate-600 bg-white border-t border-slate-100 hidden">
              No advance payment is required for standard bookings. You can book directly via WhatsApp or phone call and pay the driver upon trip completion using Cash or UPI (GPay / PhonePe / Paytm).
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
  `;

  return generateHtmlPage({
    title: 'Isha Yoga & Adiyogi Tour Packages from Coimbatore | Get Taxi Kovai',
    description: 'Book private full-day Isha Yoga cab tours from Coimbatore. Option 1: Spiritual & Heritage Tour (₹3,000 / 10 Hrs / 100 KM). Option 2: Adiyogi + Light Show Tour (₹3,500 / 12 Hrs / 120 KM). Doorstep Coimbatore pickup & drop. Call 9043743777.',
    keywords: 'Isha Yoga Center Tour from Coimbatore, Adiyogi Tour from Coimbatore, Isha Light Show Tour, Marudhamalai and Isha Tour, Coimbatore Private Cab Tour, Isha Yoga Tour Package',
    canonicalUrl,
    activeNav: 'tours',
    bodyContent,
    schemaJson: schema
  });
}

function generateIndividualTourPage(tour) {
  if (tour.id === 'isha-spiritual-day-tour') {
    return generateIshaYogaTourPage();
  }

  const pageFilename = TOUR_PAGE_MAP[tour.id];
  const canonicalUrl = `${SITE_URL}/${pageFilename}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": tour.title,
    "description": tour.subtitle,
    "touristType": tour.category,
    "offers": {
      "@type": "Offer",
      "price": tour.startingPrice.toString(),
      "priceCurrency": "INR"
    },
    "itinerary": tour.itinerary.map(it => ({
      "@type": "ItemList",
      "name": it.title,
      "itemListElement": it.activities.map((act, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": act
      }))
    }))
  };

  const bodyContent = `
  <!-- Tour Header / Banner -->
  <section class="relative bg-slate-950 text-white py-16 overflow-hidden">
    <div class="absolute inset-0 opacity-25">
      <img src="${tour.coverImage}" alt="${tour.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="max-w-3xl">
        <div class="flex items-center gap-2 mb-3">
          <a href="tours.html" class="text-xs text-amber-400 hover:underline">← All Tour Packages</a>
          <span class="text-slate-500">•</span>
          <span class="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">${tour.durationDays} Day${tour.durationDays > 1 ? 's' : ''} ${tour.durationNights > 0 ? `• ${tour.durationNights} Night` : ''}</span>
        </div>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">${tour.title}</h1>
        <p class="text-base sm:text-lg text-slate-300">${tour.subtitle}</p>
        
        <div class="flex flex-wrap gap-4 mt-6 items-center">
          <div class="bg-slate-900/80 backdrop-blur-xs px-4 py-2 rounded-xl border border-slate-800">
            <span class="text-[11px] text-slate-400 block">Starting From</span>
            <span class="text-2xl font-black text-amber-400">₹${tour.startingPrice.toLocaleString()}</span>
          </div>
          <a href="https://wa.me/91${PHONE_NUMBER}?text=Hello%20Get%20Taxi%20Kovai%2C%20I%20want%20to%20book%20the%20${encodeURIComponent(tour.title)}" target="_blank" rel="noopener" class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition">
            <span>Book Tour on WhatsApp</span>
          </a>
          <a href="tel:${PHONE_NUMBER}" class="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg transition">
            <span>Call 9043743777</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Main Tour Content Grid -->
  <section class="py-14 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Left: Tour Details & Itinerary -->
        <div class="lg:col-span-8 space-y-10">
          <!-- Key Highlights -->
          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h2 class="text-xl font-bold text-slate-900 mb-4">Tour Highlights & Key Perks</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${tour.keyHighlights.map(kh => `
              <div class="flex items-start gap-2.5 text-sm text-slate-700">
                <span class="text-amber-500 font-bold text-base">★</span>
                <span>${kh}</span>
              </div>
              `).join('')}
            </div>
          </div>

          <!-- Destinations Covered -->
          <div>
            <h2 class="text-2xl font-bold text-slate-900 mb-4">Destinations Covered</h2>
            <div class="flex flex-wrap gap-2">
              ${tour.destinationsCovered.map(dest => `
              <span class="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-slate-800 text-sm font-semibold flex items-center gap-1.5">
                <span class="text-amber-600">📍</span> ${dest}
              </span>
              `).join('')}
            </div>
          </div>

          <!-- Day-by-Day Itinerary -->
          <div>
            <h2 class="text-2xl font-bold text-slate-900 mb-6">Detailed Day-by-Day Itinerary</h2>
            <div class="space-y-6">
              ${tour.itinerary.map(day => `
              <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div class="flex items-center gap-3 mb-4">
                  <span class="px-3 py-1 rounded-lg bg-slate-900 text-amber-400 font-extrabold text-sm">Day ${day.day}</span>
                  <h3 class="text-lg font-bold text-slate-900">${day.title}</h3>
                </div>
                <div class="space-y-2.5 border-l-2 border-amber-300 ml-4 pl-4 text-sm text-slate-600">
                  ${day.activities.map(act => `
                  <div class="relative">
                    <span class="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <p class="leading-relaxed">${act}</p>
                  </div>
                  `).join('')}
                </div>
              </div>
              `).join('')}
            </div>
          </div>

          <!-- Inclusions & Exclusions -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-emerald-50/60 rounded-2xl p-6 border border-emerald-200">
              <h3 class="text-lg font-bold text-emerald-950 mb-3 flex items-center gap-2">
                <span>✅</span> <span>Package Inclusions</span>
              </h3>
              <ul class="space-y-2 text-xs sm:text-sm text-emerald-900">
                ${tour.inclusions.map(inc => `<li class="flex items-start gap-2"><span>•</span> <span>${inc}</span></li>`).join('')}
              </ul>
            </div>

            <div class="bg-rose-50/60 rounded-2xl p-6 border border-rose-200">
              <h3 class="text-lg font-bold text-rose-950 mb-3 flex items-center gap-2">
                <span>❌</span> <span>Exclusions</span>
              </h3>
              <ul class="space-y-2 text-xs sm:text-sm text-rose-900">
                ${tour.exclusions.map(exc => `<li class="flex items-start gap-2"><span>•</span> <span>${exc}</span></li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <!-- Right: Vehicle Price Selector & Booking Widget -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg sticky top-28">
            <h3 class="text-lg font-bold text-slate-900 mb-1">Vehicle Price Rates</h3>
            <p class="text-xs text-slate-500 mb-4">All-inclusive tour cab rates</p>

            <div class="space-y-3 mb-6">
              ${tour.vehiclePrices.map(vp => `
              <div class="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-amber-400 transition">
                <span class="text-xs font-bold text-slate-800">${vp.vehicleName}</span>
                <span class="text-sm font-black text-amber-600">₹${vp.totalPrice.toLocaleString()}</span>
              </div>
              `).join('')}
            </div>

            <div class="space-y-2.5">
              <a href="https://wa.me/91${PHONE_NUMBER}?text=Hello%20Get%20Taxi%20Kovai%2C%20I%20want%20to%20reserve%20the%20${encodeURIComponent(tour.title)}" target="_blank" rel="noopener" class="block w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center text-sm shadow-md transition">
                Reserve on WhatsApp
              </a>
              <a href="tel:${PHONE_NUMBER}" class="block w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-center text-sm transition">
                Call 9043743777
              </a>
            </div>

            <p class="text-[11px] text-slate-500 text-center mt-3">Doorstep pickup from anywhere in Coimbatore City / CJB Airport.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;

  return generateHtmlPage({
    title: `${tour.title} | Get Taxi Kovai`,
    description: `${tour.title} from Coimbatore. ${tour.subtitle}. All-inclusive private AC cab package starting from ₹${tour.startingPrice}. Call 9043743777.`,
    keywords: `${tour.title}, Coimbatore to ${tour.destinationsCovered[0]} taxi, ${tour.category} tour Kovai, outstation cab Coimbatore`,
    canonicalUrl,
    activeNav: 'tours',
    bodyContent,
    schemaJson: schema
  });
}

// ==========================================
// 5. GENERATE BLOG.HTML (BLOG DIRECTORY)
// ==========================================
function generateBlogDirectoryPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Get Taxi Kovai Travel Guides & Coimbatore Heritage Blog",
    "description": "Comprehensive local travel guides, taxi fare tips, Nilgiri heritage histories, and road trip itineraries from Coimbatore.",
    "url": `${SITE_URL}/blog.html`
  };

  const bodyContent = `
  <section class="bg-slate-900 text-white py-14 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span class="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">Local Travel Insights</span>
      <h1 class="text-4xl sm:text-5xl font-black tracking-tight mt-3 text-white">Coimbatore Travel Guides & Heritage</h1>
      <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mt-3">Discover the history of Kongu Nadu, Nilgiri hill stations, airport transfer tips, and outstation taxi fare comparisons.</p>
    </div>
  </section>

  <section class="py-14 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${BLOG_POSTS.map(post => {
          const pageUrl = getBlogFilename(post);
          return `
          <article class="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition flex flex-col justify-between group">
            <div>
              <div class="relative h-48 overflow-hidden bg-slate-200">
                <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80'" />
                <span class="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs text-amber-400 font-bold text-xs">
                  ${post.category}
                </span>
              </div>
              <div class="p-6">
                <div class="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                  <span>${post.date}</span>
                  <span>•</span>
                  <span>${post.readTime}</span>
                </div>
                <h3 class="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-amber-600 transition">
                  <a href="${pageUrl}">${post.title}</a>
                </h3>
                <p class="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">${post.excerpt}</p>
              </div>
            </div>

            <div class="p-6 pt-0">
              <div class="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div class="flex flex-wrap gap-1">
                  ${post.tags.slice(0, 2).map(tag => `<span class="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 text-[10px]">${tag}</span>`).join('')}
                </div>
                <a href="${pageUrl}" class="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                  Read Article &rarr;
                </a>
              </div>
            </div>
          </article>
          `;
        }).join('')}
      </div>
    </div>
  </section>
  `;

  return generateHtmlPage({
    title: 'Coimbatore Travel Guides & Local Heritage Blog | Get Taxi Kovai',
    description: 'Explore 26 in-depth travel articles and local histories covering Coimbatore, Ooty, Isha Yoga Center, Valparai 40 hairpin bends, airport cab rates, and one-way drop taxis.',
    keywords: 'Coimbatore travel guide, history of Coimbatore, Ooty taxi guide, Isha Yoga cabs, Valparai hairpin bends, Coimbatore airport transfer rates, Get Taxi Kovai blog',
    canonicalUrl: `${SITE_URL}/blog.html`,
    activeNav: 'blog',
    bodyContent,
    schemaJson: schema
  });
}

// ==========================================
// 6. GENERATE INDIVIDUAL BLOG POST PAGES
// ==========================================
function generateIndividualBlogPostPage(post) {
  const pageFilename = getBlogFilename(post);
  const canonicalUrl = `${SITE_URL}/${pageFilename}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Get Taxi Kovai",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`
      }
    },
    "datePublished": post.date,
    "mainEntityOfPage": canonicalUrl
  };

  const bodyContent = `
  <!-- Blog Article Header -->
  <section class="bg-slate-950 text-white py-14 border-b border-slate-800">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center gap-2 mb-4">
        <a href="blog.html" class="text-xs text-amber-400 hover:underline">← All Travel Articles</a>
        <span class="text-slate-600">•</span>
        <span class="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">${post.category}</span>
        <span class="text-slate-600">•</span>
        <span class="text-xs text-slate-400">${post.readTime}</span>
      </div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">${post.title}</h1>
      <div class="flex items-center gap-3 text-xs text-slate-400">
        <span>By ${post.author}</span>
        <span>•</span>
        <span>Published on ${post.date}</span>
      </div>
    </div>
  </section>

  <!-- Blog Article Content -->
  <article class="py-14 bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Feature Image -->
      <div class="rounded-2xl overflow-hidden mb-10 shadow-md bg-slate-100 max-h-[450px]">
        <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'" />
      </div>

      <!-- Lead Excerpt Box -->
      <div class="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-xl mb-8 text-base text-slate-800 leading-relaxed font-medium">
        ${post.excerpt}
      </div>

      <!-- Main Body Text -->
      <div class="space-y-6 text-slate-700 text-base sm:text-lg leading-relaxed">
        ${post.content.map(paragraph => `<p class="leading-relaxed">${paragraph}</p>`).join('')}
      </div>

      <!-- Tags -->
      <div class="mt-10 pt-6 border-t border-slate-200 flex flex-wrap gap-2 items-center">
        <span class="text-xs font-bold text-slate-500">Tags:</span>
        ${post.tags.map(t => `<span class="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">#${t}</span>`).join('')}
      </div>

      <!-- Booking CTA Box -->
      <div class="mt-12 bg-slate-900 text-white rounded-2xl p-8 text-center space-y-4">
        <h3 class="text-2xl font-bold tracking-tight">Need a Reliable Cab in Coimbatore?</h3>
        <p class="text-sm text-slate-300 max-w-xl mx-auto">Get Taxi Kovai provides 24/7 doorstep pickup across Coimbatore with zero surge pricing. Call or WhatsApp 9043743777 now!</p>
        <div class="flex flex-wrap justify-center gap-3 pt-2">
          <a href="tel:${PHONE_NUMBER}" class="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition">Call 9043743777</a>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition">Book on WhatsApp</a>
        </div>
      </div>
    </div>
  </article>
  `;

  return generateHtmlPage({
    title: `${post.title} | Get Taxi Kovai`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    canonicalUrl,
    activeNav: 'blog',
    bodyContent,
    schemaJson: schema
  });
}

// ==========================================
// 7. GENERATE ABOUT.HTML
// ==========================================
function generateAboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Get Taxi Kovai",
    "description": "About Get Taxi Kovai - Coimbatore's premier 24/7 call taxi service founded on transparent pricing, verified drivers, and rapid 15-minute doorstep dispatch.",
    "url": `${SITE_URL}/about.html`
  };

  const bodyContent = `
  <section class="bg-slate-900 text-white py-14 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span class="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">Our Story & Standards</span>
      <h1 class="text-4xl sm:text-5xl font-black tracking-tight mt-3 text-white">About Get Taxi Kovai</h1>
      <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mt-3">Re-defining call taxi travel across Kongu Nadu with honesty, zero hidden fees, and courteous hospitality.</p>
    </div>
  </section>

  <section class="py-16 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-6 space-y-5 text-slate-700 text-base leading-relaxed">
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Coimbatore’s Trusted Taxi Partner</h2>
          <p>
            Founded in the heart of Gandhipuram, Coimbatore, <strong>Get Taxi Kovai</strong> was built to solve a major frustration among passengers: unexpected surge pricing, driver cancellations, and exorbitant return kilometer charges on one-way outstation trips.
          </p>
          <p>
            We introduced transparent per-kilometer rates (<strong class="text-slate-900">Base ₹80 + ₹28/km local</strong>, <strong class="text-slate-900">₹26/km one-way drop</strong>, and <strong class="text-slate-900">₹15/km round-trips</strong>) with a simple policy: what you are quoted is exactly what you pay.
          </p>
          <p>
            Today, our network covers over 500+ verified vehicles ranging from compact hatchbacks to executive sedans, spacious Ertigas, luxury Innova Crystas, and 14-seater Tempo Travellers.
          </p>
        </div>

        <div class="lg:col-span-6">
          <div class="bg-slate-50 rounded-2xl p-8 border border-slate-200 space-y-6">
            <h3 class="text-xl font-bold text-slate-900">Our Core Service Promises</h3>
            <div class="space-y-4 text-sm text-slate-700">
              <div class="flex items-start gap-3">
                <span class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold flex-shrink-0">1</span>
                <div>
                  <h4 class="font-bold text-slate-900">Zero Surge Pricing Policy</h4>
                  <p class="text-xs text-slate-500">Same fair rate whether it's 2 AM, heavy rain, or peak festival hours.</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold flex-shrink-0">2</span>
                <div>
                  <h4 class="font-bold text-slate-900">Nilgiri Mountain Expert Drivers</h4>
                  <p class="text-xs text-slate-500">Specialized drivers experienced on 36 hairpin bends to Ooty and 40 bends to Valparai.</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold flex-shrink-0">3</span>
                <div>
                  <h4 class="font-bold text-slate-900">15-Minute Doorstep Dispatch</h4>
                  <p class="text-xs text-slate-500">Dedicated dispatch desks across Gandhipuram, Peelamedu, RS Puram, and Saravanampatti.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;

  return generateHtmlPage({
    title: 'About Us | Get Taxi Kovai - Premier Coimbatore Call Taxi',
    description: 'Learn about Get Taxi Kovai, Coimbatore’s most dependable call taxi and outstation cab provider. 24/7 service, transparent rates, and verified mountain drivers.',
    keywords: 'About Get Taxi Kovai, best call taxi Coimbatore, taxi company Gandhipuram, Coimbatore cab service profile',
    canonicalUrl: `${SITE_URL}/about.html`,
    activeNav: 'about',
    bodyContent,
    schemaJson: schema
  });
}

// ==========================================
// 8. GENERATE CONTACT.HTML
// ==========================================
function generateContactPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact & 24/7 Booking - Get Taxi Kovai",
    "description": "Contact Get Taxi Kovai for 24/7 cab booking in Coimbatore. Call 9043743777 or visit Cross Cut Road, Gandhipuram.",
    "url": `${SITE_URL}/contact.html`
  };

  const bodyContent = `
  <section class="bg-slate-900 text-white py-14 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span class="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">24/7 Help Desk</span>
      <h1 class="text-4xl sm:text-5xl font-black tracking-tight mt-3 text-white">Contact & Quick Cab Booking</h1>
      <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mt-3">We are available 24 hours a day, 365 days a year for instant cab dispatch across Coimbatore.</p>
    </div>
  </section>

  <section class="py-14 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Contact Information -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-6">
            <h2 class="text-xl font-bold text-slate-900">Coimbatore Office & Dispatch</h2>
            
            <div class="space-y-4 text-sm text-slate-700">
              <div class="flex items-start gap-3">
                <span class="text-amber-500 text-lg">📍</span>
                <div>
                  <strong class="text-slate-900 block">Main Dispatch Office:</strong>
                  <p class="text-slate-600">Cross Cut Road, Gandhipuram, Coimbatore, Tamil Nadu 641012</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="text-amber-500 text-lg">📞</span>
                <div>
                  <strong class="text-slate-900 block">24/7 Booking Hotline:</strong>
                  <a href="tel:${PHONE_NUMBER}" class="text-amber-600 font-bold hover:underline">+91 ${PHONE_DISPLAY}</a>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="text-emerald-500 text-lg">💬</span>
                <div>
                  <strong class="text-slate-900 block">Instant WhatsApp Dispatch:</strong>
                  <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" class="text-emerald-600 font-bold hover:underline">Click to Chat on WhatsApp</a>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="text-blue-500 text-lg">🕒</span>
                <div>
                  <strong class="text-slate-900 block">Operating Hours:</strong>
                  <p class="text-slate-600">Open 24 Hours / 7 Days a Week (Including Holidays)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Direct Booking Form -->
        <div class="lg:col-span-7">
          <div class="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h2 class="text-2xl font-bold text-slate-900 mb-1">Book Your Cab Online</h2>
            <p class="text-xs text-slate-500 mb-6">Fill in your trip details to send an instant reservation directly to our dispatch desk.</p>

            <form id="contact-booking-form" class="space-y-4 text-sm">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input type="text" id="cust-name" required placeholder="e.g. Ramesh Kumar" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input type="tel" id="cust-phone" required placeholder="e.g. 9876543210" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Pickup Location in Kovai</label>
                  <input type="text" id="cust-pickup" required placeholder="e.g. Gandhipuram / Airport / RS Puram" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Destination / Drop Location</label>
                  <input type="text" id="cust-drop" required placeholder="e.g. Ooty / Isha Yoga / Bangalore" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Preferred Vehicle</label>
                  <select id="cust-vehicle" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none">
                    <option value="Executive Sedan (Dzire/Etios)">Executive Sedan (Dzire/Etios)</option>
                    <option value="Hatchback (WagonR/Indica)">Hatchback (WagonR/Indica)</option>
                    <option value="6-Seater SUV (Ertiga)">6-Seater SUV (Ertiga)</option>
                    <option value="7-Seater Innova Crysta">7-Seater Innova Crysta</option>
                    <option value="14-Seater Tempo Traveller">14-Seater Tempo Traveller</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Trip Type</label>
                  <select id="cust-triptype" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none">
                    <option value="One-Way Drop">One-Way Drop Taxi</option>
                    <option value="Round Trip">Outstation Round Trip</option>
                    <option value="Local Hourly Rental">Local City Ride</option>
                    <option value="Airport Transfer">Airport Transfer</option>
                  </select>
                </div>
              </div>

              <button type="submit" class="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-base transition shadow-md">
                Send Booking on WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('contact-booking-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('cust-name').value;
          const phone = document.getElementById('cust-phone').value;
          const pickup = document.getElementById('cust-pickup').value;
          const drop = document.getElementById('cust-drop').value;
          const veh = document.getElementById('cust-vehicle').value;
          const trip = document.getElementById('cust-triptype').value;

          const text = encodeURIComponent(
            'Hello Get Taxi Kovai, I would like to book a cab:\\n' +
            '• Name: ' + name + '\\n' +
            '• Phone: ' + phone + '\\n' +
            '• Pickup: ' + pickup + '\\n' +
            '• Drop: ' + drop + '\\n' +
            '• Vehicle: ' + veh + '\\n' +
            '• Trip Type: ' + trip
          );

          window.open('https://wa.me/919043743777?text=' + text, '_blank');
        });
      }
    });
  </script>
  `;

  return generateHtmlPage({
    title: 'Contact & 24/7 Cab Booking | Get Taxi Kovai 9043743777',
    description: 'Contact Get Taxi Kovai for 24/7 taxi booking in Coimbatore. Call 9043743777 or message on WhatsApp for 15-minute doorstep dispatch.',
    keywords: 'Contact Get Taxi Kovai, Coimbatore taxi phone number, call taxi 9043743777, book taxi Gandhipuram',
    canonicalUrl: `${SITE_URL}/contact.html`,
    activeNav: 'contact',
    bodyContent,
    schemaJson: schema
  });
}

// ==========================================
// 9. GENERATE SITEMAP.XML
// ==========================================
function generateSitemapXml() {
  const today = new Date().toISOString().split('T')[0];
  
  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/tariffs.html`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/tours.html`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/blog.html`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${SITE_URL}/about.html`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${SITE_URL}/contact.html`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${SITE_URL}/privacy.html`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${SITE_URL}/terms.html`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${SITE_URL}/cancellation-refund.html`, priority: '0.5', changefreq: 'monthly' },
  ];

  // Add Tour pages
  TOUR_PACKAGES.forEach(tour => {
    const filename = TOUR_PAGE_MAP[tour.id];
    if (filename) {
      urls.push({
        loc: `${SITE_URL}/${filename}`,
        priority: '0.85',
        changefreq: 'weekly'
      });
    }
  });

  // Add Blog pages
  BLOG_POSTS.forEach(post => {
    urls.push({
      loc: `${SITE_URL}/${getBlogFilename(post)}`,
      priority: '0.75',
      changefreq: 'monthly'
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

// ==========================================
// 10. GENERATE ROBOTS.TXT
// ==========================================
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

// ==========================================
// EXECUTE GENERATION OF ALL FILES
// ==========================================
console.log('Writing all static HTML files to workspace root...');

// 1. Home
fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), generateHomePage(), 'utf8');
console.log('✓ Created: index.html');

// 2. Tariffs
fs.writeFileSync(path.join(ROOT_DIR, 'tariffs.html'), generateTariffsPage(), 'utf8');
console.log('✓ Created: tariffs.html');

// 3. Tours Directory
fs.writeFileSync(path.join(ROOT_DIR, 'tours.html'), generateToursDirectoryPage(), 'utf8');
console.log('✓ Created: tours.html');

// 4. Individual Tour Pages
TOUR_PACKAGES.forEach(tour => {
  const filename = TOUR_PAGE_MAP[tour.id];
  if (filename) {
    fs.writeFileSync(path.join(ROOT_DIR, filename), generateIndividualTourPage(tour), 'utf8');
    console.log(`✓ Created Tour Page: ${filename}`);
  }
});

// 5. Blog Directory
fs.writeFileSync(path.join(ROOT_DIR, 'blog.html'), generateBlogDirectoryPage(), 'utf8');
console.log('✓ Created: blog.html');

// 6. Individual Blog Pages
BLOG_POSTS.forEach(post => {
  const filename = getBlogFilename(post);
  fs.writeFileSync(path.join(ROOT_DIR, filename), generateIndividualBlogPostPage(post), 'utf8');
  console.log(`✓ Created Blog Page: ${filename}`);
});

// 7. About Page
fs.writeFileSync(path.join(ROOT_DIR, 'about.html'), generateAboutPage(), 'utf8');
console.log('✓ Created: about.html');

// 8. Contact Page
fs.writeFileSync(path.join(ROOT_DIR, 'contact.html'), generateContactPage(), 'utf8');
console.log('✓ Created: contact.html');

// 9. Mandatory Legal Pages (Privacy, Terms, Cancellation/Refund)
writeLegalPages();

// 10. Sitemap & Robots
fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), generateSitemapXml(), 'utf8');
console.log('✓ Created: sitemap.xml');

fs.writeFileSync(path.join(ROOT_DIR, 'robots.txt'), generateRobotsTxt(), 'utf8');
console.log('✓ Created: robots.txt');

// Copy sitemap.xml & robots.txt to public folder too
if (fs.existsSync(path.join(ROOT_DIR, 'public'))) {
  fs.writeFileSync(path.join(ROOT_DIR, 'public', 'sitemap.xml'), generateSitemapXml(), 'utf8');
  fs.writeFileSync(path.join(ROOT_DIR, 'public', 'robots.txt'), generateRobotsTxt(), 'utf8');
}

console.log('🎉 ALL STATIC HTML FILES AND SITEMAP GENERATED SUCCESSFULLY!');
