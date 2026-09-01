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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isGmapsLoaded, setIsGmapsLoaded] = useState<boolean>(false);
  const [isOlaMapsActive, setIsOlaMapsActive] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const debounceTimerRef = useRef<any>(null);

  const olaApiKey =
    (import.meta as any).env?.VITE_OLA_MAPS_API_KEY ||
    'oEXDV2OnmdjglIpk594yrqdC7WGGrNPsxUqrwYvG';

  // Sync internal state with external value
  useEffect(() => {
    setInputVal(value);
  }, [value]);

  // Check Ola Maps API Key
  useEffect(() => {
    if (olaApiKey) {
      setIsOlaMapsActive(true);
    }
  }, [olaApiKey]);

  // Load Google Maps API script if VITE_GOOGLE_MAPS_API_KEY is available
  useEffect(() => {
    const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;

    if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
      setIsGmapsLoaded(true);
      return;
    }

    if (!apiKey) return;

    const existingScript = document.getElementById('google-maps-places-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-maps-places-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGmapsLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener('load', () => setIsGmapsLoaded(true));
    }
  }, []);

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

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          const formatted = place.formatted_address || place.name || '';
          if (formatted) {
            setInputVal(formatted);
            onChange(formatted);
            setShowSuggestions(false);
          }
        });
      } catch (err) {
        console.warn('Google Places Autocomplete init warning:', err);
      }
    }
  }, [isGmapsLoaded, mode]);

  // Fetch Ola Maps Autocomplete suggestions
  const fetchOlaMapsSuggestions = async (query: string) => {
    if (!olaApiKey || !query.trim()) return;
    try {
      const response = await fetch(
        `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(query)}&api_key=${olaApiKey}`
      );
      if (response.ok) {
        const data = await response.json();
        const predictions = data?.predictions || data?.features || [];
        const results = predictions.map((p: any) => p.description || p.structured_formatting?.main_text || p.properties?.label).filter(Boolean);
        if (results.length > 0) {
          setSuggestions(results);
          setShowSuggestions(true);
        }
      }
    } catch (err) {
      console.warn('Ola Maps Autocomplete fetch warning:', err);
    }
  };

  // Handle input change with Ola Maps / Google Maps / Fallback local search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputVal(text);
    onChange(text);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (text.trim().length > 1) {
      if (olaApiKey) {
        debounceTimerRef.current = setTimeout(() => {
          fetchOlaMapsSuggestions(text);
        }, 250);
      } else if (!isGmapsLoaded) {
        const filtered = DETAILED_KOVAI_AREAS.filter((loc) =>
          loc.toLowerCase().includes(text.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (loc: string) => {
    setInputVal(loc);
    onChange(loc);
    setShowSuggestions(false);
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
            setShowSuggestions(false);
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
              <span>Type Custom Address</span>
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
        /* Autocomplete / Freeform Type Any Address Mode */
        <div className="relative">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={handleInputChange}
              onFocus={() => {
                // Do not preload locations on empty focus
              }}
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
                  setShowSuggestions(false);
                }}
                className="absolute right-2.5 text-slate-400 hover:text-slate-900 text-xs font-bold bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions Popup */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-60 overflow-y-auto divide-y divide-slate-100">
              <div className="p-2.5 bg-slate-50 text-[10px] font-black text-slate-700 flex items-center justify-between uppercase tracking-wider">
                <span>{isOlaMapsActive ? 'OLA MAPS SUGGESTIONS:' : 'SUGGESTED LOCATIONS:'}</span>
                <span className="text-slate-400 font-medium normal-case">Type custom address anytime</span>
              </div>
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(item)}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-slate-800 hover:bg-amber-50/80 hover:text-slate-950 flex items-center justify-between transition cursor-pointer font-medium"
                >
                  <span className="flex items-center gap-2 truncate">
                    <Navigation className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{item}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold shrink-0">Select</span>
                </button>
              ))}
            </div>
          )}

          {/* Indicator notice */}
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 px-0.5">
            <span>✨ Type any custom doorstep, street, or hotel</span>
            {isOlaMapsActive ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Ola Maps Live
              </span>
            ) : isGmapsLoaded ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Google Maps Live
              </span>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
