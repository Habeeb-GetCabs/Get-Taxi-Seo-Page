import React from 'react';
import { Phone, MessageSquare, Mail, MapPin, Car, Clock, ShieldCheck, Heart, BookOpen } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tabId: string) => void;
  onOpenTrackBooking: () => void;
  onOpenAiAssistant: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenTrackBooking,
  onOpenAiAssistant,
}) => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-slate-950 font-bold">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white block leading-tight">
                  GET TAXI KOVAI
                </span>
                <span className="text-xs text-amber-400 font-bold">
                  Your Best Choice Call Taxi in Coimbatore
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Your top choice call taxi in Coimbatore. Local cabs, one-way drop taxi to Chennai & Bangalore, outstation round trips to Ooty & Kodaikanal, and 24/7 airport transfers with zero hidden fees.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Cross Cut Road, Gandhipuram, Coimbatore - 641012, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919043743777" className="hover:text-amber-400 transition font-bold">9043743777</a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>booking@gettaxikovai.com</span>
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
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  🚖 Local City Taxi (Base ₹80 | ₹28/km)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('estimator')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  🛣️ Outstation One-Way Drop (₹26/km)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('estimator')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  🔄 Outstation Round Trip (₹15/km)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('estimator')}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  ✈️ Airport Drops (Base ₹100 | ₹30/km)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('blog')}
                  className="hover:text-amber-400 transition cursor-pointer text-amber-300 font-bold"
                >
                  📚 Local Travel Guide & History Blog
                </button>
              </li>
              <li>
                <button onClick={onOpenTrackBooking} className="hover:text-amber-400 transition cursor-pointer">
                  🔍 Track My Cab Booking
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Tour Destinations */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
              Top Tour Packages
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li>
                <button onClick={() => onSelectTab('tours')} className="hover:text-amber-400 transition cursor-pointer">
                  ⛰️ 2-Day Ooty & Coonoor Hill Tour
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('tours')} className="hover:text-amber-400 transition cursor-pointer">
                  🛕 1-Day Isha Yoga & Marudhamalai Tour
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('tours')} className="hover:text-amber-400 transition cursor-pointer">
                  🌲 3-Day Kodaikanal Lake Escape
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('tours')} className="hover:text-amber-400 transition cursor-pointer">
                  🐅 2-Day Valparai 40 Hairpin Tour
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('tours')} className="hover:text-amber-400 transition cursor-pointer">
                  🛕 1-Day Palani Murugan Temple Special
                </button>
              </li>
            </ul>
          </div>

          {/* Operating Locations */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
              24/7 Hotline & Booking
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Serving Coimbatore, Ooty, Coonoor, Kodaikanal, Valparai, Isha Foundation, Pollachi, Tiruppur, Salem, Erode, Madurai, Chennai, and Bangalore.
            </p>

            <div className="pt-2 space-y-2">
              <a
                href="https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20I%20want%20to%20book%20a%20cab."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp 9043743777</span>
              </a>

              <a
                href="tel:+919043743777"
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call 9043743777</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Get Taxi Kovai. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>100% Verified Local Drivers</span>
            <span>•</span>
            <span>Fixed Transparent Pricing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
