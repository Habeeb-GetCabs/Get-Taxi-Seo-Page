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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-600" />
            <h3 className="font-black text-lg text-slate-950">Track Your Cab Booking Status</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-950 p-1 rounded-lg hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Enter Ref ID (e.g. GTK-90437) or Mobile No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
            />
            <button
              type="submit"
              className="taxi-yellow-btn text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer border border-amber-400 font-syne uppercase tracking-wider shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Recent Bookings Quick List if not searched */}
          {!hasSearched && savedBookings.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-black text-slate-900 block uppercase tracking-wider">
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
                    className="bg-slate-50 border border-slate-200 hover:border-amber-400 rounded-2xl p-3.5 cursor-pointer transition flex justify-between items-center text-xs shadow-sm hover:shadow-md"
                  >
                    <div>
                      <span className="font-mono font-black text-slate-950 block">{b.id}</span>
                      <span className="text-slate-600 font-medium">
                        {b.pickupLocation} ➔ {b.dropLocation}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-950 block">₹{b.totalFare.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{b.pickupDate}</span>
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
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold block uppercase">Booking Reference</span>
                      <span className="font-mono font-black text-slate-950 text-base">
                        {searchedResult.id}
                      </span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Confirmed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Passenger</span>
                      <span className="font-black text-slate-950">{searchedResult.passengerName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone Number</span>
                      <span className="font-black text-slate-950">{searchedResult.passengerPhone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Pickup Schedule</span>
                      <span className="font-black text-slate-950">
                        {searchedResult.pickupDate} @ {searchedResult.pickupTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">Vehicle Reserved</span>
                      <span className="font-black text-amber-700">{searchedResult.vehicleName}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-xs">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Pickup Address</span>
                    <span className="text-slate-800 font-medium">{searchedResult.pickupAddress}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Estimated Total</span>
                      <span className="text-lg font-black text-slate-950">
                        ₹{searchedResult.totalFare.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <a
                      href={`tel:+919043743777`}
                      className="taxi-yellow-btn text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition border border-amber-400 font-syne uppercase tracking-wider shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5 fill-slate-950" /> Call Dispatch Desk
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-slate-600 text-xs space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="font-bold text-slate-950 text-sm">No booking record found for "{searchQuery}".</p>
                  <p>Please check your booking reference code or call our 24/7 hotline 9043743777 for immediate dispatch assistance.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
