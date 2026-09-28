import React from 'react';
import { MapPin, Navigation, ArrowUpRight, Compass, Shield } from 'lucide-react';

/**
 * RouteSilos Component
 * Organic SEO internal link silo section placed directly above or inside the footer.
 * Organizes high-intent route searches across Tamil Nadu into a 4-column semantic grid.
 */
export const RouteSilos = ({ onSelectRoute = undefined }) => {
  const siloColumns = [
    {
      id: 'city-airport',
      title: 'Coimbatore City & Airport Hub',
      description: 'Local transit & CJB terminal chauffeur dispatches',
      routes: [
        {
          name: 'Coimbatore Airport Taxi',
          href: '/blog-coimbatore-airport-cjb-taxi-transfer-guide.html',
          badge: '24/7 CJB',
          distance: '12 km',
        },
        {
          name: 'Railway Station Drop',
          href: '/tariffs.html',
          badge: 'CBE Junction',
          distance: 'City Center',
        },
        {
          name: 'Hourly City Rental',
          href: '/blog-coimbatore-city-local-hourly-taxi-rental-guide.html',
          badge: '₹350/hr',
          distance: 'Multi-stop',
        },
        {
          name: 'Isha Foundation Cab',
          href: '/tour-isha-yoga.html',
          badge: 'Adiyogi Day Trip',
          distance: '32 km',
        },
      ],
    },
    {
      id: 'western-hub',
      title: 'Western Hub Drop Taxi',
      description: 'Textile belt & industrial corridor one-way drops',
      routes: [
        {
          name: 'Coimbatore to Pollachi',
          href: '/tariffs.html',
          badge: 'From ₹1,199',
          distance: '45 km',
        },
        {
          name: 'Coimbatore to Tirupur',
          href: '/blog-coimbatore-to-tiruppur-texvalley-garment-hub-taxi-guide.html',
          badge: 'TexValley Drop',
          distance: '55 km',
        },
        {
          name: 'Coimbatore to Erode',
          href: '/blog-coimbatore-to-erode-salem-highway-cab-rates-turmeric-market.html',
          badge: 'Turmeric Hub',
          distance: '100 km',
        },
        {
          name: 'Coimbatore to Salem',
          href: '/blog-coimbatore-to-erode-salem-highway-cab-rates-turmeric-market.html',
          badge: 'Highway Express',
          distance: '165 km',
        },
        {
          name: 'Coimbatore to Karur',
          href: '/tariffs.html',
          badge: 'Textile Export',
          distance: '135 km',
        },
      ],
    },
    {
      id: 'hill-stations',
      title: 'Hill Station Getaways',
      description: 'Nilgiri hairpin bend & Western Ghat mountain tours',
      routes: [
        {
          name: 'Coimbatore to Ooty Cab',
          href: '/tour-ooty-coonoor.html',
          badge: 'Flat ₹3,500 Drop',
          distance: '86 km',
        },
        {
          name: 'Coimbatore to Kodaikanal Taxi',
          href: '/tour-kodaikanal.html',
          badge: 'Princess of Hills',
          distance: '175 km',
        },
        {
          name: 'Coimbatore to Coonoor Cabs',
          href: '/blog-coonoor-hill-station-tea-tasting-sims-park-cab-sightseeing-guide.html',
          badge: "Sim's Park & Tea",
          distance: '70 km',
        },
        {
          name: 'Coimbatore to Valparai',
          href: '/tour-valparai.html',
          badge: '40 Hairpins',
          distance: '105 km',
        },
      ],
    },
    {
      id: 'south-central',
      title: 'South & Central TN Transfers',
      description: 'Heritage pilgrimages & inter-city express cabs',
      routes: [
        {
          name: 'Coimbatore to Madurai Drop Taxi',
          href: '/blog-coimbatore-to-madurai-meenakshi-amman-temple-highway-cab-tour.html',
          badge: 'Temple City Drop',
          distance: '215 km',
        },
        {
          name: 'Coimbatore to Trichy Cab',
          href: '/tariffs.html',
          badge: 'Rockfort Direct',
          distance: '220 km',
        },
        {
          name: 'Coimbatore to Dindigul Taxi',
          href: '/tariffs.html',
          badge: 'NH83 Express',
          distance: '155 km',
        },
        {
          name: 'Coimbatore to Palani',
          href: '/tour-palani.html',
          badge: 'Murugan Darshan',
          distance: '110 km',
        },
      ],
    },
  ];

  const handleLinkClick = (e, route) => {
    if (onSelectRoute) {
      e.preventDefault();
      onSelectRoute(route);
    }
  };

  return (
    <section
      id="popular-routes-silos"
      aria-labelledby="route-silos-heading"
      className="bg-slate-950 text-slate-300 border-t border-slate-800/90 py-12 sm:py-16 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle Section Tagline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-800/80 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Tamil Nadu Regional Outstation & City Cabs</span>
            </div>
            <h3
              id="route-silos-heading"
              className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight"
            >
              Popular Taxi Routes & Destination Silos
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md font-normal leading-relaxed">
            Direct outstation drops, prompt airport pickups, and mountain sightseeing packages with 100% transparent kilometer rate cards.
          </p>
        </div>

        {/* 4-Column Responsive Semantic Silo Grid */}
        <nav
          aria-label="Popular taxi routes and destinations across Tamil Nadu"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {siloColumns.map((col) => (
            <div
              key={col.id}
              className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-5 hover:border-slate-700/80 transition-colors"
            >
              <div className="mb-4">
                <h4 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <span>{col.title}</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 pl-4">
                  {col.description}
                </p>
              </div>

              <ul className="space-y-2 text-xs">
                {col.routes.map((route, rIdx) => (
                  <li key={rIdx}>
                    <a
                      href={route.href}
                      onClick={(e) => handleLinkClick(e, route)}
                      aria-label={`Book or view taxi rates for ${route.name}`}
                      className="group flex items-center justify-between py-2 px-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all duration-150"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <span className="text-slate-500 group-hover:text-amber-400 transition-colors">
                          •
                        </span>
                        <span className="truncate font-medium group-hover:underline">
                          {route.name}
                        </span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded shrink-0 border border-amber-400/20 group-hover:border-amber-400/50">
                        {route.badge}
                        <ArrowUpRight className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer Micro Trust Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Commercial yellow-plated AC vehicles • Polite background-verified chauffeurs</span>
          </div>
          <div className="text-slate-400">
            Transparent Pricing: Round Trip from <span className="text-amber-400 font-bold">₹13/km</span> • One-Way from <span className="text-amber-400 font-bold">₹14/km</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RouteSilos;
