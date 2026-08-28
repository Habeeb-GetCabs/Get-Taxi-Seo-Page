import React, { useState } from 'react';
import { BookingDetails } from '../types';
import { X, Search, Car, Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Phone, Printer } from 'lucide-react';

interface TrackBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedBookings: BookingDetails[];
}

export const TrackBookingModal: React.FC<TrackBookingModalProps> = ({
  isOpen,
  onClose,
  savedBookings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedResult, setSearchedResult] = useState<BookingDetails | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const query = searchQuery.trim().toLowerCase();

    const found = savedBookings.find(
      (b) =>
        b.id.toLowerCase() === query ||
        b.passengerPhone.toLowerCase().includes(query) ||
        b.passengerName.toLowerCase().includes(query)
    );

    setSearchedResult(found || null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-lg text-white">Track Your Cab Booking Status</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Enter Ref ID (e.g. GTK-90437) or Mobile No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Recent Bookings Quick List if not searched */}
          {!hasSearched && savedBookings.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-amber-400 block uppercase tracking-wider">
                Your Recent Local Sessions ({savedBookings.length})
              </span>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {savedBookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSearchedResult(b);
                      setHasSearched(true);
                    }}
                    className="bg-slate-950 border border-slate-800 hover:border-amber-400/50 rounded-xl p-3 cursor-pointer transition flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-amber-300 block">{b.id}</span>
                      <span className="text-white font-medium">
                        {b.pickupLocation} ➔ {b.dropLocation}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-amber-400 block">₹{b.totalFare.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-slate-400">{b.pickupDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Result Display */}
          {hasSearched && (
            <div>
              {searchedResult ? (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Booking Reference</span>
                      <span className="font-mono font-extrabold text-amber-400 text-base">
                        {searchedResult.id}
                      </span>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Passenger</span>
                      <span className="font-bold text-white">{searchedResult.passengerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Phone Number</span>
                      <span className="font-bold text-white">{searchedResult.passengerPhone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Pickup Schedule</span>
                      <span className="font-bold text-white">
                        {searchedResult.pickupDate} @ {searchedResult.pickupTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Vehicle Reserved</span>
                      <span className="font-bold text-amber-300">{searchedResult.vehicleName}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400 block text-[10px]">Pickup Address</span>
                    <span className="text-slate-200">{searchedResult.pickupAddress}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Estimated Total</span>
                      <span className="text-lg font-extrabold text-amber-400">
                        ₹{searchedResult.totalFare.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <a
                      href={`tel:+919842212345`}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Dispatch Desk
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="font-semibold text-white">No booking record found for "{searchQuery}".</p>
                  <p>Please check your booking reference code or call our 24/7 hotline +91 98422 12345 for immediate dispatch assistance.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
