import fs from 'fs';
import path from 'path';
import {
  DISCOVERY_CATEGORIES,
  COIMBATORE_NEIGHBOURHOODS,
  VERIFIED_PLACES,
  STATEWIDE_DESTINATIONS,
  SCENIC_ROUTES,
  READY_TRIP_SUGGESTIONS,
} from './src/data/discovery.ts';
import {
  SITE_URL,
  PHONE_NUMBER,
  PHONE_DISPLAY,
  PHONE_HREF,
  WHATSAPP_URL,
  generateHtmlPage,
} from './build-static-site.js';

const ROOT_DIR = process.cwd();

function renderBreadcrumbs(items) {
  return `
  <nav aria-label="Breadcrumb" class="bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 py-2.5 px-4">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center gap-1.5">
      ${items
        .map((item, idx) => {
          const isLast = idx === items.length - 1;
          if (isLast || !item.href) {
            return `<span class="text-amber-400 font-semibold" aria-current="page">${item.label}</span>`;
          }
          return `<a href="${item.href}" class="hover:text-white transition">${item.label}</a><span class="text-slate-600">/</span>`;
        })
        .join('')}
    </div>
  </nav>`;
}

function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      item: item.href ? `${SITE_URL}/${item.href === 'index.html' ? '' : item.href}` : undefined,
    })),
  };
}

function escAttr(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Indicative straight-line geographic distance calculation with typical road factor (~1.28x)
// Note: This is an indicative reference estimate and must not be presented as a verified odometer driving route
function calcIndicativeDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightKm = R * c;
  return Math.max(1, Math.round(straightKm * 1.28 * 10) / 10);
}

function renderPlaceCard(place) {
  const nbObj = COIMBATORE_NEIGHBOURHOODS.find(
    (n) => n.name === place.neighbourhood || place.neighbourhood.includes(n.name)
  );
  const waText = encodeURIComponent(
    `Hello Get Taxi Kovai, I would like to enquire about a cab for ${place.name} (${place.locality}, ${place.city}). Pickup: ${place.taxiOptions.prefillPickup}.`
  );

  return `
  <article class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between" data-place-card data-name="${escAttr(place.name.toLowerCase())}" data-category="${escAttr(place.category)}" data-neighbourhood="${escAttr(place.neighbourhood.toLowerCase())}" data-city="${escAttr(place.city.toLowerCase())}" data-keywords="${escAttr((place.name + ' ' + place.subcategory + ' ' + place.locality + ' ' + place.neighbourhood + ' ' + place.shortDescription).toLowerCase())}">
    <div>
      <div class="relative h-48 bg-slate-900 overflow-hidden">
        <img src="${place.image}" alt="${escAttr(place.name)}" width="600" height="384" loading="lazy" decoding="async" class="w-full h-full object-cover" onerror="this.style.display='none'" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
        <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 text-[11px] font-semibold">
          <span class="px-2.5 py-1 rounded-md bg-slate-950/80 text-amber-400 border border-slate-800">${place.subcategory}</span>
          ${place._distanceBadge ? `<span class="px-2.5 py-1 rounded-md bg-slate-950/90 text-emerald-300 border border-slate-700">${place._distanceBadge}</span>` : (place.isHiddenGem ? `<span class="px-2.5 py-1 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-700">Quieter / Offbeat</span>` : '')}
        </div>
        <div class="absolute bottom-3 left-3 right-3 text-white">
          <p class="text-[11px] text-slate-300 font-medium">${place.locality} · ${place.city}</p>
          <h3 class="text-base font-extrabold leading-snug text-white mt-0.5">
            <a href="place-${place.slug}.html" class="hover:text-amber-300 transition">${place.name}</a>
          </h3>
        </div>
      </div>

      <div class="p-5 space-y-3">
        <p class="text-xs text-slate-600 leading-relaxed line-clamp-3">${place.shortDescription}</p>
        
        <div class="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
          <p><strong class="text-slate-700">Address:</strong> ${place.postalAddress}</p>
          ${place.openingHours ? `<p><strong class="text-slate-700">Hours:</strong> ${place.openingHours}</p>` : ''}
          <p><strong class="text-slate-700">Verification:</strong> Verified (${place.lastVerifiedDate}) · ${place.sourceOfInfo}</p>
        </div>
      </div>
    </div>

    <div class="px-5 pb-5 pt-2 flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50/60">
      <a href="place-${place.slug}.html" class="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition">
        Visitor Guide & Details
      </a>
      <a href="https://wa.me/91${PHONE_NUMBER}?text=${waText}" target="_blank" rel="noopener" data-conversion-intent="whatsapp" class="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs text-center transition">
        ${place.taxiOptions.primaryActionLabel}
      </a>
      ${nbObj ? `<a href="neighbourhood-${nbObj.slug}.html" class="w-full text-[11px] text-slate-500 hover:text-amber-600 text-center pt-1 font-medium">Explore ${nbObj.name} Neighbourhood →</a>` : ''}
    </div>
  </article>`;
}

// ==========================================
// 1. EXPLORE TAMIL NADU — MAIN LANDING PAGE
// ==========================================
export function generateExploreTamilNaduPage() {
  const canonicalUrl = `${SITE_URL}/explore-tamil-nadu.html`;
  const breadcrumbs = [
    { label: 'Home', href: 'index.html' },
    { label: 'Explore Tamil Nadu', href: 'explore-tamil-nadu.html' },
  ];

  const schema = [
    buildBreadcrumbSchema(breadcrumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Explore Tamil Nadu & Coimbatore Local Discovery Directory | Get Taxi Kovai',
      description:
        'Comprehensive local discovery, destination guide, temples, restaurants, hospitals, transport hubs, scenic drives, and trip planner across Coimbatore and Tamil Nadu.',
      url: canonicalUrl,
    },
  ];

  const searchIndexJson = JSON.stringify([
    ...VERIFIED_PLACES.map((p) => ({
      type: 'Place',
      title: p.name,
      subtitle: `${p.subcategory} · ${p.locality}, ${p.city}`,
      category: p.category,
      city: p.city,
      neighbourhood: p.neighbourhood,
      url: `place-${p.slug}.html`,
      lat: p.coordinates?.lat || 11.0168,
      lng: p.coordinates?.lng || 76.9558,
      keywords: `${p.name} ${p.subcategory} ${p.categoryLabel} ${p.locality} ${p.neighbourhood} ${p.city} ${p.shortDescription}`.toLowerCase(),
    })),
    ...COIMBATORE_NEIGHBOURHOODS.map((n) => ({
      type: 'Neighbourhood',
      title: `${n.name} (${n.city})`,
      subtitle: `${n.ZoneLabel} · PIN ${n.postalPin}`,
      category: 'neighbourhood',
      city: 'Coimbatore',
      neighbourhood: n.name,
      url: `neighbourhood-${n.slug}.html`,
      lat: n.coordinates.lat,
      lng: n.coordinates.lng,
      keywords: `${n.name} ${n.ZoneLabel} ${n.keyLandmarks.join(' ')} ${n.popularFor.join(' ')} coimbatore`.toLowerCase(),
    })),
    ...STATEWIDE_DESTINATIONS.map((d) => ({
      type: d.isCrossState ? 'Cross-State Guide (Kerala)' : 'Destination',
      title: d.name,
      subtitle: `${d.categoryLabel} · ${d.distanceFromCoimbatoreKm} KM from Coimbatore`,
      category: d.category,
      city: d.name,
      neighbourhood: d.districtOrRegion,
      url: `destination-${d.slug}.html`,
      lat: d.coordinates?.lat || 11.0168,
      lng: d.coordinates?.lng || 76.9558,
      keywords: `${d.name} ${d.districtOrRegion} ${d.categoryLabel} ${d.topAttractions.join(' ')} ${d.shortSummary} taxi`.toLowerCase(),
    })),
    ...SCENIC_ROUTES.map((r) => ({
      type: 'Scenic Route',
      title: r.title,
      subtitle: `${r.distanceRegularKm} KM · ${r.approxDuration}`,
      category: 'hill-stations-nature',
      city: r.origin,
      neighbourhood: r.destination,
      url: `scenic-routes.html#${r.slug}`,
      lat: 11.0168,
      lng: 76.9558,
      keywords: `${r.title} ${r.origin} ${r.destination} ${r.regularRouteSummary} ${r.scenicAlternativeSummary}`.toLowerCase(),
    })),
  ]);

  const bodyContent = `
  ${renderBreadcrumbs(breadcrumbs)}

  <!-- Hero & Live Discovery Search Engine -->
  <section class="bg-slate-950 text-white py-14 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mb-8">
        <p class="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Tamil Nadu Local Discovery & Travel Directory</p>
        <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Explore Coimbatore & Tamil Nadu
        </h1>
        <p class="text-slate-300 text-base sm:text-lg mt-3 leading-relaxed">
          Discover verified places, temples, restaurants, hospitals, transit hubs, public facilities, scenic hill drives, and city-to-city travel guides—with optional doorstep taxi booking whenever you need a ride.
        </p>
      </div>

      <!-- Interactive Search & Filter Console -->
      <div class="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-200">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div class="md:col-span-5">
            <label for="discovery-search-input" class="block text-xs font-bold text-slate-700 mb-1">Search Places, Landmarks, Cities or Routes</label>
            <input
              id="discovery-search-input"
              type="text"
              placeholder="e.g. Restaurants in RS Puram, Maruthamalai, Airport hotels, Ooty..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none"
            />
          </div>
          <div class="md:col-span-3">
            <label for="discovery-category-select" class="block text-xs font-bold text-slate-700 mb-1">Category</label>
            <select id="discovery-category-select" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-semibold text-slate-900 focus:outline-none">
              <option value="all">All Categories</option>
              ${DISCOVERY_CATEGORIES.map((c) => `<option value="${c.slug}">${c.shortTitle}</option>`).join('')}
              <option value="neighbourhood">Coimbatore Neighbourhoods</option>
              <option value="hill-station">Hill Stations & Destinations</option>
              <option value="pilgrimage">Pilgrimage Towns</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label for="discovery-area-select" class="block text-xs font-bold text-slate-700 mb-1">City / Locality</label>
            <select id="discovery-area-select" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-semibold text-slate-900 focus:outline-none">
              <option value="all">All Tamil Nadu</option>
              <option value="coimbatore">Coimbatore (All)</option>
              ${COIMBATORE_NEIGHBOURHOODS.map((n) => `<option value="${n.name.toLowerCase()}">CBE: ${n.name}</option>`).join('')}
              <option value="ooty">Ooty & Coonoor</option>
              <option value="kodaikanal">Kodaikanal & Palani</option>
              <option value="valparai">Valparai & Pollachi</option>
              <option value="madurai">Madurai & South TN</option>
              <option value="chennai">Chennai & North TN</option>
            </select>
          </div>
          <div class="md:col-span-2 flex items-end gap-2">
            <button type="button" id="discovery-near-me-btn" class="w-full py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition cursor-pointer" title="Find places near your current location (asks permission)">
              Near Me (GPS)
            </button>
          </div>
        </div>

        <!-- Popular Search Intent Chips -->
        <div class="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span class="font-bold text-slate-500">Popular Searches:</span>
          <button type="button" class="quick-search-chip px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 font-semibold transition cursor-pointer" data-q="places to visit coimbatore">Best places in Coimbatore</button>
          <button type="button" class="quick-search-chip px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 font-semibold transition cursor-pointer" data-q="rs puram restaurant">Restaurants in RS Puram</button>
          <button type="button" class="quick-search-chip px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 font-semibold transition cursor-pointer" data-q="airport hotel">Hotels near CJB Airport</button>
          <button type="button" class="quick-search-chip px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 font-semibold transition cursor-pointer" data-q="maruthamalai">Maruthamalai Temple</button>
          <button type="button" class="quick-search-chip px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 font-semibold transition cursor-pointer" data-q="hospital">Hospitals in Coimbatore</button>
          <button type="button" class="quick-search-chip px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 font-semibold transition cursor-pointer" data-q="parking toilet">Public Toilets & Parking</button>
          <button type="button" class="quick-search-chip px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 font-semibold transition cursor-pointer" data-q="ooty">Ooty Sightseeing</button>
          <button type="button" class="quick-search-chip px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 font-semibold transition cursor-pointer" data-q="kodaikanal">Coimbatore to Kodaikanal</button>
        </div>

        <p id="discovery-gps-status" class="hidden mt-3 text-xs font-semibold text-slate-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2" role="status" aria-live="polite"></p>

        <!-- Live Search Results Container -->
        <div id="discovery-search-results-wrap" class="hidden mt-5 pt-4 border-t border-slate-200">
          <div class="flex items-center justify-between mb-3">
            <h2 id="discovery-results-heading" class="text-sm font-black text-slate-900">Matching Directory Records</h2>
            <button type="button" id="discovery-clear-btn" class="text-xs text-amber-700 font-bold hover:underline cursor-pointer">Reset Filters</button>
          </div>
          <div id="discovery-results-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"></div>
          <div id="discovery-empty-state" class="hidden bg-slate-50 rounded-xl p-6 text-center border border-slate-200">
            <p class="text-sm font-bold text-slate-900">No verified places matched that exact filter in our current dataset.</p>
            <p class="text-xs text-slate-600 mt-1">Our directory currently indexes verified Coimbatore neighbourhoods, key local services, and 17 major Tamil Nadu & cross-state travel corridors. Need a cab to an unlisted address?</p>
            <div class="mt-3 flex justify-center gap-3">
              <a href="make-my-trip.html" class="px-4 py-2 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs">Get Taxi Trip Planner</a>
              <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" class="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs">Ask Dispatch on WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 16-Section Main Discovery Navigation Hub (Section 3 Requirement) -->
  <section class="py-14 bg-white border-b border-slate-200" id="categories">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-600">Directory Sections</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">Browse by Discovery Section</h2>
          <p class="text-sm text-slate-600 mt-1">Navigate directly to Coimbatore neighbourhood guides, essential services, sightseeing categories, or custom trip planning.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <a href="explore-coimbatore.html" class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition">Explore Coimbatore Flagship →</a>
          <a href="make-my-trip.html" class="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition">Get Taxi Trip Planner →</a>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a href="explore-coimbatore.html" class="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 hover:border-amber-400 transition group">
          <span class="text-xs font-bold text-amber-400">01 · Flagship City Hub</span>
          <h3 class="text-lg font-extrabold mt-1 group-hover:text-amber-300">Explore Coimbatore</h3>
          <p class="text-xs text-slate-300 mt-1.5">15 neighbourhoods, temples, museums, hospitals, malls, dining & transit hubs.</p>
        </a>
        <a href="category-places-to-visit.html" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group">
          <span class="text-xs font-bold text-amber-700">02 · Sightseeing</span>
          <h3 class="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-amber-600">Places to Visit</h3>
          <p class="text-xs text-slate-600 mt-1.5">Museums, Smart City lakefronts, botanical parks & family attractions.</p>
        </a>
        <a href="category-temples-pilgrimage.html" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group">
          <span class="text-xs font-bold text-amber-700">03 · Spiritual</span>
          <h3 class="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-amber-600">Temples and Pilgrimage</h3>
          <p class="text-xs text-slate-600 mt-1.5">Maruthamalai, Perur, Isha Adiyogi, Eachanari, Palani & Madurai shrines.</p>
        </a>
        <a href="category-restaurants-food.html" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group">
          <span class="text-xs font-bold text-amber-700">04 · Dining</span>
          <h3 class="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-amber-600">Restaurants and Food</h3>
          <p class="text-xs text-slate-600 mt-1.5">Iconic vegetarian tiffin, traditional Kongu cuisine & family dining.</p>
        </a>
        <a href="category-hotels-accommodation.html" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group">
          <span class="text-xs font-bold text-amber-700">05 · Stays</span>
          <h3 class="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-amber-600">Hotels and Accommodation</h3>
          <p class="text-xs text-slate-600 mt-1.5">Stays near CJB Airport, Railway Junction, Avinashi Road & hospitals.</p>
        </a>
        <a href="category-shopping-entertainment.html" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group">
          <span class="text-xs font-bold text-amber-700">06 · Retail</span>
          <h3 class="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-amber-600">Shopping and Malls</h3>
          <p class="text-xs text-slate-600 mt-1.5">Brookefields, Prozone, Fun Republic, Oppanakara St & Cross Cut Road.</p>
        </a>
        <a href="category-shopping-entertainment.html#cinemas" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group">
          <span class="text-xs font-bold text-amber-700">07 · Leisure</span>
          <h3 class="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-amber-600">Cinemas and Entertainment</h3>
          <p class="text-xs text-slate-600 mt-1.5">PVR, INOX, Cinepolis multiplexes & recreational promenades.</p>
        </a>
        <a href="category-transport-hubs.html" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group">
          <span class="text-xs font-bold text-amber-700">08 · Transit</span>
          <h3 class="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-amber-600">Airports, Rail & Bus Terminals</h3>
          <p class="text-xs text-slate-600 mt-1.5">CJB Airport, Coimbatore Junction, Gandhipuram, Singanallur & Ukkadam.</p>
        </a>
        <a href="category-hospitals-essential.html" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group">
          <span class="text-xs font-bold text-amber-700">09 · Healthcare</span>
          <h3 class="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-amber-600">Hospitals & Essential Services</h3>
          <p class="text-xs text-slate-600 mt-1.5">KMCH, PSG Hospitals, Ganga Hospital, CMCH & GKNM access guides.</p>
        </a>
        <a href="category-public-facilities.html" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group">
          <span class="text-xs font-bold text-amber-700">10 · Civic Utilities</span>
          <h3 class="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-amber-600">Public Toilets, Parking & EV</h3>
          <p class="text-xs text-slate-600 mt-1.5">Multi-level car parking, Smart City restrooms, EV chargers & 24/7 fuel.</p>
        </a>
        <a href="scenic-routes.html" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group">
          <span class="text-xs font-bold text-amber-700">11 · Ghat Corridors</span>
          <h3 class="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-amber-600">Hill Stations & Scenic Drives</h3>
          <p class="text-xs text-slate-600 mt-1.5">Ooty, Coonoor, Valparai 40 bends, Kodaikanal & Yercaud route guides.</p>
        </a>
        <a href="category-hill-stations-nature.html" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group">
          <span class="text-xs font-bold text-amber-700">12 · Eco & Outdoors</span>
          <h3 class="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-amber-600">Waterfalls, Nature & Dams</h3>
          <p class="text-xs text-slate-600 mt-1.5">Siruvani Kovai Kutralam, Aliyar Dam & Topslip Anamalai Tiger Reserve.</p>
        </a>
        <a href="scenic-routes.html#hidden-gems" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group">
          <span class="text-xs font-bold text-amber-700">13 · Offbeat</span>
          <h3 class="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-amber-600">Lesser-Known & Quieter Places</h3>
          <p class="text-xs text-slate-600 mt-1.5">Kotagiri ghat alternative, Gass Forest Museum, Aliyar & offbeat viewpoints.</p>
        </a>
        <a href="destinations-tamil-nadu.html" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition group">
          <span class="text-xs font-bold text-amber-700">14 · Statewide Directory</span>
          <h3 class="text-lg font-extrabold text-slate-900 mt-1 group-hover:text-amber-600">City-to-City Travel Guides</h3>
          <p class="text-xs text-slate-600 mt-1.5">Chennai, Madurai, Trichy, Thanjavur, Rameswaram, Kanyakumari & more.</p>
        </a>
        <a href="make-my-trip.html" class="p-5 rounded-2xl bg-amber-50 border border-amber-300 hover:border-amber-500 transition group">
          <span class="text-xs font-bold text-amber-800">15 · Custom Itinerary</span>
          <h3 class="text-lg font-extrabold text-slate-950 mt-1 group-hover:text-amber-700">Get Taxi Trip Planner</h3>
          <p class="text-xs text-slate-700 mt-1.5">Combine pickup, destination, and verified sightseeing stops for a custom quote.</p>
        </a>
        <a href="contact.html" class="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 hover:border-emerald-500 transition group">
          <span class="text-xs font-bold text-emerald-800">16 · 24/7 Dispatch</span>
          <h3 class="text-lg font-extrabold text-slate-950 mt-1 group-hover:text-emerald-700">Book a Taxi</h3>
          <p class="text-xs text-slate-700 mt-1.5">Local rides, airport transfers, one-way drops & multi-day tours (+91 ${PHONE_DISPLAY}).</p>
        </a>
      </div>
    </div>
  </section>

  <!-- Featured Coimbatore Neighbourhoods Preview -->
  <section class="py-14 bg-slate-50 border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-600">Flagship Local Coverage</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">Coimbatore Neighbourhood Guides</h2>
          <p class="text-sm text-slate-600 mt-1">Explore landmarks, hospitals, dining, shopping, and connectivity across 15 verified Coimbatore localities.</p>
        </div>
        <a href="explore-coimbatore.html" class="text-xs font-extrabold text-slate-900 hover:text-amber-600">View Full Coimbatore Directory →</a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${COIMBATORE_NEIGHBOURHOODS.slice(0, 9)
          .map(
            (n) => `
          <a href="neighbourhood-${n.slug}.html" class="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-400 shadow-xs transition flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-2 text-[11px] text-slate-500 font-semibold">
                <span>${n.ZoneLabel}</span>
                <span>PIN ${n.postalPin}</span>
              </div>
              <h3 class="text-lg font-extrabold text-slate-900 mt-1">${n.name}</h3>
              <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">${n.summary}</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span class="text-slate-500 truncate">${n.keyLandmarks.slice(0, 2).join(' · ')}</span>
              <span class="font-bold text-amber-600 shrink-0">Explore →</span>
            </div>
          </a>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- Featured Verified Places in Coimbatore -->
  <section class="py-14 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <span class="text-xs font-bold uppercase tracking-wider text-amber-600">Verified Place Pages</span>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">Popular Places, Temples, Hospitals & Transit Hubs</h2>
        <p class="text-sm text-slate-600 mt-1">Every place record includes verified address, visitor notes, nearby places, and unobtrusive travel options.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${VERIFIED_PLACES.slice(0, 9).map(renderPlaceCard).join('')}
      </div>
    </div>
  </section>

  <!-- Statewide Destinations & Scenic Corridors Preview -->
  <section class="py-14 bg-slate-50 border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-600">Statewide Expansion</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">Tamil Nadu Destinations & Hill Corridors</h2>
          <p class="text-sm text-slate-600 mt-1">Detailed travel guides for major Tamil Nadu cities, hill stations, and pilgrimage towns (plus cross-state Munnar guide).</p>
        </div>
        <a href="destinations-tamil-nadu.html" class="text-xs font-extrabold text-slate-900 hover:text-amber-600">View All ${STATEWIDE_DESTINATIONS.length} Destinations →</a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        ${STATEWIDE_DESTINATIONS.slice(0, 8)
          .map(
            (d) => `
          <a href="destination-${d.slug}.html" class="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-400 transition flex flex-col justify-between">
            <div>
              <span class="text-[11px] font-bold ${d.isCrossState ? 'text-emerald-700' : 'text-amber-600'}">${d.isCrossState ? 'Cross-State (Kerala)' : d.categoryLabel}</span>
              <h3 class="text-base font-extrabold text-slate-900 mt-1">${d.name}</h3>
              <p class="text-xs text-slate-500 mt-0.5">${d.distanceFromCoimbatoreKm === 0 ? 'Base City' : `${d.distanceFromCoimbatoreKm} KM from Coimbatore`}</p>
              <p class="text-xs text-slate-600 mt-2 line-clamp-3">${d.shortSummary}</p>
            </div>
            <span class="text-xs font-bold text-slate-900 mt-4 pt-2 border-t border-slate-100 block">Read Destination Guide →</span>
          </a>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- Data Transparency & Sourcing Disclosure (Section 8 & 12 Requirement) -->
  <section class="py-12 bg-white">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-3">
        <h2 class="text-lg font-extrabold text-slate-900">Data Coverage, Verification & Editorial Standards</h2>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          <strong>Current Dataset Scope:</strong> This discovery platform currently provides deep flagship coverage across <strong>15 Coimbatore neighbourhoods</strong>, <strong>${VERIFIED_PLACES.length} verified multi-category local places & civic facilities</strong>, <strong>${STATEWIDE_DESTINATIONS.length} major Tamil Nadu & cross-state destinations</strong>, and <strong>${SCENIC_ROUTES.length} detailed scenic route corridors</strong>. We do not claim to index every street or business in Tamil Nadu; records are published incrementally only after address and visitor details are verified against official tourism boards (Tamil Nadu Tourism, District NIC portals), TN HR&CE temple registries, AAI/Southern Railway directories, and public municipal records.
        </p>
        <p class="text-xs text-slate-500">
          Dynamic facilities such as public parking lots, restrooms, forest checkposts, and temple darshan hours are subject to municipal or administrative updates. No live occupancy feed is claimed unless explicitly linked.
        </p>
      </div>
    </div>
  </section>

  <!-- Client-Side Search & Filter Script -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const SEARCH_INDEX = ${searchIndexJson};
      const searchInput = document.getElementById('discovery-search-input');
      const categorySelect = document.getElementById('discovery-category-select');
      const areaSelect = document.getElementById('discovery-area-select');
      const nearMeBtn = document.getElementById('discovery-near-me-btn');
      const clearBtn = document.getElementById('discovery-clear-btn');
      const resultsWrap = document.getElementById('discovery-search-results-wrap');
      const resultsList = document.getElementById('discovery-results-list');
      const resultsHeading = document.getElementById('discovery-results-heading');
      const emptyState = document.getElementById('discovery-empty-state');

      function renderResults(items, label) {
        resultsWrap.classList.remove('hidden');
        resultsHeading.textContent = label + ' (' + items.length + ' results)';
        if (items.length === 0) {
          resultsList.innerHTML = '';
          emptyState.classList.remove('hidden');
          return;
        }
        emptyState.classList.add('hidden');
        resultsList.innerHTML = items.map(function(item) {
          return '<a href="' + item.url + '" class="block p-4 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200 hover:border-amber-400 transition">' +
            '<div class="flex items-center justify-between text-[11px] font-bold text-amber-700 mb-1">' +
              '<span>' + item.type + '</span>' +
              '<span>' + item.city + '</span>' +
            '</div>' +
            '<h3 class="text-sm font-extrabold text-slate-900">' + item.title + '</h3>' +
            '<p class="text-xs text-slate-600 mt-1">' + item.subtitle + '</p>' +
          '</a>';
        }).join('');
      }

      function runFilter() {
        const q = (searchInput.value || '').trim().toLowerCase();
        const cat = categorySelect.value;
        const area = areaSelect.value;

        if (!q && cat === 'all' && area === 'all') {
          resultsWrap.classList.add('hidden');
          return;
        }

        const tokens = q.split(/\\s+/).filter(Boolean);
        const filtered = SEARCH_INDEX.filter(function(item) {
          const matchesCat = cat === 'all' || item.category === cat;
          const matchesArea = area === 'all' ||
            item.city.toLowerCase().includes(area) ||
            item.neighbourhood.toLowerCase().includes(area) ||
            item.keywords.includes(area);
          const matchesQuery = tokens.length === 0 || tokens.every(function(tok) {
            return item.keywords.includes(tok);
          });
          return matchesCat && matchesArea && matchesQuery;
        });

        renderResults(filtered, 'Filtered Directory Records');
      }

      searchInput.addEventListener('input', runFilter);
      categorySelect.addEventListener('change', runFilter);
      areaSelect.addEventListener('change', runFilter);

      document.querySelectorAll('.quick-search-chip').forEach(function(btn) {
        btn.addEventListener('click', function() {
          searchInput.value = btn.getAttribute('data-q') || '';
          categorySelect.value = 'all';
          areaSelect.value = 'all';
          runFilter();
        });
      });

      clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        categorySelect.value = 'all';
        areaSelect.value = 'all';
        resultsWrap.classList.add('hidden');
        const gpsStatus = document.getElementById('discovery-gps-status');
        if (gpsStatus) gpsStatus.classList.add('hidden');
      });

      function haversineKm(lat1, lon1, lat2, lon2) {
        const toRad = function(deg) { return (deg * Math.PI) / 180; };
        const R = 6371; // Earth radius in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 10) / 10;
      }

      nearMeBtn.addEventListener('click', function() {
        const gpsStatus = document.getElementById('discovery-gps-status');
        if (!navigator.geolocation) {
          if (gpsStatus) {
            gpsStatus.textContent = 'Browser geolocation is not supported on this device. Showing Coimbatore city directory records—you can also select any locality above.';
            gpsStatus.classList.remove('hidden');
          }
          areaSelect.value = 'coimbatore';
          runFilter();
          return;
        }
        nearMeBtn.textContent = 'Locating...';
        navigator.geolocation.getCurrentPosition(
          function(pos) {
            const uLat = pos.coords.latitude;
            const uLng = pos.coords.longitude;
            if (typeof uLat !== 'number' || typeof uLng !== 'number' || isNaN(uLat) || isNaN(uLng) || uLat < -90 || uLat > 90 || uLng < -180 || uLng > 180) {
              nearMeBtn.textContent = 'Select Area Manually';
              if (gpsStatus) {
                gpsStatus.textContent = 'Could not verify valid GPS coordinates. Please select your city or Coimbatore neighbourhood from the dropdown.';
                gpsStatus.classList.remove('hidden');
              }
              return;
            }
            nearMeBtn.textContent = 'Near Me (Active)';
            if (gpsStatus) {
              gpsStatus.textContent = 'Showing verified places and destinations sorted by Haversine straight-line distance from your current GPS coordinates (' + uLat.toFixed(4) + ', ' + uLng.toFixed(4) + '). Actual road distance may vary.';
              gpsStatus.classList.remove('hidden');
            }
            const sorted = SEARCH_INDEX.slice().map(function(item) {
              const distKm = haversineKm(uLat, uLng, item.lat, item.lng);
              return Object.assign({}, item, {
                subtitle: item.subtitle + ' · ~' + distKm + ' km (straight-line GPS)',
                _dist: distKm
              });
            }).sort(function(a, b) { return a._dist - b._dist; }).slice(0, 9);
            renderResults(sorted, 'Nearest Verified Places to Your Location');
          },
          function() {
            nearMeBtn.textContent = 'Select Area Manually';
            if (gpsStatus) {
              gpsStatus.textContent = 'Location permission was declined or unavailable. Please select a Coimbatore neighbourhood or Tamil Nadu city manually from the dropdown.';
              gpsStatus.classList.remove('hidden');
            }
            areaSelect.focus();
          },
          { timeout: 6000 }
        );
      });
    });
  </script>
  `;

  return generateHtmlPage({
    title: 'Explore Tamil Nadu & Coimbatore Local Discovery Directory | Get Taxi Kovai',
    description:
      'Discover verified places to visit, temples, restaurants, hotels, malls, hospitals, transport hubs, public facilities, and scenic routes across Coimbatore and Tamil Nadu.',
    keywords:
      'Explore Tamil Nadu, Explore Coimbatore, places to visit in Coimbatore, temples in Coimbatore, restaurants in RS Puram, hospitals in Coimbatore, Get Taxi Trip Planner Coimbatore',
    canonicalUrl,
    activeNav: 'explore',
    bodyContent,
    schemaJson: schema,
  });
}

// ==========================================
// 2. EXPLORE COIMBATORE — FLAGSHIP CITY DIRECTORY
// ==========================================
export function generateExploreCoimbatorePage() {
  const canonicalUrl = `${SITE_URL}/explore-coimbatore.html`;
  const breadcrumbs = [
    { label: 'Home', href: 'index.html' },
    { label: 'Explore Tamil Nadu', href: 'explore-tamil-nadu.html' },
    { label: 'Explore Coimbatore', href: 'explore-coimbatore.html' },
  ];

  const schema = [
    buildBreadcrumbSchema(breadcrumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'TouristDestination',
      name: 'Coimbatore Local Discovery & City Directory',
      description:
        'Flagship local guide to Coimbatore covering 15 neighbourhoods (RS Puram, Gandhipuram, Peelamedu, Race Course, Saravanampatti, Perur, Maruthamalai), temples, restaurants, hospitals, transit hubs, and local utilities.',
      url: canonicalUrl,
    },
  ];

  const bodyContent = `
  ${renderBreadcrumbs(breadcrumbs)}

  <section class="bg-slate-950 text-white py-14 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-8 space-y-4">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Flagship City Directory · Kongu Nadu</span>
          <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Explore Coimbatore: Complete Neighbourhood & Place Guide
          </h1>
          <p class="text-slate-300 text-base sm:text-lg leading-relaxed">
            From ancient Noyyal river temples and Western Ghats hill shrines to RS Puram’s iconic filter-coffee institutions, Peelamedu’s super-specialty medical and airport corridor, and everyday civic utilities.
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <a href="#neighbourhoods" class="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition">15 Neighbourhoods</a>
            <a href="#coimbatore-places" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition">Filter All Places</a>
            <a href="tour-isha-yoga.html" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 transition">Isha & Temple Packages</a>
            <a href="make-my-trip.html" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition">Get Taxi Trip Planner</a>
          </div>
        </div>
        <div class="lg:col-span-4 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-3 text-xs">
          <h2 class="text-base font-extrabold text-white">Coimbatore Quick Transit Facts</h2>
          <p class="text-slate-300"><strong class="text-amber-400">Airport:</strong> Coimbatore International Airport (CJB), Peelamedu (11 km from city center)</p>
          <p class="text-slate-300"><strong class="text-amber-400">Main Rail:</strong> Coimbatore Junction (CBE), Town Hall / Gopalapuram</p>
          <p class="text-slate-300"><strong class="text-amber-400">Bus Terminals:</strong> Gandhipuram (Central & SETC), Singanallur (East/South), Ukkadam (West/Pollachi)</p>
          <p class="text-slate-300"><strong class="text-amber-400">24/7 Cab Dispatch:</strong> Cross Cut Road, Gandhipuram · <a href="${PHONE_HREF}" class="text-amber-400 underline font-bold">+91 ${PHONE_DISPLAY}</a></p>
        </div>
      </div>
    </div>
  </section>

  <!-- All 15 Coimbatore Neighbourhoods Grid -->
  <section id="neighbourhoods" class="py-14 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <span class="text-xs font-bold uppercase tracking-wider text-amber-600">Locality-Wise Directory</span>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">All 15 Coimbatore Neighbourhoods & Corridors</h2>
        <p class="text-sm text-slate-600 mt-1">Select any neighbourhood to view its verified landmarks, connectivity, nearby hospitals, dining, and cab pickup points.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        ${COIMBATORE_NEIGHBOURHOODS.map(
          (n) => `
          <a href="neighbourhood-${n.slug}.html" class="bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-400 shadow-xs transition flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span>${n.ZoneLabel}</span>
                <span>PIN ${n.postalPin}</span>
              </div>
              <h3 class="text-lg font-extrabold text-slate-900 mt-1">${n.name}</h3>
              <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">${n.summary}</p>
              <div class="mt-3 pt-2.5 border-t border-slate-200/70 text-[11px] text-slate-500">
                <strong class="text-slate-700">Key Landmarks:</strong> ${n.keyLandmarks.join(', ')}
              </div>
            </div>
            <span class="mt-4 text-xs font-extrabold text-amber-600">Open ${n.name} Guide →</span>
          </a>`
        ).join('')}
      </div>
    </div>
  </section>

  <!-- Category-Wise & Neighbourhood-Filterable Coimbatore Places -->
  <section id="coimbatore-places" class="py-14 bg-slate-50 border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-600">Verified Places & Everyday Facilities</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">Coimbatore Directory by Category & Locality</h2>
          <p class="text-sm text-slate-600 mt-1">Filter verified attractions, temples, restaurants, malls, hotels, hospitals, transit terminals, and public facilities.</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <select id="cbe-filter-category" class="bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900">
            <option value="all">All Categories (${VERIFIED_PLACES.length})</option>
            ${DISCOVERY_CATEGORIES.map((c) => `<option value="${c.slug}">${c.shortTitle}</option>`).join('')}
          </select>
          <select id="cbe-filter-neighbourhood" class="bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900">
            <option value="all">All Neighbourhoods</option>
            ${COIMBATORE_NEIGHBOURHOODS.map((n) => `<option value="${n.name.toLowerCase()}">${n.name}</option>`).join('')}
          </select>
        </div>
      </div>

      <div id="cbe-places-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${VERIFIED_PLACES.map(renderPlaceCard).join('')}
      </div>
    </div>
  </section>

  <!-- Suggested 1-Day Coimbatore Sightseeing & Temple Flows -->
  <section class="py-14 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <span class="text-xs font-bold uppercase tracking-wider text-amber-600">Suggested Local Itineraries</span>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">Popular One-Day Sightseeing & Temple Circuits in Coimbatore</h2>
        <p class="text-sm text-slate-600 mt-1">Flexible destination sequences without rigid arrival-time pressure.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold text-amber-700">Circuit 01 · Spiritual & Heritage (10 Hrs / 100 KM)</span>
            <h3 class="text-lg font-extrabold text-slate-900 mt-1">Perur + Maruthamalai + Isha Yoga</h3>
            <p class="text-xs text-slate-600 mt-2 leading-relaxed">
              Coimbatore Pickup → Perur Pateeswarar Temple → Maruthamalai Murugan Temple → Isha Yoga Center & Adiyogi → Coimbatore Drop.
            </p>
            <p class="text-xs font-bold text-slate-900 mt-3">Package Fare: ₹3,000 (Extra: ₹20/km · ₹150/hr)</p>
          </div>
          <a href="tour-isha-yoga.html" class="mt-4 py-2.5 px-4 rounded-xl bg-slate-900 text-amber-400 font-bold text-xs text-center block">View Full Package Details →</a>
        </div>

        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold text-amber-700">Circuit 02 · Extended Evening (12 Hrs / 120 KM)</span>
            <h3 class="text-lg font-extrabold text-slate-900 mt-1">Isha Yoga + Adiyogi + Evening Light Show</h3>
            <p class="text-xs text-slate-600 mt-2 leading-relaxed">
              Coimbatore Pickup → Isha Yoga Center (Dhyanalinga, Linga Bhairavi & Theerthakunds) → 112-ft Adiyogi & Evening Light Show → Post-Show Coimbatore Drop.
            </p>
            <p class="text-xs font-bold text-slate-900 mt-3">Package Fare: ₹3,500 (Extra: ₹20/km · ₹150/hr)</p>
          </div>
          <a href="tour-isha-yoga.html" class="mt-4 py-2.5 px-4 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs text-center block">View Light Show Package →</a>
        </div>

        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold text-amber-700">Circuit 03 · Museums, Dining & Shopping (4h / 8h)</span>
            <h3 class="text-lg font-extrabold text-slate-900 mt-1">City Museums, RS Puram & Silk Markets</h3>
            <p class="text-xs text-slate-600 mt-2 leading-relaxed">
              Gedee Car Museum (Avinashi Rd) → Gass Forest Museum & Sree Annapoorna Lunch (RS Puram) → Oppanakara Street / Brookefields Mall → Race Course Evening Walk.
            </p>
            <p class="text-xs font-bold text-slate-900 mt-3">Hourly Rental: 4 Hrs ₹1,450 · 8 Hrs ₹2,850 (1 Hr ₹375, 2 Hrs ₹750)</p>
          </div>
          <a href="make-my-trip.html" class="mt-4 py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center block">Customize in Get Taxi Trip Planner →</a>
        </div>
      </div>
    </div>
  </section>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const catSel = document.getElementById('cbe-filter-category');
      const nbSel = document.getElementById('cbe-filter-neighbourhood');
      const cards = document.querySelectorAll('#cbe-places-grid [data-place-card]');

      function filterCbe() {
        const c = catSel.value;
        const n = nbSel.value;
        cards.forEach(function(card) {
          const cardCat = card.getAttribute('data-category') || '';
          const cardNb = card.getAttribute('data-neighbourhood') || '';
          const showCat = c === 'all' || cardCat === c;
          const showNb = n === 'all' || cardNb.includes(n) || n.includes(cardNb);
          if (showCat && showNb) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      }

      catSel.addEventListener('change', filterCbe);
      nbSel.addEventListener('change', filterCbe);
    });
  </script>
  `;

  return generateHtmlPage({
    title: 'Explore Coimbatore | Flagship Neighbourhood, Temple, Dining & Hospital Directory',
    description:
      'Comprehensive Coimbatore local guide covering RS Puram, Gandhipuram, Peelamedu, Race Course, Saravanampatti, temples, restaurants, hospitals, malls, parking, and 24/7 cabs.',
    keywords:
      'Explore Coimbatore, places to visit in Coimbatore, RS Puram guide, Peelamedu guide, Gandhipuram guide, Coimbatore temples, Coimbatore hospitals, Get Taxi Kovai',
    canonicalUrl,
    activeNav: 'explore',
    bodyContent,
    schemaJson: schema,
  });
}

// ==========================================
// 3. REUSABLE CATEGORY DIRECTORY PAGES
// ==========================================
export function generateCategoryPage(categoryMeta) {
  const filename = `category-${categoryMeta.slug}.html`;
  const canonicalUrl = `${SITE_URL}/${filename}`;
  const matchingPlaces = VERIFIED_PLACES.filter((p) => p.category === categoryMeta.slug);

  const breadcrumbs = [
    { label: 'Home', href: 'index.html' },
    { label: 'Explore Tamil Nadu', href: 'explore-tamil-nadu.html' },
    { label: categoryMeta.shortTitle, href: filename },
  ];

  const schema = [
    buildBreadcrumbSchema(breadcrumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: categoryMeta.seoTitle,
      description: categoryMeta.seoDescription,
      url: canonicalUrl,
    },
  ];

  const bodyContent = `
  ${renderBreadcrumbs(breadcrumbs)}

  <section class="bg-slate-950 text-white py-12 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Verified Category Directory</span>
      <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">${categoryMeta.title}</h1>
      <p class="text-slate-300 text-base max-w-3xl mt-2">${categoryMeta.description}</p>
      <div class="flex flex-wrap gap-2 mt-4 text-xs text-slate-300">
        ${categoryMeta.highlights.map((h) => `<span class="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">${h}</span>`).join('')}
      </div>
    </div>
  </section>

  <section class="py-12 bg-slate-50 border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${matchingPlaces.map(renderPlaceCard).join('')}
      </div>
    </div>
  </section>

  <!-- Explore Other Categories -->
  <section class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-xl font-extrabold text-slate-900 mb-4">Explore Other Local Categories</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        ${DISCOVERY_CATEGORIES.filter((c) => c.slug !== categoryMeta.slug)
          .map(
            (c) => `
          <a href="category-${c.slug}.html" class="p-4 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 transition">
            <h3 class="text-sm font-bold text-slate-900">${c.shortTitle}</h3>
            <p class="text-xs text-slate-500 mt-1 line-clamp-2">${c.description}</p>
          </a>`
          )
          .join('')}
      </div>
    </div>
  </section>
  `;

  return {
    filename,
    html: generateHtmlPage({
      title: categoryMeta.seoTitle,
      description: categoryMeta.seoDescription,
      keywords: `${categoryMeta.title}, Coimbatore ${categoryMeta.shortTitle}, Tamil Nadu travel guide, Get Taxi Kovai`,
      canonicalUrl,
      activeNav: 'explore',
      bodyContent,
      schemaJson: schema,
    }),
  };
}

// ==========================================
// 4. REUSABLE COIMBATORE NEIGHBOURHOOD PAGES
// ==========================================
export function generateNeighbourhoodPage(nb) {
  const filename = `neighbourhood-${nb.slug}.html`;
  const canonicalUrl = `${SITE_URL}/${filename}`;
  const placesWithDist = VERIFIED_PLACES.map((p) => {
    const isDirect =
      p.neighbourhood.toLowerCase().includes(nb.name.toLowerCase()) ||
      nb.name.toLowerCase().includes(p.neighbourhood.toLowerCase()) ||
      p.locality.toLowerCase().includes(nb.name.toLowerCase());
    const distKm = p.coordinates
      ? calcIndicativeDistanceKm(nb.coordinates.lat, nb.coordinates.lng, p.coordinates.lat, p.coordinates.lng)
      : 8;
    return {
      ...p,
      _isDirect: isDirect,
      _distKm: distKm,
      _distanceBadge: isDirect ? `In ${nb.name}` : `~${distKm} KM from ${nb.name} (Indicative)`,
    };
  }).sort((a, b) => {
    if (a._isDirect && !b._isDirect) return -1;
    if (!a._isDirect && b._isDirect) return 1;
    return a._distKm - b._distKm;
  });

  const displayPlaces = placesWithDist.slice(0, 6);

  // Compute indicative geographic distances from this neighbourhood to major Coimbatore transit hubs
  const distToAirportKm = Math.round(calcIndicativeDistanceKm(nb.coordinates.lat, nb.coordinates.lng, 11.0298, 77.0434));
  const distToJunctionKm = Math.round(calcIndicativeDistanceKm(nb.coordinates.lat, nb.coordinates.lng, 10.9998, 76.9634));
  const distToGandhipuramKm = Math.round(calcIndicativeDistanceKm(nb.coordinates.lat, nb.coordinates.lng, 11.0183, 76.9644));
  const distToIshaKm = Math.round(calcIndicativeDistanceKm(nb.coordinates.lat, nb.coordinates.lng, 10.9763, 76.7344));

  const breadcrumbs = [
    { label: 'Home', href: 'index.html' },
    { label: 'Explore Tamil Nadu', href: 'explore-tamil-nadu.html' },
    { label: 'Explore Coimbatore', href: 'explore-coimbatore.html' },
    { label: nb.name, href: filename },
  ];

  const schema = [
    buildBreadcrumbSchema(breadcrumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      name: `${nb.name}, Coimbatore (${nb.postalPin})`,
      description: nb.summary,
      address: {
        '@type': 'PostalAddress',
        addressLocality: nb.name,
        addressRegion: 'Tamil Nadu',
        postalCode: nb.postalPin,
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: nb.coordinates.lat,
        longitude: nb.coordinates.lng,
      },
    },
  ];

  const waPickupMsg = encodeURIComponent(
    `Hello Get Taxi Kovai, I need a cab pickup in ${nb.name}, Coimbatore (PIN ${nb.postalPin}).`
  );

  const bodyContent = `
  ${renderBreadcrumbs(breadcrumbs)}

  <section class="bg-slate-950 text-white py-12 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-8 space-y-3">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-400">${nb.ZoneLabel} · PIN ${nb.postalPin}</span>
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white">${nb.name}, Coimbatore — Local Guide & Directory</h1>
          <p class="text-slate-300 text-base leading-relaxed">${nb.summary}</p>
          <p class="text-xs text-slate-400"><strong>Road & Transit Connectivity:</strong> ${nb.connectivityNote}</p>
        </div>
        <div class="lg:col-span-4 bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-3">
          <h2 class="text-base font-extrabold text-white">Need a Taxi in ${nb.name}?</h2>
          <p class="text-xs text-slate-300">Fast 10-to-15 minute doorstep cab pickup across ${nb.name} for local city drops, CJB Airport transfers, railway station pickups, and outstation trips.</p>
          <div class="flex flex-col gap-2 pt-1">
            <a href="https://wa.me/91${PHONE_NUMBER}?text=${waPickupMsg}" target="_blank" rel="noopener" data-conversion-intent="whatsapp" class="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center transition">WhatsApp Pickup in ${nb.name}</a>
            <a href="${PHONE_HREF}" data-conversion-intent="call" class="py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs text-center transition">Call +91 ${PHONE_DISPLAY}</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Key Landmarks & Popular For -->
  <section class="py-10 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h2 class="text-base font-extrabold text-slate-900 mb-3">Key Landmarks in ${nb.name}</h2>
          <ul class="space-y-2 text-xs text-slate-700">
            ${nb.keyLandmarks.map((l) => `<li class="flex items-center gap-2"><span class="text-amber-500 font-bold">•</span><span>${l}</span></li>`).join('')}
          </ul>
        </div>
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h2 class="text-base font-extrabold text-slate-900 mb-3">What ${nb.name} is Known For</h2>
          <ul class="space-y-2 text-xs text-slate-700">
            ${nb.popularFor.map((p) => `<li class="flex items-center gap-2"><span class="text-emerald-600 font-bold">✓</span><span>${p}</span></li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- Local Transit Distances & Approved Taxi Service Reference -->
      <div class="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-amber-400">Transit Distance & Taxi Reference</span>
            <h2 class="text-lg font-extrabold text-white mt-0.5">Indicative Transit Proximity from ${nb.name} (${nb.postalPin})</h2>
          </div>
          <div class="flex flex-wrap gap-2 text-xs">
            <a href="hourly-rental.html" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold transition">Hourly Rental (from ₹375) →</a>
            <a href="oneway.html" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold transition">One-Way Drop (from ₹16/km) →</a>
            <a href="make-my-trip.html" class="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold transition">Get Taxi Trip Planner →</a>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span class="text-slate-400 block">Coimbatore Airport (CJB)</span>
            <strong class="text-white text-sm font-black mt-0.5 block">~${distToAirportKm} KM</strong>
            <span class="text-[11px] text-amber-400">24/7 Terminal Pickup/Drop</span>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span class="text-slate-400 block">Coimbatore Railway Jn</span>
            <strong class="text-white text-sm font-black mt-0.5 block">~${distToJunctionKm} KM</strong>
            <span class="text-[11px] text-amber-400">Station Doorstep Transfer</span>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span class="text-slate-400 block">Gandhipuram Bus Stand</span>
            <strong class="text-white text-sm font-black mt-0.5 block">${nb.slug === 'gandhipuram' ? '0–2 KM (Local Hub)' : `~${distToGandhipuramKm} KM`}</strong>
            <span class="text-[11px] text-amber-400">Central City Corridor</span>
          </div>
          <div class="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span class="text-slate-400 block">Isha Yoga & Adiyogi</span>
            <strong class="text-white text-sm font-black mt-0.5 block">~${distToIshaKm} KM</strong>
            <a href="tour-isha-yoga.html" class="text-[11px] text-emerald-400 hover:underline">Tours ₹3,000 / ₹3,500 →</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Verified Places in & near this Neighbourhood -->
  <section class="py-12 bg-slate-50 border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-black text-slate-900 mb-2">Verified Places & Services in / near ${nb.name}</h2>
      <p class="text-xs text-slate-600 mb-6">Verified landmarks, hospitals, dining, shopping, and transit hubs sorted by proximity to ${nb.name} (${nb.postalPin}).</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${displayPlaces.map(renderPlaceCard).join('')}
      </div>
    </div>
  </section>

  <!-- Other Coimbatore Neighbourhoods -->
  <section class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-lg font-extrabold text-slate-900 mb-4">Explore Other Coimbatore Neighbourhoods</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
        ${COIMBATORE_NEIGHBOURHOODS.filter((o) => o.id !== nb.id)
          .map(
            (o) => `
          <a href="neighbourhood-${o.slug}.html" class="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 font-bold text-slate-800 hover:text-amber-700 transition">
            ${o.name}
          </a>`
          )
          .join('')}
      </div>
    </div>
  </section>
  `;

  return {
    filename,
    html: generateHtmlPage({
      title: `${nb.name}, Coimbatore Local Guide — Landmarks, Dining, Hospitals & Taxi | Get Taxi Kovai`,
      description: `Discover verified places, landmarks (${nb.keyLandmarks.join(', ')}), connectivity, and 24/7 doorstep taxi services in ${nb.name}, Coimbatore (${nb.postalPin}).`,
      keywords: `${nb.name} Coimbatore, places in ${nb.name}, call taxi in ${nb.name} Coimbatore, ${nb.keyLandmarks.join(', ')}`,
      canonicalUrl,
      activeNav: 'explore',
      bodyContent,
      schemaJson: schema,
    }),
  };
}

// ==========================================
// 5. REUSABLE INDIVIDUAL PLACE-DETAIL PAGES (Section 7)
// ==========================================
export function generatePlaceDetailPage(place) {
  const filename = `place-${place.slug}.html`;
  const canonicalUrl = `${SITE_URL}/${filename}`;
  const catMeta = DISCOVERY_CATEGORIES.find((c) => c.slug === place.category);
  const nbMeta = COIMBATORE_NEIGHBOURHOODS.find(
    (n) => n.name === place.neighbourhood || place.neighbourhood.includes(n.name)
  );
  const nearbyPlaces = place.nearbyPlaceIds
    .map((id) => VERIFIED_PLACES.find((p) => p.id === id))
    .filter(Boolean);

  const breadcrumbs = [
    { label: 'Home', href: 'index.html' },
    { label: 'Explore Tamil Nadu', href: 'explore-tamil-nadu.html' },
    ...(catMeta ? [{ label: catMeta.shortTitle, href: `category-${catMeta.slug}.html` }] : []),
    { label: place.name, href: filename },
  ];

  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': place.schemaType,
    name: place.name,
    description: place.shortDescription,
    url: canonicalUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: place.postalAddress,
      addressLocality: place.city,
      addressRegion: place.state,
      addressCountry: 'IN',
    },
    ...(place.coordinates
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: place.coordinates.lat,
            longitude: place.coordinates.lng,
          },
        }
      : {}),
  };

  const waQuoteMsg = encodeURIComponent(
    `Hello Get Taxi Kovai, I would like to request a cab quote for visiting ${place.name} (${place.locality}, ${place.city}). Pickup: ${place.taxiOptions.prefillPickup}.`
  );

  const bodyContent = `
  ${renderBreadcrumbs(breadcrumbs)}

  <!-- Place Header -->
  <section class="bg-slate-950 text-white py-12 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-8 space-y-3">
          <div class="flex flex-wrap items-center gap-2 text-xs text-amber-400 font-bold">
            <span>${place.categoryLabel}</span>
            <span>·</span>
            <span>${place.subcategory}</span>
            <span>·</span>
            <span>${place.locality}, ${place.city}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">${place.name}</h1>
          <p class="text-slate-300 text-base leading-relaxed">${place.shortDescription}</p>
          <div class="pt-2 flex flex-wrap gap-3 text-xs text-slate-300">
            <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>Verified Address:</strong> ${place.postalAddress}</span>
            ${place.openingHours ? `<span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>Hours:</strong> ${place.openingHours}</span>` : ''}
          </div>
        </div>

        <div class="lg:col-span-4">
          <div class="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 h-52 relative">
            <img src="${place.image}" alt="${escAttr(place.name)}" width="800" height="416" loading="eager" fetchpriority="high" decoding="async" class="w-full h-full object-cover" onerror="this.style.display='none'" />
          </div>
        </div>
      </div>
    </div>
  </section>

  ${
    place.essentialEmergencyNote
      ? `
  <div class="bg-amber-50 border-b border-amber-200 py-3 px-4">
    <div class="max-w-7xl mx-auto text-xs text-amber-950 font-semibold">
      <strong>Important Healthcare Transport Note:</strong> ${place.essentialEmergencyNote}
    </div>
  </div>`
      : ''
  }

  <!-- Main Place Detail Content -->
  <section class="py-12 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Left 8 Cols: Visitor Information, Facilities, How to Reach -->
        <div class="lg:col-span-8 space-y-8">
          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
            <h2 class="text-xl font-extrabold text-slate-900">Detailed Visitor & Access Information</h2>
            <ul class="space-y-3 text-sm text-slate-700 leading-relaxed">
              ${place.detailedVisitorInfo
                .map(
                  (info) => `
                <li class="flex items-start gap-2.5">
                  <span class="text-amber-500 font-bold mt-0.5">•</span>
                  <span>${info}</span>
                </li>`
                )
                .join('')}
            </ul>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 class="text-base font-extrabold text-slate-900 mb-3">Facilities & Visitor Amenities</h3>
              <ul class="space-y-2 text-xs text-slate-700">
                ${place.facilities.map((f) => `<li class="flex items-center gap-2"><span class="text-emerald-600 font-bold">✓</span><span>${f}</span></li>`).join('')}
              </ul>
            </div>
            <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 class="text-base font-extrabold text-slate-900 mb-3">Accessibility & Senior Info</h3>
              <ul class="space-y-2 text-xs text-slate-700">
                ${place.accessibility.map((a) => `<li class="flex items-start gap-2"><span class="text-amber-600 font-bold">•</span><span>${a}</span></li>`).join('')}
              </ul>
            </div>
          </div>

          <!-- How to Reach -->
          <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
            <h2 class="text-lg font-extrabold text-slate-900">How to Reach ${place.name}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div class="p-3.5 rounded-xl bg-white border border-slate-200">
                <strong class="text-slate-900 block mb-1">Nearest Airport:</strong>
                <span>${place.howToReach.nearestAirport}</span>
              </div>
              <div class="p-3.5 rounded-xl bg-white border border-slate-200">
                <strong class="text-slate-900 block mb-1">Nearest Railway Station:</strong>
                <span>${place.howToReach.nearestRailway}</span>
              </div>
              <div class="p-3.5 rounded-xl bg-white border border-slate-200">
                <strong class="text-slate-900 block mb-1">Nearest Bus Terminal:</strong>
                <span>${place.howToReach.nearestBusStand}</span>
              </div>
              <div class="p-3.5 rounded-xl bg-white border border-slate-200">
                <strong class="text-slate-900 block mb-1">Road & Route Access:</strong>
                <span>${place.howToReach.roadAccessNote}</span>
              </div>
            </div>
            <div class="pt-2 flex flex-wrap gap-3">
              <a href="${place.mapDirectionsUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition">
                Open in Google Maps & Directions ↗
              </a>
              ${place.officialWebsite ? `<a href="${place.officialWebsite}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs transition">Official Website ↗</a>` : ''}
            </div>
          </div>

          <!-- Verification Metadata -->
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <span><strong>Information Source:</strong> ${place.sourceOfInfo}</span>
            <span><strong>Verification Status:</strong> ${place.verificationStatus} (Last checked: ${place.lastVerifiedDate})</span>
          </div>
        </div>

        <!-- Right 4 Cols: Unobtrusive Taxi Options & Prefilled Enquiry -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-amber-400">Travel & Cab Options</span>
              <h3 class="text-lg font-extrabold text-white mt-0.5">${place.taxiOptions.primaryActionLabel}</h3>
              <p class="text-xs text-slate-300 mt-1 leading-relaxed">${place.taxiOptions.bookingIntentNote}</p>
            </div>

            <div class="space-y-1.5 text-xs">
              <p class="font-bold text-slate-200">Suitable Trip Formats:</p>
              ${place.taxiOptions.recommendedTripTypes
                .map((t) => `<div class="p-2 rounded-lg bg-slate-800/90 text-amber-300 font-medium">✓ ${t}</div>`)
                .join('')}
            </div>

            <!-- Prefilled Quick Enquiry Form -->
            <form class="place-enquiry-form space-y-3 pt-2 border-t border-slate-800 text-xs">
              <div>
                <label class="block text-slate-300 font-bold mb-1">Pickup Location</label>
                <input type="text" class="eq-pickup w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-xs" value="${place.taxiOptions.prefillPickup}" required />
              </div>
              <div>
                <label class="block text-slate-300 font-bold mb-1">Destination / Stop</label>
                <input type="text" class="eq-drop w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-xs" value="${place.taxiOptions.prefillDrop}" required />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-slate-300 font-bold mb-1">Trip Type</label>
                  <select class="eq-type w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-xs">
                    <option value="Local Drop / Waiting">Local Cab</option>
                    <option value="Round-Trip Sightseeing">Round-Trip</option>
                    <option value="Airport / Station Transfer">Airport / Rail Transfer</option>
                    <option value="Full-Day Tour Package">Full-Day Package</option>
                  </select>
                </div>
                <div>
                  <label class="block text-slate-300 font-bold mb-1">Passengers</label>
                  <select class="eq-pax w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-xs">
                    <option value="1-4 Pax (Sedan/Hatchback)">1–4 Pax (Sedan)</option>
                    <option value="5-6 Pax (Ertiga SUV)">5–6 Pax (Ertiga)</option>
                    <option value="6-7 Pax (Innova Crysta)">6–7 Pax (Crysta)</option>
                    <option value="8-14 Pax (Tempo Traveller)">8–14 Pax (Van)</option>
                  </select>
                </div>
              </div>
              <button type="submit" class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition cursor-pointer">
                Prepare WhatsApp Quote Request
              </button>
              <div id="place-eq-handoff" class="hidden rounded-xl bg-emerald-950 border border-emerald-800 p-3 space-y-2 text-xs">
                <p class="font-extrabold text-emerald-400">✓ Quote Request Prepared</p>
                <p class="text-[11px] text-slate-200 leading-relaxed">
                  <strong>Important:</strong> This enquiry is not saved or sent automatically. Click the button below to open WhatsApp and <strong>press Send</strong> to transmit your request to our 24/7 dispatch desk (+91 ${PHONE_DISPLAY}).
                </p>
                <a id="place-eq-wa-btn" href="${WHATSAPP_URL}" target="_blank" rel="noopener" data-conversion-intent="whatsapp" class="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs text-center block transition">
                  Open WhatsApp & Press Send →
                </a>
              </div>
              <a href="${PHONE_HREF}" data-conversion-intent="call" class="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs text-center block transition">
                Call Dispatch: +91 ${PHONE_DISPLAY}
              </a>
              <p class="text-[11px] text-slate-400 leading-normal">
                Note: Preparing a quote request does not save or confirm a booking automatically. Please send the message on WhatsApp or call +91 ${PHONE_DISPLAY} to confirm with our dispatch desk.
              </p>
            </form>
          </div>

          <div class="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2.5 text-xs">
            <h4 class="font-extrabold text-slate-900">Related Directory Links</h4>
            <ul class="space-y-2 font-semibold text-slate-700">
              ${catMeta ? `<li><a href="category-${catMeta.slug}.html" class="hover:text-amber-600">→ All ${catMeta.shortTitle}</a></li>` : ''}
              ${nbMeta ? `<li><a href="neighbourhood-${nbMeta.slug}.html" class="hover:text-amber-600">→ ${nbMeta.name} Neighbourhood Guide</a></li>` : ''}
              <li><a href="explore-coimbatore.html" class="hover:text-amber-600">→ Explore Coimbatore City Directory</a></li>
              <li><a href="make-my-trip.html?addStop=${encodeURIComponent(place.name)}" class="hover:text-amber-600">→ Add ${place.name} to Get Taxi Trip Planner</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Nearby Attractions, Restaurants, Hotels & Services -->
  ${
    nearbyPlaces.length > 0
      ? `
  <section class="py-12 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-black text-slate-900 mb-2">Nearby Places, Dining, Stays & Services</h2>
      <p class="text-xs text-slate-600 mb-6">Verified places and essential services connected to ${place.name}.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${nearbyPlaces.map(renderPlaceCard).join('')}
      </div>
    </div>
  </section>`
      : ''
  }

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const form = document.querySelector('.place-enquiry-form');
      const handoffBox = document.getElementById('place-eq-handoff');
      const waBtn = document.getElementById('place-eq-wa-btn');
      if (form) {
        function buildWaUrl() {
          const pickup = form.querySelector('.eq-pickup').value;
          const drop = form.querySelector('.eq-drop').value;
          const type = form.querySelector('.eq-type').value;
          const pax = form.querySelector('.eq-pax').value;
          const msg = encodeURIComponent(
            'Hello Get Taxi Kovai, I would like to request a quote:\\n' +
            '• Place: ${place.name.replace(/'/g, "\\'")}\\n' +
            '• Pickup: ' + pickup + '\\n' +
            '• Destination: ' + drop + '\\n' +
            '• Trip Type: ' + type + '\\n' +
            '• Passengers: ' + pax
          );
          return 'https://wa.me/91${PHONE_NUMBER}?text=' + msg;
        }
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          const url = buildWaUrl();
          if (waBtn) waBtn.href = url;
          if (handoffBox) handoffBox.classList.remove('hidden');
        });
      }
    });
  </script>
  `;

  return {
    filename,
    html: generateHtmlPage({
      title: `${place.name} (${place.locality}, ${place.city}) — Visitor Guide, Timings & How to Reach`,
      description: `${place.shortDescription} Verified address, timings, facilities, nearby places, and how to reach ${place.name} in ${place.city}.`,
      keywords: `${place.name}, ${place.locality} ${place.city}, how to reach ${place.name}, taxi to ${place.name}`,
      canonicalUrl,
      activeNav: 'explore',
      bodyContent,
      schemaJson: [buildBreadcrumbSchema(breadcrumbs), placeSchema],
    }),
  };
}

// ==========================================
// 6. STATEWIDE DESTINATIONS DIRECTORY & INDIVIDUAL PAGES
// ==========================================
export function generateDestinationsDirectoryPage() {
  const canonicalUrl = `${SITE_URL}/destinations-tamil-nadu.html`;
  const breadcrumbs = [
    { label: 'Home', href: 'index.html' },
    { label: 'Explore Tamil Nadu', href: 'explore-tamil-nadu.html' },
    { label: 'Tamil Nadu Destinations', href: 'destinations-tamil-nadu.html' },
  ];

  const tnDestinations = STATEWIDE_DESTINATIONS.filter((d) => !d.isCrossState);
  const crossStateDestinations = STATEWIDE_DESTINATIONS.filter((d) => d.isCrossState);

  const schema = [
    buildBreadcrumbSchema(breadcrumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Tamil Nadu Destinations, Hill Stations & Pilgrimage Travel Guide | Get Taxi Kovai',
      description:
        'Explore verified travel and taxi guides for major Tamil Nadu cities, hill stations (Ooty, Kodaikanal, Valparai, Coonoor, Yercaud, Yelagiri), and pilgrimage centres (Palani, Madurai, Rameswaram, Tiruvannamalai, Thanjavur).',
      url: canonicalUrl,
    },
  ];

  const bodyContent = `
  ${renderBreadcrumbs(breadcrumbs)}

  <section class="bg-slate-950 text-white py-14 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Statewide Travel & Destination Directory</span>
      <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white mt-1">Tamil Nadu Cities, Hill Stations & Pilgrimage Centres</h1>
      <p class="text-slate-300 text-base sm:text-lg max-w-3xl mt-3">
        Explore verified visitor guides, route corridors from Coimbatore, top attractions, best seasons to visit, and intercity one-way or round-trip taxi options across Tamil Nadu.
      </p>
    </div>
  </section>

  <section class="py-14 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-black text-slate-900 mb-6">Destinations Within Tamil Nadu (${tnDestinations.length} Major Hubs)</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${tnDestinations
          .map(
            (d) => `
          <article class="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-amber-400 transition">
            <div>
              <div class="h-48 bg-slate-900 relative overflow-hidden">
                <img src="${d.image}" alt="${escAttr(d.name)}" width="600" height="384" loading="lazy" decoding="async" class="w-full h-full object-cover" onerror="this.style.display='none'" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <div class="absolute top-3 left-3 right-3 flex justify-between text-[11px] font-bold">
                  <span class="px-2.5 py-1 rounded-md bg-slate-950/80 text-amber-400">${d.categoryLabel}</span>
                  <span class="px-2.5 py-1 rounded-md bg-slate-950/80 text-white">${d.distanceFromCoimbatoreKm === 0 ? 'Base City' : `${d.distanceFromCoimbatoreKm} KM`}</span>
                </div>
                <div class="absolute bottom-3 left-3 right-3 text-white">
                  <p class="text-[11px] text-slate-300">${d.districtOrRegion}</p>
                  <h3 class="text-lg font-extrabold text-white"><a href="destination-${d.slug}.html" class="hover:text-amber-300">${d.name}</a></h3>
                </div>
              </div>
              <div class="p-5 space-y-3">
                <p class="text-xs text-slate-600 leading-relaxed">${d.shortSummary}</p>
                <p class="text-[11px] text-slate-500"><strong>Route:</strong> ${d.primaryRouteCorridor}</p>
                <p class="text-[11px] text-slate-500"><strong>Top Attractions:</strong> ${d.topAttractions.slice(0, 4).join(', ')}</p>
              </div>
            </div>
            <div class="p-4 border-t border-slate-200 bg-white flex gap-2">
              <a href="destination-${d.slug}.html" class="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs text-center">Destination Guide</a>
              <a href="make-my-trip.html?dest=${encodeURIComponent(d.name)}" class="py-2.5 px-3 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs text-center">Get Taxi Trip Planner</a>
            </div>
          </article>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- Cross-State Kerala Corridor Section (Explicitly separated per Section 5 requirement) -->
  <section class="py-12 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-700">Cross-State Travel Guide (Outside Tamil Nadu)</span>
        <h2 class="text-2xl font-black text-slate-900 mt-1">Inter-State Destinations Accessible from Coimbatore (Kerala)</h2>
        <p class="text-xs text-slate-600 mt-1">Note: The following destination is located in Kerala (outside Tamil Nadu) and is listed here to assist travellers departing from Coimbatore Airport / Junction.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${crossStateDestinations
          .map(
            (d) => `
          <div class="bg-white rounded-2xl p-6 border border-emerald-300 flex flex-col justify-between">
            <div>
              <span class="text-xs font-bold text-emerald-700">${d.districtOrRegion}</span>
              <h3 class="text-xl font-extrabold text-slate-900 mt-1">${d.name}</h3>
              <p class="text-xs text-slate-600 mt-2 leading-relaxed">${d.shortSummary}</p>
              <p class="text-xs text-slate-500 mt-2"><strong>Route from Coimbatore:</strong> ${d.primaryRouteCorridor} (${d.distanceFromCoimbatoreKm} KM)</p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100 flex gap-3">
              <a href="destination-${d.slug}.html" class="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs">View Cross-State Guide</a>
              <a href="tour-munnar.html" class="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs">Munnar Tour Package</a>
            </div>
          </div>`
          )
          .join('')}
      </div>
    </div>
  </section>
  `;

  return generateHtmlPage({
    title: 'Tamil Nadu Destinations, Hill Stations & Pilgrimage Directory | Get Taxi Kovai',
    description:
      'Explore destination guides and cab routes for Coimbatore, Ooty, Coonoor, Kodaikanal, Valparai, Palani, Madurai, Chennai, Trichy, Thanjavur, Rameswaram, Kanyakumari, and more.',
    keywords:
      'Tamil Nadu destinations, hill stations near Coimbatore, Tamil Nadu temple tour guide, Coimbatore outstation taxi destinations',
    canonicalUrl,
    activeNav: 'explore',
    bodyContent,
    schemaJson: schema,
  });
}

const DEST_TOUR_LINK_MAP = {
  'coimbatore': { href: 'tour-isha-yoga.html', label: 'View Isha Yoga Tour Packages (₹3,000 / ₹3,500) →' },
  'ooty-udhagamandalam': { href: 'tour-ooty-coonoor.html', label: 'View Ooty & Coonoor 2-Day Tour Package →' },
  'coonoor-nilgiris': { href: 'tour-ooty-coonoor.html', label: 'View Ooty & Coonoor Tour Package →' },
  'kodaikanal': { href: 'tour-kodaikanal.html', label: 'View Kodaikanal 3-Day Tour Package →' },
  'valparai-anamalai-hills': { href: 'tour-valparai.html', label: 'View Valparai 2-Day Tour Package →' },
  'palani-murugan-temple': { href: 'tour-palani.html', label: 'View Palani 1-Day Pilgrimage Package →' },
  'thanjavur-tanjore': { href: 'tour-thanjavur.html', label: 'View Thanjavur Big Temple Tour Package →' },
  'munnar-kerala-cross-state-guide': { href: 'tour-munnar.html', label: 'View Munnar 3-Day Tour Package →' },
};

export function generateDestinationDetailPage(dest) {
  const filename = `destination-${dest.slug}.html`;
  const canonicalUrl = `${SITE_URL}/${filename}`;
  const breadcrumbs = [
    { label: 'Home', href: 'index.html' },
    { label: 'Explore Tamil Nadu', href: 'explore-tamil-nadu.html' },
    { label: 'Destinations', href: 'destinations-tamil-nadu.html' },
    { label: dest.name, href: filename },
  ];

  const schema = [
    buildBreadcrumbSchema(breadcrumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'TouristDestination',
      name: dest.name,
      description: dest.shortSummary,
      url: canonicalUrl,
      address: {
        '@type': 'PostalAddress',
        addressLocality: dest.name,
        addressRegion: dest.state,
        addressCountry: 'IN',
      },
    },
  ];

  const waDestMsg = encodeURIComponent(
    `Hello Get Taxi Kovai, I would like to request a taxi quote from Coimbatore to ${dest.name} (${dest.distanceFromCoimbatoreKm} KM).`
  );

  // Compute approved fare estimates from Coimbatore using ONLY the approved formulas
  const distKm = Number(dest.distanceFromCoimbatoreKm) || 0;
  const billableOneWayKm = Math.max(distKm, 130);
  const oneWaySedanEst = billableOneWayKm * 16 + 500;
  const oneWaySuvEst = billableOneWayKm * 20 + 500;
  const oneWayCretaEst = billableOneWayKm * 25 + 500;
  const outstationSedanEst = 300 + distKm * 30 + 300;
  const matchingTourLink = DEST_TOUR_LINK_MAP[dest.slug] || null;

  const isCrossStateKerala = Boolean(dest.isCrossState || dest.slug.includes('munnar'));

  const fareReferenceBoxHtml =
    distKm === 0
      ? `
      <div class="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
        <p class="font-extrabold text-amber-400">Approved Local & Hourly Reference Rates (Coimbatore Hub):</p>
        <div class="flex justify-between text-slate-300"><span>1 Hr / 2 Hrs Sedan:</span><strong class="text-white">₹375 / ₹750</strong></div>
        <div class="flex justify-between text-slate-300"><span>4 Hrs / 8 Hrs Sedan:</span><strong class="text-white">₹1,450 / ₹2,850</strong></div>
        <div class="flex justify-between text-slate-300"><span>12 Hrs Full-Day Sedan:</span><strong class="text-white">₹4,250</strong></div>
        <div class="flex justify-between text-slate-300"><span>Isha Yoga Full-Day Tours:</span><strong class="text-emerald-400">₹3,000 / ₹3,500</strong></div>
        <p class="text-[11px] text-slate-400 pt-1 leading-normal">
          *Indicative local rental rates. Includes fuel and chauffeur allowance. Extra km ₹16, extra hr ₹150. Parking and toll charges extra at actuals.
        </p>
      </div>`
      : `
      <div class="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-amber-400">Indicative Fare Reference (~${distKm} KM Corridor)</span>
          <a href="oneway.html" class="text-[11px] text-amber-300 hover:underline">Rate Card →</a>
        </div>
        <div class="flex justify-between text-slate-300"><span>One-Way Drop Taxi (Sedan · ₹16/km + ₹500 batta):</span><strong class="text-white">₹${oneWaySedanEst.toLocaleString('en-IN')}*</strong></div>
        <div class="flex justify-between text-slate-300"><span>One-Way Drop Taxi (SUV · ₹20/km + ₹500 batta):</span><strong class="text-white">₹${oneWaySuvEst.toLocaleString('en-IN')}*</strong></div>
        <div class="flex justify-between text-slate-300"><span>One-Way Drop Taxi (Creta/Prem. · ₹25/km + ₹500):</span><strong class="text-white">₹${oneWayCretaEst.toLocaleString('en-IN')}*</strong></div>
        <div class="pt-1.5 border-t border-slate-800 flex justify-between text-slate-300"><span>Outstation Round-Trip Transfer Est.:</span><strong class="text-emerald-400">₹${outstationSedanEst.toLocaleString('en-IN')}*</strong></div>
        <p class="text-[11px] text-slate-400 leading-normal pt-1">
          *Indicative reference estimate only, not a final confirmed quotation. One-way drop calculated using ${billableOneWayKm} km billable distance (130 km minimum threshold) + ₹500 driver batta. Actual driving distance, highway toll gate fees, hill checkpost / parking charges, and applicable interstate permits ${isCrossStateKerala ? '(Kerala state road tax & entry permit strictly extra at actuals)' : '(if applicable)'} can affect final quotation.
        </p>
      </div>`;

  const bodyContent = `
  ${renderBreadcrumbs(breadcrumbs)}

  <section class="bg-slate-950 text-white py-12 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div class="lg:col-span-8 space-y-3">
          <span class="text-xs font-bold uppercase tracking-wider ${dest.isCrossState ? 'text-emerald-400' : 'text-amber-400'}">
            ${dest.isCrossState ? 'Cross-State Travel Guide · State: Kerala (Outside Tamil Nadu)' : `${dest.categoryLabel} · State: Tamil Nadu`}
          </span>
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white">${dest.name} — Destination & Travel Guide</h1>
          <p class="text-slate-300 text-base leading-relaxed">${dest.shortSummary}</p>
          <div class="flex flex-wrap gap-3 pt-2 text-xs">
            <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>Highway Corridor Distance from Coimbatore:</strong> ${dest.distanceFromCoimbatoreKm === 0 ? 'Base Hub (0 KM)' : `~${dest.distanceFromCoimbatoreKm} KM (Indicative)`}</span>
            <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>Approx. Drive Time:</strong> ${dest.approxDriveTime}</span>
            <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"><strong>Best Season:</strong> ${dest.bestSeasonToVisit}</span>
          </div>
        </div>
        <div class="lg:col-span-4">
          <div class="rounded-2xl overflow-hidden border border-slate-800 h-52 bg-slate-900">
            <img src="${dest.image}" alt="${escAttr(dest.name)}" width="800" height="416" loading="eager" fetchpriority="high" decoding="async" class="w-full h-full object-cover" onerror="this.style.display='none'" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-12 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div class="lg:col-span-8 space-y-8">
        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
          <h2 class="text-xl font-extrabold text-slate-900">Visitor Overview & Highway Corridor</h2>
          <p class="text-xs font-bold text-amber-700">Primary Route: ${dest.primaryRouteCorridor}</p>
          ${dest.visitorOverview.map((p) => `<p class="text-sm text-slate-700 leading-relaxed">${p}</p>`).join('')}
        </div>

        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
          <h2 class="text-lg font-extrabold text-slate-900 mb-4">Top Places to Visit & Attractions in ${dest.name}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-800 font-semibold">
            ${dest.topAttractions
              .map(
                (a) => `
              <div class="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                <span class="text-amber-500 font-black">★</span>
                <span>${a}</span>
              </div>`
              )
              .join('')}
          </div>
        </div>

        <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-2 text-xs text-slate-700">
          <h3 class="text-base font-extrabold text-slate-900">Transportation & Access Notes</h3>
          <p>${dest.localTransportAndAccess}</p>
          <p class="text-slate-500 pt-2">Source: ${dest.sourceOfInfo} · Last Verified: ${dest.lastVerifiedDate}</p>
        </div>
      </div>

      <div class="lg:col-span-4 space-y-6">
        <div class="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
          <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Intercity & Sightseeing Taxi</span>
          <h3 class="text-lg font-extrabold text-white">Travel to ${dest.name}</h3>
          <p class="text-xs text-slate-300 leading-relaxed">
            Transparent estimated fares from Coimbatore based on our approved rate card. Final quotes depend on vehicle category, multi-day waiting, and local sightseeing detours.
          </p>
          ${fareReferenceBoxHtml}
          <div class="space-y-1.5 text-xs">
            ${dest.recommendedTripTypes.map((t) => `<div class="p-2 rounded-lg bg-slate-800 text-amber-300 font-medium">✓ ${t}</div>`).join('')}
          </div>
          <div class="space-y-2 pt-2">
            ${matchingTourLink ? `<a href="${matchingTourLink.href}" class="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50 hover:bg-amber-500/30 text-amber-300 font-extrabold text-xs text-center block transition">${matchingTourLink.label}</a>` : ''}
            <a href="https://wa.me/91${PHONE_NUMBER}?text=${waDestMsg}" target="_blank" rel="noopener" data-conversion-intent="whatsapp" class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs text-center block transition">Request Quote on WhatsApp</a>
            <a href="make-my-trip.html?dest=${encodeURIComponent(dest.name)}" class="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs text-center block transition">Customize in Get Taxi Trip Planner</a>
            <a href="${PHONE_HREF}" data-conversion-intent="call" class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center block transition">Call +91 ${PHONE_DISPLAY}</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;

  return {
    filename,
    html: generateHtmlPage({
      title: `${dest.name} Travel Guide — Places to Visit, Route from Coimbatore & Cab Options`,
      description: `${dest.shortSummary} Explore top attractions, route corridor (${dest.distanceFromCoimbatoreKm} km from Coimbatore), and taxi booking options.`,
      keywords: `${dest.name} travel guide, places to visit in ${dest.name}, Coimbatore to ${dest.name} taxi, ${dest.name} sightseeing`,
      canonicalUrl,
      activeNav: 'explore',
      bodyContent,
      schemaJson: schema,
    }),
  };
}

// ==========================================
// 7. SCENIC ROUTES & LESSER-KNOWN PLACES PAGE (Section 11)
// ==========================================
export function generateScenicRoutesPage() {
  const canonicalUrl = `${SITE_URL}/scenic-routes.html`;
  const breadcrumbs = [
    { label: 'Home', href: 'index.html' },
    { label: 'Explore Tamil Nadu', href: 'explore-tamil-nadu.html' },
    { label: 'Scenic Routes & Offbeat Places', href: 'scenic-routes.html' },
  ];

  const hiddenGemPlaces = VERIFIED_PLACES.filter((p) => p.isHiddenGem);

  const schema = [
    buildBreadcrumbSchema(breadcrumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Scenic Drives, Ghat Routes & Lesser-Known Places in Tamil Nadu | Get Taxi Kovai',
      description:
        'Detailed road-trip guides comparing regular highways with quieter scenic alternatives for Coimbatore to Ooty, Coonoor, Valparai, Kodaikanal, Salem to Yercaud, and Kongu temple circuits.',
      url: canonicalUrl,
    },
  ];

  const bodyContent = `
  ${renderBreadcrumbs(breadcrumbs)}

  <section class="bg-slate-950 text-white py-14 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Verified Road Corridors & Offbeat Stops</span>
      <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white mt-1">
        Scenic Drives, Ghat Routes & Quieter Places
      </h1>
      <p class="text-slate-300 text-base sm:text-lg max-w-3xl mt-3 leading-relaxed">
        Compare regular highway routes with verified, lawful scenic alternatives—including hairpin bend counts, viewpoints, forest checkpost timings, and seasonal regulations.
      </p>
    </div>
  </section>

  <!-- Detailed Scenic Route Guides -->
  <section class="py-14 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      ${SCENIC_ROUTES.map(
        (route) => `
        <article id="${route.slug}" class="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span class="text-xs font-bold text-amber-700">${route.stateNote} · ~${route.distanceRegularKm} KM (${route.approxDuration})</span>
              <h2 class="text-2xl font-black text-slate-900 mt-1">${route.title}</h2>
            </div>
            <div class="flex flex-wrap gap-2">
              <a href="make-my-trip.html?dest=${encodeURIComponent(route.destination)}" class="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs">Customize Route in Get Taxi Trip Planner</a>
              <a href="https://wa.me/91${PHONE_NUMBER}?text=${encodeURIComponent(`Hello Get Taxi Kovai, I would like a cab quote for the ${route.title} route.`)}" target="_blank" rel="noopener" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs">Request Route Quote</a>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl p-5 border border-slate-200">
              <h3 class="text-sm font-extrabold text-slate-900 mb-2">Regular Highway Route</h3>
              <p class="text-xs text-slate-700 leading-relaxed">${route.regularRouteSummary}</p>
            </div>
            <div class="bg-amber-50/70 rounded-2xl p-5 border border-amber-200">
              <h3 class="text-sm font-extrabold text-slate-900 mb-2">Verified Scenic / Quieter Alternative</h3>
              <p class="text-xs text-slate-700 leading-relaxed">${route.scenicAlternativeSummary}</p>
            </div>
          </div>

          <!-- Verified En-Route Stops -->
          <div>
            <h3 class="text-sm font-extrabold text-slate-900 mb-3">Suggested Lawful En-Route Viewpoints & Stops</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              ${route.verifiedStops
                .map(
                  (s) => `
                <div class="bg-white rounded-xl p-4 border border-slate-200 text-xs">
                  <span class="text-[11px] font-bold text-amber-700">${s.category}</span>
                  <h4 class="font-extrabold text-slate-900 mt-0.5">${s.name}</h4>
                  <p class="text-slate-600 mt-1">${s.locationNote}</p>
                  <p class="text-[11px] text-slate-500 mt-1 font-medium">${s.detourNote}</p>
                </div>`
                )
                .join('')}
            </div>
          </div>

          <!-- Road Safety & Legal/Forest Restrictions -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div class="bg-white rounded-2xl p-5 border border-slate-200">
              <h4 class="font-extrabold text-slate-900 mb-2">Road Conditions & Driving Notes</h4>
              <ul class="space-y-1.5 text-slate-600">
                ${route.roadConditionAndSafety.map((n) => `<li>• ${n}</li>`).join('')}
              </ul>
            </div>
            <div class="bg-white rounded-2xl p-5 border border-slate-200">
              <h4 class="font-extrabold text-slate-900 mb-2">Checkpost, Seasonal & Legal Restrictions</h4>
              <ul class="space-y-1.5 text-slate-600">
                ${route.seasonalAndLegalRestrictions.map((r) => `<li>• ${r}</li>`).join('')}
              </ul>
            </div>
          </div>
        </article>`
      ).join('')}
    </div>
  </section>

  <!-- Lesser-Known & Quieter Places Section -->
  <section id="hidden-gems" class="py-14 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-700">Quieter & Offbeat Stops</span>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Lesser-Known & Quieter Places Around Coimbatore</h2>
        <p class="text-xs sm:text-sm text-slate-600 mt-1">Publicly accessible, lawful heritage and nature spots that offer a calmer experience away from peak tourist crowds.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${hiddenGemPlaces.map(renderPlaceCard).join('')}
      </div>
    </div>
  </section>
  `;

  return generateHtmlPage({
    title: 'Scenic Drives, Ghat Routes & Lesser-Known Places from Coimbatore | Get Taxi Kovai',
    description:
      'Explore verified scenic routes from Coimbatore to Ooty (Coonoor vs Kotagiri), Valparai 40 hairpin bends, Kodaikanal via Palani, and Salem to Yercaud.',
    keywords:
      'Coimbatore to Ooty scenic route, Kotagiri vs Coonoor road, Valparai 40 hairpin bends guide, lesser known places near Coimbatore',
    canonicalUrl,
    activeNav: 'explore',
    bodyContent,
    schemaJson: schema,
  });
}

// ==========================================
// 8. GET TAXI TRIP PLANNER — CUSTOM TRIP PLANNER (Section 10)
// ==========================================
export function generateMakeMyTripPage(options = {}) {
  const isAlias = Boolean(options.isAlias);
  const canonicalUrl = `${SITE_URL}/make-my-trip.html`;
  const breadcrumbs = [
    { label: 'Home', href: 'index.html' },
    { label: 'Explore Tamil Nadu', href: 'explore-tamil-nadu.html' },
    { label: 'Get Taxi Trip Planner', href: 'make-my-trip.html' },
  ];

  const schema = [
    buildBreadcrumbSchema(breadcrumbs),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Get Taxi Trip Planner — Custom Multi-Stop Taxi Itinerary Planner | Get Taxi Kovai',
      description:
        'Plan a customized sightseeing or intercity taxi trip from Coimbatore. Select pickup, primary destination, verified sightseeing stops, trip duration, and request a transparent quote.',
      url: canonicalUrl,
    },
  ];

  const stopsCatalogJson = JSON.stringify(
    VERIFIED_PLACES.map((p) => ({
      id: p.id,
      name: p.name,
      city: p.city,
      locality: p.locality,
      category: p.categoryLabel,
    })).concat([
      { id: 'stop-sims-park', name: 'Sims Park & Dolphin’s Nose (Coonoor)', city: 'Coonoor', locality: 'Coonoor Ghat', category: 'Hill Station Stop' },
      { id: 'stop-doddabetta', name: 'Doddabetta Peak & Botanical Garden (Ooty)', city: 'Ooty', locality: 'Ooty', category: 'Hill Station Stop' },
      { id: 'stop-pykara', name: 'Pykara Lake & Pine Forest (Ooty)', city: 'Ooty', locality: 'Ooty–Gudalur Rd', category: 'Nature Stop' },
      { id: 'stop-palani-temple', name: 'Palani Murugan Hill Temple', city: 'Palani', locality: 'NH83 Foothills', category: 'Pilgrimage Stop' },
      { id: 'stop-kodai-lake', name: 'Kodaikanal Lake, Coaker’s Walk & Pillar Rocks', city: 'Kodaikanal', locality: 'Kodaikanal', category: 'Hill Station Stop' },
      { id: 'stop-loams-view', name: 'Loam’s Viewpoint & Monkey Falls (Valparai Ghat)', city: 'Valparai', locality: '40 Hairpin Bends', category: 'Viewpoint Stop' },
      { id: 'stop-sholayar', name: 'Nallamudi Viewpoint & Sholayar Dam (Valparai)', city: 'Valparai', locality: 'Valparai', category: 'Hill Station Stop' },
      { id: 'stop-meenakshi', name: 'Madurai Meenakshi Amman Temple & Nayakkar Mahal', city: 'Madurai', locality: 'Madurai', category: 'Pilgrimage Stop' },
      { id: 'stop-srirangam', name: 'Trichy Srirangam & Rockfort Temple', city: 'Tiruchirappalli', locality: 'Trichy', category: 'Pilgrimage Stop' },
      { id: 'stop-big-temple', name: 'Thanjavur Brihadeeswarar Big Temple', city: 'Thanjavur', locality: 'Thanjavur', category: 'Heritage Stop' },
    ])
  );

  const readyItinerariesJson = JSON.stringify(READY_TRIP_SUGGESTIONS);

  const bodyContent = `
  ${renderBreadcrumbs(breadcrumbs)}

  <section class="bg-slate-950 text-white py-12 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Custom Multi-Stop Trip Builder</span>
      <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white mt-1">Get Taxi Trip Planner — Plan Your Custom Cab Itinerary</h1>
      <p class="text-slate-300 text-base sm:text-lg max-w-3xl mt-3 leading-relaxed">
        Select your pickup location, choose a primary destination, add verified sightseeing or temple stops along the corridor, or load a ready-made itinerary suggestion to request an exact taxi quote.
      </p>
    </div>
  </section>

  <!-- Ready-Made Suggested Itineraries Bar -->
  <section class="py-10 bg-slate-100 border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-base font-extrabold text-slate-900 mb-3">Load a Ready-Made Verified Itinerary Suggestion (1-Click Prefill):</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        ${READY_TRIP_SUGGESTIONS.map(
          (itin, idx) => `
          <button type="button" class="load-itinerary-btn text-left p-4 rounded-2xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 shadow-xs transition cursor-pointer flex flex-col justify-between" data-itin-index="${idx}">
            <div>
              <span class="text-[11px] font-bold text-amber-700">${itin.recommendedDuration}</span>
              <h3 class="text-xs font-extrabold text-slate-900 mt-1">${itin.title}</h3>
              <p class="text-[11px] text-slate-500 mt-1 line-clamp-2">${itin.subtitle}</p>
            </div>
            <span class="text-[11px] font-bold text-emerald-700 mt-3 block">+ Load Into Planner →</span>
          </button>`
        ).join('')}
      </div>
    </div>
  </section>

  <!-- Interactive Trip Builder Grid -->
  <section class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Left 7 Cols: Interactive Builder Form -->
        <div class="lg:col-span-7 space-y-6">
          <form id="mmt-planner-form" class="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-5">
            <h2 class="text-xl font-black text-slate-900">1. Route, Dates & Passenger Details</h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Pickup City / Address</label>
                <input type="text" id="mmt-pickup" value="Coimbatore (Gandhipuram / Airport / Hotel)" required class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900" />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Primary Destination</label>
                <select id="mmt-destination" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-semibold text-slate-900">
                  <option value="Isha Yoga Center & Adiyogi">Isha Yoga Center & Adiyogi (Coimbatore)</option>
                  <option value="Ooty (Udhagamandalam)">Ooty (Udhagamandalam)</option>
                  <option value="Coonoor Hill Station">Coonoor Hill Station</option>
                  <option value="Valparai (Anamalai Hills)">Valparai (40 Hairpin Bends)</option>
                  <option value="Kodaikanal Hill Station">Kodaikanal Hill Station</option>
                  <option value="Palani Murugan Temple">Palani Murugan Temple</option>
                  <option value="Madurai Meenakshi Temple">Madurai</option>
                  <option value="Munnar (Kerala — Cross-State)">Munnar (Kerala Cross-State)</option>
                  <option value="Yercaud (Salem)">Yercaud Hill Station</option>
                  <option value="Tiruchirappalli & Thanjavur">Trichy & Thanjavur</option>
                  <option value="Rameswaram & Kanyakumari">Rameswaram / Kanyakumari</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore Local Sightseeing">Coimbatore Local Sightseeing / Temples</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Trip Type</label>
                <select id="mmt-triptype" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-semibold text-slate-900">
                  <option value="Round-Trip Sightseeing">Round-Trip Sightseeing</option>
                  <option value="One-Way Drop">One-Way Drop Only</option>
                  <option value="Multi-Day Tour">Multi-Day Tour</option>
                  <option value="Local Full-Day Package">Local Full-Day Package</option>
                  <option value="Airport / Station Transfer">Airport / Station Transfer</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Trip Duration</label>
                <select id="mmt-duration" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-semibold text-slate-900">
                  <option value="1 Day (Up to 10-12 Hours)">1 Day (Same Day Return)</option>
                  <option value="One-Way Point-to-Point">One-Way Transfer</option>
                  <option value="2 Days / 1 Night">2 Days / 1 Night</option>
                  <option value="3 Days / 2 Nights">3 Days / 2 Nights</option>
                  <option value="4+ Days Custom Tour">4+ Days Custom Tour</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Passengers & Vehicle</label>
                <select id="mmt-vehicle" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-semibold text-slate-900">
                  <option value="1–4 Pax · Executive Sedan (Dzire/Etios)">1–4 Pax · Sedan (Dzire/Etios)</option>
                  <option value="1–4 Pax · Hatchback">1–4 Pax · Hatchback</option>
                  <option value="5–6 Pax · Family SUV (Ertiga)">5–6 Pax · SUV (Ertiga)</option>
                  <option value="6–7 Pax · Innova Crysta">6–7 Pax · Innova Crysta</option>
                  <option value="8–14 Pax · Tempo Traveller">8–14 Pax · Tempo Traveller</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label for="mmt-date" class="block text-xs font-bold text-slate-700 mb-1">Travel / Pickup Date</label>
                <input type="date" id="mmt-date" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900" />
              </div>
              <div>
                <label for="mmt-return-date" class="block text-xs font-bold text-slate-700 mb-1">Return Date (Optional)</label>
                <input type="date" id="mmt-return-date" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900" />
              </div>
              <div>
                <label for="mmt-time" class="block text-xs font-bold text-slate-700 mb-1">Approx. Pickup Time</label>
                <input type="time" id="mmt-time" value="07:30" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900" />
              </div>
              <div>
                <label for="mmt-phone" class="block text-xs font-bold text-slate-700 mb-1">Your Contact Phone</label>
                <input type="tel" id="mmt-phone" placeholder="10-digit mobile number" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label for="mmt-passengers" class="block text-xs font-bold text-slate-700 mb-1">Passenger Count</label>
                <input type="number" id="mmt-passengers" min="1" max="30" value="4" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-semibold text-slate-900" />
              </div>
              <div class="sm:col-span-2">
                <label for="mmt-luggage" class="block text-xs font-bold text-slate-700 mb-1">Luggage & Carrier Requirement</label>
                <select id="mmt-luggage" class="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-semibold text-slate-900">
                  <option value="Standard (1–2 Medium Bags)">Standard (1–2 Medium Bags)</option>
                  <option value="Hand Baggage Only">Hand Baggage Only (Day Trip)</option>
                  <option value="Family Luggage (3–4 Large Bags)">Family Luggage (3–4 Large Suitcases)</option>
                  <option value="Heavy Group Luggage / Roof Carrier Needed">Heavy Group Luggage / Roof Carrier Needed</option>
                </select>
              </div>
            </div>

            <!-- Add Sightseeing Stops -->
            <div class="pt-4 border-t border-slate-200 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-base font-extrabold text-slate-900">2. Add & Order Sightseeing or Temple Stops</h3>
                <button type="button" id="mmt-reset-btn" class="text-xs font-bold text-amber-700 hover:underline cursor-pointer">Reset Planner</button>
              </div>
              <p class="text-xs text-slate-600">Select verified attractions along your route, type a custom stop, and use ↑ / ↓ to reorder stops:</p>

              <div class="flex gap-2">
                <select id="mmt-stop-picker" aria-label="Select verified sightseeing stop" class="flex-1 bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-900"></select>
                <button type="button" id="mmt-add-stop-btn" class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs shrink-0 cursor-pointer">+ Add Stop</button>
              </div>

              <div class="flex gap-2">
                <input type="text" id="mmt-custom-stop" placeholder="Or type any custom landmark / hotel / temple stop..." class="flex-1 bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900" />
                <button type="button" id="mmt-add-custom-btn" class="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold text-xs shrink-0 cursor-pointer">+ Add Custom</button>
              </div>

              <div id="mmt-selected-stops" class="space-y-2 pt-2"></div>
            </div>

            <!-- Additional Notes -->
            <div class="pt-4 border-t border-slate-200">
              <label for="mmt-notes" class="block text-xs font-bold text-slate-700 mb-1">3. Special Instructions / Temple Timings / Child or Senior Needs (Optional)</label>
              <textarea id="mmt-notes" rows="2" placeholder="e.g. Need wheelchair space in boot, planning morning darshan at Perur & Maruthamalai..." class="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900"></textarea>
            </div>

            <div id="mmt-error-alert" class="hidden rounded-xl bg-rose-50 border border-rose-300 p-3.5 text-xs font-bold text-rose-900" role="alert"></div>

            <div id="mmt-status-banner" class="hidden rounded-2xl bg-emerald-50 border border-emerald-300 p-4 text-xs text-emerald-950 space-y-2" role="status" aria-live="polite">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="font-extrabold text-emerald-900">✓ Trip Enquiry Validated — Action Required: Send on WhatsApp</span>
                <span id="mmt-ref-badge" class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 font-bold text-[11px]"></span>
              </div>
              <p id="mmt-status-disclaimer" class="text-slate-700 leading-relaxed"></p>
              <div class="flex flex-wrap gap-2 pt-1">
                <a id="mmt-status-wa-link" href="${WHATSAPP_URL}" target="_blank" rel="noopener" data-conversion-intent="whatsapp" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs">Open WhatsApp & Press Send →</a>
                <a href="${PHONE_HREF}" data-conversion-intent="call" class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs">Call 24/7 Dispatch (+91 ${PHONE_DISPLAY})</a>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
              <button type="submit" class="flex-1 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md transition cursor-pointer">
                Validate & Request Custom Trip Quote on WhatsApp
              </button>
              <a id="mmt-gmaps-link" href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" class="py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center transition">
                View Route Directions in Google Maps ↗
              </a>
            </div>
          </form>
        </div>

        <!-- Right 5 Cols: Live Trip Summary & Honest Pricing Policy -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Your Proposed Trip Summary</span>
              <h2 id="summary-title" class="text-xl font-black text-white mt-1">Coimbatore → Isha Yoga Center & Adiyogi</h2>
              <p id="summary-meta" class="text-xs text-slate-300 mt-1">Round-Trip Sightseeing · 1 Day · 4 Pax · Sedan</p>
            </div>

            <div class="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
              <p class="font-bold text-amber-400">Proposed Route Sequence:</p>
              <ol id="summary-sequence" class="space-y-1.5 text-slate-300 list-decimal pl-4"></ol>
            </div>

            <div id="summary-notes-box" class="bg-slate-800/70 rounded-2xl p-4 border border-slate-700 text-xs text-slate-300 space-y-1.5">
              <p class="font-bold text-white">Route & Pricing Guidance:</p>
              <p>• Itinerary stops are suggestions; please verify real-time road/traffic conditions via Google Maps or with our dispatch desk.</p>
              <p>• We do not display fabricated instant fares for multi-stop custom detours—your exact quote is calculated transparently based on total kilometres, hill/plain route, and trip duration.</p>
              <p>• Note: Submitting a quote request is an enquiry, not an automatic confirmed vehicle reservation, until confirmed by our 24/7 dispatch desk.</p>
            </div>

            <div class="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <a href="${PHONE_HREF}" data-conversion-intent="call" class="py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs text-center transition">
                 Prefer Speaking to an Expert? Call +91 ${PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const STOPS_CATALOG = ${stopsCatalogJson};
      const READY_ITINERARIES = ${readyItinerariesJson};

      const pickupEl = document.getElementById('mmt-pickup');
      const destEl = document.getElementById('mmt-destination');
      const typeEl = document.getElementById('mmt-triptype');
      const durEl = document.getElementById('mmt-duration');
      const vehEl = document.getElementById('mmt-vehicle');
      const dateEl = document.getElementById('mmt-date');
      const returnDateEl = document.getElementById('mmt-return-date');
      const timeEl = document.getElementById('mmt-time');
      const phoneEl = document.getElementById('mmt-phone');
      const paxEl = document.getElementById('mmt-passengers');
      const luggageEl = document.getElementById('mmt-luggage');
      const notesEl = document.getElementById('mmt-notes');
      const resetBtn = document.getElementById('mmt-reset-btn');
      const stopPicker = document.getElementById('mmt-stop-picker');
      const addStopBtn = document.getElementById('mmt-add-stop-btn');
      const customStopEl = document.getElementById('mmt-custom-stop');
      const addCustomBtn = document.getElementById('mmt-add-custom-btn');
      const selectedStopsEl = document.getElementById('mmt-selected-stops');
      const summaryTitle = document.getElementById('summary-title');
      const summaryMeta = document.getElementById('summary-meta');
      const summarySeq = document.getElementById('summary-sequence');
      const gmapsLink = document.getElementById('mmt-gmaps-link');
      const errorAlert = document.getElementById('mmt-error-alert');
      const statusBanner = document.getElementById('mmt-status-banner');
      const statusWaLink = document.getElementById('mmt-status-wa-link');
      const statusDisclaimer = document.getElementById('mmt-status-disclaimer');
      const refBadge = document.getElementById('mmt-ref-badge');

      let selectedStops = [
        'Perur Pateeswarar Temple',
        'Maruthamalai Murugan Temple'
      ];

      // Check URL params
      const params = new URLSearchParams(window.location.search);
      if (params.get('dest')) {
        const dParam = params.get('dest');
        for (let i = 0; i < destEl.options.length; i++) {
          if (destEl.options[i].value.toLowerCase().includes(dParam.toLowerCase())) {
            destEl.selectedIndex = i;
            break;
          }
        }
      }
      if (params.get('addStop')) {
        selectedStops = [params.get('addStop')];
      }

      function populateStopPicker() {
        stopPicker.innerHTML = STOPS_CATALOG.map(function(s) {
          return '<option value="' + s.name + '">' + s.name + ' (' + s.city + ' — ' + s.category + ')</option>';
        }).join('');
      }

      function renderBuilderState() {
        if (selectedStops.length === 0) {
          selectedStopsEl.innerHTML = '<div class="text-xs text-slate-500 italic bg-white px-3.5 py-2.5 rounded-xl border border-slate-200">No intermediate sightseeing stops selected (direct point-to-point route).</div>';
        } else {
          selectedStopsEl.innerHTML = selectedStops.map(function(stop, idx) {
            return '<div class="flex items-center justify-between gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-xs">' +
              '<span class="font-bold text-slate-800">' + (idx + 1) + '. ' + stop + '</span>' +
              '<div class="flex items-center gap-1.5 shrink-0">' +
                '<button type="button" data-move-up="' + idx + '" class="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer" title="Move stop up"' + (idx === 0 ? ' disabled style="opacity:0.4"' : '') + '>↑</button>' +
                '<button type="button" data-move-down="' + idx + '" class="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer" title="Move stop down"' + (idx === selectedStops.length - 1 ? ' disabled style="opacity:0.4"' : '') + '>↓</button>' +
                '<button type="button" data-remove-idx="' + idx + '" class="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold cursor-pointer">Remove</button>' +
              '</div>' +
            '</div>';
          }).join('');
        }

        selectedStopsEl.querySelectorAll('[data-remove-idx]').forEach(function(btn) {
          btn.addEventListener('click', function() {
            const idx = parseInt(btn.getAttribute('data-remove-idx'), 10);
            selectedStops.splice(idx, 1);
            renderBuilderState();
          });
        });

        selectedStopsEl.querySelectorAll('[data-move-up]').forEach(function(btn) {
          btn.addEventListener('click', function() {
            const idx = parseInt(btn.getAttribute('data-move-up'), 10);
            if (idx > 0) {
              const temp = selectedStops[idx - 1];
              selectedStops[idx - 1] = selectedStops[idx];
              selectedStops[idx] = temp;
              renderBuilderState();
            }
          });
        });

        selectedStopsEl.querySelectorAll('[data-move-down]').forEach(function(btn) {
          btn.addEventListener('click', function() {
            const idx = parseInt(btn.getAttribute('data-move-down'), 10);
            if (idx < selectedStops.length - 1) {
              const temp = selectedStops[idx + 1];
              selectedStops[idx + 1] = selectedStops[idx];
              selectedStops[idx] = temp;
              renderBuilderState();
            }
          });
        });

        summaryTitle.textContent = pickupEl.value + ' → ' + destEl.value;
        summaryMeta.textContent = typeEl.value + ' · ' + durEl.value + ' · ' + (paxEl.value || '4') + ' Pax · ' + vehEl.value + ' · ' + luggageEl.value;

        const seqItems = ['Pickup: ' + pickupEl.value]
          .concat(selectedStops.map(function(s) { return 'Stop: ' + s; }))
          .concat(['Primary Destination: ' + destEl.value]);
        if (typeEl.value.includes('Round-Trip') || typeEl.value.includes('Multi-Day') || typeEl.value.includes('Local')) {
          seqItems.push('Return Drop: ' + pickupEl.value);
        }
        summarySeq.innerHTML = seqItems.map(function(item) {
          return '<li>' + item + '</li>';
        }).join('');

        const waypointsParam = selectedStops.length > 0 ? '&waypoints=' + encodeURIComponent(selectedStops.join('|')) : '';
        gmapsLink.href = 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(pickupEl.value) + '&destination=' + encodeURIComponent(destEl.value) + waypointsParam;
      }

      addStopBtn.addEventListener('click', function() {
        const val = stopPicker.value;
        if (val && !selectedStops.includes(val)) {
          selectedStops.push(val);
          renderBuilderState();
        }
      });

      addCustomBtn.addEventListener('click', function() {
        const val = (customStopEl.value || '').trim();
        if (val && !selectedStops.includes(val)) {
          selectedStops.push(val);
          customStopEl.value = '';
          renderBuilderState();
        }
      });

      resetBtn.addEventListener('click', function() {
        pickupEl.value = 'Coimbatore (Gandhipuram / Airport / Hotel)';
        destEl.selectedIndex = 0;
        typeEl.selectedIndex = 0;
        durEl.selectedIndex = 0;
        vehEl.selectedIndex = 0;
        dateEl.value = '';
        returnDateEl.value = '';
        timeEl.value = '07:30';
        phoneEl.value = '';
        paxEl.value = '4';
        luggageEl.selectedIndex = 0;
        notesEl.value = '';
        selectedStops = [];
        errorAlert.classList.add('hidden');
        statusBanner.classList.add('hidden');
        renderBuilderState();
      });

      [pickupEl, destEl, typeEl, durEl, vehEl, paxEl, luggageEl].forEach(function(el) {
        el.addEventListener('change', renderBuilderState);
        el.addEventListener('input', renderBuilderState);
      });

      document.querySelectorAll('.load-itinerary-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          const idx = parseInt(btn.getAttribute('data-itin-index'), 10);
          const itin = READY_ITINERARIES[idx];
          if (!itin) return;
          pickupEl.value = itin.originCity;
          for (let i = 0; i < destEl.options.length; i++) {
            if (destEl.options[i].value.toLowerCase().includes(itin.primaryDestination.toLowerCase())) {
              destEl.selectedIndex = i;
              break;
            }
          }
          selectedStops = itin.suggestedStops.map(function(s) { return s.stopName; });
          renderBuilderState();
        });
      });

      document.getElementById('mmt-planner-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        errorAlert.classList.add('hidden');
        statusBanner.classList.add('hidden');

        const pickupVal = (pickupEl.value || '').trim();
        const destVal = (destEl.value || '').trim();
        if (!pickupVal || !destVal) {
          errorAlert.textContent = 'Please provide both a pickup location and a primary destination.';
          errorAlert.classList.remove('hidden');
          return;
        }

        if (dateEl.value && returnDateEl.value && returnDateEl.value < dateEl.value) {
          errorAlert.textContent = 'Return date cannot be earlier than the pickup/travel date.';
          errorAlert.classList.remove('hidden');
          return;
        }

        const payload = {
          pickup: pickupVal,
          destination: destVal,
          stops: selectedStops,
          tripType: typeEl.value,
          duration: durEl.value,
          vehicle: vehEl.value,
          passengers: Number(paxEl.value) || 4,
          luggage: luggageEl.value,
          travelDate: dateEl.value || 'Flexible',
          returnDate: returnDateEl.value || '',
          pickupTime: timeEl.value || 'Flexible',
          phone: (phoneEl.value || '').trim(),
          notes: (notesEl.value || '').trim(),
        };

        try {
          const res = await fetch('/api/directory/enquiry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (res.status === 404 || res.status === 405) {
            throw new Error('Static host fallback');
          }
          const data = await res.json();
          if (!res.ok || !data.ok) {
            errorAlert.textContent = data.error || 'Could not validate trip enquiry. Please check your inputs.';
            errorAlert.classList.remove('hidden');
            return;
          }
          const resolvedId = data.enquiryId || ('GTK-' + Date.now().toString(36).toUpperCase().slice(-6));
          refBadge.textContent = 'Ref: ' + resolvedId;
          statusDisclaimer.textContent = data.disclaimer || data.disclosure || 'IMPORTANT: Your enquiry is NOT saved on our server or dispatched automatically. Please click the WhatsApp button below and press Send in WhatsApp to transmit your trip details to our 24/7 dispatch desk (+91 ${PHONE_DISPLAY}), or call us directly.';
          statusWaLink.href = data.whatsappUrl;
          statusBanner.classList.remove('hidden');
        } catch (err) {
          const fallbackId = 'GTK-' + Date.now().toString(36).toUpperCase().slice(-6);
          const stopsText = selectedStops.length > 0 ? selectedStops.join(' -> ') : 'Direct (No extra stops)';
          const fallbackMsg = encodeURIComponent(
            'Hello Get Taxi Kovai, I would like a custom Get Taxi Trip Planner taxi quote (Ref: ' + fallbackId + '):\\n' +
            '• Pickup: ' + pickupVal + '\\n' +
            '• Primary Destination: ' + destVal + '\\n' +
            '• Sightseeing Stops: ' + stopsText + '\\n' +
            '• Trip Type: ' + typeEl.value + ' (' + durEl.value + ')\\n' +
            '• Vehicle & Pax: ' + vehEl.value + ' (' + (paxEl.value || '4') + ' Pax, ' + luggageEl.value + ')\\n' +
            '• Travel Date: ' + (dateEl.value || 'Flexible') + (returnDateEl.value ? ' to ' + returnDateEl.value : '') + ' at ' + (timeEl.value || 'Flexible') + '\\n' +
            '• Contact Phone: ' + (phoneEl.value || 'On WhatsApp') +
            (notesEl.value ? '\\n• Notes: ' + notesEl.value : '')
          );
          refBadge.textContent = 'Ref: ' + fallbackId;
          statusDisclaimer.textContent = 'IMPORTANT: Your enquiry is NOT saved on our server or dispatched automatically. Please click the WhatsApp button below and press Send in WhatsApp to transmit your trip details to our 24/7 dispatch desk (+91 ${PHONE_DISPLAY}), or call us directly.';
          statusWaLink.href = 'https://wa.me/91${PHONE_NUMBER}?text=' + fallbackMsg;
          statusBanner.classList.remove('hidden');
        }
      });

      populateStopPicker();
      renderBuilderState();
    });
  </script>
  `;

  return generateHtmlPage({
    title: 'Get Taxi Trip Planner — Custom Sightseeing & Multi-Stop Taxi Planner | Get Taxi Kovai',
    description:
      'Plan your custom sightseeing or intercity trip from Coimbatore with the Get Taxi Trip Planner. Select pickup, destination, multiple stops (Ooty, Coonoor, Kodaikanal, Valparai, Temples), and request a quote.',
    keywords:
      'Get Taxi Trip Planner, Coimbatore taxi trip planner, custom sightseeing cab Coimbatore, plan my trip Tamil Nadu, multi stop cab booking Coimbatore',
    canonicalUrl,
    activeNav: 'explore',
    extraHead: isAlias ? '<meta name="robots" content="noindex, follow" />' : '',
    bodyContent,
    schemaJson: schema,
  });
}

// ==========================================
// 9. DYNAMIC QUERY-PARAMETER LOOKUP PAGES (place.html?id=... & destination.html?id=...)
// ==========================================
export function generateDynamicPlaceQueryPage() {
  const canonicalUrl = `${SITE_URL}/explore-coimbatore.html`;
  const breadcrumbs = [
    { label: 'Home', href: 'index.html' },
    { label: 'Explore Tamil Nadu', href: 'explore-tamil-nadu.html' },
    { label: 'Place Directory Lookup', href: 'place.html' },
  ];

  const placesJson = JSON.stringify(VERIFIED_PLACES);

  const bodyContent = `
  ${renderBreadcrumbs(breadcrumbs)}
  <section class="py-12 bg-white min-h-[60vh]">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" id="dynamic-place-root">
      <div class="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center">
        <h1 class="text-2xl font-black text-slate-900">Verified Place Directory Lookup</h1>
        <p class="text-sm text-slate-600 mt-2">Loading place record...</p>
      </div>
    </div>
  </section>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const PLACES = ${placesJson};
      const root = document.getElementById('dynamic-place-root');
      const params = new URLSearchParams(window.location.search);
      const rawId = (params.get('id') || params.get('slug') || '').trim().toLowerCase();

      const match = rawId ? PLACES.find(function(p) {
        return p.id.toLowerCase() === rawId || p.slug.toLowerCase() === rawId || p.slug.toLowerCase().includes(rawId);
      }) : null;

      if (!match) {
        root.innerHTML =
          '<div class="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-5" role="region" aria-label="Place lookup fallback">' +
            '<span class="inline-block px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">Directory Record Lookup</span>' +
            '<h1 class="text-2xl sm:text-3xl font-black text-slate-900">' + (rawId ? 'No Verified Place Found for ID "' + rawId.replace(/[<>"&]/g, '') + '"' : 'Select a Verified Place from the Directory') + '</h1>' +
            '<p class="text-sm text-slate-600 leading-relaxed">The requested place identifier was not found or was not specified. Browse our verified Coimbatore & Tamil Nadu place pages below:</p>' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">' +
              PLACES.slice(0, 9).map(function(p) {
                return '<a href="place-' + p.slug + '.html" class="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 transition block">' +
                  '<span class="text-[11px] font-bold text-amber-700">' + p.subcategory + '</span>' +
                  '<h2 class="text-sm font-extrabold text-slate-900 mt-0.5">' + p.name + '</h2>' +
                  '<p class="text-xs text-slate-500 mt-1">' + p.locality + ', ' + p.city + '</p>' +
                '</a>';
              }).join('') +
            '</div>' +
            '<div class="pt-4 flex flex-wrap gap-3">' +
              '<a href="explore-coimbatore.html" class="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs">Explore Coimbatore Directory →</a>' +
              '<a href="explore-tamil-nadu.html" class="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs">Search All Places →</a>' +
            '</div>' +
          '</div>';
        return;
      }

      document.title = match.name + ' (' + match.neighbourhood + ', ' + match.city + ') | Get Taxi Kovai';
      const waMsg = encodeURIComponent('Hello Get Taxi Kovai, I would like to book a cab for ' + match.name + ' (' + match.locality + ', ' + match.city + ').');
      root.innerHTML =
        '<article class="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">' +
          '<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">' +
            '<div>' +
              '<span class="text-xs font-bold text-amber-700">' + match.categoryLabel + ' · ' + match.subcategory + '</span>' +
              '<h1 class="text-2xl sm:text-4xl font-black text-slate-900 mt-1">' + match.name + '</h1>' +
              '<p class="text-xs text-slate-600 mt-1">' + match.postalAddress + '</p>' +
            '</div>' +
            '<a href="place-' + match.slug + '.html" class="px-4 py-2 rounded-xl bg-slate-900 text-amber-400 font-bold text-xs">Open Full Canonical Guide →</a>' +
          '</div>' +
          '<p class="text-sm text-slate-700 leading-relaxed">' + match.shortDescription + '</p>' +
          '<div class="space-y-2 text-sm text-slate-700">' +
            match.detailedVisitorInfo.map(function(info) { return '<p>• ' + info + '</p>'; }).join('') +
          '</div>' +
          '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-200 text-xs">' +
            '<div><strong>Opening Hours:</strong> ' + (match.openingHours || 'Check locally') + '</div>' +
            '<div><strong>Nearest Railway:</strong> ' + match.howToReach.nearestRailway + '</div>' +
            '<div><strong>Nearest Airport:</strong> ' + match.howToReach.nearestAirport + '</div>' +
            '<div><strong>Source & Verified:</strong> ' + match.sourceOfInfo + ' (' + match.lastVerifiedDate + ')</div>' +
          '</div>' +
          '<div class="flex flex-wrap gap-3 pt-2">' +
            '<a href="https://wa.me/91${PHONE_NUMBER}?text=' + waMsg + '" target="_blank" rel="noopener" data-conversion-intent="whatsapp" class="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs">' + match.taxiOptions.primaryActionLabel + ' on WhatsApp</a>' +
            '<a href="make-my-trip.html?addStop=' + encodeURIComponent(match.name) + '" class="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs">+ Add to Get Taxi Trip Planner</a>' +
            '<a href="' + match.mapDirectionsUrl + '" target="_blank" rel="noopener noreferrer" class="px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs">Google Maps Directions ↗</a>' +
          '</div>' +
        '</article>';
    });
  </script>
  `;

  return generateHtmlPage({
    title: 'Verified Place Lookup — Coimbatore & Tamil Nadu Directory | Get Taxi Kovai',
    description: 'Lookup verified visitor guides, addresses, timings, and travel options for places across Coimbatore and Tamil Nadu.',
    keywords: 'Coimbatore place directory, Tamil Nadu place guide, Get Taxi Kovai directory',
    canonicalUrl,
    activeNav: 'explore',
    extraHead: '<meta name="robots" content="noindex, follow" />',
    bodyContent,
  });
}

export function generateDynamicDestinationQueryPage() {
  const canonicalUrl = `${SITE_URL}/destinations-tamil-nadu.html`;
  const breadcrumbs = [
    { label: 'Home', href: 'index.html' },
    { label: 'Explore Tamil Nadu', href: 'explore-tamil-nadu.html' },
    { label: 'Destination Lookup', href: 'destination.html' },
  ];

  const destsJson = JSON.stringify(STATEWIDE_DESTINATIONS);

  const bodyContent = `
  ${renderBreadcrumbs(breadcrumbs)}
  <section class="py-12 bg-white min-h-[60vh]">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" id="dynamic-dest-root">
      <div class="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center">
        <h1 class="text-2xl font-black text-slate-900">Tamil Nadu & Cross-State Destination Lookup</h1>
        <p class="text-sm text-slate-600 mt-2">Loading destination guide...</p>
      </div>
    </div>
  </section>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const DESTS = ${destsJson};
      const root = document.getElementById('dynamic-dest-root');
      const params = new URLSearchParams(window.location.search);
      const rawId = (params.get('id') || params.get('slug') || '').trim().toLowerCase();

      const match = rawId ? DESTS.find(function(d) {
        return d.id.toLowerCase() === rawId || d.slug.toLowerCase() === rawId || d.name.toLowerCase() === rawId || d.slug.toLowerCase().includes(rawId);
      }) : null;

      if (!match) {
        root.innerHTML =
          '<div class="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-5" role="region" aria-label="Destination lookup fallback">' +
            '<span class="inline-block px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">Destination Directory Lookup</span>' +
            '<h1 class="text-2xl sm:text-3xl font-black text-slate-900">' + (rawId ? 'No Destination Found for ID "' + rawId.replace(/[<>"&]/g, '') + '"' : 'Browse Tamil Nadu & Cross-State Destinations') + '</h1>' +
            '<p class="text-sm text-slate-600 leading-relaxed">Select any of our verified destination guides below for route corridors, attractions, and intercity cab options:</p>' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">' +
              DESTS.map(function(d) {
                return '<a href="destination-' + d.slug + '.html" class="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 transition block">' +
                  '<span class="text-[11px] font-bold ' + (d.isCrossState ? 'text-emerald-700' : 'text-amber-700') + '">' + (d.isCrossState ? 'Cross-State (Kerala)' : d.categoryLabel) + '</span>' +
                  '<h2 class="text-sm font-extrabold text-slate-900 mt-0.5">' + d.name + '</h2>' +
                  '<p class="text-xs text-slate-500 mt-1">' + d.distanceFromCoimbatoreKm + ' KM from Coimbatore</p>' +
                '</a>';
              }).join('') +
            '</div>' +
          '</div>';
        return;
      }

      document.title = match.name + ' Travel Guide (' + match.state + ') | Get Taxi Kovai';
      const waMsg = encodeURIComponent('Hello Get Taxi Kovai, I would like a taxi quote from Coimbatore to ' + match.name + ' (' + match.distanceFromCoimbatoreKm + ' KM).');
      root.innerHTML =
        '<article class="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">' +
          '<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">' +
            '<div>' +
              '<span class="text-xs font-bold ' + (match.isCrossState ? 'text-emerald-700' : 'text-amber-700') + '">' + (match.isCrossState ? 'Cross-State Corridor · State: Kerala (Outside Tamil Nadu)' : match.categoryLabel + ' · State: Tamil Nadu') + '</span>' +
              '<h1 class="text-2xl sm:text-4xl font-black text-slate-900 mt-1">' + match.name + '</h1>' +
              '<p class="text-xs text-slate-600 mt-1">Primary Route: ' + match.primaryRouteCorridor + '</p>' +
            '</div>' +
            '<a href="destination-' + match.slug + '.html" class="px-4 py-2 rounded-xl bg-slate-900 text-amber-400 font-bold text-xs">Open Full Canonical Destination Page →</a>' +
          '</div>' +
          '<p class="text-sm text-slate-700 leading-relaxed">' + match.shortSummary + '</p>' +
          '<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs">' +
            '<div><strong>Distance from Coimbatore:</strong> ~' + match.distanceFromCoimbatoreKm + ' KM</div>' +
            '<div><strong>Approx. Drive Time:</strong> ' + match.approxDriveTime + '</div>' +
            '<div><strong>Best Season:</strong> ' + match.bestSeasonToVisit + '</div>' +
          '</div>' +
          '<div class="flex flex-wrap gap-3 pt-2">' +
            '<a href="https://wa.me/91${PHONE_NUMBER}?text=' + waMsg + '" target="_blank" rel="noopener" data-conversion-intent="whatsapp" class="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs">Request Quote on WhatsApp</a>' +
            '<a href="make-my-trip.html?dest=' + encodeURIComponent(match.name) + '" class="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs">Customize in Get Taxi Trip Planner</a>' +
          '</div>' +
        '</article>';
    });
  </script>
  `;

  return generateHtmlPage({
    title: 'Destination Guide Lookup — Tamil Nadu & Cross-State Routes | Get Taxi Kovai',
    description: 'Lookup verified destination travel guides, highway corridors, distances from Coimbatore, and intercity cab options.',
    keywords: 'Tamil Nadu destination lookup, Coimbatore intercity cab guide',
    canonicalUrl,
    activeNav: 'explore',
    extraHead: '<meta name="robots" content="noindex, follow" />',
    bodyContent,
  });
}

// ==========================================
// WRITE ALL DISCOVERY PAGES & RETURN URL LIST FOR SITEMAP
// ==========================================
export function writeAllDiscoveryPages() {
  const generatedUrls = [];

  // 1. Main Landing Hub
  fs.writeFileSync(path.join(ROOT_DIR, 'explore-tamil-nadu.html'), generateExploreTamilNaduPage(), 'utf8');
  generatedUrls.push({ loc: `${SITE_URL}/explore-tamil-nadu.html`, priority: '0.95', changefreq: 'weekly' });
  console.log('✓ Created: explore-tamil-nadu.html');

  // 2. Coimbatore Flagship Directory
  fs.writeFileSync(path.join(ROOT_DIR, 'explore-coimbatore.html'), generateExploreCoimbatorePage(), 'utf8');
  generatedUrls.push({ loc: `${SITE_URL}/explore-coimbatore.html`, priority: '0.95', changefreq: 'weekly' });
  console.log('✓ Created: explore-coimbatore.html');

  // 3. Statewide Destinations Directory
  fs.writeFileSync(path.join(ROOT_DIR, 'destinations-tamil-nadu.html'), generateDestinationsDirectoryPage(), 'utf8');
  generatedUrls.push({ loc: `${SITE_URL}/destinations-tamil-nadu.html`, priority: '0.90', changefreq: 'weekly' });
  console.log('✓ Created: destinations-tamil-nadu.html');

  // 4. Scenic Routes & Lesser-Known Places
  fs.writeFileSync(path.join(ROOT_DIR, 'scenic-routes.html'), generateScenicRoutesPage(), 'utf8');
  generatedUrls.push({ loc: `${SITE_URL}/scenic-routes.html`, priority: '0.88', changefreq: 'weekly' });
  console.log('✓ Created: scenic-routes.html');

  // 5. Get Taxi Trip Planner
  const plannerHtml = generateMakeMyTripPage({ isAlias: false });
  const plannerAliasHtml = generateMakeMyTripPage({ isAlias: true });
  fs.writeFileSync(path.join(ROOT_DIR, 'make-my-trip.html'), plannerHtml, 'utf8');
  fs.writeFileSync(path.join(ROOT_DIR, 'trip-planner.html'), plannerAliasHtml, 'utf8');
  fs.writeFileSync(path.join(ROOT_DIR, 'get-taxi-trip-planner.html'), plannerAliasHtml, 'utf8');
  generatedUrls.push({ loc: `${SITE_URL}/make-my-trip.html`, priority: '0.92', changefreq: 'weekly' });
  console.log('✓ Created: make-my-trip.html (Get Taxi Trip Planner)');

  // 6. Category Pages
  DISCOVERY_CATEGORIES.forEach((cat) => {
    const { filename, html } = generateCategoryPage(cat);
    fs.writeFileSync(path.join(ROOT_DIR, filename), html, 'utf8');
    generatedUrls.push({ loc: `${SITE_URL}/${filename}`, priority: '0.85', changefreq: 'weekly' });
  });
  console.log(`✓ Created ${DISCOVERY_CATEGORIES.length} Category Directory Pages`);

  // 7. Coimbatore Neighbourhood Pages
  COIMBATORE_NEIGHBOURHOODS.forEach((nb) => {
    const { filename, html } = generateNeighbourhoodPage(nb);
    fs.writeFileSync(path.join(ROOT_DIR, filename), html, 'utf8');
    generatedUrls.push({ loc: `${SITE_URL}/${filename}`, priority: '0.82', changefreq: 'weekly' });
  });
  console.log(`✓ Created ${COIMBATORE_NEIGHBOURHOODS.length} Coimbatore Neighbourhood Pages`);

  // 8. Statewide Destination Detail Pages
  STATEWIDE_DESTINATIONS.forEach((dest) => {
    const { filename, html } = generateDestinationDetailPage(dest);
    fs.writeFileSync(path.join(ROOT_DIR, filename), html, 'utf8');
    generatedUrls.push({ loc: `${SITE_URL}/${filename}`, priority: '0.85', changefreq: 'weekly' });
  });
  console.log(`✓ Created ${STATEWIDE_DESTINATIONS.length} Destination Detail Pages`);

  // 9. Individual Place Detail Pages
  VERIFIED_PLACES.forEach((place) => {
    const { filename, html } = generatePlaceDetailPage(place);
    fs.writeFileSync(path.join(ROOT_DIR, filename), html, 'utf8');
    generatedUrls.push({ loc: `${SITE_URL}/${filename}`, priority: '0.84', changefreq: 'weekly' });
  });
  console.log(`✓ Created ${VERIFIED_PLACES.length} Individual Place Detail Pages`);

  // 10. Dynamic Query-Param Lookup Pages (place.html & destination.html)
  fs.writeFileSync(path.join(ROOT_DIR, 'place.html'), generateDynamicPlaceQueryPage(), 'utf8');
  fs.writeFileSync(path.join(ROOT_DIR, 'destination.html'), generateDynamicDestinationQueryPage(), 'utf8');
  console.log('✓ Created: place.html & destination.html (dynamic ?id= lookup pages)');

  return generatedUrls;
}
