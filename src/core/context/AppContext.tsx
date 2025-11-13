/**
 * AppContext & SDK Provider (TypeScript)
 * Provides a single source of truth for auth, filters, active vehicle, bookings, session, wallet
 */

import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { createSdk, type Sdk, type GetToken } from '../sdk/api';
import type {
  AuthState,
  Vehicle,
  BookingDraft,
  ChargingSession,
  Wallet,
  StationFilters,
  FavoriteStation,
} from '../types';

interface AppState {
  auth: AuthState;
  vehicle: {
    active: Vehicle | null;
    list: Vehicle[];
  };
  filters: StationFilters;
  bookingDraft: BookingDraft | null;
  mobileDraft: BookingDraft | null;
  session: {
    active: ChargingSession | null;
  };
  wallet: Wallet;
  favorites: FavoriteStation[];
  notifications: {
    enabled: boolean;
    booking: boolean;
    charging: boolean;
    payments: boolean;
    promotions: boolean;
    quietStart: string; // 'HH:MM'
    quietEnd: string;   // 'HH:MM'
  };
  reminderPrefs: {
    beforeStartMinutes: number[]; // multi-select e.g., [15,30]
    showCountdown: boolean;
    graceWarning: boolean;
    graceWarnMinutes: number; // 5 means 5 min before end
  };
}

interface AppContextValue extends AppState {
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  setVehicle: React.Dispatch<React.SetStateAction<{ active: Vehicle | null; list: Vehicle[] }>>;
  setFilters: React.Dispatch<React.SetStateAction<StationFilters>>;
  setBookingDraft: React.Dispatch<React.SetStateAction<BookingDraft | null>>;
  setMobileDraft: React.Dispatch<React.SetStateAction<BookingDraft | null>>;
  setSession: React.Dispatch<React.SetStateAction<{ active: ChargingSession | null }>>;
  setWallet: React.Dispatch<React.SetStateAction<Wallet>>;
  setFavorites: React.Dispatch<React.SetStateAction<FavoriteStation[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<AppState['notifications']>>;
  setReminderPrefs: React.Dispatch<React.SetStateAction<AppState['reminderPrefs']>>;
}

const AppCtx = createContext<AppContextValue | null>(null);
const SdkCtx = createContext<Sdk | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps): React.ReactElement {
  const [auth, setAuth] = useState<AuthState>({ user: null, token: null });
  const [vehicle, setVehicle] = useState<{ active: Vehicle | null; list: Vehicle[] }>({
    active: null,
    list: [],
  });
  const [filters, setFilters] = useState<StationFilters>({
    onlyAvail: true,
    fastOnly: false,
    minKw: 3,
    maxKw: 350,
    connectorTypes: ['CCS2', 'Type 2'],
  });
  const [bookingDraft, setBookingDraft] = useState<BookingDraft | null>(null);
  const [mobileDraft, setMobileDraft] = useState<BookingDraft | null>(null);
  const [session, setSession] = useState<{ active: ChargingSession | null }>({
    active: null,
  });
  const [wallet, setWallet] = useState<Wallet>({
    balance: 0,
    currency: 'UGX',
    methods: [],
  });
  const [favorites, setFavorites] = useState<FavoriteStation[]>([
    {
      id: 'KLA-CENTRAL-001',
      name: 'Central Hub — Downtown Mall',
      address: 'Plot 10 Main St, Kampala, UG',
      location: { lat: 0.3476, lng: 32.5825 },
      rating: 4.6,
      availability: { total: 4, available: 2 },
      connectors: [
        { type: 'CCS2', power: 60 },
        { type: 'Type2', power: 22 },
      ],
      distanceKm: 0.8,
    },
    {
      id: 'KLA-AIRPORT-B',
      name: 'Airport Park — Lot B',
      address: 'Airport Road, Kampala, UG',
      location: { lat: 0.0406, lng: 32.4435 },
      rating: 4.3,
      availability: { total: 3, available: 1 },
      connectors: [{ type: 'Type2', power: 22 }],
      distanceKm: 4.2,
    },
  ]);
  const [notifications, setNotifications] = useState<AppState['notifications']>({
    enabled: true,
    booking: true,
    charging: true,
    payments: true,
    promotions: false,
    quietStart: '22:00',
    quietEnd: '06:00',
  });
  const [reminderPrefs, setReminderPrefs] = useState<AppState['reminderPrefs']>({
    beforeStartMinutes: [15, 30],
    showCountdown: true,
    graceWarning: true,
    graceWarnMinutes: 5,
  });

  const sdk = useMemo(() => {
    const getToken: GetToken = () => auth.token;
    return createSdk(getToken);
  }, [auth.token]);

  const value = useMemo<AppContextValue>(
    () => ({
      auth,
      setAuth,
      vehicle,
      setVehicle,
      filters,
      setFilters,
      bookingDraft,
      setBookingDraft,
      mobileDraft,
      setMobileDraft,
      session,
      setSession,
      wallet,
      setWallet,
      favorites,
      setFavorites,
      notifications,
      setNotifications,
      reminderPrefs,
      setReminderPrefs,
    }),
    [auth, vehicle, filters, bookingDraft, mobileDraft, session, wallet, favorites, notifications, reminderPrefs]
  );

  return (
    <SdkCtx.Provider value={sdk}>
      <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
    </SdkCtx.Provider>
  );
}

export function useApp(): AppContextValue {
  const context = useContext(AppCtx);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function useSdk(): Sdk {
  const context = useContext(SdkCtx);
  if (!context) {
    throw new Error('useSdk must be used within an AppProvider');
  }
  return context;
}
