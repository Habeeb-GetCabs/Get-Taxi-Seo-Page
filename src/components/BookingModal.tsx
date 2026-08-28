import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { TripType, VehicleCategory, BookingDetails } from '../types';
import { X, CheckCircle2, MessageSquare, Phone, Printer, Calendar, Clock, MapPin, User, Car, Sparkles, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
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
  } | null;
  onSaveBooking: (newBooking: BookingDetails) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  bookingData,
  onSaveBooking,
}) => {
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupDate, setPickupDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState('07:00');
  const [specialNotes, setSpecialNotes] = useState('');

  const [confirmedBooking, setConfirmedBooking] = useState<BookingDetails | null>(null);

  if (!isOpen || !bookingData) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passengerName || !passengerPhone || !pickupAddress) {
      alert('Please fill in your name, mobile phone number, and pickup address.');
      return;
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `GTK-${randomNum}`;

    const newBooking: BookingDetails = {
      id: bookingId,
      tripType: bookingData.tripType,
      pickupLocation: bookingData.pickupLocation,
      dropLocation: bookingData.dropLocation,
      distanceKm: bookingData.distanceKm,
      vehicleId: bookingData.vehicle.id,
      vehicleName: bookingData.vehicle.name,
      pickupDate,
      pickupTime,
      passengerName,
      passengerPhone,
      passengerEmail,
      pickupAddress,
      specialNotes,
      baseFare: bookingData.baseFare,
      driverBata: bookingData.driverBata,
      estimatedTolls: bookingData.estimatedTolls,
      totalFare: bookingData.totalFare,
      status: 'confirmed',
      createdAt: new Date().toLocaleString(),
    };

    onSaveBooking(newBooking);
    setConfirmedBooking(newBooking);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
  };

  const generateWhatsAppMessage = (b: BookingDetails) => {
    const text = `*NEW TAXI BOOKING REQUEST - GET TAXI KOVAI* 🚖\n\n` +
      `*Booking Ref:* ${b.id}\n` +
      `*Name:* ${b.passengerName}\n` +
      `*Phone:* ${b.passengerPhone}\n` +
      `*Trip Type:* ${b.tripType.toUpperCase()}\n` +
      `*Route:* ${b.pickupLocation} ➔ ${b.dropLocation}\n` +
      `*Distance:* ${b.distanceKm} KM\n` +
      `*Vehicle:* ${b.vehicleName}\n` +
      `*Pickup Date & Time:* ${b.pickupDate} at ${b.pickupTime}\n` +
      `*Pickup Address:* ${b.pickupAddress}\n` +
      `*Est Total Fare:* ₹${b.totalFare.toLocaleString('en-IN')}\n\n` +
      `Please confirm my driver & cab dispatch details!`;

    return `https://wa.me/919043743777?text=${encodeURIComponent(text)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleModalClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 text-white">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-slate-950 font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                {confirmedBooking ? 'Booking Confirmed!' : 'Complete Your Cab Booking'}
              </h3>
              <p className="text-xs text-slate-400">
                {confirmedBooking ? `Booking Reference: ${confirmedBooking.id}` : 'Fast 1-minute doorstep dispatch'}
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        {confirmedBooking ? (
          /* Confirmation State View */
          <div className="p-6 space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-300 text-sm">Cab Booking Reserved Successfully!</h4>
                <p className="text-xs text-emerald-200/80 mt-1">
                  Your reference ID is <span className="font-mono font-bold">{confirmedBooking.id}</span>. Our Coimbatore 24/7 dispatch desk will call or SMS your vehicle details 30 minutes before departure.
                </p>
              </div>
            </div>

            {/* Trip Details Summary Ticket */}
            <div id="printable-receipt" className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-400">COVAI CALL TAXI TRIP TICKET</span>
                <span className="text-xs font-mono text-slate-400">{confirmedBooking.createdAt}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Passenger Name</span>
                  <span className="font-bold text-white">{confirmedBooking.passengerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Phone Number</span>
                  <span className="font-bold text-white">{confirmedBooking.passengerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Pickup Date & Time</span>
                  <span className="font-bold text-white">{confirmedBooking.pickupDate} at {confirmedBooking.pickupTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Vehicle Reserved</span>
                  <span className="font-bold text-amber-300">{confirmedBooking.vehicleName}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 block text-[10px]">Route</span>
                <span className="font-bold text-white">
                  {confirmedBooking.pickupLocation} ➔ {confirmedBooking.dropLocation} ({confirmedBooking.distanceKm} KM)
                </span>
                <span className="text-slate-400 block text-[10px] mt-1">Pickup Address</span>
                <span className="text-slate-200">{confirmedBooking.pickupAddress}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-300">Estimated Total Fare</span>
                <span className="font-extrabold text-amber-400 text-lg">
                  ₹{confirmedBooking.totalFare.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <a
                href={generateWhatsAppMessage(confirmedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Confirm Instantly via WhatsApp</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print Ticket</span>
                </button>
                <a
                  href="tel:+919842212345"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call +91 98422 12345</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Form Input View */
          <form onSubmit={handleConfirm} className="p-6 space-y-5">
            {/* Selected Trip Overview Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-wrap justify-between items-center gap-2 text-xs">
              <div>
                <span className="text-slate-400 block">Selected Route</span>
                <span className="font-bold text-amber-400 text-sm">
                  {bookingData.pickupLocation} ➔ {bookingData.dropLocation}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-400 block">Cab Category</span>
                  <span className="font-bold text-white">{bookingData.vehicle.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Total Fare</span>
                  <span className="font-extrabold text-amber-400 text-base">
                    ₹{bookingData.totalFare.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Inputs Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Passenger & Pickup Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senthil Kumar"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Mobile Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 98422 12345"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Pickup Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Pickup Time *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="time"
                      required
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Doorstep Pickup Address in Coimbatore *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <textarea
                    required
                    rows={2}
                    placeholder="Door No, Street Name, Landmark (e.g. Near PSG Tech, Peelamedu)"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Special Instructions / Flight Details (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flight 6E-241 arrival at 10:15 AM, extra luggage roof carrier"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-base shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                Confirm Cab Booking Now
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                🔒 No cancellation fees. Pay cash or UPI directly to driver after ride.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
