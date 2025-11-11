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
  DISCOVER: { title: 'Discover chargers' },
  ACTIVITY: { title: 'Activity' },
  WALLET: { title: 'Wallet' },
  PROFILE: { title: 'Profile' },
  FILTERS: { title: 'Filters' },
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

