import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroFareCalculator } from './components/HeroFareCalculator';
import { TourPackages } from './components/TourPackages';
import { TariffTable } from './components/TariffTable';
import { FleetShowcase } from './components/FleetShowcase';
import { DistanceMatrix } from './components/DistanceMatrix';
import { BlogSection } from './components/BlogSection';
import { Reviews } from './components/Reviews';
import { BookingModal } from './components/BookingModal';
import { TrackBookingModal } from './components/TrackBookingModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { Footer } from './components/Footer';

import { TripType, VehicleCategory, BookingDetails, TourPackage } from './types';
import { VEHICLES, POPULAR_LOCATIONS } from './data/locations';
import { FAQS } from './data/tariffs';

import { Phone, MessageSquare, ShieldCheck, HelpCircle, ChevronDown, ChevronUp, Sparkles, Car, CheckCircle2, Clock } from 'lucide-react';

export default function App() {
  // Modal states
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [trackBookingOpen, setTrackBookingOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // Active FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Selected Booking details
  const [selectedBookingData, setSelectedBookingData] = useState<{
    tripType: TripType;
    pickupLocation: string;
    dropLocation: string;
    distanceKm: number;
    vehicle: VehicleCategory;
    totalFare: number;
    baseFare: number;
    driverBata: number;
    estimatedTolls: number;
    daysCount: number;
    localPackageHours?: number;
  } | null>(null);

  // Saved bookings history
  const [savedBookings, setSavedBookings] = useState<BookingDetails[]>(() => {
    try {
      const stored = localStorage.getItem('covai_taxi_bookings');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }

    // Default mock booking sample so tracking has initial demo data
    return [
      {
        id: 'GTK-90437',
        tripType: 'round-trip',
        pickupLocation: '',
        dropLocation: 'Ooty (Udhagamandalam)',
        distanceKm: 86,
        vehicleId: 'sedan',
        vehicleName: 'Executive Sedan (Dzire)',
        pickupDate: '2026-08-28',
        pickupTime: '06:30',
        passengerName: 'Karthik Raja',
        passengerPhone: '9043743777',
        passengerEmail: 'karthik@example.com',
        pickupAddress: '#12, Cross Cut Road, Gandhipuram',
        specialNotes: 'Family trip to Ooty Doddabetta',
        baseFare: 2580,
        driverBata: 400,
        estimatedTolls: 250,
        totalFare: 3230,
        status: 'confirmed',
        createdAt: '2026-08-26 10:30 AM',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('covai_taxi_bookings', JSON.stringify(savedBookings));
    } catch {
      // ignore
    }
  }, [savedBookings]);

  const handleSelectBooking = (data: {
    tripType: TripType;
    pickupLocation: string;
    dropLocation: string;
    distanceKm: number;
    vehicle: VehicleCategory;
    totalFare: number;
    baseFare: number;
    driverBata: number;
    estimatedTolls: number;
    daysCount: number;
    localPackageHours?: number;
  }) => {
    setSelectedBookingData(data);
    setBookingModalOpen(true);
  };

  const handleSelectVehicleFromFleet = (vehicle: VehicleCategory) => {
    setSelectedBookingData({
      tripType: 'one-way',
      pickupLocation: '',
      dropLocation: 'Ooty (Udhagamandalam)',
      distanceKm: 86,
      vehicle,
      totalFare: 86 * vehicle.ratePerKmOneWay + vehicle.driverBataPerDay + 150,
      baseFare: 86 * vehicle.ratePerKmOneWay,
      driverBata: vehicle.driverBataPerDay,
      estimatedTolls: 150,
      daysCount: 1,
    });
    setBookingModalOpen(true);
  };

  const handleSelectTourBooking = (tour: TourPackage, vehicle: VehicleCategory, price: number) => {
    setSelectedBookingData({
      tripType: 'tour',
      pickupLocation: tour.pickupLocation,
      dropLocation: tour.title,
      distanceKm: tour.durationDays * 120,
      vehicle,
      totalFare: price,
      baseFare: price * 0.85,
      driverBata: tour.durationDays * vehicle.driverBataPerDay,
      estimatedTolls: 300,
      daysCount: tour.durationDays,
    });
    setBookingModalOpen(true);
  };

  const handleQuickBookRoute = (dropId: string) => {
    const dropObj = POPULAR_LOCATIONS.find((l) => l.id === dropId);
    const dropName = dropObj ? dropObj.name : 'Outstation Destination';
    const dist = dropObj ? dropObj.distanceFromCbeKm : 100;
    const vehicle = VEHICLES[1]; // Sedan

    const chargedKm = Math.max(dist, 130);
    const baseFare = chargedKm * vehicle.ratePerKmOneWay;
    const driverBata = vehicle.driverBataPerDay;
    const estimatedTolls = Math.round(dist * 1.2);
    const totalFare = baseFare + driverBata + estimatedTolls;

    setSelectedBookingData({
      tripType: 'one-way',
      pickupLocation: '',
      dropLocation: dropName,
      distanceKm: dist,
      vehicle,
      totalFare,
      baseFare,
      driverBata,
      estimatedTolls,
      daysCount: 1,
    });
    setBookingModalOpen(true);
  };

  const handleSaveBooking = (newBooking: BookingDetails) => {
    setSavedBookings((prev) => [newBooking, ...prev]);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased selection:bg-amber-400 selection:text-zinc-950">
      {/* Navigation Header */}
      <Header
        onOpenTrackBooking={() => setTrackBookingOpen(true)}
        onOpenAiAssistant={() => setAiAssistantOpen(true)}
        onSelectTab={scrollToSection}
      />

      {/* Hero Section & Interactive Fare Calculator */}
      <HeroFareCalculator
        onSelectBooking={handleSelectBooking}
        onExploreTours={() => scrollToSection('tours')}
      />

      {/* Floating Call & WhatsApp Quick Bar for Mobile */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-30 flex gap-2.5">
        <a
          href="https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20I%20want%20to%20book%20a%20cab."
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 shadow-2xl shadow-emerald-500/30 border border-emerald-400/30"
        >
          <MessageSquare className="w-4 h-4 fill-white/20" /> WhatsApp 9043743777
        </a>
        <a
          href="tel:+919043743777"
          className="flex-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-zinc-950 py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 shadow-2xl shadow-amber-500/30"
        >
          <Phone className="w-4 h-4 fill-zinc-950" /> Call 9043743777
        </a>
      </div>

      {/* Trust Stats Bar */}
      <section className="bg-zinc-900/90 border-y border-zinc-800/90 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/80">
            <span className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 block mb-1">50,000+</span>
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Outstation Rides Completed</span>
          </div>
          <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/80">
            <span className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 block mb-1">5 Mins</span>
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Avg Doorstep Dispatch Time</span>
          </div>
          <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/80">
            <span className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 block mb-1">Best Fares</span>
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Guaranteed Best Local & Airport Rates</span>
          </div>
          <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/80">
            <span className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 block mb-1">4.9 ★</span>
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Verified Customer Rating</span>
          </div>
        </div>
      </section>

      {/* Tour Packages Section */}
      <TourPackages onSelectTourBooking={handleSelectTourBooking} />

      {/* Tariff & Rate Card Section */}
      <TariffTable />

      {/* Fleet Overview Section */}
      <FleetShowcase onSelectVehicle={handleSelectVehicleFromFleet} />

      {/* Route Distance Matrix */}
      <DistanceMatrix onQuickBookRoute={handleQuickBookRoute} />

      {/* Blog & Local History Section */}
      <BlogSection />

      {/* Customer Reviews Section */}
      <Reviews />

      {/* FAQs Section */}
      <section id="faqs" className="py-16 bg-zinc-950 text-white border-t border-zinc-800 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-black mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Everything You Need to Know About Get Taxi Kovai
            </h2>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-400/40"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-black text-sm sm:text-base text-white hover:text-amber-300 transition cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-3.5 font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        bookingData={selectedBookingData}
        onSaveBooking={handleSaveBooking}
      />

      <TrackBookingModal
        isOpen={trackBookingOpen}
        onClose={() => setTrackBookingOpen(false)}
        savedBookings={savedBookings}
      />

      <AiAssistantModal
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
      />

      {/* Footer */}
      <Footer
        onSelectTab={scrollToSection}
        onOpenTrackBooking={() => setTrackBookingOpen(true)}
        onOpenAiAssistant={() => setAiAssistantOpen(true)}
      />
    </div>
  );
}
