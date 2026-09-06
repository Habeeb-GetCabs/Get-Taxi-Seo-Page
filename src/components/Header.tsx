import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Car, MapPin, Clock, Search, Sparkles, Menu, X, BookOpen, ShieldCheck } from 'lucide-react';

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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-3 sm:px-6 ${isScrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-5'}`}>
      {/* Floating Semi-Transparent Pill Bar */}
      <div className={`max-w-7xl mx-auto transition-all duration-300 rounded-[1.5rem] sm:rounded-[2rem] px-4 sm:px-6 border ${
        isScrolled
          ? 'glass bg-white/85 shadow-xl shadow-slate-950/5 border-slate-200/90 py-2 sm:py-2.5'
          : 'glass bg-white/80 shadow-lg shadow-slate-900/5 border-slate-200/70 py-3 sm:py-3.5'
      }`}>
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('estimator')} 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-slate-950 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md shadow-slate-900/10 border border-slate-800 group-hover:bg-blue-950 transition-all duration-300">
              <Car className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2] text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-950 font-syne group-hover:text-blue-900 transition">
                  GET TAXI KOVAI
                </span>
                <span className="hidden xs:inline-flex items-center gap-1 bg-amber-100/90 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300 tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-amber-700" /> VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide hidden sm:block">
                Lowest Fare Taxi & Hill Tours
              </p>
            </div>
          </div>

          {/* Desktop Nav Pills */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60 text-xs font-bold text-slate-700 backdrop-blur-md">
            <button
              onClick={() => handleNavClick('estimator')}
              className="px-3.5 py-1.5 rounded-xl hover:text-slate-950 hover:bg-white transition cursor-pointer font-extrabold text-slate-900 shadow-sm"
            >
              Estimator
            </button>
            <button
              onClick={() => handleNavClick('tours')}
              className="px-3.5 py-1.5 rounded-xl hover:text-slate-950 hover:bg-white transition cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tour Packages
            </button>
            <button
              onClick={() => handleNavClick('tariffs')}
              className="px-3.5 py-1.5 rounded-xl hover:text-slate-950 hover:bg-white transition cursor-pointer"
            >
              Rate Card
            </button>
            <button
              onClick={() => handleNavClick('distance-matrix')}
              className="px-3.5 py-1.5 rounded-xl hover:text-slate-950 hover:bg-white transition cursor-pointer"
            >
              Distances
            </button>
            <button
              onClick={() => handleNavClick('fleet')}
              className="px-3.5 py-1.5 rounded-xl hover:text-slate-950 hover:bg-white transition cursor-pointer"
            >
              Fleet
            </button>
            <button
              onClick={() => handleNavClick('blog')}
              className="px-3.5 py-1.5 rounded-xl hover:text-slate-950 hover:bg-white transition cursor-pointer flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" /> Guides
            </button>
            <button
              onClick={() => handleNavClick('reviews')}
              className="px-3.5 py-1.5 rounded-xl hover:text-slate-950 hover:bg-white transition cursor-pointer"
            >
              Reviews
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* AI Assistant Pill */}
            <button
              onClick={onOpenAiAssistant}
              className="hidden md:flex items-center gap-1.5 bg-slate-100 hover:bg-white border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm hover:shadow"
              title="Ask AI Trip Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">AI Planner</span>
            </button>

            {/* Track Booking */}
            <button
              onClick={onOpenTrackBooking}
              className="hidden sm:flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shadow-sm hover:shadow"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" /> Track
            </button>

            {/* WhatsApp Direct */}
            <a
              href="https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20I%20want%20to%20book%20a%20cab%20in%20Coimbatore."
              target="_blank"
              rel="noopener noreferrer"
              data-conversion-intent="whatsapp"
              className="hidden md:flex items-center justify-center w-9 h-9 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl transition cursor-pointer shadow-sm"
              title="WhatsApp Dispatch"
            >
              <MessageSquare className="w-4 h-4 fill-emerald-600/20 text-emerald-700" />
            </a>

            {/* Call Button */}
            <a
              href="tel:+919043743777"
              data-conversion-intent="call"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer border border-amber-400 transition hover:scale-105"
            >
              <Phone className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>9043743777</span>
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition cursor-pointer border border-slate-200"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden pt-4 mt-3 border-t border-slate-200/80 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => handleNavClick('estimator')}
                className="text-left py-2.5 px-3 text-slate-900 bg-slate-100/80 hover:bg-white rounded-xl font-bold border border-slate-200/60"
              >
                🚖 Fare Estimator
              </button>
              <button
                onClick={() => handleNavClick('tours')}
                className="text-left py-2.5 px-3 text-slate-900 bg-slate-100/80 hover:bg-white rounded-xl font-bold border border-slate-200/60"
              >
                🏔️ Tour Packages
              </button>
              <button
                onClick={() => handleNavClick('tariffs')}
                className="text-left py-2.5 px-3 text-slate-800 bg-slate-100/80 hover:bg-white rounded-xl font-semibold border border-slate-200/60"
              >
                📊 Rate Cards
              </button>
              <button
                onClick={() => handleNavClick('distance-matrix')}
                className="text-left py-2.5 px-3 text-slate-900 bg-slate-100/80 hover:bg-white rounded-xl font-bold border border-slate-200/60"
              >
                🗺️ Distances
              </button>
              <button
                onClick={() => handleNavClick('fleet')}
                className="text-left py-2.5 px-3 text-slate-800 bg-slate-100/80 hover:bg-white rounded-xl font-semibold border border-slate-200/60"
              >
                🚗 Fleet Cars
              </button>
              <button
                onClick={() => handleNavClick('blog')}
                className="text-left py-2.5 px-3 text-slate-800 bg-slate-100/80 hover:bg-white rounded-xl font-semibold border border-slate-200/60"
              >
                📚 Travel Guides
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAiAssistant();
                }}
                className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold border border-slate-200"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                AI Trip Planner
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTrackBooking();
                }}
                className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 py-2.5 rounded-xl text-xs font-bold border border-slate-200 shadow-sm"
              >
                <Search className="w-4 h-4 text-slate-500" />
                Track Booking
              </button>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20I%20want%20to%20book%20a%20cab%20in%20Coimbatore."
                target="_blank"
                rel="noopener noreferrer"
                data-conversion-intent="whatsapp"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp: 9043743777
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

