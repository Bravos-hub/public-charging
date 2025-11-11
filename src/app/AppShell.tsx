/**
 * App Shell Component (TypeScript)
 * Main app shell with navigation and screens
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationProvider, ROUTES, useNavigation } from '../core';
import { Header } from '../shared/components/ui/Header';
import { BottomNav } from '../shared/components/ui/BottomNav';
import { DiscoverScreen } from './screens/DiscoverScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { WalletScreen } from './screens/WalletScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { FiltersScreen } from './screens/FiltersScreen';

function AppContent(): React.ReactElement {
  const { route } = useNavigation();
  const title = ROUTES[route.name as keyof typeof ROUTES]?.title || 'EVzone';

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      <Header title={title} />
      <main className="max-w-md mx-auto h-[calc(100dvh-3.5rem-56px)] overflow-y-auto overscroll-behavior-contain">
        <AnimatePresence mode="wait">
          <motion.div
            key={route.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="min-h-full"
          >
            {route.name === 'DISCOVER' && <DiscoverScreen />}
            {route.name === 'ACTIVITY' && <ActivityScreen />}
            {route.name === 'WALLET' && <WalletScreen />}
            {route.name === 'PROFILE' && <ProfileScreen />}
            {route.name === 'FILTERS' && <FiltersScreen />}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
}

export function AppShell(): React.ReactElement {
  return (
    <NavigationProvider initialRoute={{ name: 'DISCOVER' }}>
      <AppContent />
    </NavigationProvider>
  );
}

