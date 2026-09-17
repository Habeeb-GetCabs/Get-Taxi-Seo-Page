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
// ₹350/hr with 10 km free per hour
export const calculateLocalPackageFare = (hours: number): number => {
  return hours * 350;
};

export const HeroFareCalculator: React.FC<HeroFareCalculatorProps> = ({
  onSelectBooking,
  onExploreTours,
}) => {
  const [tripType, setTripType] = useState<TripType>('local-ride');
  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [dropAddress, setDropAddress] = useState<string>('');
  const [customKm, setCustomKm] = useState<string>('');
  const [useCustomKm, setUseCustomKm] = useState<boolean>(false);
  const [tripDays, setTripDays] = useState<number>(2);
  const [localHours, setLocalHours] = useState<number>(4);
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

  const hasSelectedDestination = useMemo(() => {
    if (tripType === 'local') return !!pickupAddress.trim();
    if (tripType === 'local-ride') return !!pickupAddress.trim() && !!dropAddress.trim();
    if (useCustomKm) return !!customKm && parseFloat(customKm) > 0;
    return !!dropAddress.trim() && !!pickupAddress.trim();
  }, [tripType, useCustomKm, customKm, dropAddress, pickupAddress]);

  // Vehicle categories displayed based on trip type
  const availableVehicles = useMemo(() => {
    if (tripType === 'local') {
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

  // Tariff Card Matching & Fare Engine (computes total backend fare without exposing price formulas)
  const fareBreakdown = useMemo(() => {
    const v = selectedVehicle;

    if (tripType === 'local-ride') {
      if (!dropAddress.trim() || !pickupAddress.trim()) {
        return {
          chargedKm: 0,
          ratePerKm: 0,
          baseFare: 0,
          driverBata: 0,
          estimatedTolls: 0,
          totalFare: 0,
          isCustomQuote: false,
          notes: 'Enter both pickup and drop locations to get your instant fare calculation.',
        };
      }
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
        notes: 'Doorstep pickup in 5 minutes across Coimbatore with zero hidden charges.',
      };
    }

    if (tripType === 'local') {
      const isSuvOrCrysta = selectedVehicleId === 'suv' || selectedVehicleId === 'crysta';
      const hours = localHours || 4;
      const distanceCap = hours * 10;

      if (!pickupAddress.trim()) {
        return {
          chargedKm: distanceCap,
          ratePerKm: 0,
          baseFare: 0,
          driverBata: 0,
          estimatedTolls: 0,
          totalFare: 0,
          isCustomQuote: isSuvOrCrysta,
          notes: `Enter your pickup location in Coimbatore for ${hours}-Hour Rental package.`,
          packageHours: hours,
        };
      }

      if (isSuvOrCrysta) {
        return {
          chargedKm: distanceCap,
          ratePerKm: 0,
          baseFare: 0,
          driverBata: 0,
          estimatedTolls: 0,
          totalFare: 0,
          isCustomQuote: true,
          notes: `Hourly Rental for ${selectedVehicleId === 'suv' ? '6-Seater Family SUV' : 'Premium Innova Crysta'} (${hours} Hours): Exclusive package rate. Call us at 9043743777 for instant confirmation!`,
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
        notes: `Hourly Rental Package (${hours} Hours): All-inclusive package rate with professional chauffeur.`,
        packageHours: hours,
      };
    }

    if (tripType === 'airport') {
      if (!pickupAddress.trim() && !dropAddress.trim()) {
        return {
          chargedKm: 0,
          ratePerKm: 0,
          baseFare: 0,
          driverBata: 0,
          estimatedTolls: 0,
          totalFare: 0,
          isCustomQuote: false,
          notes: `Enter your doorstep address or flight details for Coimbatore Airport transfer.`,
        };
      }
      return {
        chargedKm: calculatedDistanceKm || 20,
        ratePerKm: 0,
        baseFare: 0,
        driverBata: 0,
        estimatedTolls: 0,
        totalFare: 0,
        isCustomQuote: false,
        notes: `Coimbatore Airport Transfer — Prompt Doorstep Pickup across Coimbatore.`,
      };
    }

    if (!hasSelectedDestination) {
      return {
        chargedKm: 0,
        ratePerKm: 0,
        baseFare: 0,
        driverBata: 0,
        estimatedTolls: 0,
        totalFare: 0,
        isCustomQuote: false,
        notes: 'Enter pickup address and destination location above to calculate fare.',
      };
    }

    if (tripType === 'one-way') {
      const dropLower = (useCustomKm ? `Custom Location (${customKm} km)` : dropAddress).toLowerCase();

      // 1. OOTY FLAT 3500 REQUIREMENT
      if (dropLower.includes('ooty')) {
        return {
          chargedKm: calculatedDistanceKm || 87,
          ratePerKm: 0,
          baseFare: 3500,
          driverBata: 0,
          estimatedTolls: 0,
          totalFare: 3500,
          isCustomQuote: false,
          notes: `Flat Rate Card Fare for Ooty One-Way Drop (All Inclusive).`,
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
          notes: `Official Tariff Card Fare: Fixed tariff rate for ${matchedCard.route}.`,
        };
      }

      // 3. General One-Way calculation: ₹15 per km, minimum 130 km coverage, driver batta ₹500
      const chargedKm = Math.max(calculatedDistanceKm, 130);
      const baseFare = chargedKm * 15;
      const driverBata = 500;
      const total = baseFare + driverBata + hillCharges;

      return {
        chargedKm,
        ratePerKm: 15,
        baseFare,
        driverBata: driverBata + hillCharges,
        estimatedTolls: 0,
        totalFare: total,
        isCustomQuote: false,
        notes: `Confirmed One-Way Drop to ${dropAddress || 'Destination'} (₹15/km, min 130 km coverage, ₹500 batta).`,
      };
    }

    // Round Trip calculation
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
      notes: `Round Trip Tour (${tripDays} Day${tripDays > 1 ? 's' : ''}) with dedicated vehicle & chauffeur.`,
    };
  }, [calculatedDistanceKm, customKm, dropAddress, hasSelectedDestination, localHours, pickupAddress, selectedVehicle, selectedVehicleId, tripDays, tripType, useCustomKm]);

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
    <div id="estimator" className="relative bg-slate-950 text-white overflow-hidden pt-28 sm:pt-36 lg:pt-40 pb-16 lg:pb-24 border-b border-slate-800">
      {/* Background Ooty Scenic Nilgiri Hills Image & Gradient Overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 scale-105 pointer-events-none transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=2000&q=85')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950 pointer-events-none" />

      {/* Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[32rem] h-[32rem] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[32rem] h-[32rem] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Hero Header Badge & Multicolor Block Title */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 text-amber-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-5 shadow-xl backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Coimbatore&apos;s Most Trusted Taxi • Doorstep Pickup in 5 Mins</span>
          </div>

          {/* Headline with exact uppercase heavy geometric font & multi-color layout */}
          <h1 className="font-['Outfit','Syne',sans-serif] text-4xl sm:text-6xl lg:text-7xl font-[900] tracking-tight text-white uppercase leading-[1.05] mb-5 mx-auto drop-shadow-xl">
            <span className="block text-amber-400">PREMIUM COIMBATORE CALL TAXI</span>
            <span className="block text-white text-2xl sm:text-4xl lg:text-5xl mt-2 tracking-wider font-extrabold text-slate-200">
              ALWAYS ON TIME • ZERO HIDDEN CHARGES
            </span>
            <span className="block text-orange-500 text-3xl sm:text-5xl lg:text-6xl mt-1">
              ONE-WAY DROPS &amp; HILL STATION TOURS
            </span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-semibold max-w-3xl mx-auto mb-2 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
            <span className="text-amber-400">Round-Trip from ₹13–15/km</span>
            <span className="text-slate-500 mx-2">|</span>
            <span className="text-amber-400">One-Way Drop from ₹14–26/km</span>
            <span className="text-slate-500 mx-2">|</span>
            <span className="text-amber-400">Hourly Rentals at ₹350/hr</span>
          </p>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-normal max-w-2xl mx-auto">
            Experience Kovai&apos;s premier taxi service with transparent per-km billing. Verified drivers, luxury cabs for outstation drops, Ooty tours &amp; 24/7 airport pick up.
            <span className="block text-[11px] text-slate-500 mt-1">*Fast 10-Min Doorstep Pickup: Within Coimbatore Municipal Corporation limits, subject to peak traffic and vehicle availability.</span>
          </p>
        </div>

        {/* Main Interactive Calculator Console Card */}
        <div className="bg-[#0d1627]/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl p-4 sm:p-8">
          {/* Trip Type Selector Tabs: 1. Local Ride, 2. Hourly Rental, 3. One-Way, 4. Outstation */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 bg-slate-950/90 p-2 rounded-2xl border border-slate-800/90 mb-6">
            <button
              onClick={() => setTripType('local-ride')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                tripType === 'local-ride'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <MapPin className={`w-4 h-4 ${tripType === 'local-ride' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>Local Ride</span>
            </button>

            <button
              onClick={() => setTripType('local')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                tripType === 'local'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Clock className={`w-4 h-4 ${tripType === 'local' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>Hourly Rental</span>
            </button>

            <button
              onClick={() => setTripType('one-way')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                tripType === 'one-way'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Navigation className={`w-4 h-4 ${tripType === 'one-way' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>One-Way</span>
            </button>

            <button
              onClick={() => setTripType('round-trip')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                tripType === 'round-trip'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Car className={`w-4 h-4 ${tripType === 'round-trip' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>Outstation</span>
            </button>

            <button
              onClick={() => setTripType('airport')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                tripType === 'airport'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Car className={`w-4 h-4 ${tripType === 'airport' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>Airport Drop</span>
            </button>

            <button
              onClick={onExploreTours}
              className="col-span-2 sm:col-span-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
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
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Hourly Rental Package
                  </span>
                  <span className="text-[11px] text-amber-400 font-semibold">
                    ₹350/hr (10 KM free / hr)
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
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black'
                          : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-amber-400/50'
                      }`}
                    >
                      {h} Hrs ({h * 10}km)
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-1 bg-slate-900 border border-slate-700 rounded-xl p-2">
                  <span className="text-xs text-slate-400 font-medium pl-1">Custom Hours:</span>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={localHours}
                    onChange={(e) => setLocalHours(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-0.5 text-xs text-white text-center font-bold"
                  />
                  <span className="text-xs text-amber-400 font-extrabold">
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
                      className="text-[11px] text-amber-400 hover:underline font-bold ml-auto cursor-pointer"
                    >
                      {useCustomKm ? '← Use Location Address' : 'Enter Custom KM →'}
                    </button>
                  )}
                </div>

                {useCustomKm ? (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-200">Custom Distance (KM)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="e.g. 140"
                        value={customKm}
                        onChange={(e) => setCustomKm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-amber-400"
                      />
                      <span className="text-xs text-slate-400 font-bold">KM</span>
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
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" /> Total Days
                </label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1">
                  <button
                    onClick={() => setTripDays(Math.max(1, tripDays - 1))}
                    className="px-3 py-1 bg-slate-800 border border-slate-700 text-white rounded-lg font-bold hover:bg-slate-700 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-sm text-white">
                    {tripDays} {tripDays === 1 ? 'Day' : 'Days'}
                  </span>
                  <button
                    onClick={() => setTripDays(tripDays + 1)}
                    className="px-3 py-1 bg-slate-800 border border-slate-700 text-white rounded-lg font-bold hover:bg-slate-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : tripType === 'local' ? (
              <div className="md:col-span-3 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Package Duration
                  </span>
                  <span className="text-base font-black text-white">
                    {localHours} Hours
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-medium">
                    Service Area
                  </span>
                  <span className="text-xs font-bold text-amber-400">
                    Coimbatore City
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Vehicle Selection Grid */}
          <div className="mb-6">
            <label className="text-xs font-extrabold text-slate-200 block mb-3 uppercase tracking-wider">
              Step 2: Choose Your Vehicle Category
            </label>
            <div className={`grid gap-3 ${tripType === 'local' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'}`}>
              {availableVehicles.map((v) => {
                const isSelected = selectedVehicleId === v.id;
                let itemTotalDisplay = '';

                if (tripType === 'local-ride') {
                  if (fareBreakdown.totalFare > 0) {
                    itemTotalDisplay = `₹${fareBreakdown.totalFare.toLocaleString('en-IN')}`;
                  } else {
                    itemTotalDisplay = 'Enter Locations';
                  }
                } else if (tripType === 'local') {
                  if (v.id === 'suv' || v.id === 'crysta') {
                    itemTotalDisplay = 'Call for Best Price';
                  } else if (fareBreakdown.totalFare > 0) {
                    const localFare = calculateLocalPackageFare(localHours);
                    itemTotalDisplay = `₹${localFare.toLocaleString('en-IN')}`;
                  } else {
                    itemTotalDisplay = 'Enter Pickup';
                  }
                } else if (tripType === 'airport') {
                  itemTotalDisplay = 'Best Rate';
                } else if (tripType === 'one-way') {
                  if (fareBreakdown.totalFare > 0) {
                    itemTotalDisplay = `₹${fareBreakdown.totalFare.toLocaleString('en-IN')}`;
                  } else {
                    itemTotalDisplay = 'Enter Locations';
                  }
                } else {
                  if (hasSelectedDestination && fareBreakdown.totalFare > 0) {
                    const minKm = (v as any).minKmRoundTripPerDay || 250;
                    const rateKm = (v as any).ratePerKmRoundTrip || 15;
                    const batta = (v as any).driverBataPerDay || 400;
                    const totalMin = minKm * tripDays;
                    const totalKm = Math.max(calculatedDistanceKm * 2, totalMin);
                    const itemTotal = totalKm * rateKm + batta * tripDays + Math.round(calculatedDistanceKm * 2.2);
                    itemTotalDisplay = `₹${itemTotal.toLocaleString('en-IN')}`;
                  } else {
                    itemTotalDisplay = 'Enter Locations';
                  }
                }

                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`cursor-pointer rounded-2xl p-3.5 border transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/40 shadow-xl shadow-amber-400/10'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-600 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-extrabold text-sm text-white">{v.name}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mb-2 font-medium">{v.models}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-300 font-semibold mb-3">
                        <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">👥 {v.passengers} Seats</span>
                        <span className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">🧳 {v.luggage} Bags</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <span className={`font-black ${tripType === 'local' && (v.id === 'suv' || v.id === 'crysta') ? 'text-xs text-amber-400 font-extrabold' : 'text-base text-white'}`}>
                          {itemTotalDisplay}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${
                          isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
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

          {/* Fare Summary Box - Clean customer-facing view without price math or basefare/km breakdown */}
          <div className="bg-slate-950 text-white border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                    Booking Rate & Trip Terms
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
                        Hourly rental for {localHours} Hours. Direct dispatch with driver details in 5 minutes!
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
                ) : (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated All-Inclusive Fare</span>
                      <span className="text-lg font-black text-amber-400">
                        {fareBreakdown.totalFare > 0
                          ? `₹${fareBreakdown.totalFare.toLocaleString('en-IN')}`
                          : 'Enter Locations to Calculate'}
                      </span>
                    </div>
                    <div className="text-right text-[11px] text-slate-400 font-medium">
                      ✓ No Hidden Charges • Zero Advance Required
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {tripType === 'local' && (selectedVehicleId === 'suv' || selectedVehicleId === 'crysta') ? (
                <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2">
                  <a
                    href="tel:+919043743777"
                    data-conversion-intent="call"
                    className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base px-8 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Phone className="w-5 h-5 fill-slate-950" />
                    <span>Call 9043743777 for Best Price</span>
                  </a>
                  <a
                    href={`https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20please%20quote%20hourly%20rental%20tariff%20for%20${encodeURIComponent(selectedVehicleId === 'suv' ? '6-Seater Family SUV' : 'Premium Innova Crysta')}%20for%20${localHours}%20Hours%20in%20Coimbatore.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-conversion-intent="whatsapp"
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

                  <a
                    href={`https://wa.me/919043743777?text=${encodeURIComponent(
                      `Hi Get Taxi Kovai, I want to book a cab in Coimbatore. Route: ${pickupAddress || 'Coimbatore'} to ${dropAddress || 'Destination'} (${selectedVehicle.name}). ` +
                      (fareBreakdown.totalFare > 0 ? `Estimated Fare: ₹${fareBreakdown.totalFare}. ` : '') +
                      `Please confirm driver & cab details!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-conversion-intent="whatsapp"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Book Instantly via WhatsApp</span>
                  </a>

                  <p className="text-[11px] text-center text-slate-400">
                    ⚡ Zero advance required • Pay after ride (Cash/UPI)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Key Value Props Bar with explicit trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs text-slate-300 font-semibold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero Advance Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pay After Ride (Cash/UPI)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Free Cancellation Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Fast 10-Min Doorstep Pickup*</span>
            </div>
          </div>
        </div>

        {/* Local Landing Area Chips for Popular Hubs */}
        <div className="mt-8 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Popular Coimbatore Pickup Hubs & Drop Points:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { label: 'Gandhipuram Bus Stand', address: 'Gandhipuram Central Bus Stand, Coimbatore' },
              { label: 'CJB Airport', address: 'Coimbatore International Airport (CJB), Peelamedu' },
              { label: 'Coimbatore Jn Railway Station', address: 'Coimbatore Junction Railway Station (CBE)' },
              { label: 'RS Puram', address: 'RS Puram, DB Road, Coimbatore' },
              { label: 'Peelamedu', address: 'Peelamedu, Avinashi Road, Coimbatore' },
              { label: 'Saravanampatti', address: 'Saravanampatti IT Corridor, Coimbatore' },
            ].map((hub) => (
              <button
                key={hub.label}
                type="button"
                onClick={() => {
                  if (!pickupAddress) {
                    setPickupAddress(hub.address);
                  } else {
                    setDropAddress(hub.address);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-amber-400 hover:text-slate-950 text-slate-300 border border-slate-700/80 hover:border-amber-400 text-xs font-semibold transition-all duration-200 shadow-sm cursor-pointer group"
              >
                <MapPin className="w-3 h-3 text-amber-400 group-hover:text-slate-950 transition" />
                <span>{hub.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
