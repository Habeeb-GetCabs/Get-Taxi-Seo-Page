import fs from 'fs';
import path from 'path';

import { TOUR_PACKAGES } from './src/data/tours.ts';
import { BLOG_POSTS } from './src/data/blogs.ts';
import { FIXED_ROUTE_CARDS, TARIFF_POLICIES, FAQS, INITIAL_REVIEWS } from './src/data/tariffs.ts';
import { POPULAR_LOCATIONS, VEHICLES } from './src/data/locations.ts';
import { SITE_URL, PHONE_NUMBER, PHONE_DISPLAY, WHATSAPP_URL, generateHtmlPage } from './build-static-site.js';

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
            <span>✨ Lowest Fare Taxi in Coimbatore</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Coimbatore Cabs at <br class="hidden sm:inline" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">Unbeatable Rates</span>
          </h1>

          <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
            Experience 100% transparent pricing with zero surge fees. Local rides from <strong class="text-amber-400">Base ₹80 + ₹28/km</strong>, One-Way drops at <strong class="text-amber-400">₹26/km</strong>, Round Trips at <strong class="text-amber-400">₹15/km</strong>, and Airport Transfers at <strong class="text-amber-400">Base ₹100 + ₹30/km</strong>.
          </p>

          <!-- Quick Action Buttons -->
          <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <a href="tel:${PHONE_NUMBER}" class="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-base shadow-lg shadow-amber-400/20 hover:scale-[1.02] transition">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z"/></svg>
              Call 9043743777
            </a>
            <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" class="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              WhatsApp 24/7
            </a>
          </div>

          <!-- Trust Badges -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 text-left">
            <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <p class="text-amber-400 font-extrabold text-base">15 Mins</p>
              <p class="text-xs text-slate-400">Doorstep Dispatch</p>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <p class="text-amber-400 font-extrabold text-base">Zero Surge</p>
              <p class="text-xs text-slate-400">Fixed Fare Guarantee</p>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <p class="text-amber-400 font-extrabold text-base">₹26 / KM</p>
              <p class="text-xs text-slate-400">One-Way Drops</p>
            </div>
            <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <p class="text-amber-400 font-extrabold text-base">50k+ Happy</p>
              <p class="text-xs text-slate-400">Riders in Kovai</p>
            </div>
          </div>
        </div>

        <!-- Interactive Live Fare Estimator Card -->
        <div class="lg:col-span-5">
          <div class="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 class="text-lg font-black text-slate-900 tracking-tight">Instant Fare Estimator</h3>
                <p class="text-xs text-slate-500">Calculate your exact ride estimate</p>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">Live Rates</span>
            </div>

            <!-- Ride Type Selector Tabs -->
            <div class="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold" id="ride-type-tabs">
              <button type="button" class="tab-btn py-2 px-1 rounded-lg text-center bg-white text-slate-900 shadow-xs transition" data-type="oneway">One-Way</button>
              <button type="button" class="tab-btn py-2 px-1 rounded-lg text-center text-slate-600 hover:text-slate-900 transition" data-type="roundtrip">Round-Trip</button>
              <button type="button" class="tab-btn py-2 px-1 rounded-lg text-center text-slate-600 hover:text-slate-900 transition" data-type="local">Local City</button>
              <button type="button" class="tab-btn py-2 px-1 rounded-lg text-center text-slate-600 hover:text-slate-900 transition" data-type="airport">Airport</button>
            </div>

            <!-- Form Inputs -->
            <div class="space-y-3 text-sm">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Pickup Location</label>
                <select id="calc-pickup" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none">
                  <option value="gandhipuram">Gandhipuram, Coimbatore</option>
                  <option value="cbe-airport">Coimbatore Airport (CJB)</option>
                  <option value="cbe-junction">Coimbatore Railway Junction</option>
                  <option value="peelamedu">Peelamedu / TIDEL Park</option>
                  <option value="rs-puram">RS Puram</option>
                  <option value="saravanampatti">Saravanampatti</option>
                  <option value="singanallur">Singanallur</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Destination / Drop Location</label>
                <select id="calc-drop" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none">
                  <option value="ooty">Ooty (86 KM)</option>
                  <option value="coonoor">Coonoor (68 KM)</option>
                  <option value="isha-yoga">Isha Yoga Center (30 KM)</option>
                  <option value="kodaikanal">Kodaikanal (175 KM)</option>
                  <option value="valparai">Valparai (105 KM)</option>
                  <option value="palani">Palani Murugan Temple (108 KM)</option>
                  <option value="munnar">Munnar Kerala (160 KM)</option>
                  <option value="bangalore">Bangalore (360 KM)</option>
                  <option value="chennai">Chennai (505 KM)</option>
                  <option value="tiruppur">Tiruppur (55 KM)</option>
                  <option value="salem">Salem (165 KM)</option>
                  <option value="madurai">Madurai (215 KM)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Select Vehicle Class</label>
                <select id="calc-vehicle" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none">
                  <option value="sedan">Executive Sedan (Dzire / Etios) - 4 Seater</option>
                  <option value="hatchback">Hatchback (WagonR / Indica) - 4 Seater</option>
                  <option value="suv">Family SUV (Ertiga) - 6 Seater</option>
                  <option value="crysta">Innova Crysta - 7 Seater Luxury</option>
                  <option value="tempo">14-Seater Tempo Traveller</option>
                </select>
              </div>

              <!-- Live Estimate Display Box -->
              <div class="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-slate-900 mt-2">
                <div class="flex justify-between items-center">
                  <div>
                    <span class="text-xs text-slate-600 block">Estimated Distance</span>
                    <span class="text-sm font-extrabold text-slate-900" id="calc-dist-display">86 KM (approx)</span>
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-slate-600 block">Estimated Fare</span>
                    <span class="text-xl font-black text-amber-600" id="calc-fare-display">₹2,536*</span>
                  </div>
                </div>
                <p class="text-[11px] text-slate-500 mt-1.5" id="calc-fare-breakdown">*Flat ₹26/km + ₹300 Driver Batta. Tolls extra.</p>
              </div>

              <!-- Quick Book Trigger -->
              <div class="pt-1 flex gap-2">
                <a id="calc-whatsapp-btn" href="${WHATSAPP_URL}" target="_blank" rel="noopener" class="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm text-center flex items-center justify-center gap-2 transition shadow-sm">
                  <span>Book on WhatsApp</span>
                </a>
                <a href="tel:${PHONE_NUMBER}" class="py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm text-center flex items-center justify-center gap-1 transition">
                  <span>Call</span>
                </a>
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
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Coimbatore Taxi Tariff Rates</h2>
        <p class="text-base text-slate-600 mt-2">Guaranteed lowest fares in Coimbatore with clear per-km billing and zero hidden surprises.</p>
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
            <div class="flex justify-between"><span class="text-slate-600">Base Fare:</span> <strong class="text-slate-900">₹80</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Per KM Charge:</span> <strong class="text-slate-900">₹28 / KM</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Hourly Package:</span> <strong class="text-slate-900">₹375 / 2 hrs</strong></div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-200">
            <a href="tariffs.html" class="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">View Local Tariff &rarr;</a>
          </div>
        </div>

        <!-- Card 2: One-Way Drop Taxi -->
        <div class="bg-amber-50/50 rounded-2xl p-6 border-2 border-amber-300 hover:shadow-md transition relative">
          <span class="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">Most Popular</span>
          <div class="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl mb-4">
            🚀
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">One-Way Drop Taxi</h3>
          <p class="text-xs text-slate-500 mb-4">Save 50% on return km across TN & Bangalore</p>
          <div class="space-y-2 text-sm border-t border-amber-200 pt-3">
            <div class="flex justify-between"><span class="text-slate-600">Per KM Rate:</span> <strong class="text-slate-900">₹26 / KM</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Driver Batta:</span> <strong class="text-slate-900">₹300 / drop</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Return KM:</span> <strong class="text-emerald-700 font-bold">ZERO Charge</strong></div>
          </div>
          <div class="mt-4 pt-3 border-t border-amber-200">
            <a href="tariffs.html" class="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1">Calculate One-Way Drops &rarr;</a>
          </div>
        </div>

        <!-- Card 3: Outstation Round Trips -->
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-amber-400 hover:shadow-md transition">
          <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl mb-4">
            ⛰️
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">Outstation Round Trips</h3>
          <p class="text-xs text-slate-500 mb-4">Ooty, Kodaikanal, Valparai, Munnar Holidays</p>
          <div class="space-y-2 text-sm border-t border-slate-200 pt-3">
            <div class="flex justify-between"><span class="text-slate-600">Per KM Rate:</span> <strong class="text-slate-900">₹15 / KM</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Driver Batta:</span> <strong class="text-slate-900">₹400 / day</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Hill Climbs:</span> <strong class="text-slate-900">Included</strong></div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-200">
            <a href="tours.html" class="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">View Tour Packages &rarr;</a>
          </div>
        </div>

        <!-- Card 4: Airport Transfers -->
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-amber-400 hover:shadow-md transition">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl mb-4">
            ✈️
          </div>
          <h3 class="text-lg font-bold text-slate-900 mb-1">CJB Airport Transfers</h3>
          <p class="text-xs text-slate-500 mb-4">24/7 Flight Tracking & Terminal Pickup</p>
          <div class="space-y-2 text-sm border-t border-slate-200 pt-3">
            <div class="flex justify-between"><span class="text-slate-600">Base Fare:</span> <strong class="text-slate-900">₹100</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Per KM Rate:</span> <strong class="text-slate-900">₹30 / KM</strong></div>
            <div class="flex justify-between"><span class="text-slate-600">Surge Pricing:</span> <strong class="text-emerald-700 font-bold">ZERO Surge</strong></div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-200">
            <a href="tel:${PHONE_NUMBER}" class="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1">Book Airport Cab &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Popular Fixed Cab Routes Table -->
  <section class="py-16 bg-slate-50 border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Popular Fixed Cab Routes</h2>
          <p class="text-base text-slate-600 mt-1">Direct point-to-point transfers from Coimbatore with transparent package fares.</p>
        </div>
        <a href="tariffs.html" class="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition">
          View All 16 Fixed Routes &rarr;
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${FIXED_ROUTE_CARDS.slice(0, 6).map(rc => `
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-bold text-slate-900">${rc.route}</h3>
            <span class="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-black text-sm">₹${rc.fare}</span>
          </div>
          <p class="text-xs text-slate-500 font-semibold mb-2">Distance: ${rc.distance}</p>
          <p class="text-xs text-slate-600 leading-relaxed mb-4">${rc.description}</p>
          <div class="flex flex-wrap gap-1.5 mb-4">
            ${rc.attractions.map(att => `<span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">${att}</span>`).join('')}
          </div>
          <a href="https://wa.me/91${PHONE_NUMBER}?text=Hello%2C%20I%20would%20like%20to%20book%20a%20cab%20for%20route%20${encodeURIComponent(rc.route)}%20(Fare%20₹${rc.fare})" target="_blank" rel="noopener" class="block w-full py-2 rounded-xl bg-slate-100 hover:bg-amber-400 hover:text-slate-950 text-slate-800 text-center font-bold text-xs transition">
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

  <!-- Clean Fleet Showcase -->
  <section class="py-16 bg-slate-50 border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Our Well-Maintained Fleet</h2>
        <p class="text-base text-slate-600 mt-2">100% Air-conditioned, sanitized vehicles driven by polite, verified local drivers.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${VEHICLES.map(v => `
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-400 transition">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-lg font-bold text-slate-900">${v.name}</h3>
              <p class="text-xs text-slate-500">${v.models}</p>
            </div>
            <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">👤 ${v.passengers} Seats</span>
          </div>
          <p class="text-xs text-slate-600 mb-4">${v.popularFor}</p>
          <div class="bg-slate-50 rounded-xl p-3 space-y-1 text-xs border border-slate-100 mb-4">
            <div class="flex justify-between"><span class="text-slate-500">One-Way Drop:</span> <strong class="text-slate-900">₹${v.ratePerKmOneWay} / KM</strong></div>
            <div class="flex justify-between"><span class="text-slate-500">Round Trip:</span> <strong class="text-slate-900">₹${v.ratePerKmRoundTrip} / KM</strong></div>
            <div class="flex justify-between"><span class="text-slate-500">Driver Batta:</span> <strong class="text-slate-900">₹${v.driverBataPerDay} / day</strong></div>
          </div>
          <a href="https://wa.me/91${PHONE_NUMBER}?text=Hello%2C%20I%20want%20to%20book%20a%20${encodeURIComponent(v.name)}" target="_blank" rel="noopener" class="block w-full py-2.5 rounded-xl bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-white font-bold text-xs text-center transition">
            Book ${v.name}
          </a>
        </div>
        `).join('')}
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
        <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">Trusted by 50,000+ Travellers</h2>
        <p class="text-base text-slate-600 mt-2">See what passengers say about Get Taxi Kovai drivers and pricing.</p>
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

  <!-- CTA Banner -->
  <section class="py-16 bg-slate-950 text-white text-center relative overflow-hidden">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Ride? Book Your Cab in 60 Seconds</h2>
      <p class="text-slate-300 text-base max-w-2xl mx-auto">Call or WhatsApp our 24/7 booking desk at <strong>9043743777</strong> for guaranteed on-time doorstep dispatch anywhere in Coimbatore.</p>
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
    document.addEventListener('DOMContentLoaded', () => {
      const dists = {
        'ooty': 86,
        'coonoor': 68,
        'isha-yoga': 30,
        'kodaikanal': 175,
        'valparai': 105,
        'palani': 108,
        'munnar': 160,
        'bangalore': 360,
        'chennai': 505,
        'tiruppur': 55,
        'salem': 165,
        'madurai': 215
      };

      const vehRates = {
        'hatchback': { oneway: 26, roundtrip: 15, bata: 300 },
        'sedan': { oneway: 26, roundtrip: 15, bata: 300 },
        'suv': { oneway: 28, roundtrip: 18, bata: 400 },
        'crysta': { oneway: 32, roundtrip: 20, bata: 400 },
        'tempo': { oneway: 36, roundtrip: 25, bata: 500 }
      };

      let activeRideType = 'oneway';

      const tabs = document.querySelectorAll('#ride-type-tabs .tab-btn');
      const dropSelect = document.getElementById('calc-drop');
      const vehSelect = document.getElementById('calc-vehicle');
      const distDisp = document.getElementById('calc-dist-display');
      const fareDisp = document.getElementById('calc-fare-display');
      const breakdownDisp = document.getElementById('calc-fare-breakdown');
      const whatsappBtn = document.getElementById('calc-whatsapp-btn');

      function updateCalculation() {
        const destKey = dropSelect.value;
        const vehKey = vehSelect.value;
        const km = dists[destKey] || 86;
        const vInfo = vehRates[vehKey] || vehRates['sedan'];

        let estimatedFare = 0;
        let breakdownText = '';

        if (activeRideType === 'oneway') {
          estimatedFare = Math.round(km * vInfo.oneway + vInfo.bata);
          distDisp.textContent = km + ' KM (One-Way)';
          breakdownText = 'Flat ₹' + vInfo.oneway + '/KM + ₹' + vInfo.bata + ' Driver Batta (Zero return KM fee)';
        } else if (activeRideType === 'roundtrip') {
          const totalKm = Math.max(km * 2, 250);
          estimatedFare = Math.round(totalKm * vInfo.roundtrip + vInfo.bata);
          distDisp.textContent = (km * 2) + ' KM (Round Trip)';
          breakdownText = '₹' + vInfo.roundtrip + '/KM + ₹' + vInfo.bata + ' Driver Batta/day';
        } else if (activeRideType === 'local') {
          estimatedFare = 80 + (km * 28);
          distDisp.textContent = 'City Travel (~' + km + ' KM)';
          breakdownText = 'Base fare ₹80 + ₹28 per KM (Hourly pkgs: ₹375 / 2 hrs)';
        } else if (activeRideType === 'airport') {
          estimatedFare = 100 + (km * 30);
          distDisp.textContent = 'Airport Drop (~' + km + ' KM)';
          breakdownText = 'Base fare ₹100 + ₹30 per KM (Tolls extra as applicable)';
        }

        fareDisp.textContent = '₹' + estimatedFare.toLocaleString();
        breakdownDisp.textContent = breakdownText;

        const destName = dropSelect.options[dropSelect.selectedIndex].text;
        const vehName = vehSelect.options[vehSelect.selectedIndex].text;
        const msg = encodeURIComponent('Hello Get Taxi Kovai, I want to book a ' + activeRideType + ' cab to ' + destName + ' (' + vehName + '). Estimated Fare: ₹' + estimatedFare);
        whatsappBtn.href = 'https://wa.me/919043743777?text=' + msg;
      }

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => {
            t.classList.remove('bg-white', 'text-slate-900', 'shadow-xs');
            t.classList.add('text-slate-600');
          });
          tab.classList.add('bg-white', 'text-slate-900', 'shadow-xs');
          tab.classList.remove('text-slate-600');
          activeRideType = tab.dataset.type;
          updateCalculation();
        });
      });

      dropSelect.addEventListener('change', updateCalculation);
      vehSelect.addEventListener('change', updateCalculation);

      updateCalculation();
    });
  </script>
  `;

  return generateHtmlPage({
    title: 'Get Taxi Kovai | Lowest Fare Taxi Service in Coimbatore | Call 9043743777',
    description: 'Book Get Taxi Kovai for premier Coimbatore cabs. Local rides from Base ₹80 + ₹28/km, One-Way drops at ₹26/km, Round trips at ₹15/km, and Airport drops at ₹100 base + ₹30/km. Call 9043743777!',
    keywords: 'Get Taxi Kovai, taxi in Coimbatore, Coimbatore airport cab, Ooty drop taxi, outstation cabs Coimbatore, lowest fare taxi, call taxi Coimbatore, Isha Yoga cab, Valparai taxi, Kodaikanal drop taxi, Kovai call taxi 9043743777',
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
    "name": "Coimbatore Taxi Tariffs & Rate Card - Get Taxi Kovai",
    "description": "Complete rate card for Get Taxi Kovai. Local rides, One-way drop taxi (₹26/km), Round trips (₹15/km), Airport transfers, and 16 Fixed Route fares.",
    "url": `${SITE_URL}/tariffs.html`
  };

  const bodyContent = `
  <section class="bg-slate-900 text-white py-14 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <span class="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">100% Transparent Billing</span>
      <h1 class="text-4xl sm:text-5xl font-black tracking-tight mt-3 text-white">Coimbatore Taxi Tariff & Rate Card</h1>
      <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mt-3">Zero surge pricing, zero hidden kilometer tricks. Clear per-kilometer rates for all vehicles.</p>
    </div>
  </section>

  <!-- Master Tariff Comparison Table -->
  <section class="py-14 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Vehicle Category Rate Matrix</h2>
        <p class="text-sm text-slate-600 mt-1">Compare per-kilometer and daily rates across our entire fleet.</p>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
        <table class="w-full text-left text-sm border-collapse">
          <thead class="bg-slate-900 text-white text-xs uppercase tracking-wider">
            <tr>
              <th class="p-4">Vehicle Model</th>
              <th class="p-4">Seats / Capacity</th>
              <th class="p-4">One-Way Drop Rate</th>
              <th class="p-4">Round Trip Rate</th>
              <th class="p-4">Driver Batta</th>
              <th class="p-4">Local (Base + KM)</th>
              <th class="p-4 text-center">Instant Booking</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            ${VEHICLES.map(v => `
            <tr class="hover:bg-slate-50 transition">
              <td class="p-4 font-bold text-slate-900">
                <div>${v.name}</div>
                <div class="text-xs text-slate-500 font-normal">${v.models}</div>
              </td>
              <td class="p-4 text-slate-600">${v.passengers} Passengers + ${v.luggage} Bags</td>
              <td class="p-4 font-extrabold text-amber-600 text-base">₹${v.ratePerKmOneWay} / KM</td>
              <td class="p-4 font-extrabold text-slate-900 text-base">₹${v.ratePerKmRoundTrip} / KM</td>
              <td class="p-4 text-slate-600">₹${v.driverBataPerDay} / day</td>
              <td class="p-4 text-slate-700">Base ₹80 + ₹28/km</td>
              <td class="p-4 text-center">
                <a href="https://wa.me/91${PHONE_NUMBER}?text=Hello%2C%20I%20want%20to%20book%20a%20${encodeURIComponent(v.name)}" target="_blank" rel="noopener" class="inline-flex px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition">
                  Book Now
                </a>
              </td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Complete 16 Fixed Route Tariff Cards -->
  <section class="py-14 bg-slate-50 border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-10">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">16 Fixed Point-to-Point Package Fares</h2>
        <p class="text-sm text-slate-600 mt-1">Guaranteed package rates with doorstep pickup in Coimbatore.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        ${FIXED_ROUTE_CARDS.map(rc => `
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-slate-900 text-base">${rc.route}</h3>
              <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-sm">₹${rc.fare}</span>
            </div>
            <p class="text-xs text-slate-500 font-medium mb-2">Distance: ${rc.distance}</p>
            <p class="text-xs text-slate-600 leading-relaxed mb-3">${rc.description}</p>
          </div>
          <a href="https://wa.me/91${PHONE_NUMBER}?text=Hello%20Get%20Taxi%20Kovai%2C%20I%20want%20to%20book%20the%20${encodeURIComponent(rc.route)}%20cab%20package%20(Fare%20₹${rc.fare})" target="_blank" rel="noopener" class="block w-full py-2 rounded-xl bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-white text-center font-bold text-xs transition">
            Book Route
          </a>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Tariff Rules & Policies -->
  <section class="py-14 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center max-w-3xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Tariff Policy & Distance Calculation Rules</h2>
        <p class="text-sm text-slate-600 mt-1">Clear operational guidelines to ensure complete clarity before your trip starts.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        ${TARIFF_POLICIES.map(tp => `
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
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
      <p class="text-sm text-slate-400">Speak directly with our Coimbatore taxi dispatch desk for instant customized quotes.</p>
      <div class="flex justify-center gap-3 pt-2">
        <a href="tel:${PHONE_NUMBER}" class="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition">Call 9043743777</a>
        <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition">WhatsApp Us</a>
      </div>
    </div>
  </section>
  `;

  return generateHtmlPage({
    title: 'Coimbatore Taxi Tariffs & Rate Card | Get Taxi Kovai 9043743777',
    description: 'Complete Coimbatore taxi tariff rate card. Local rides from Base ₹80 + ₹28/km, One-way drops at flat ₹26/km, Round trips at ₹15/km, and Airport drops at Base ₹100 + ₹30/km.',
    keywords: 'Coimbatore taxi tariff, Kovai call taxi rates, Ooty drop taxi price, one way taxi Coimbatore rate card, outstation cab tariff Coimbatore, airport taxi charges Coimbatore',
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
function generateIndividualTourPage(tour) {
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
            We introduced transparent per-kilometer rates (<strong class="text-slate-900">Base ₹80 + ₹28/km local</strong>, <strong class="text-slate-900">₹26/km one-way drop</strong>, and <strong class="text-slate-900">₹15/km round-trips</strong>) with a simple guarantee: what you are quoted is exactly what you pay.
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
                  <h4 class="font-bold text-slate-900">Zero Surge Pricing Guarantee</h4>
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

// 9. Sitemap & Robots
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
