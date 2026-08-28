import React from 'react';
import { VEHICLES } from '../data/locations';
import { VehicleCategory } from '../types';
import { Car, Users, Luggage, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface FleetShowcaseProps {
  onSelectVehicle: (vehicle: VehicleCategory) => void;
}

export const FleetShowcase: React.FC<FleetShowcaseProps> = ({ onSelectVehicle }) => {
  return (
    <section id="fleet" className="py-16 bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Car className="w-3.5 h-3.5" /> Well-Maintained Commercial Fleet
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Clean, Air-Conditioned Cabs for Every Group Size
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Regularly sanitized, GPS-enabled vehicles driven by verified professional local drivers with extensive ghat mountain experience.
          </p>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VEHICLES.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-slate-950 border border-slate-800 hover:border-amber-400/50 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group transition duration-300"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-900">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                  <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-xs font-extrabold px-2.5 py-1 rounded">
                    One-Way ₹{vehicle.ratePerKmOneWay}/km
                  </span>

                  <span className="absolute top-3 right-3 bg-slate-900/90 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded border border-emerald-500/30">
                    AC Guaranteed
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-white group-hover:text-amber-400 transition">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{vehicle.models}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-300">
                    <div className="bg-slate-900 border border-slate-800 p-2 rounded flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{vehicle.passengers} Passengers</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-2 rounded flex items-center gap-2">
                      <Luggage className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{vehicle.luggage} Luggage Bags</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-slate-400 font-semibold block">Best Suited For:</span>
                    <p className="text-slate-300 italic">{vehicle.popularFor}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Round Trip Rate:</span>
                      <span className="font-bold text-amber-300">₹{vehicle.ratePerKmRoundTrip}/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Driver Allowance:</span>
                      <span className="font-semibold text-slate-200">₹{vehicle.driverBataPerDay}/day</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => onSelectVehicle(vehicle)}
                  className="w-full bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-amber-400 font-bold py-2.5 px-4 rounded-xl border border-amber-400/30 flex items-center justify-center gap-2 transition cursor-pointer text-xs sm:text-sm"
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
