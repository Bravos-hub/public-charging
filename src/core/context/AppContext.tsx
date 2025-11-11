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
}

interface AppContextValue extends AppState {
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  setVehicle: React.Dispatch<React.SetStateAction<{ active: Vehicle | null; list: Vehicle[] }>>;
  setFilters: React.Dispatch<React.SetStateAction<StationFilters>>;
  setBookingDraft: React.Dispatch<React.SetStateAction<BookingDraft | null>>;
  setMobileDraft: React.Dispatch<React.SetStateAction<BookingDraft | null>>;
  setSession: React.Dispatch<React.SetStateAction<{ active: ChargingSession | null }>>;
  setWallet: React.Dispatch<React.SetStateAction<Wallet>>;
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
    }),
    [auth, vehicle, filters, bookingDraft, mobileDraft, session, wallet]
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

