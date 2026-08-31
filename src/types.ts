export type TripType = 'one-way' | 'round-trip' | 'local-ride' | 'local' | 'airport' | 'tour';

export interface LocationOption {
  id: string;
  name: string;
  category: 'coimbatore' | 'outstation' | 'tourist' | 'airport';
  distanceFromCbeKm: number; // Distance in km from Coimbatore city center
  estimatedHours: number;
}

export interface VehicleCategory {
  id: string;
  name: string;
  subTitle: string;
  models: string;
  passengers: number;
  luggage: number;
  ac: boolean;
  ratePerKmOneWay: number;
  ratePerKmRoundTrip: number;
  minKmOneWay: number;
  minKmRoundTripPerDay: number;
  driverBataPerDay: number;
  nightCharges: number;
  image: string;
  fallbackImage?: string;
  popularFor: string;
  localPackageRates: {
    fourHours40Km: number;
    eightHours80Km: number;
    twelveHours120Km: number;
    extraKmRate: number;
    extraHourRate: number;
  };
}

export interface TourPackage {
  id: string;
  title: string;
  subtitle: string;
  category: 'hill-station' | 'pilgrimage' | 'wildlife' | 'heritage' | 'weekend';
  durationDays: number;
  durationNights: number;
  startingPrice: number;
  recommendedVehicle: string;
  coverImage: string;
  fallbackImage?: string;
  pickupLocation: string;
  destinationsCovered: string[];
  keyHighlights: string[];
  itinerary: {
    day: number;
    title: string;
    activities: string[];
  }[];
  vehiclePrices: {
    vehicleId: string;
    vehicleName: string;
    totalPrice: number;
  }[];
  inclusions: string[];
  exclusions: string[];
}

export interface BookingDetails {
  id: string;
  tripType: TripType;
  pickupLocation: string;
  dropLocation: string;
  distanceKm: number;
  vehicleId: string;
  vehicleName: string;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  pickupAddress: string;
  specialNotes?: string;
  baseFare: number;
  driverBata: number;
  estimatedTolls: number;
  totalFare: number;
  status: 'confirmed' | 'pending' | 'completed';
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  tripTitle: string;
  comment: string;
  date: string;
  verified: boolean;
}
