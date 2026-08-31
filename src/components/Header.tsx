import React, { useState } from 'react';
import { Phone, MessageSquare, Car, MapPin, Clock, Search, Sparkles, Menu, X, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenTrackBooking: () => void;
  onOpenAiAssistant: () => void;
  onSelectTab: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTrackBooking,
  onOpenAiAssistant,
  onSelectTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 text-slate-900 shadow-md border-b border-slate-200/80 backdrop-blur-xl relative overflow-hidden">
      {/* Top 24/7 Hotline Bar */}
      <div className="bg-slate-950 text-slate-100 px-4 py-1.5 text-xs sm:text-sm font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-400 text-[11px] sm:text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> 24/7 Doorstep Taxi Dispatch in 5 Mins
            </span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300 text-xs">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Coimbatore • Ooty • Kodaikanal • Isha Yoga • Valparai
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="tel:+919043743777"
              className="flex items-center gap-1.5 hover:text-amber-300 font-bold text-white transition tracking-tight"
            >
              <Phone className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Call: 9043743777
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20I%20want%20to%20book%20a%20cab."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition shadow-sm"
            >
              <MessageSquare className="w-3 h-3 text-emerald-400 fill-emerald-400/20" /> WhatsApp: 9043743777
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => handleNavClick('hero')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 bg-slate-950 text-white rounded-xl flex items-center justify-center shadow-md shadow-slate-900/10 border border-slate-800 group-hover:bg-blue-950 transition-colors duration-300">
            <Car className="w-6 h-6 stroke-[2.2] text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-950 group-hover:text-blue-900 transition">
                GET TAXI KOVAI
              </span>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-300 tracking-wider">
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              Coimbatore&apos;s Premier Lowest Fare Taxi
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700">
          <button
            onClick={() => handleNavClick('estimator')}
            className="hover:text-blue-900 transition cursor-pointer"
          >
            Fare Estimator
          </button>
          <button
            onClick={() => handleNavClick('tours')}
            className="hover:text-blue-950 transition cursor-pointer flex items-center gap-1 text-slate-900 font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tour Packages
          </button>
          <button
            onClick={() => handleNavClick('tariffs')}
            className="hover:text-blue-900 transition cursor-pointer"
          >
            Rate Card
          </button>
          <button
            onClick={() => handleNavClick('fleet')}
            className="hover:text-blue-900 transition cursor-pointer"
          >
            Our Fleet
          </button>
          <button
            onClick={() => handleNavClick('distance-matrix')}
            className="hover:text-blue-900 transition cursor-pointer text-slate-900 font-extrabold"
          >
            Distance Matrix
          </button>
          <button
            onClick={() => handleNavClick('blog')}
            className="hover:text-blue-900 transition cursor-pointer flex items-center gap-1 text-slate-800 font-semibold"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" /> Travel Blog
          </button>
          <button
            onClick={() => handleNavClick('reviews')}
            className="hover:text-blue-900 transition cursor-pointer"
          >
            Reviews
          </button>
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm"
            title="Ask AI Trip Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            AI Assistant
          </button>

          <button
            onClick={onOpenTrackBooking}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" /> Track
          </button>

          <a
            href="tel:+919043743777"
            className="bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer border border-slate-800"
          >
            <Phone className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Call 9043743777
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-slate-950 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-2 text-sm font-bold">
            <button
              onClick={() => handleNavClick('estimator')}
              className="text-left py-2 px-3 text-slate-800 hover:bg-slate-100 rounded-xl font-semibold"
            >
              🚖 Fare Estimator & Book
            </button>
            <button
              onClick={() => handleNavClick('tours')}
              className="text-left py-2 px-3 text-slate-900 hover:bg-slate-100 rounded-xl font-bold"
            >
              🏔️ Tour Packages (Ooty, Kodai, Isha)
            </button>
            <button
              onClick={() => handleNavClick('tariffs')}
              className="text-left py-2 px-3 text-slate-800 hover:bg-slate-100 rounded-xl font-semibold"
            >
              📊 Rate Card & Tariffs
            </button>
            <button
              onClick={() => handleNavClick('distance-matrix')}
              className="text-left py-2 px-3 text-slate-900 hover:bg-slate-100 rounded-xl font-extrabold"
            >
              🗺️ Distance Matrix
            </button>
            <button
              onClick={() => handleNavClick('blog')}
              className="text-left py-2 px-3 text-slate-800 hover:bg-slate-100 rounded-xl font-semibold flex items-center gap-2"
            >
              📚 Travel Guide & History Blog
            </button>
            <button
              onClick={() => handleNavClick('fleet')}
              className="text-left py-2 px-3 text-slate-800 hover:bg-slate-100 rounded-xl font-semibold"
            >
              🚗 Fleet Overview
            </button>
            <button
              onClick={() => handleNavClick('reviews')}
              className="text-left py-2 px-3 text-slate-800 hover:bg-slate-100 rounded-xl font-semibold"
            >
              ⭐ Customer Reviews
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <a
              href="https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20I%20want%20to%20book%20a%20cab."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-bold shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Us: 9043743777
            </a>
            <a
              href="tel:+919043743777"
              className="w-full flex items-center justify-center gap-2 bg-slate-950 text-white py-2.5 rounded-xl text-sm font-black shadow-md border border-slate-800"
            >
              <Phone className="w-4 h-4 fill-amber-400 text-amber-400" />
              Call Now: 9043743777
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

