import React, { useState, useMemo, useEffect } from 'react';
import { TripType, LocationOption, VehicleCategory } from '../types';
import { POPULAR_LOCATIONS, VEHICLES } from '../data/locations';
import { FIXED_ROUTE_CARDS } from '../data/tariffs';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';
import { Car, MapPin, Calendar, Clock, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Info, AlertCircle, Sparkles, Navigation, Phone, MessageSquare } from 'lucide-react';

interface HeroFareCalculatorProps {
  onSelectBooking: (bookingData: {
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
  }) => void;
  onExploreTours: () => void;
}

// Helper function for local package pricing rule:
// ₹375/hr for first 2 hours + ₹350/hr for additional hours
export const calculateLocalPackageFare = (hours: number): number => {
  if (hours <= 2) {
    return hours * 375;
  }
  return (2 * 375) + ((hours - 2) * 350);
};

export const HeroFareCalculator: React.FC<HeroFareCalculatorProps> = ({
  onSelectBooking,
  onExploreTours,
}) => {
  const [tripType, setTripType] = useState<TripType>('one-way');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [dropAddress, setDropAddress] = useState<string>('');
  const [customKm, setCustomKm] = useState<string>('');
  const [useCustomKm, setUseCustomKm] = useState<boolean>(false);
  const [tripDays, setTripDays] = useState<number>(2);
  const [localHours, setLocalHours] = useState<number>(8);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('sedan');

  // Ensure valid vehicle selected when switching to hourly rentals
  useEffect(() => {
    if (tripType === 'local') {
      if (selectedVehicleId === 'tempo' || selectedVehicleId === 'hatchback') {
        setSelectedVehicleId('sedan');
      }
    }
  }, [tripType, selectedVehicleId]);

  // Calculate distance in KM
  const calculatedDistanceKm = useMemo(() => {
    if (useCustomKm) {
      const parsed = parseFloat(customKm);
      return isNaN(parsed) || parsed <= 0 ? 50 : parsed;
    }

    if (tripType === 'local') {
      return localHours * 10;
    }

    if (tripType === 'local-ride') {
      if (!pickupAddress && !dropAddress) return 10;
    }

    // Attempt to match pickup/drop strings to known locations or fixed cards
    const pickupLower = (pickupAddress || '').toLowerCase();
    const dropLower = (dropAddress || '').toLowerCase();

    const pickupLoc = POPULAR_LOCATIONS.find(
      (l) => pickupLower.includes(l.name.toLowerCase()) || pickupLower.includes(l.id)
    );
    const dropLoc = POPULAR_LOCATIONS.find(
      (l) => dropLower.includes(l.name.toLowerCase()) || dropLower.includes(l.id)
    );

    if (dropLoc && dropLoc.distanceFromCbeKm > 0) {
      return dropLoc.distanceFromCbeKm;
    }

    if (pickupLoc && pickupLoc.distanceFromCbeKm > 0) {
      return pickupLoc.distanceFromCbeKm;
    }

    // Match fixed route cards
    const matchedCard = FIXED_ROUTE_CARDS.find((card) => {
      const routeLower = card.route.toLowerCase();
      const parts = routeLower.split(/[/,]/).map((p) => p.trim());
      return parts.some((p) => p.length > 2 && dropLower.includes(p));
    });

    if (matchedCard) {
      return matchedCard.distance;
    }

    return tripType === 'local-ride' ? 12 : 50;
  }, [pickupAddress, dropAddress, useCustomKm, customKm, tripType, localHours]);

  // Selected vehicle object
  const selectedVehicle = useMemo(() => {
    return VEHICLES.find((v) => v.id === selectedVehicleId) || VEHICLES[1];
  }, [selectedVehicleId]);

  // Vehicle categories displayed based on trip type
  const availableVehicles = useMemo(() => {
    if (tripType === 'local') {
      // For hourly rentals:
      // 1. Hatchback & Sedan combined into one single tariff
      // 2. 6-Seater Family SUV (Call for Best Price)
      // 3. Premium Innova Crysta (Call for Best Price)
      // Tempo Traveller & standalone Hatchback removed
      return [
        {
          id: 'sedan',
          name: 'Hatchback / Sedan (AC)',
          subTitle: 'Swift, Dzire, Etios, WagonR, Ritz',
          models: 'Swift Dzire, Toyota Etios, WagonR, Ritz AC',
          passengers: 4,
          luggage: 3,
          ac: true,
          ratePerKmOneWay: 26,
          ratePerKmRoundTrip: 15,
          minKmOneWay: 130,
          minKmRoundTripPerDay: 250,
          driverBataPerDay: 300,
          isCustomQuote: false,
        },
        {
          id: 'suv',
          name: '6-Seater Family SUV',
          subTitle: 'Maruti Ertiga, Mahindra Xylo, Lodgy',
          models: 'Maruti Ertiga, Mahindra Xylo AC',
          passengers: 6,
          luggage: 4,
          ac: true,
          ratePerKmOneWay: 28,
          ratePerKmRoundTrip: 18,
          minKmOneWay: 130,
          minKmRoundTripPerDay: 250,
          driverBataPerDay: 400,
          isCustomQuote: true,
        },
        {
          id: 'crysta',
          name: 'Premium Innova Crysta',
          subTitle: 'VIP Luxury 7-Seater Ride',
          models: 'Toyota Innova Crysta AC',
          passengers: 7,
          luggage: 5,
          ac: true,
          ratePerKmOneWay: 32,
          ratePerKmRoundTrip: 20,
          minKmOneWay: 130,
          minKmRoundTripPerDay: 250,
          driverBataPerDay: 400,
          isCustomQuote: true,
        },
      ];
    }

    return VEHICLES.map((v) => ({
      ...v,
      isCustomQuote: false,
    }));
  }, [tripType]);

  // Tariff Card Matching & Fare Engine
  const fareBreakdown = useMemo(() => {
    const v = selectedVehicle;

    if (tripType === 'local-ride') {
      // Local City Point-to-Point Drops: Base fare ₹80 (first 2 km) + ₹26/km
      const dist = Math.max(1, calculatedDistanceKm);
      const baseFare = dist <= 2 ? 80 : 80 + Math.round((dist - 2) * 26);
      return {
        chargedKm: dist,
        ratePerKm: 26,
        baseFare,
        driverBata: 0,
        estimatedTolls: 0,
        totalFare: baseFare,
        isCustomQuote: false,
        notes: `Local City Ride (${dist} KM): Base ₹80 (incl. 2 km) + ₹26/km. Doorstep pickup in 5 minutes across Coimbatore.`,
      };
    }

    if (tripType === 'local') {
      const isSuvOrCrysta = selectedVehicleId === 'suv' || selectedVehicleId === 'crysta';
      const hours = localHours || 8;
      const distanceCap = hours * 10;

      if (isSuvOrCrysta) {
        return {
          chargedKm: distanceCap,
          ratePerKm: 0,
          baseFare: 0,
          driverBata: 0,
          estimatedTolls: 0,
          totalFare: 0,
          isCustomQuote: true,
          notes: `Hourly Rental for ${selectedVehicleId === 'suv' ? '6-Seater Family SUV' : 'Premium Innova Crysta'} (${hours} Hours / ${distanceCap} KM Cap): Exclusive customized package rate. Call us at 9043743777 for the best price!`,
          packageHours: hours,
        };
      }

      const totalLocalFare = calculateLocalPackageFare(hours);
      return {
        chargedKm: distanceCap,
        ratePerKm: 0,
        baseFare: hours <= 2 ? hours * 375 : 750,
        driverBata: hours > 2 ? (hours - 2) * 350 : 0,
        estimatedTolls: 0,
        totalFare: totalLocalFare,
        isCustomQuote: false,
        notes: `Hourly Rental (${hours} Hours / ${distanceCap} KM Cap): First 2 Hrs @ ₹375/hr (₹750) + Next ${Math.max(0, hours - 2)} Hrs @ ₹350/hr = Total ₹${totalLocalFare.toLocaleString('en-IN')}`,
        packageHours: hours,
      };
    }

    if (tripType === 'airport') {
      return {
        chargedKm: calculatedDistanceKm || 20,
        ratePerKm: 0,
        baseFare: 0,
        driverBata: 0,
        estimatedTolls: 0,
        totalFare: 0,
        isCustomQuote: false,
        notes: `Coimbatore Airport Transfer — Guaranteed Doorstep Pickup in 5 minutes. Custom Quote on request.`,
      };
    }

    if (tripType === 'one-way') {
      const dropLower = (useCustomKm ? `Custom Location (${customKm} km)` : dropAddress).toLowerCase();

      // 1. OOTY FLAT 3500 REQUIREMENT: "if he put a drop loction to ooty it should give them 3500 as a tariff , for one way drop if it is hill station hill chargers 400 will be extra but for ooty its a flat 3500 rupees"
      if (dropLower.includes('ooty')) {
        return {
          chargedKm: calculatedDistanceKm || 87,
          ratePerKm: 0,
          baseFare: 3500,
          driverBata: 0,
          estimatedTolls: 0,
          totalFare: 3500,
          isCustomQuote: false,
          notes: `Flat ₹3,500 Tariff Card for Ooty One-Way Drop (All Inclusive, Zero Extra Hill Charges).`,
        };
      }

      // Check hill station list (non-Ooty)
      const hillStationKeywords = ['kodaikanal', 'valparai', 'coonoor', 'kotagiri', 'munnar', 'topslip', 'yercaud', 'wayanad'];
      const isHillStation = hillStationKeywords.some((hk) => dropLower.includes(hk));
      const hillCharges = isHillStation ? 400 : 0;

      // 2. Check matched tariff card in FIXED_ROUTE_CARDS
      const matchedCard = FIXED_ROUTE_CARDS.find((card) => {
        const cardLower = card.route.toLowerCase();
        const parts = cardLower.split(/[/,]/).map((p) => p.trim());
        return (
          parts.some((part) => part.length > 2 && dropLower.includes(part)) ||
          dropLower.includes(cardLower)
        );
      });

      if (matchedCard) {
        const baseRouteFare = matchedCard.fare;
        const totalFare = baseRouteFare + hillCharges;
        return {
          chargedKm: calculatedDistanceKm || 50,
          ratePerKm: 0,
          baseFare: baseRouteFare,
          driverBata: hillCharges,
          estimatedTolls: 0,
          totalFare,
          isCustomQuote: false,
          notes: isHillStation
            ? `Fixed Tariff Card Match (${matchedCard.route}): ₹${baseRouteFare} + ₹400 Extra Hill Charges = ₹${totalFare}`
            : `Fixed Tariff Card Match (${matchedCard.route}): ₹${totalFare} (Official Rate)`,
        };
      }

      // 3. General One-Way calculation
      const chargedKm = Math.max(calculatedDistanceKm, v.minKmOneWay);
      const baseFare = chargedKm * 26;
      const driverBata = 300;
      const estimatedTolls = Math.round(calculatedDistanceKm * 1.2);
      const total = baseFare + driverBata + estimatedTolls + hillCharges;

      return {
        chargedKm,
        ratePerKm: 26,
        baseFare,
        driverBata: driverBata + hillCharges,
        estimatedTolls,
        totalFare: total,
        isCustomQuote: false,
        notes: isHillStation
          ? `One-Way Drop to ${dropAddress || 'Destination'} (${calculatedDistanceKm} km) + ₹400 Extra Hill Charges.`
          : `One-Way Drop (${calculatedDistanceKm} km distance, min charged ${v.minKmOneWay} km @ ₹26/km + ₹300 Batta). ZERO return km charged!`,
      };
    }

    // Round Trip calculation: ₹15/km + ₹400 driver batta per day
    const totalMinKm = v.minKmRoundTripPerDay * tripDays;
    const actualTotalKm = Math.max(calculatedDistanceKm * 2, totalMinKm);
    const baseFare = actualTotalKm * 15;
    const driverBata = 400 * tripDays;
    const estimatedTolls = Math.round(calculatedDistanceKm * 2.2);
    const total = baseFare + driverBata + estimatedTolls;

    return {
      chargedKm: actualTotalKm,
      ratePerKm: 15,
      baseFare,
      driverBata,
      estimatedTolls,
      totalFare: total,
      isCustomQuote: false,
      notes: `Round Trip for ${tripDays} Day(s) (Min charged ${totalMinKm} km @ ₹15/km + ₹400 Batta/day)`,
    };
  }, [calculatedDistanceKm, customKm, dropAddress, localHours, selectedVehicle, selectedVehicleId, tripDays, tripType, useCustomKm]);

  const handleBookingSubmit = () => {
    const pickupName = pickupAddress || 'Coimbatore Doorstep Pickup';
    const dropName = useCustomKm
      ? `Custom Location (${customKm} km)`
      : tripType === 'local'
      ? `Hourly Rental (${localHours} Hrs)`
      : tripType === 'local-ride'
      ? dropAddress || 'Coimbatore Local Drop'
      : dropAddress || 'Outstation Destination';

    onSelectBooking({
      tripType,
      pickupLocation: pickupName,
      dropLocation: dropName,
      distanceKm: calculatedDistanceKm,
      vehicle: selectedVehicle,
      totalFare: fareBreakdown.totalFare,
      baseFare: fareBreakdown.baseFare,
      driverBata: fareBreakdown.driverBata,
      estimatedTolls: fareBreakdown.estimatedTolls,
      daysCount: tripDays,
      localPackageHours: fareBreakdown.packageHours,
    });
  };


  return (
    <div id="estimator" className="relative bg-slate-50 text-slate-900 overflow-hidden pt-28 sm:pt-36 lg:pt-40 pb-12 lg:pb-16 border-b border-slate-200">
      {/* Background Lighting & Soft Ambient Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Hero Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-100/80 border border-amber-300 text-amber-900 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Coimbatore&apos;s #1 Taxi Service • Doorstep Cab Dispatch in 5 Mins
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 mb-4 leading-tight">
            Book Outstation Cabs & Hill Station Tours with{' '}
            <span className="text-blue-950 underline decoration-amber-400 decoration-wavy decoration-2">
              Zero Hidden Charges
            </span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            One-way drop taxi to Chennai, Bangalore, Madurai, or round trips to Ooty (Flat ₹3500), Isha Yoga Center, Kodaikanal & Valparai. Transparent rate card.
          </p>
        </div>

        {/* Main Interactive Calculator Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xl p-4 sm:p-8">
          {/* Trip Type Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200 mb-6">
            <button
              onClick={() => setTripType('one-way')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                tripType === 'one-way'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <Navigation className="w-4 h-4 text-amber-400" />
              <span>One-Way Drop</span>
            </button>

            <button
              onClick={() => setTripType('round-trip')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                tripType === 'round-trip'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <Car className="w-4 h-4 text-amber-400" />
              <span>Round Trip</span>
            </button>

            <button
              onClick={() => setTripType('local-ride')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                tripType === 'local-ride'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Local Rides</span>
            </button>

            <button
              onClick={() => setTripType('local')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                tripType === 'local'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Hourly Rentals</span>
            </button>

            <button
              onClick={() => setTripType('airport')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                tripType === 'airport'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <Car className="w-4 h-4 text-amber-400" />
              <span>Airport Drop</span>
            </button>

            <button
              onClick={onExploreTours}
              className="col-span-2 sm:col-span-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Tour Packages</span>
            </button>
          </div>

          {/* Form Controls Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-6">
            {/* Pickup Location */}
            <div className="md:col-span-4">
              <LocationAutocompleteInput
                label={tripType === 'local-ride' ? 'Pickup Area / Landmark' : 'Pickup Location'}
                value={pickupAddress}
                onChange={setPickupAddress}
                placeholder="Type doorstep, area or hotel address..."
                isPickup={true}
              />
            </div>

            {/* Drop Location / Hourly Rental Selection */}
            {tripType === 'local' ? (
              <div className="md:col-span-5 space-y-1.5">
                <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-900" /> Hourly Rental Package
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    ₹375 (1st 2 hrs) + ₹350/hr
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[2, 4, 8, 12].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setLocalHours(h)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        localHours === h
                          ? 'bg-slate-950 text-white border-slate-950 shadow-md'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {h} Hrs (₹{calculateLocalPackageFare(h)})
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <span className="text-xs text-slate-600 font-medium pl-1">Custom Hours:</span>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={localHours}
                    onChange={(e) => setLocalHours(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-0.5 text-xs text-slate-900 text-center font-bold"
                  />
                  <span className="text-xs text-blue-950 font-extrabold">
                    = ₹{calculateLocalPackageFare(localHours).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="md:col-span-5 space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  {tripType !== 'local-ride' && (
                    <button
                      type="button"
                      onClick={() => setUseCustomKm(!useCustomKm)}
                      className="text-[11px] text-blue-950 hover:underline font-bold ml-auto cursor-pointer"
                    >
                      {useCustomKm ? '← Use Location Address' : 'Enter Custom KM →'}
                    </button>
                  )}
                </div>

                {useCustomKm ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-900">Custom Distance (KM)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="e.g. 140"
                        value={customKm}
                        onChange={(e) => setCustomKm(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 shadow-inner"
                      />
                      <span className="text-xs text-slate-500 font-bold">KM</span>
                    </div>
                  </div>
                ) : (
                  <LocationAutocompleteInput
                    label={tripType === 'local-ride' ? 'Local Drop Area / Street' : 'Destination / Drop Location'}
                    value={dropAddress}
                    onChange={setDropAddress}
                    placeholder={tripType === 'local-ride' ? 'Type local drop area (e.g., RS Puram, Saravanampatti)...' : 'Type any city, town or destination...'}
                    isPickup={false}
                  />
                )}
              </div>
            )}

            {/* Trip Days (Only for Round Trip) */}
            {tripType === 'round-trip' ? (
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-900" /> Total Days
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl p-1">
                  <button
                    onClick={() => setTripDays(Math.max(1, tripDays - 1))}
                    className="px-3 py-1 bg-white border border-slate-200 text-slate-900 rounded-lg font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-sm text-slate-900">
                    {tripDays} {tripDays === 1 ? 'Day' : 'Days'}
                  </span>
                  <button
                    onClick={() => setTripDays(tripDays + 1)}
                    className="px-3 py-1 bg-white border border-slate-200 text-slate-900 rounded-lg font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <div className="md:col-span-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block font-medium">
                    {tripType === 'local' ? 'Package Limit' : 'Est. Distance'}
                  </span>
                  <span className="text-lg font-black text-slate-950">
                    {calculatedDistanceKm} KM
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block font-medium">
                    {tripType === 'local' ? 'Package Time' : 'Drive Time'}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {tripType === 'local' ? `${localHours} Hrs` : `~${(calculatedDistanceKm / 45).toFixed(1)} Hrs`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Selection Grid */}
          <div className="mb-6">
            <label className="text-xs font-extrabold text-slate-900 block mb-3 uppercase tracking-wider">
              Step 2: Choose Your Vehicle Category
            </label>
            <div className={`grid gap-3 ${tripType === 'local' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'}`}>
              {availableVehicles.map((v) => {
                const isSelected = selectedVehicleId === v.id;
                let itemTotalDisplay = '';
                let perKmRateDisplay = '';

                if (tripType === 'local-ride') {
                  const dist = Math.max(1, calculatedDistanceKm);
                  const baseFare = dist <= 2 ? 80 : 80 + Math.round((dist - 2) * 26);
                  itemTotalDisplay = `₹${baseFare.toLocaleString('en-IN')}`;
                  perKmRateDisplay = 'Base ₹80 + ₹26/km';
                } else if (tripType === 'local') {
                  if (v.id === 'suv' || v.id === 'crysta') {
                    itemTotalDisplay = 'Call for Best Price';
                    perKmRateDisplay = '📞 Custom Package';
                  } else {
                    const localFare = calculateLocalPackageFare(localHours);
                    itemTotalDisplay = `₹${localFare.toLocaleString('en-IN')}`;
                    perKmRateDisplay = '₹375 (1st 2 hrs) / ₹350 (rest)';
                  }
                } else if (tripType === 'airport') {
                  itemTotalDisplay = 'Best Rate';
                } else if (tripType === 'one-way') {
                  if (fareBreakdown.totalFare > 0) {
                    itemTotalDisplay = `₹${fareBreakdown.totalFare.toLocaleString('en-IN')}`;
                  } else {
                    itemTotalDisplay = 'Tariff Quote';
                  }
                  perKmRateDisplay = (v as any).ratePerKmOneWay > 0 ? `₹${(v as any).ratePerKmOneWay}/km` : '';
                } else {
                  const minKm = (v as any).minKmRoundTripPerDay || 250;
                  const rateKm = (v as any).ratePerKmRoundTrip || 15;
                  const batta = (v as any).driverBataPerDay || 400;
                  const totalMin = minKm * tripDays;
                  const totalKm = Math.max(calculatedDistanceKm * 2, totalMin);
                  const itemTotal = totalKm * rateKm + batta * tripDays + Math.round(calculatedDistanceKm * 2.2);
                  itemTotalDisplay = `₹${itemTotal.toLocaleString('en-IN')}`;
                  perKmRateDisplay = `₹${rateKm}/km`;
                }

                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`cursor-pointer rounded-2xl p-3.5 border transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-50/60 border-amber-500 ring-2 ring-amber-400/40 shadow-lg'
                        : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-extrabold text-sm text-slate-950">{v.name}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mb-2 font-medium">{v.models}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-700 font-semibold mb-3">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">👥 {v.passengers} Seats</span>
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">🧳 {v.luggage} Bags</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        {perKmRateDisplay && (
                          <span className="text-[10px] text-slate-500 block font-medium">
                            {perKmRateDisplay}
                          </span>
                        )}
                        <span className={`font-black text-slate-950 ${tripType === 'local' && (v.id === 'suv' || v.id === 'crysta') ? 'text-xs text-amber-700 font-extrabold' : 'text-base'}`}>
                          {itemTotalDisplay}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${
                          isSelected ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fare Calculation Math Breakdown Box */}
          <div className="bg-slate-950 text-white border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                    Rate Card & Tariff Breakdown
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{fareBreakdown.notes}</p>

                {tripType === 'local' && (selectedVehicleId === 'suv' || selectedVehicleId === 'crysta') ? (
                  <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-extrabold text-amber-300 block text-sm">
                        📞 Call Us for Best Price: {selectedVehicleId === 'suv' ? '6-Seater Family SUV' : 'Premium Innova Crysta'}
                      </span>
                      <span className="text-slate-300 text-xs">
                        Hourly rental for {localHours} Hours ({localHours * 10} KM cap). Direct dispatch with driver details in 5 minutes!
                      </span>
                    </div>
                    <a
                      href="tel:+919043743777"
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1 transition shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5 fill-slate-950" />
                      <span>9043743777</span>
                    </a>
                  </div>
                ) : tripType !== 'local' && tripType !== 'airport' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] font-medium">Base Route Fare</span>
                      <span className="font-extrabold text-white">₹{fareBreakdown.baseFare.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] font-medium">Driver Batta / Hill</span>
                      <span className="font-extrabold text-white">₹{fareBreakdown.driverBata.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] font-medium">Est. Toll & Taxes</span>
                      <span className="font-extrabold text-white">₹{fareBreakdown.estimatedTolls.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-amber-950/40 p-2.5 rounded-xl border border-amber-700/50">
                      <span className="text-amber-300 block text-[10px] font-bold">Final Total Fare</span>
                      <span className="font-black text-amber-400 text-sm">₹{fareBreakdown.totalFare.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200">
                    ✓ <strong>Guaranteed Lowest Fare:</strong> {tripType === 'local' ? `Hourly rental package (${localHours} Hours / ${localHours * 10} KM Cap) for Hatchback & Sedan is flat ₹${calculateLocalPackageFare(localHours).toLocaleString('en-IN')}.` : 'Airport drops include doorstep pickup in 5 minutes across Coimbatore.'} Call 9043743777 or click Book Now for instant confirmation!
                  </div>
                )}
              </div>

              {/* Action Button */}
              {tripType === 'local' && (selectedVehicleId === 'suv' || selectedVehicleId === 'crysta') ? (
                <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2">
                  <a
                    href="tel:+919043743777"
                    className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base px-8 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Phone className="w-5 h-5 fill-slate-950" />
                    <span>Call 9043743777 for Best Price</span>
                  </a>
                  <a
                    href={`https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20please%20quote%20hourly%20rental%20tariff%20for%20${encodeURIComponent(selectedVehicleId === 'suv' ? '6-Seater Family SUV' : 'Premium Innova Crysta')}%20for%20${localHours}%20Hours%20in%20Coimbatore.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Us for Best Price</span>
                  </a>
                </div>
              ) : (
                <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2">
                  <button
                    onClick={handleBookingSubmit}
                    className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base px-8 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <span>Book {tripType === 'local' && selectedVehicleId === 'sedan' ? 'Hatchback / Sedan' : selectedVehicle.name} Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    ⚡ Pay zero advance. 5 Mins doorstep dispatch!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Key Value Props Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-200 text-xs text-slate-700 font-semibold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No Hidden Charges Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Clean Sanitized AC Vehicles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Expert Nilgiri Hill Drivers</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>5 Mins Doorstep Dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
