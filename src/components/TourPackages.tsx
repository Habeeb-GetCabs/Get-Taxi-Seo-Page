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
    <section id="tours" className="py-16 bg-slate-50 text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Curated South Indian Tour Packages
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Explore Ooty, Kodaikanal & Isha Foundation
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-2xl font-medium leading-relaxed">
              Hassle-free hill station holidays & temple pilgrimage packages starting from Coimbatore. Complete with expert ghat road drivers, fuel, driver bata & parking.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                selectedCategory === 'all'
                  ? 'bg-slate-950 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Tours ({TOUR_PACKAGES.length})
            </button>
            <button
              onClick={() => setSelectedCategory('hill-station')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                selectedCategory === 'hill-station'
                  ? 'bg-slate-950 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              ⛰️ Hill Stations
            </button>
            <button
              onClick={() => setSelectedCategory('pilgrimage')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                selectedCategory === 'pilgrimage'
                  ? 'bg-slate-950 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              🛕 Temple Pilgrimage
            </button>
            <button
              onClick={() => setSelectedCategory('wildlife')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                selectedCategory === 'wildlife'
                  ? 'bg-slate-950 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
              className="bg-white border border-slate-200/90 hover:border-amber-400 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group transition duration-300 hover:-translate-y-1"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[11px] font-black px-3 py-1 rounded-full shadow">
                    {tour.durationDays} {tour.durationDays === 1 ? 'Day Tour' : 'Days Tour'}
                  </span>

                  <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-950 border border-slate-200 text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                    From ₹{tour.startingPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-3">
                  <h3 className="font-black text-xl text-slate-950 group-hover:text-blue-950 transition">
                    {tour.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 font-medium">{tour.subtitle}</p>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
                      Destinations Covered:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tour.destinationsCovered.slice(0, 3).map((dest, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200"
                        >
                          {dest}
                        </span>
                      ))}
                      {tour.destinationsCovered.length > 3 && (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-amber-300">
                          +{tour.destinationsCovered.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => handleOpenTourDetails(tour)}
                  className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 cursor-pointer text-sm shadow-md"
                >
                  <span>View More Details</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tour Detail Modal */}
      {activeTourModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 text-slate-900 max-h-[90vh] flex flex-col">
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
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/60" />

              <button
                onClick={() => setActiveTourModal(null)}
                className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-950 text-white p-2 rounded-full border border-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="bg-amber-400 text-slate-950 font-extrabold text-xs px-2.5 py-1 rounded-full shadow">
                  {activeTourModal.durationDays} Days / {activeTourModal.durationNights} Night Package
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                  {activeTourModal.title}
                </h3>
                <p className="text-xs text-slate-200 mt-1 font-medium">{activeTourModal.subtitle}</p>
              </div>
            </div>

            {/* Modal Body Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {/* Pickup & Destinations */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 font-extrabold">
                  <MapPin className="w-4 h-4" />
                  <span>Pickup Location: {activeTourModal.pickupLocation}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block mb-1">Places Covered:</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-800">
                    {activeTourModal.destinationsCovered.map((d, i) => (
                      <li key={i} className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Daywise Itinerary */}
              <div>
                <h4 className="font-black text-base text-slate-950 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  Day-Wise Tour Itinerary
                </h4>
                <div className="space-y-3">
                  {activeTourModal.itinerary.map((day) => (
                    <div key={day.day} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
                          Day {day.day}
                        </span>
                        <h5 className="font-bold text-slate-950 text-sm">{day.title}</h5>
                      </div>
                      <ul className="space-y-1.5 text-slate-600 pl-2">
                        {day.activities.map((act, actIdx) => (
                          <li key={actIdx} className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold">•</span>
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
                <h4 className="font-black text-base text-slate-950 mb-3 flex items-center gap-2">
                  <Car className="w-4 h-4 text-amber-600" />
                  Select Vehicle Category & Total Tour Fare
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeTourModal.vehiclePrices.map((vp) => {
                    const isSelected = selectedVehicleForTour === vp.vehicleId;
                    return (
                      <div
                        key={vp.vehicleId}
                        onClick={() => setSelectedVehicleForTour(vp.vehicleId)}
                        className={`cursor-pointer border rounded-2xl p-3.5 flex justify-between items-center transition ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-slate-950 block text-xs sm:text-sm">
                            {vp.vehicleName}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">Fixed Tour Fare</span>
                        </div>
                        <span className="font-black text-slate-950 text-sm sm:text-base">
                          ₹{vp.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5">
                  <span className="font-bold text-emerald-800 block mb-2 text-xs uppercase tracking-wider">
                    ✓ Package Inclusions
                  </span>
                  <ul className="space-y-1 text-slate-700 text-xs font-medium">
                    {activeTourModal.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-3.5">
                  <span className="font-bold text-rose-800 block mb-2 text-xs uppercase tracking-wider">
                    ✕ Exclusions
                  </span>
                  <ul className="space-y-1 text-slate-600 text-xs font-medium">
                    {activeTourModal.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <span className="text-slate-500 block text-xs font-medium">Selected Package Price</span>
                <span className="text-xl font-black text-slate-950">
                  ₹
                  {activeTourModal.vehiclePrices
                    .find((p) => p.vehicleId === selectedVehicleForTour)
                    ?.totalPrice.toLocaleString('en-IN') || activeTourModal.startingPrice}
                </span>
              </div>

              <button
                onClick={handleBookSelectedTour}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-md text-sm flex items-center gap-2 transition cursor-pointer"
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
