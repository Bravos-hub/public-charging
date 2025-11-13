/**
 * Navigation Context (TypeScript)
 * Custom stack router for in-app navigation
 */

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export interface Route {
  name: string;
  params?: Record<string, any>;
}

export interface NavigationContextValue {
  route: Route;
  push: (name: string, params?: Record<string, any>) => void;
  replace: (name: string, params?: Record<string, any>) => void;
  back: () => void;
}

const NavCtx = createContext<NavigationContextValue | null>(null);

export const ROUTES = {
  // Main tabs
  DISCOVER: { title: 'Discover chargers' },
  ACTIVITY: { title: 'Activity' },
  WALLET: { title: 'Wallet' },
  PROFILE: { title: 'Profile' },
  FILTERS: { title: 'Filters' },
  
  // Station flows
  STATION_PREVIEW: { title: 'Station Preview' },
  STATION_DETAILS: { title: 'Station Details' },
  STATION_CHARGERS: { title: 'Chargers' },
  STATION_AMENITIES: { title: 'Amenities & Chat' },
  STATION_RATE: { title: 'Rate Station' },
  STATION_REPORT: { title: 'Report a Problem' },
  
  // Booking flows
  BOOK_FIXED_TIME: { title: 'Reserve Station' },
  BOOK_MOBILE_LOCATION: { title: 'Mobile Charging — Location' },
  BOOK_MOBILE_TIME_TARGETS: { title: 'Mobile — Time & Targets' },
  BOOK_MOBILE_TIME: { title: 'Book Mobile Charging' },
  BOOK_MOBILE_ON_THE_WAY: { title: 'Mobile charging on the way' },
  BOOK_FEE_PAYMENT: { title: 'Booking Fee — Advance Scheduling' },
  BOOK_PAYMENT: { title: 'Payment' },
  BOOK_CONFIRMATION: { title: 'Reservation Confirmed' },
  BOOK_DETAIL: { title: 'Booking Details' },
  
  // Charging flows
  ACTIVATION_SCAN: { title: 'Activate — Scan QR' },
  ACTIVATION_ENTER_ID: { title: 'Activate — Enter ID' },
  ACTIVATION_CHOOSE_CONNECTOR: { title: 'Activate — Choose Connector' },
  SCAN_FAILED: { title: 'Scan failed' },
  PREPAID_CHARGING: { title: 'Prepaid — Fixed Charging' },
  CHARGING_READY: { title: 'Charging Ready' },
  CHARGING_IN_PROGRESS: { title: 'Charging' },
  CHARGING_COMPLETE: { title: 'Charging Complete' },
  POSTPAID_PAYMENT: { title: 'Payment — Fixed (Postpaid)' },
  CHARGING_STOP: { title: 'Stop Charging' },
  
  // Wallet flows
  WALLET_ADD_METHOD: { title: 'Add Payment Method' },
  WALLET_TRANSACTIONS: { title: 'Transactions' },
  PAYMENT_VERIFICATION: { title: 'Payment Verification' },
  REFUND_VOID: { title: 'Refund / Void' },
  
  // Profile flows
  PROFILE_SETTINGS: { title: 'Settings' },
  PROFILE_NOTIFICATIONS: { title: 'Notifications' },
  PROFILE_LANGUAGE: { title: 'Language & Units' },
  PROFILE_FAVORITES: { title: 'Favorites' },
  
  // Location permission
  ENABLE_LOCATION: { title: 'Enable Location' },
  CAMERA_PERMISSION: { title: 'Use your camera' },
  
  // Filter screens
  FILTER_CONNECTOR_TYPES: { title: 'Connector Types' },
  FILTER_POWER: { title: 'Power (kW)' },
  FILTER_NETWORKS: { title: 'Networks' },
  FILTER_LOCATION_TYPES: { title: 'Location Types' },
  FILTER_ACCESS: { title: 'Access' },
  FILTER_USER_RATING: { title: 'User Rating' },
  FILTER_MULTIPLE_DEVICES: { title: 'Multiple Devices' },
  FILTER_STATION_CATEGORY: { title: 'Station Category' },
  
  // Activity screens
  EXPORT_CENTER: { title: 'Export Center' },
  RECEIPT: { title: 'Receipt' },
  
  // Support screens
  CONTACT_SUPPORT: { title: 'Contact / Support' },
  TERMS_OF_SERVICE: { title: 'Terms of Service' },
  
  // System / Status
  SYSTEM_OFFLINE: { title: 'Offline' },
  
  // Tools
  COMPATIBILITY_HELPER: { title: 'Compatibility Helper' },
} as const;

interface NavigationProviderProps {
  children: ReactNode;
  initialRoute?: Route;
}

export function NavigationProvider({
  children,
  initialRoute = { name: 'DISCOVER' },
}: NavigationProviderProps): React.ReactElement {
  const [stack, setStack] = useState<Route[]>([initialRoute]);
  const route = stack[stack.length - 1];

  const nav = useMemo<NavigationContextValue>(
    () => ({
      route,
      push: (name: string, params?: Record<string, any>) => {
        setStack((s) => [...s, { name, params }]);
      },
      replace: (name: string, params?: Record<string, any>) => {
        setStack((s) => [...s.slice(0, s.length - 1), { name, params }]);
      },
      back: () => {
        setStack((s) => (s.length > 1 ? s.slice(0, s.length - 1) : s));
      },
    }),
    [route]
  );

  // Expose navigation to window for backward compatibility
  React.useEffect(() => {
    (window as any).go = (name: string, params?: Record<string, any>) => {
      nav.push(name, params);
    };
  }, [nav]);

  return <NavCtx.Provider value={nav}>{children}</NavCtx.Provider>;
}

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavCtx);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
