/**
 * Booking-related TypeScript types
 */

export type BookingMode = 'fixed' | 'mobile';

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'expired';

export interface Booking {
  id: string;
  stationId?: string;
  stationName?: string; // Display name for the station
  stationAddress?: string; // Full address for display
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  startTime: Date | string;
  endTime?: Date | string;
  connectorType: string;
  status: BookingStatus;
  mode: BookingMode;
  vehicleId?: string;
  vehicleName?: string; // Display name for the vehicle
  energyTarget?: number; // kWh
  cost?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface BookingDraft {
  stationId?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  startTime?: Date | string;
  connectorType?: string;
  mode?: BookingMode;
  vehicleId?: string;
  energyTarget?: number;
}

