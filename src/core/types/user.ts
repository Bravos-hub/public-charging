/**
 * User-related TypeScript types
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language?: 'en' | 'fr' | 'sw';
  units?: 'metric' | 'imperial';
  notifications?: NotificationPreferences;
}

export interface NotificationPreferences {
  bookingReminders?: boolean;
  chargingComplete?: boolean;
  promotions?: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  make?: string;
  model?: string;
  year?: number;
  batteryCapacity?: number; // kWh
  connectorType?: string;
  maxChargingPower?: number; // kW
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

