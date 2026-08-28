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
    <header className="sticky top-0 z-40 bg-zinc-950/95 text-white shadow-2xl border-b border-amber-400/30 backdrop-blur-xl relative overflow-hidden">
      {/* Header Background Ambient Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none mix-blend-luminosity -z-10"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/95 to-zinc-950 pointer-events-none -z-10" />
      <div className="absolute top-0 left-1/4 w-96 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute top-0 right-1/4 w-96 h-24 bg-amber-400/5 rounded-full blur-3xl pointer-events-none -z-10" />
      {/* Top 24/7 Hotline Bar */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-zinc-950 px-4 py-1.5 text-xs sm:text-sm font-extrabold shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-black uppercase tracking-wide">
              <Clock className="w-3.5 h-3.5 text-zinc-950" /> 24/7 Instant Cab Dispatch in 5 Mins
            </span>
            <span className="hidden md:inline text-amber-950 opacity-40">|</span>
            <span className="hidden md:flex items-center gap-1 font-bold">
              <MapPin className="w-3.5 h-3.5 text-zinc-950" /> Coimbatore • Ooty • Kodaikanal • Isha Yoga • Valparai
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:+919043743777"
              className="flex items-center gap-1.5 hover:scale-105 font-black text-zinc-950 transition tracking-tight"
            >
              <Phone className="w-3.5 h-3.5 fill-zinc-950" /> Call: 9043743777
            </a>
            <span className="text-amber-950 opacity-40">|</span>
            <a
              href="https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20I%20want%20to%20book%20a%20cab."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-900 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-xs font-black transition shadow-sm"
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
          <div className="w-11 h-11 bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 rounded-xl flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform duration-300">
            <Car className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white group-hover:text-amber-400 transition">
                GET TAXI KOVAI
              </span>
              <span className="bg-amber-400/10 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-400/30 tracking-wider">
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-amber-400/90 font-bold tracking-wide">
              Coimbatore&apos;s Premier Lowest Fare Taxi
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-bold text-zinc-200">
          <button
            onClick={() => handleNavClick('estimator')}
            className="hover:text-amber-400 transition cursor-pointer"
          >
            Fare Estimator
          </button>
          <button
            onClick={() => handleNavClick('tours')}
            className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1 text-amber-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tour Packages
          </button>
          <button
            onClick={() => handleNavClick('tariffs')}
            className="hover:text-amber-400 transition cursor-pointer"
          >
            Rate Card
          </button>
          <button
            onClick={() => handleNavClick('fleet')}
            className="hover:text-amber-400 transition cursor-pointer"
          >
            Our Fleet
          </button>
          <button
            onClick={() => handleNavClick('distance-matrix')}
            className="hover:text-amber-400 transition cursor-pointer text-amber-400 font-extrabold"
          >
            Distance Matrix
          </button>
          <button
            onClick={() => handleNavClick('blog')}
            className="hover:text-amber-400 transition cursor-pointer flex items-center gap-1 text-amber-300 font-semibold"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Travel Blog
          </button>
          <button
            onClick={() => handleNavClick('reviews')}
            className="hover:text-amber-400 transition cursor-pointer"
          >
            Reviews
          </button>
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-amber-400/30 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shadow-sm"
            title="Ask AI Trip Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Assistant
          </button>

          <button
            onClick={onOpenTrackBooking}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" /> Track
          </button>

          <a
            href="tel:+919043743777"
            className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-zinc-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 fill-zinc-950" /> Call 9043743777
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-zinc-300 hover:text-white cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-t border-zinc-800 px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-bold">
            <button
              onClick={() => handleNavClick('estimator')}
              className="text-left py-2 px-3 text-zinc-200 hover:bg-zinc-900 rounded-xl font-medium"
            >
              🚖 Fare Estimator & Book
            </button>
            <button
              onClick={() => handleNavClick('tours')}
              className="text-left py-2 px-3 text-amber-300 hover:bg-zinc-900 rounded-xl font-medium"
            >
              🏔️ Tour Packages (Ooty, Kodai, Isha)
            </button>
            <button
              onClick={() => handleNavClick('tariffs')}
              className="text-left py-2 px-3 text-zinc-200 hover:bg-zinc-900 rounded-xl font-medium"
            >
              📊 Rate Card & Tariffs
            </button>
            <button
              onClick={() => handleNavClick('distance-matrix')}
              className="text-left py-2 px-3 text-amber-400 hover:bg-zinc-900 rounded-xl font-extrabold"
            >
              🗺️ Distance Matrix
            </button>
            <button
              onClick={() => handleNavClick('blog')}
              className="text-left py-2 px-3 text-amber-300 hover:bg-zinc-900 rounded-xl font-semibold flex items-center gap-2"
            >
              📚 Travel Guide & History Blog
            </button>
            <button
              onClick={() => handleNavClick('fleet')}
              className="text-left py-2 px-3 text-zinc-200 hover:bg-zinc-900 rounded-xl font-medium"
            >
              🚗 Fleet Overview
            </button>
            <button
              onClick={() => handleNavClick('reviews')}
              className="text-left py-2 px-3 text-zinc-200 hover:bg-zinc-900 rounded-xl font-medium"
            >
              ⭐ Customer Reviews
            </button>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
            <a
              href="https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20I%20want%20to%20book%20a%20cab."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Us: 9043743777
            </a>
            <a
              href="tel:+919043743777"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-zinc-950 py-2.5 rounded-xl text-sm font-black shadow-md shadow-amber-500/20"
            >
              <Phone className="w-4 h-4 fill-zinc-950" />
              Call Now: 9043743777
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

