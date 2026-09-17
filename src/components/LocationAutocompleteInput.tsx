import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Sparkles, Navigation, List, Edit3 } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../data/locations';

// Expanded list of Kovai & Tamil Nadu areas for rich built-in autocomplete suggestions
const DETAILED_KOVAI_AREAS = [
  'Gandhipuram, Coimbatore',
  'Coimbatore International Airport (CJB)',
  'Coimbatore Junction Railway Station',
  'Peelamedu / TIDEL Park, Coimbatore',
  'Saravanampatti / IT Corridor, Coimbatore',
  'RS Puram, Coimbatore',
  'Singanallur Bus Stand, Coimbatore',
  'Ukkadam Bus Stand, Coimbatore',
  'Thudiyalur, Coimbatore',
  'Vadavalli, Coimbatore',
  'Kovaipudur, Coimbatore',
  'Sulur, Coimbatore',
  'Podanur Junction, Coimbatore',
  'Eachanari Temple, Coimbatore',
  'Kuniyamuthur, Coimbatore',
  'Saibaba Colony, Coimbatore',
  'Ramanathapuram, Coimbatore',
  'Race Course, Coimbatore',
  'Ganapathy, Coimbatore',
  'Kurumbapalayam / SNS College',
  'Kovilpalayam / Sathy Road',
  'Perur Pateeswarar Temple',
  'Marudhamalai Murugan Temple',
  'Isha Yoga Center (Adiyogi 112ft)',
  'Ooty (Udhagamandalam) Bus Stand',
  'Coonoor Hill Station',
  'Kotagiri Hill Station',
  'Kodaikanal Lake',
  'Valparai Tea Estates',
  'Mettupalayam Railway Station',
  'Annur Town',
  'Anaikatti Eco Valley',
  'Pollachi Coconut Junction',
  'Tiruppur Railway Station / Texvalley',
  'Erode Central Bus Stand',
  'Salem Junction',
  'Palani Hill Temple',
  'Madurai Junction',
  'Bangalore (Bengaluru)',
  'Chennai Central',
];

interface LocationAutocompleteInputProps {
  label: string;
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
  isPickup?: boolean;
}

export const LocationAutocompleteInput: React.FC<LocationAutocompleteInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Type address or pick from list...',
  isPickup = true,
}) => {
  const [mode, setMode] = useState<'autocomplete' | 'dropdown'>('autocomplete');
  const [inputVal, setInputVal] = useState<string>(value);
  const [isGmapsLoaded, setIsGmapsLoaded] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  const googleApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  // Sync internal state with external value
  useEffect(() => {
    setInputVal(value);
  }, [value]);

  // Load Google Maps API script if VITE_GOOGLE_MAPS_API_KEY is available
  useEffect(() => {
    if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
      setIsGmapsLoaded(true);
      return;
    }

    if (!googleApiKey) return;

    const existingScript = document.getElementById('google-maps-places-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-maps-places-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGmapsLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener('load', () => setIsGmapsLoaded(true));
      if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
        setIsGmapsLoaded(true);
      }
    }
  }, [googleApiKey]);

  // Initialize Google Places Autocomplete on input element when script is loaded
  useEffect(() => {
    if (
      isGmapsLoaded &&
      inputRef.current &&
      (window as any).google &&
      (window as any).google.maps &&
      (window as any).google.maps.places
    ) {
      try {
        autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(
          inputRef.current,
          {
            componentRestrictions: { country: 'in' },
            fields: ['formatted_address', 'name', 'geometry'],
          }
        );

        const placeListener = autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          const formatted = place.formatted_address || place.name || '';
          if (formatted) {
            setInputVal(formatted);
            onChange(formatted);
          }
        });

        return () => {
          if ((window as any).google?.maps?.event?.removeListener) {
            (window as any).google.maps.event.removeListener(placeListener);
          }
        };
      } catch (err) {
        console.warn('Google Places Autocomplete init warning:', err);
      }
    }
  }, [isGmapsLoaded, mode]);

  // Handle manual input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputVal(text);
    onChange(text);
  };

  return (
    <div className="space-y-1.5 relative">
      {/* Header Label + Toggle Mode */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-black text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
          <MapPin className={`w-4 h-4 ${isPickup ? 'text-amber-400' : 'text-emerald-400'}`} />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'autocomplete' ? 'dropdown' : 'autocomplete');
          }}
          className="text-[11px] font-extrabold text-amber-300 hover:text-white flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1 rounded-lg transition cursor-pointer shadow-sm"
        >
          {mode === 'autocomplete' ? (
            <>
              <List className="w-3.5 h-3.5 text-amber-400" />
              <span>Select from List</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Places Search</span>
            </>
          )}
        </button>
      </div>

      {mode === 'dropdown' ? (
        /* Dropdown Mode */
        <select
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setInputVal(e.target.value);
          }}
          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
        >
          <option value="">-- Select {label} --</option>
          {isPickup ? (
            POPULAR_LOCATIONS.filter((l) => l.category === 'coimbatore' || l.category === 'airport').map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name}
              </option>
            ))
          ) : (
            <>
              <optgroup label="Popular Tourist Hill Stations & Temples">
                {POPULAR_LOCATIONS.filter((l) => l.category === 'tourist').map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name} ({loc.distanceFromCbeKm} km)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Major Outstation Cities & Hubs">
                {POPULAR_LOCATIONS.filter((l) => l.category === 'outstation').map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name} ({loc.distanceFromCbeKm} km)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Coimbatore City Local Drop">
                {POPULAR_LOCATIONS.filter((l) => l.category === 'coimbatore' || l.category === 'airport').map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </optgroup>
            </>
          )}
        </select>
      ) : (
        /* Autocomplete with Google Maps Places Mode */
        <div className="relative">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-8 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />

            {inputVal && (
              <button
                type="button"
                onClick={() => {
                  setInputVal('');
                  onChange('');
                }}
                className="absolute right-2.5 text-slate-400 hover:text-slate-900 text-xs font-bold bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Indicator notice */}
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 px-0.5">
            <span>✨ Type any doorstep, street, hotel, or city</span>
            {isGmapsLoaded ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Google Places Autocomplete Active
              </span>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
