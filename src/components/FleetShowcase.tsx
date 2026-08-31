import React from 'react';
import { VEHICLES } from '../data/locations';
import { VehicleCategory } from '../types';
import { Car, Users, Luggage, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface FleetShowcaseProps {
  onSelectVehicle: (vehicle: VehicleCategory) => void;
}

export const FleetShowcase: React.FC<FleetShowcaseProps> = ({ onSelectVehicle }) => {
  return (
    <section id="fleet" className="py-16 bg-white text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3 shadow-sm">
            <Car className="w-3.5 h-3.5 text-amber-600" /> Well-Maintained Commercial Fleet
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
            Clean, Air-Conditioned Cabs for Every Group Size
          </h2>
          <p className="text-slate-600 text-sm mt-2 font-medium">
            Regularly sanitized, GPS-enabled vehicles driven by verified professional local drivers with extensive ghat mountain experience.
          </p>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VEHICLES.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white border border-slate-200 hover:border-amber-400 rounded-3xl overflow-hidden shadow-md hover:shadow-xl flex flex-col justify-between group transition duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    onError={(e) => {
                      if (vehicle.fallbackImage) {
                        (e.target as HTMLImageElement).src = vehicle.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow">
                    One-Way ₹{vehicle.ratePerKmOneWay}/km
                  </span>

                  <span className="absolute top-3 right-3 bg-white/95 text-emerald-700 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200 shadow-sm">
                    AC Guaranteed
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-black text-xl text-slate-950 group-hover:text-amber-700 transition">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{vehicle.models}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700">
                    <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{vehicle.passengers} Passengers</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center gap-2">
                      <Luggage className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{vehicle.luggage} Luggage Bags</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Best Suited For:</span>
                    <p className="text-slate-700 italic font-medium">{vehicle.popularFor}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-xs space-y-1 font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Round Trip Rate:</span>
                      <span className="font-bold text-slate-950">₹{vehicle.ratePerKmRoundTrip}/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Driver Allowance:</span>
                      <span className="font-bold text-slate-950">₹{vehicle.driverBataPerDay}/day</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectVehicle(vehicle)}
                  className="w-full taxi-yellow-btn text-slate-950 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer text-xs sm:text-sm shadow-sm border border-amber-400 font-syne uppercase tracking-wider"
                >
                  <span>Select {vehicle.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
