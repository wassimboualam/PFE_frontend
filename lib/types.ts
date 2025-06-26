export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Parking {
  id: string;
  name: string;
  city: string;
  address: string;
  totalSpots: number;
  availableSpots: number;
  price: number;
  pricePerHour?: number;
  pricePerDay?: number;
}

export interface TariffType {
  id: string;
  name: string;
  description: string;
}

export interface ParkingSession {
  id: string;
  userId: string;
  parkingId: string;
  tariffTypeId: string;
  units: number;
  date: string;
  amount: number;
}

export interface Expense {
  id: string;
  parkingId: string;
  parkingName: string;
  city: string;
  pricePerUnit: number;
  units: number;
  totalAmount: number;
  date: string;
}