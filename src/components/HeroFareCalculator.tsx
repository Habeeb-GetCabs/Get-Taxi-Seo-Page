import React, { useState, useMemo } from 'react';
import { TripType, LocationOption, VehicleCategory } from '../types';
import { POPULAR_LOCATIONS, VEHICLES } from '../data/locations';
import { FIXED_ROUTE_CARDS } from '../data/tariffs';
import { LocationAutocompleteInput } from './LocationAutocompleteInput';
import { Car, MapPin, Calendar, Clock, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Info, AlertCircle, Sparkles, Navigation } from 'lucide-react';

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
  const [pickupAddress, setPickupAddress] = useState<string>('Gandhipuram, Coimbatore');
  const [dropAddress, setDropAddress] = useState<string>('Ooty (Udhagamandalam)');
  const [customKm, setCustomKm] = useState<string>('');
  const [useCustomKm, setUseCustomKm] = useState<boolean>(false);
  const [tripDays, setTripDays] = useState<number>(2);
  const [localHours, setLocalHours] = useState<number>(8);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('sedan');

  // Calculate distance in KM
  const calculatedDistanceKm = useMemo(() => {
    if (useCustomKm) {
      const parsed = parseFloat(customKm);
      return isNaN(parsed) || parsed <= 0 ? 50 : parsed;
    }

    if (tripType === 'local') {
      return localHours * 10;
    }

    // Attempt to match pickup/drop strings to known locations or fixed cards
    const pickupLower = pickupAddress.toLowerCase();
    const dropLower = dropAddress.toLowerCase();

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

    return 100;
  }, [pickupAddress, dropAddress, useCustomKm, customKm, tripType, localHours]);

  // Selected vehicle object
  const selectedVehicle = useMemo(() => {
    return VEHICLES.find((v) => v.id === selectedVehicleId) || VEHICLES[1];
  }, [selectedVehicleId]);

  // Tariff Card Matching & Hill Station Fare Engine
  const fareBreakdown = useMemo(() => {
    const v = selectedVehicle;

    if (tripType === 'local') {
      const hours = localHours || 8;
      const totalLocalFare = calculateLocalPackageFare(hours);
      const distanceCap = hours * 10;

      return {
        chargedKm: distanceCap,
        ratePerKm: 0,
        baseFare: hours <= 2 ? hours * 375 : 750,
        driverBata: hours > 2 ? (hours - 2) * 350 : 0,
        estimatedTolls: 0,
        totalFare: totalLocalFare,
        notes: `Local Package (${hours} Hours / ${distanceCap} KM Cap): First 2 Hrs @ ₹375/hr (₹750) + Next ${Math.max(0, hours - 2)} Hrs @ ₹350/hr = Total ₹${totalLocalFare.toLocaleString('en-IN')}`,
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
        notes: isHillStation
          ? `One-Way Drop to ${dropAddress} (${calculatedDistanceKm} km) + ₹400 Extra Hill Charges.`
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
      notes: `Round Trip for ${tripDays} Day(s) (Min charged ${totalMinKm} km @ ₹15/km + ₹400 Batta/day)`,
    };
  }, [tripType, calculatedDistanceKm, selectedVehicle, tripDays, localHours, dropAddress, customKm, useCustomKm]);

  const handleBookingSubmit = () => {
    const pickupName = pickupAddress || 'Coimbatore Doorstep Pickup';
    const dropName = useCustomKm
      ? `Custom Location (${customKm} km)`
      : tripType === 'local'
      ? `Coimbatore Local (${localHours} Hrs)`
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
    <div id="estimator" className="relative bg-slate-50 text-slate-900 overflow-hidden py-10 lg:py-16 border-b border-slate-200">
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
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200 mb-6">
            <button
              onClick={() => setTripType('one-way')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition ${
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
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition ${
                tripType === 'round-trip'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <Car className="w-4 h-4 text-amber-400" />
              <span>Round Trip</span>
            </button>

            <button
              onClick={() => setTripType('local')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition ${
                tripType === 'local'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Local Package</span>
            </button>

            <button
              onClick={() => setTripType('airport')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition ${
                tripType === 'airport'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Airport Drop</span>
            </button>

            <button
              onClick={onExploreTours}
              className="col-span-2 sm:col-span-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition"
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
                label="Pickup Location"
                value={pickupAddress}
                onChange={setPickupAddress}
                placeholder="Type any doorstep, area or hotel address..."
                isPickup={true}
              />
            </div>

            {/* Drop Location / Local Package Selection */}
            {tripType === 'local' ? (
              <div className="md:col-span-5 space-y-1.5">
                <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-900" /> Local Hours Package Rate
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
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition text-center ${
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
                  <button
                    type="button"
                    onClick={() => setUseCustomKm(!useCustomKm)}
                    className="text-[11px] text-blue-950 hover:underline font-bold ml-auto"
                  >
                    {useCustomKm ? '← Use Location Address' : 'Enter Custom KM →'}
                  </button>
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
                    label="Destination / Drop Location"
                    value={dropAddress}
                    onChange={setDropAddress}
                    placeholder="Type any city, town or destination..."
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
                    className="px-3 py-1 bg-white border border-slate-200 text-slate-900 rounded-lg font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-sm text-slate-900">
                    {tripDays} {tripDays === 1 ? 'Day' : 'Days'}
                  </span>
                  <button
                    onClick={() => setTripDays(tripDays + 1)}
                    className="px-3 py-1 bg-white border border-slate-200 text-slate-900 rounded-lg font-bold hover:bg-slate-100"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {VEHICLES.map((v) => {
                const isSelected = selectedVehicleId === v.id;
                let itemTotalDisplay = '';
                let perKmRateDisplay = '';

                if (tripType === 'local') {
                  const localFare = calculateLocalPackageFare(localHours);
                  itemTotalDisplay = `₹${localFare.toLocaleString('en-IN')}`;
                  perKmRateDisplay = '₹375 (1st 2 hrs) / ₹350 (rest)';
                } else if (tripType === 'airport') {
                  itemTotalDisplay = 'Best Rate';
                } else if (tripType === 'one-way') {
                  if (fareBreakdown.totalFare > 0) {
                    itemTotalDisplay = `₹${fareBreakdown.totalFare.toLocaleString('en-IN')}`;
                  } else {
                    itemTotalDisplay = 'Tariff Quote';
                  }
                  perKmRateDisplay = v.ratePerKmOneWay > 0 ? `₹${v.ratePerKmOneWay}/km` : '';
                } else {
                  const totalMin = v.minKmRoundTripPerDay * tripDays;
                  const totalKm = Math.max(calculatedDistanceKm * 2, totalMin);
                  const itemTotal = totalKm * v.ratePerKmRoundTrip + v.driverBataPerDay * tripDays + Math.round(calculatedDistanceKm * 2.2);
                  itemTotalDisplay = `₹${itemTotal.toLocaleString('en-IN')}`;
                  perKmRateDisplay = `₹${v.ratePerKmRoundTrip}/km`;
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
                        <span className="text-base font-black text-slate-950">
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

                {tripType !== 'local' && tripType !== 'airport' ? (
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
                    ✓ <strong>Guaranteed Lowest Fare:</strong> Local city packages & airport drops include doorstep pickup in 5 minutes across Coimbatore. Call 9043743777 or click Book Now for instant confirmation!
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2">
                <button
                  onClick={handleBookingSubmit}
                  className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base px-8 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Book {selectedVehicle.name} Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-[11px] text-center text-slate-400">
                  ⚡ Pay zero advance. 5 Mins doorstep dispatch!
                </p>
              </div>
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
