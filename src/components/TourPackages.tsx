import React, { useState } from 'react';
import { TourPackage, VehicleCategory } from '../types';
import { TOUR_PACKAGES } from '../data/tours';
import { VEHICLES } from '../data/locations';
import { Sparkles, Calendar, Clock, MapPin, CheckCircle2, XCircle, ArrowRight, X, ShieldCheck, Car, Heart, ChevronRight } from 'lucide-react';

interface TourPackagesProps {
  onSelectTourBooking: (tour: TourPackage, vehicle: VehicleCategory, price: number) => void;
}

export const TourPackages: React.FC<TourPackagesProps> = ({ onSelectTourBooking }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTourModal, setActiveTourModal] = useState<TourPackage | null>(null);
  const [selectedVehicleForTour, setSelectedVehicleForTour] = useState<string>('sedan');

  const filteredTours = TOUR_PACKAGES.filter((tour) => {
    if (selectedCategory === 'all') return true;
    return tour.category === selectedCategory;
  });

  const handleOpenTourDetails = (tour: TourPackage) => {
    setActiveTourModal(tour);
    setSelectedVehicleForTour('sedan');
  };

  const handleBookSelectedTour = () => {
    if (!activeTourModal) return;
    const v = VEHICLES.find((veh) => veh.id === selectedVehicleForTour) || VEHICLES[1];
    const priceObj = activeTourModal.vehiclePrices.find((p) => p.vehicleId === selectedVehicleForTour);
    const price = priceObj ? priceObj.totalPrice : activeTourModal.startingPrice;

    onSelectTourBooking(activeTourModal, v, price);
    setActiveTourModal(null);
  };

  return (
    <section id="tours" className="py-16 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Curated South Indian Tour Packages
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Explore Ooty, Kodaikanal & Isha Foundation
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-2xl">
              Hassle-free hill station holidays & temple pilgrimage packages starting from Coimbatore. Complete with expert ghat road drivers, fuel, driver bata & parking.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedCategory === 'all'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Tours ({TOUR_PACKAGES.length})
            </button>
            <button
              onClick={() => setSelectedCategory('hill-station')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedCategory === 'hill-station'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ⛰️ Hill Stations
            </button>
            <button
              onClick={() => setSelectedCategory('pilgrimage')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedCategory === 'pilgrimage'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🛕 Temple Pilgrimage
            </button>
            <button
              onClick={() => setSelectedCategory('wildlife')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedCategory === 'wildlife'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🐅 Wildlife & Nature
            </button>
          </div>
        </div>

        {/* Tour Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-slate-950 border border-slate-800 hover:border-amber-400/50 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group transition duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Image & Badge Header */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tour.coverImage}
                    alt={tour.title}
                    onError={(e) => {
                      if (tour.fallbackImage) {
                        (e.target as HTMLImageElement).src = tour.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40" />

                  <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[11px] font-extrabold px-2.5 py-1 rounded-md shadow">
                    {tour.durationDays} {tour.durationDays === 1 ? 'Day Tour' : 'Days Tour'}
                  </span>

                  <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-400/30 text-xs font-bold px-2.5 py-1 rounded-md">
                    From ₹{tour.startingPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <h3 className="font-extrabold text-lg text-white group-hover:text-amber-400 transition">
                    {tour.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{tour.subtitle}</p>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
                      Destinations Covered:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {tour.destinationsCovered.slice(0, 3).map((dest, i) => (
                        <span
                          key={i}
                          className="bg-slate-900 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-800"
                        >
                          {dest}
                        </span>
                      ))}
                      {tour.destinationsCovered.length > 3 && (
                        <span className="bg-slate-900 text-amber-400 text-[10px] px-1.5 py-0.5 rounded">
                          +{tour.destinationsCovered.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => handleOpenTourDetails(tour)}
                  className="w-full bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-amber-400 font-bold py-2.5 px-4 rounded-xl border border-amber-400/30 flex items-center justify-center gap-2 transition duration-200 cursor-pointer text-xs sm:text-sm"
                >
                  <span>View Itinerary & Book</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tour Detail Modal */}
      {activeTourModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 text-white max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="relative h-48 sm:h-64 shrink-0">
              <img
                src={activeTourModal.coverImage}
                alt={activeTourModal.title}
                onError={(e) => {
                  if (activeTourModal.fallbackImage) {
                    (e.target as HTMLImageElement).src = activeTourModal.fallbackImage;
                  }
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/60" />

              <button
                onClick={() => setActiveTourModal(null)}
                className="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-950 text-white p-2 rounded-full border border-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-2.5 py-1 rounded">
                  {activeTourModal.durationDays} Days / {activeTourModal.durationNights} Night Package
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                  {activeTourModal.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1">{activeTourModal.subtitle}</p>
              </div>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {/* Pickup & Destinations */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Pickup Location: {activeTourModal.pickupLocation}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Places Covered:</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-200">
                    {activeTourModal.destinationsCovered.map((d, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Daywise Itinerary */}
              <div>
                <h4 className="font-extrabold text-base text-white mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Day-Wise Tour Itinerary
                </h4>
                <div className="space-y-3">
                  {activeTourModal.itinerary.map((day) => (
                    <div key={day.day} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded text-xs font-bold">
                          Day {day.day}
                        </span>
                        <h5 className="font-bold text-white text-sm">{day.title}</h5>
                      </div>
                      <ul className="space-y-1.5 text-slate-300 pl-2">
                        {day.activities.map((act, actIdx) => (
                          <li key={actIdx} className="flex items-start gap-2">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicle Pricing Selection */}
              <div>
                <h4 className="font-extrabold text-base text-white mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4 text-amber-400" />
                  Select Vehicle Category & Total Tour Fare
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeTourModal.vehiclePrices.map((vp) => {
                    const isSelected = selectedVehicleForTour === vp.vehicleId;
                    return (
                      <div
                        key={vp.vehicleId}
                        onClick={() => setSelectedVehicleForTour(vp.vehicleId)}
                        className={`cursor-pointer border rounded-xl p-3 flex justify-between items-center transition ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/40'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-white block text-xs sm:text-sm">
                            {vp.vehicleName}
                          </span>
                          <span className="text-[11px] text-slate-400">Fixed Tour Fare</span>
                        </div>
                        <span className="font-extrabold text-amber-400 text-sm sm:text-base">
                          ₹{vp.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="font-bold text-emerald-400 block mb-2 text-xs uppercase tracking-wider">
                    ✓ Package Inclusions
                  </span>
                  <ul className="space-y-1 text-slate-300 text-xs">
                    {activeTourModal.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <span className="font-bold text-rose-400 block mb-2 text-xs uppercase tracking-wider">
                    ✕ Exclusions
                  </span>
                  <ul className="space-y-1 text-slate-400 text-xs">
                    {activeTourModal.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <span className="text-slate-400 block text-xs">Selected Package Price</span>
                <span className="text-xl font-extrabold text-amber-400">
                  ₹
                  {activeTourModal.vehiclePrices
                    .find((p) => p.vehicleId === selectedVehicleForTour)
                    ?.totalPrice.toLocaleString('en-IN') || activeTourModal.startingPrice}
                </span>
              </div>

              <button
                onClick={handleBookSelectedTour}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 text-sm flex items-center gap-2 transition cursor-pointer"
              >
                <span>Book This Tour Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
