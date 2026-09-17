import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { TripType, VehicleCategory, BookingDetails } from '../types';
import { X, CheckCircle2, MessageSquare, Phone, Printer, Calendar, Clock, MapPin, User, Car, ShieldCheck, AlertCircle } from 'lucide-react';

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

  // Inline validation state (replaces native browser alert)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [confirmedBooking, setConfirmedBooking] = useState<BookingDetails | null>(null);

  if (!isOpen || !bookingData) return null;

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!passengerName.trim()) {
      errors.passengerName = 'Full Name is required.';
    } else if (passengerName.trim().length < 2) {
      errors.passengerName = 'Name must be at least 2 characters.';
    }

    const cleanPhone = passengerPhone.replace(/\D/g, '');
    if (!passengerPhone.trim()) {
      errors.passengerPhone = 'Mobile phone number is required.';
    } else if (cleanPhone.length < 10) {
      errors.passengerPhone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!pickupAddress.trim()) {
      errors.pickupAddress = 'Doorstep pickup address is required.';
    } else if (pickupAddress.trim().length < 5) {
      errors.pickupAddress = 'Please provide detailed pickup landmark or address.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const bookingId = `GTK-${randomNum}`;

    const newBooking: BookingDetails = {
      id: bookingId,
      tripType: bookingData.tripType,
      pickupLocation: bookingData.pickupLocation || 'Coimbatore',
      dropLocation: bookingData.dropLocation || 'As Requested',
      distanceKm: bookingData.distanceKm,
      vehicleId: bookingData.vehicle.id,
      vehicleName: bookingData.vehicle.name,
      pickupDate,
      pickupTime,
      passengerName: passengerName.trim(),
      passengerPhone: passengerPhone.trim(),
      passengerEmail: passengerEmail.trim(),
      pickupAddress: pickupAddress.trim(),
      specialNotes: specialNotes.trim(),
      baseFare: bookingData.baseFare,
      driverBata: bookingData.driverBata,
      estimatedTolls: bookingData.estimatedTolls,
      totalFare: bookingData.totalFare,
      status: 'confirmed',
      createdAt: new Date().toLocaleString(),
    };

    onSaveBooking(newBooking);
    setConfirmedBooking(newBooking);
    setFormErrors({});

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
      `*Vehicle:* ${b.vehicleName}\n` +
      `*Pickup Date & Time:* ${b.pickupDate} at ${b.pickupTime}\n` +
      `*Pickup Address:* ${b.pickupAddress}\n` +
      (b.totalFare > 0 ? `*Total Fare Quote:* ₹${b.totalFare.toLocaleString('en-IN')}\n\n` : `*Fare Quote:* Best Rate on Confirmation\n\n`) +
      `*Terms:* Zero Advance • Pay Cash/UPI After Ride • Fast 10-Min Doorstep Pickup\n\n` +
      `Please confirm driver & vehicle registration details!`;

    return `https://wa.me/919043743777?text=${encodeURIComponent(text)}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleModalClose = () => {
    setConfirmedBooking(null);
    setFormErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 text-slate-900">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-sm">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-950">
                {confirmedBooking ? 'Booking Confirmed!' : 'Complete Your Cab Booking'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {confirmedBooking ? `Booking Reference: ${confirmedBooking.id}` : 'Fast 1-minute doorstep dispatch in Coimbatore'}
              </p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="text-slate-400 hover:text-slate-950 p-1.5 rounded-lg hover:bg-slate-200 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        {confirmedBooking ? (
          /* Confirmation State View */
          <div className="p-6 space-y-6">
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-900 text-sm">Cab Booking Reserved Successfully!</h4>
                <p className="text-xs text-emerald-800 mt-1 font-medium leading-relaxed">
                  Your reference ID is <span className="font-mono font-bold text-slate-950 bg-emerald-100 px-1.5 py-0.5 rounded">{confirmedBooking.id}</span>. Our Coimbatore dispatch team (+91 9043743777) will send your chauffeur contact and vehicle number.
                </p>
              </div>
            </div>

            {/* Micro-Trust Badges */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center text-[11px] font-bold text-slate-700">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Advance</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pay After Ride</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Free Cancellation</span>
              </div>
            </div>

            {/* Trip Details Summary Ticket */}
            <div id="printable-receipt" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-xs font-black text-amber-800 uppercase tracking-wider">GET TAXI KOVAI TRIP TICKET</span>
                <span className="text-xs font-mono text-slate-500">{confirmedBooking.createdAt}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Passenger Name</span>
                  <span className="font-black text-slate-950">{confirmedBooking.passengerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone Number</span>
                  <span className="font-black text-slate-950">{confirmedBooking.passengerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Pickup Date & Time</span>
                  <span className="font-black text-slate-950">{confirmedBooking.pickupDate} at {confirmedBooking.pickupTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Vehicle Reserved</span>
                  <span className="font-black text-amber-700">{confirmedBooking.vehicleName}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Route</span>
                <span className="font-black text-slate-950">
                  {confirmedBooking.pickupLocation} ➔ {confirmedBooking.dropLocation}
                </span>
                <span className="text-slate-500 block text-[10px] uppercase font-bold mt-2">Pickup Address</span>
                <span className="text-slate-800 font-medium">{confirmedBooking.pickupAddress}</span>
              </div>

              {confirmedBooking.totalFare > 0 && (
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-700">Estimated Total Fare</span>
                  <span className="font-black text-slate-950 text-xl">
                    ₹{confirmedBooking.totalFare.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <a
                href={generateWhatsAppMessage(confirmedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                data-conversion-intent="whatsapp"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md cursor-pointer text-sm"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Confirm Instantly via WhatsApp</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-200"
                >
                  <Printer className="w-4 h-4 text-amber-600" />
                  <span>Print Ticket</span>
                </button>
                <a
                  href="tel:+919043743777"
                  data-conversion-intent="call"
                  className="bg-slate-950 hover:bg-slate-900 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call +91 9043743777</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Form Input View */
          <form onSubmit={handleConfirm} noValidate className="p-6 sm:p-8 space-y-5">
            {/* Inline validation error summary if form submitted with errors */}
            {Object.keys(formErrors).length > 0 && (
              <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-start gap-3 text-rose-900">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wide">Please complete all required fields</h5>
                  <ul className="text-xs list-disc pl-4 mt-1 space-y-0.5 text-rose-800">
                    {Object.values(formErrors).map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Selected Trip Overview Card */}
            <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-2 text-xs">
              <div>
                <span className="text-slate-600 block font-medium">Selected Route</span>
                <span className="font-black text-slate-950 text-sm">
                  {bookingData.pickupLocation || 'Coimbatore'} ➔ {bookingData.dropLocation || 'Destination'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-600 block font-medium">Cab Category</span>
                  <span className="font-black text-slate-950">{bookingData.vehicle.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-600 block font-medium">Total Fare</span>
                  <span className="font-black text-slate-950 text-base">
                    {bookingData.totalFare > 0
                      ? `₹${bookingData.totalFare.toLocaleString('en-IN')}`
                      : 'Best Price on Call'}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Inputs Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Passenger & Pickup Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-900">
                      Your Full Name <span className="text-rose-600">*</span>
                    </label>
                    {formErrors.passengerName && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        {formErrors.passengerName}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Senthil Kumar"
                      value={passengerName}
                      onChange={(e) => {
                        setPassengerName(e.target.value);
                        if (formErrors.passengerName) {
                          setFormErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.passengerName;
                            return updated;
                          });
                        }
                      }}
                      className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none transition ${
                        formErrors.passengerName
                          ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                          : 'border-slate-300 focus:border-amber-400 focus:bg-white'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-900">
                      Mobile Phone Number <span className="text-rose-600">*</span>
                    </label>
                    {formErrors.passengerPhone && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        {formErrors.passengerPhone}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="e.g. 9043743777"
                      value={passengerPhone}
                      onChange={(e) => {
                        setPassengerPhone(e.target.value);
                        if (formErrors.passengerPhone) {
                          setFormErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.passengerPhone;
                            return updated;
                          });
                        }
                      }}
                      className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none transition ${
                        formErrors.passengerPhone
                          ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                          : 'border-slate-300 focus:border-amber-400 focus:bg-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">
                    Pickup Date <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">
                    Pickup Time <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="time"
                      required
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-900">
                    Full Doorstep Pickup Address in Coimbatore <span className="text-rose-600">*</span>
                  </label>
                  {formErrors.pickupAddress && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      {formErrors.pickupAddress}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    placeholder="Door No, Street Name, Landmark (e.g. Near PSG Tech, Peelamedu)"
                    value={pickupAddress}
                    onChange={(e) => {
                      setPickupAddress(e.target.value);
                      if (formErrors.pickupAddress) {
                        setFormErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.pickupAddress;
                          return updated;
                        });
                      }
                    }}
                    className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none transition ${
                      formErrors.pickupAddress
                        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                        : 'border-slate-300 focus:border-amber-400 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Special Instructions / Flight Details (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flight 6E-241 arrival at 10:15 AM, luggage carrier needed"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Micro-Trust Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-semibold">
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" /> Zero Advance Required
              </span>
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" /> Pay After Ride (Cash/UPI)
              </span>
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" /> Free Cancellation Anytime
              </span>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md transition cursor-pointer border border-amber-500 uppercase tracking-wider"
              >
                Confirm Cab Booking Now
              </button>
              <p className="text-[11px] text-center text-slate-500 font-medium mt-2">
                🔒 Transparent pricing. *Prompt 10-min doorstep pickup within Coimbatore Corporation limits.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
