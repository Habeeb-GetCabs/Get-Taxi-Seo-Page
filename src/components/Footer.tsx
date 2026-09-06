import React from 'react';
import { Phone, MessageSquare, Mail, MapPin, Car, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tabId: string) => void;
  onOpenTrackBooking: () => void;
  onOpenAiAssistant: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenTrackBooking,
}) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-28 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-md">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white block leading-tight">
                  GET TAXI KOVAI
                </span>
                <span className="text-xs text-amber-400 font-bold">
                  Coimbatore Call Taxi • 24/7 Service
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Your top choice call taxi in Coimbatore. Local cabs, one-way drop taxi to Chennai & Bangalore, outstation round trips to Ooty & Kodaikanal, and 24/7 airport transfers with zero hidden fees.
            </p>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-semibold space-y-1">
              <p>✓ Round-Trip from ₹13–15/km</p>
              <p>✓ One-Way Drop from ₹14–26/km</p>
              <p>✓ Hourly Rentals at ₹350/hr (10 km free/hr)</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Cross Cut Road, Gandhipuram, Coimbatore - 641012, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919043743777" data-conversion-intent="call" className="hover:text-amber-400 transition font-bold">+91 9043743777</a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:booking@gettaxikovai.in" className="hover:text-amber-400 transition">booking@gettaxikovai.in</a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
              Quick Taxi Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li>
                <button
                  onClick={() => onSelectTab('estimator')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  🚖 Local City Taxi (Base ₹80 | ₹28/km)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('estimator')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  🛣️ Outstation One-Way Drop (₹14–26/km)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('estimator')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  🔄 Outstation Round Trip (₹13–15/km)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('estimator')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  ⏱️ Hourly Rentals (₹350/hr • 10 km Free)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('estimator')}
                  className="hover:text-amber-400 transition cursor-pointer text-left"
                >
                  ✈️ Airport Drops (Base ₹100 | ₹30/km)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('blog')}
                  className="hover:text-amber-400 transition cursor-pointer text-amber-300 font-bold text-left"
                >
                  📚 Local Travel Guide & History Blog
                </button>
              </li>
              <li>
                <button onClick={onOpenTrackBooking} className="hover:text-amber-400 transition cursor-pointer text-left">
                  🔍 Track My Cab Booking
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Cab Routes & Articles */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
              Popular Routes & Guides
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li>
                <a href="tour-ooty-coonoor.html" className="hover:text-amber-400 transition flex items-center justify-between">
                  <span>Coimbatore to Ooty Taxi</span> <span class="text-amber-400 font-semibold">₹3,500</span>
                </a>
              </li>
              <li>
                <a href="tour-isha-yoga.html" className="hover:text-amber-400 transition flex items-center justify-between">
                  <span>Coimbatore to Isha Yoga Adiyogi</span> <span class="text-amber-400 font-semibold">₹1,100</span>
                </a>
              </li>
              <li>
                <a href="tour-valparai.html" className="hover:text-amber-400 transition flex items-center justify-between">
                  <span>Coimbatore to Valparai 40 Bends</span> <span class="text-amber-400 font-semibold">Tour Package</span>
                </a>
              </li>
              <li>
                <a href="tour-kodaikanal.html" className="hover:text-amber-400 transition flex items-center justify-between">
                  <span>Coimbatore to Kodaikanal</span> <span class="text-amber-400 font-semibold">Tour Package</span>
                </a>
              </li>
              <li>
                <a href="blog-coimbatore-airport-cjb-taxi-transfer-guide.html" className="hover:text-amber-400 transition flex items-center justify-between">
                  <span>CJB Airport Transfers Guide</span> <span class="text-amber-400 font-semibold">24/7 Pickup</span>
                </a>
              </li>
              <li>
                <a href="blog-coimbatore-to-bangalore-bengaluru-one-way-drop-taxi-fares-guide.html" className="hover:text-amber-400 transition flex items-center justify-between">
                  <span>Coimbatore to Bangalore Drop</span> <span class="text-amber-400 font-semibold">₹15/km</span>
                </a>
              </li>
            </ul>
          </div>

          {/* 24/7 Hotline & Actions */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
              24/7 Hotline & Booking
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Serving Coimbatore, Ooty, Coonoor, Kodaikanal, Valparai, Isha Foundation, Pollachi, Tiruppur, Salem, Erode, Madurai, Chennai, and Bangalore.
            </p>

            <div className="pt-2 space-y-2">
              <a
                href="https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20I%20want%20to%20book%20a%20cab%20in%20Coimbatore."
                target="_blank"
                rel="noopener noreferrer"
                data-conversion-intent="whatsapp"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp 9043743777</span>
              </a>

              <a
                href="tel:+919043743777"
                data-conversion-intent="call"
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call +91 9043743777</span>
              </a>
            </div>

            {/* Micro-trust badges */}
            <div className="pt-2 flex flex-col gap-1 text-[11px] text-slate-400 font-medium">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Zero Advance Required</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Pay After Ride (Cash/UPI)</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Free Cancellation Anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Policy Links Row */}
        <div className="py-6 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
          <div>
            <p className="text-slate-400 font-medium leading-relaxed">
              * 10 Mins Pickup Guarantee: Within Coimbatore Municipal Corporation limits, subject to peak traffic and vehicle availability.
            </p>
            <p className="text-slate-400 font-medium leading-relaxed mt-1">
              Tariff Card: Round-Trip from ₹13–15/km | One-Way Drop from ₹14–26/km | Hourly Rentals at ₹350/hr.
            </p>
          </div>
          <div className="flex flex-wrap items-center md:justify-end gap-3 text-slate-400 font-medium">
            <a href="privacy.html" className="hover:text-amber-400 transition">Privacy Policy</a>
            <span>•</span>
            <a href="terms.html" className="hover:text-amber-400 transition">Terms & Conditions</a>
            <span>•</span>
            <a href="cancellation-refund.html" className="hover:text-amber-400 transition">Cancellation & Refund Policy</a>
            <span>•</span>
            <a href="sitemap.xml" className="hover:text-amber-400 transition">XML Sitemap</a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Get Taxi Kovai (gettaxikovai.in). All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>100% Verified Local Drivers</span>
            <span>•</span>
            <span>Fixed Transparent Pricing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
