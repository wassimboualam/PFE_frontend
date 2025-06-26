import { User, Parking, TariffType, Expense } from './types';

export const mockUsers: User[] = [
  { id: '1', name: 'Jean Dupont', email: 'jean@example.com', role: 'utilisateur' },
  { id: '2', name: 'Marie Martin', email: 'marie@example.com', role: 'administrateur' },
  { id: '3', name: 'Pierre Durand', email: 'pierre@example.com', role: 'utilisateur' },
];

export const mockParkings: Parking[] = [
  { 
    id: '1', 
    name: 'Parking Central', 
    city: 'Paris', 
    address: '15 Rue de Rivoli', 
    totalSpots: 150, 
    availableSpots: 42, 
    price: 3.50,
    pricePerHour: 3.50,
    pricePerDay: 25.00
  },
  { 
    id: '2', 
    name: 'Parking Gare', 
    city: 'Lyon', 
    address: '5 Place de la Gare', 
    totalSpots: 200, 
    availableSpots: 65, 
    price: 2.80,
    pricePerHour: 2.80,
    pricePerDay: 20.00
  },
  { 
    id: '3', 
    name: 'Parking Plage', 
    city: 'Nice', 
    address: '10 Boulevard des Vagues', 
    totalSpots: 100, 
    availableSpots: 12, 
    price: 4.00,
    pricePerHour: 4.00,
    pricePerDay: 30.00
  },
  { 
    id: '4', 
    name: 'Parking Centre', 
    city: 'Marseille', 
    address: '22 Rue de la République', 
    totalSpots: 180, 
    availableSpots: 33, 
    price: 3.20,
    pricePerHour: 3.20,
    pricePerDay: 22.00
  },
  { 
    id: '5', 
    name: 'Parking du Marché', 
    city: 'Bordeaux', 
    address: '8 Place du Marché', 
    totalSpots: 90, 
    availableSpots: 25, 
    price: 2.50,
    pricePerHour: 2.50,
    pricePerDay: 18.00
  },
];

export const mockTariffTypes: TariffType[] = [
  { id: '1', name: 'Horaire', description: 'Tarif à l\'heure' },
  { id: '2', name: 'Journalier', description: 'Tarif à la journée' },
  { id: '3', name: 'Forfait soirée', description: 'Tarif forfaitaire pour la soirée (18h-8h)' },
];

export const mockExpenses: Expense[] = [
  { 
    id: '1', 
    parkingId: '1', 
    parkingName: 'Parking Central', 
    city: 'Paris', 
    pricePerUnit: 3.50, 
    units: 4, 
    totalAmount: 14.00, 
    date: '2025-03-15' 
  },
  { 
    id: '2', 
    parkingId: '2', 
    parkingName: 'Parking Gare', 
    city: 'Lyon', 
    pricePerUnit: 2.80, 
    units: 2, 
    totalAmount: 5.60, 
    date: '2025-03-16' 
  },
  { 
    id: '3', 
    parkingId: '3', 
    parkingName: 'Parking Plage', 
    city: 'Nice', 
    pricePerUnit: 4.00, 
    units: 5, 
    totalAmount: 20.00, 
    date: '2025-03-17' 
  },
  { 
    id: '4', 
    parkingId: '1', 
    parkingName: 'Parking Central', 
    city: 'Paris', 
    pricePerUnit: 3.50, 
    units: 3, 
    totalAmount: 10.50, 
    date: '2025-03-18' 
  },
  { 
    id: '5', 
    parkingId: '4', 
    parkingName: 'Parking Centre', 
    city: 'Marseille', 
    pricePerUnit: 3.20, 
    units: 6, 
    totalAmount: 19.20, 
    date: '2025-03-19' 
  },
];

// Helper function to get expenses between two dates
export function getExpensesBetweenDates(startDate: string, endDate: string): Expense[] {
  return mockExpenses.filter(expense => {
    return expense.date >= startDate && expense.date <= endDate;
  });
}

// Helper function to get parkings by max price
export function getParkingsByMaxPrice(maxPrice: number): Parking[] {
  return mockParkings.filter(parking => parking.price <= maxPrice);
}

// Helper function to get parking sessions count by parking ID and date
export function getParkingSessionsCount(parkingId: string, date: string): number {
  // Simulating random count between 0 and 30
  return Math.floor(Math.random() * 31);
}