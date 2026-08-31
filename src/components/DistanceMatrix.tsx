import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calculator, Navigation, Phone, MessageSquare, Car } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

interface DistanceMatrixProps {
  onQuickBookRoute?: (pickup: string, drop: string, distKm: number) => void;
}

export const DistanceMatrix: React.FC<DistanceMatrixProps> = ({ onQuickBookRoute }) => {
  const [pickupLocation, setPickupLocation] = useState<string>('');
  const [dropLocation, setDropLocation] = useState<string>('');
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize Google Places Autocomplete if window.google is available
    if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.places) {
      try {
        if (pickupInputRef.current) {
          const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupInputRef.current, {
            types: ['geocode', 'establishment'],
            componentRestrictions: { country: 'in' },
          });
          pickupAutocomplete.addListener('place_changed', () => {
            const place = pickupAutocomplete.getPlace();
            if (place && place.formatted_address) {
              setPickupLocation(place.formatted_address);
            } else if (place && place.name) {
              setPickupLocation(place.name);
            }
          });
        }

        if (dropInputRef.current) {
          const dropAutocomplete = new window.google.maps.places.Autocomplete(dropInputRef.current, {
            types: ['geocode', 'establishment'],
            componentRestrictions: { country: 'in' },
          });
          dropAutocomplete.addListener('place_changed', () => {
            const place = dropAutocomplete.getPlace();
            if (place && place.formatted_address) {
              setDropLocation(place.formatted_address);
            } else if (place && place.name) {
              setDropLocation(place.name);
            }
          });
        }
      } catch (e) {
        console.warn('Google Places Autocomplete initialization skipped:', e);
      }
    }
  }, []);

  // Helper fallback for distance calculation if Google API key is placeholder or unconfigured
  const getFallbackDistance = (origin: string, destination: string): number => {
    const o = origin.toLowerCase();
    const d = destination.toLowerCase();

    if ((o.includes('coimbatore') && d.includes('ooty')) || (o.includes('ooty') && d.includes('coimbatore'))) return 86;
    if ((o.includes('coimbatore') && d.includes('coonoor')) || (o.includes('coonoor') && d.includes('coimbatore'))) return 68;
    if ((o.includes('coimbatore') && d.includes('kodaikanal')) || (o.includes('kodaikanal') && d.includes('coimbatore'))) return 175;
    if ((o.includes('coimbatore') && d.includes('valparai')) || (o.includes('valparai') && d.includes('coimbatore'))) return 105;
    if ((o.includes('coimbatore') && d.includes('isha')) || (o.includes('isha') && d.includes('coimbatore'))) return 30;
    if ((o.includes('coimbatore') && d.includes('pollachi')) || (o.includes('pollachi') && d.includes('coimbatore'))) return 45;
    if ((o.includes('coimbatore') && d.includes('palani')) || (o.includes('palani') && d.includes('coimbatore'))) return 108;
    if ((o.includes('coimbatore') && d.includes('bangalore')) || (o.includes('bangalore') && d.includes('coimbatore'))) return 365;
    if ((o.includes('coimbatore') && d.includes('chennai')) || (o.includes('chennai') && d.includes('coimbatore'))) return 505;
    if ((o.includes('coimbatore') && d.includes('madurai')) || (o.includes('madurai') && d.includes('coimbatore'))) return 215;
    if ((o.includes('coimbatore') && d.includes('mysore')) || (o.includes('mysore') && d.includes('coimbatore'))) return 205;

    // Default estimate if unknown
    return 130;
  };

  const handleCalculateFare = () => {
    if (!pickupLocation.trim() || !dropLocation.trim()) {
      setErrorMsg('Please enter both Pickup and Drop locations.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    // Try Google Distance Matrix API
    if (
      typeof window !== 'undefined' &&
      window.google &&
      window.google.maps &&
      window.google.maps.DistanceMatrixService
    ) {
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [pickupLocation],
          destinations: [dropLocation],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (response: any, status: string) => {
          setLoading(false);
          if (
            status === 'OK' &&
            response &&
            response.rows &&
            response.rows[0] &&
            response.rows[0].elements &&
            response.rows[0].elements[0] &&
            response.rows[0].elements[0].status === 'OK'
          ) {
            const distanceInMeters = response.rows[0].elements[0].distance.value;
            const km = Math.max(1, Math.round(distanceInMeters / 1000));
            setDistanceKm(km);
            // Strict Pricing Math: (Distance in KM * 26) + 400
            const total = Math.round(km * 26 + 400);
            setEstimatedFare(total);
          } else {
            // Fallback if API key is invalid placeholder or address not found via matrix
            const km = getFallbackDistance(pickupLocation, dropLocation);
            setDistanceKm(km);
            const total = Math.round(km * 26 + 400);
            setEstimatedFare(total);
          }
        }
      );
    } else {
      // Fallback calculation when Google Maps JS API script key is placeholder
      setTimeout(() => {
        setLoading(false);
        const km = getFallbackDistance(pickupLocation, dropLocation);
        setDistanceKm(km);
        const total = Math.round(km * 26 + 400);
        setEstimatedFare(total);
      }, 300);
    }
  };

  return (
    <section id="distance-matrix" className="py-16 bg-slate-50 border-t border-slate-200 text-slate-900 relative overflow-hidden">
      {/* Soft Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-200/40 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3 shadow-sm">
            <Calculator className="w-3.5 h-3.5 text-amber-600" />
            Live Distance & Fare Estimator
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-3">
            Fare Estimator
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            Enter your pickup and drop locations to get an instant estimated fare powered by Google Maps.
          </p>
        </div>

        {/* Fare Estimator Form Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Pickup Location Field */}
            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" /> Pickup Location
              </label>
              <input
                ref={pickupInputRef}
                type="text"
                placeholder="Enter pickup location (e.g. Coimbatore)"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Drop Location Field */}
            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-amber-600" /> Drop Location
              </label>
              <input
                ref={dropInputRef}
                type="text"
                placeholder="Enter drop location (e.g. Ooty)"
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3.5 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 text-center text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 py-2.5 px-4 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Calculate Fare Button */}
          <div className="text-center">
            <button
              onClick={handleCalculateFare}
              disabled={loading}
              className="w-full sm:w-auto taxi-yellow-btn disabled:opacity-50 text-slate-950 font-black px-10 py-4 rounded-2xl text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2.5 mx-auto cursor-pointer border border-amber-400 font-syne uppercase tracking-wider"
            >
              <Calculator className="w-4 h-4" />
              {loading ? 'Calculating Distance & Fare...' : 'Calculate Fare'}
            </button>
          </div>

          {/* Calculated Price Display */}
          {estimatedFare !== null && (
            <div className="mt-8 pt-8 border-t border-slate-200 text-center animate-fadeIn">
              <div className="bg-amber-50/80 border border-amber-300 rounded-3xl p-6 sm:p-8 max-w-lg mx-auto space-y-4 shadow-lg">
                <span className="text-xs font-black text-amber-900 uppercase tracking-widest block">
                  Calculated Estimate
                </span>
                <div className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
                  Estimated Fare: ₹{estimatedFare.toLocaleString('en-IN')}
                </div>
                {distanceKm && (
                  <p className="text-xs text-slate-700 font-bold">
                    Calculated Distance: ~{distanceKm} KM (Doorstep Pickup & Drop)
                  </p>
                )}

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap justify-center gap-3 pt-4">
                  {onQuickBookRoute && (
                    <button
                      onClick={() => onQuickBookRoute(pickupLocation, dropLocation, distanceKm || 130)}
                      className="taxi-yellow-btn text-slate-950 font-black px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-md border border-amber-400 uppercase tracking-wider"
                    >
                      <Car className="w-4 h-4" /> Book This Fare
                    </button>
                  )}
                  <a
                    href={`tel:+919043743777`}
                    className="bg-slate-950 hover:bg-slate-900 text-white font-black px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-md border border-slate-800"
                  >
                    <Phone className="w-4 h-4 text-amber-400 fill-amber-400" /> Call 9043743777
                  </a>
                  <a
                    href={`https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20I%20calculated%20fare%20from%20${encodeURIComponent(
                      pickupLocation
                    )}%20to%20${encodeURIComponent(dropLocation)}%20(Estimated%20Fare:%20₹${estimatedFare}).%20Please%20book%20a%20cab.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 fill-white/20" /> WhatsApp Book
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
