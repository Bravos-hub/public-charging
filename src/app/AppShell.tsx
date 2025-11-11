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
import { StationDetailsScreen } from './screens/StationDetailsScreen';
import { TimePicker } from '../features/booking/components/TimePicker';
import { BookingPaymentScreen } from '../features/booking/screens/BookingPaymentScreen';
import { BookingConfirmationScreen } from '../features/booking/screens/BookingConfirmationScreen';
import { QRScanner } from '../features/charging/components/QRScanner';
import { ChargingReadyScreen } from '../features/charging/screens/ChargingReadyScreen';
import { ChargingInProgressScreen } from '../features/charging/screens/ChargingInProgressScreen';
import { ChargingCompleteScreen } from '../features/charging/screens/ChargingCompleteScreen';

// Routes that should be full-screen (no header/bottom nav)
const FULL_SCREEN_ROUTES = new Set([
  'STATION_DETAILS',
  'BOOK_FIXED_TIME',
  'BOOK_MOBILE_TIME',
  'BOOK_PAYMENT',
  'BOOK_CONFIRMATION',
  'BOOK_DETAIL',
  'ACTIVATION_SCAN',
  'ACTIVATION_ENTER_ID',
  'ACTIVATION_CHOOSE_CONNECTOR',
  'CHARGING_READY',
  'CHARGING_IN_PROGRESS',
  'CHARGING_COMPLETE',
  'CHARGING_STOP',
  'WALLET_ADD_METHOD',
  'WALLET_TRANSACTIONS',
  'PROFILE_SETTINGS',
  'PROFILE_NOTIFICATIONS',
  'PROFILE_LANGUAGE',
]);

function AppContent(): React.ReactElement {
  const { route, back, push, replace } = useNavigation();
  const title = ROUTES[route.name as keyof typeof ROUTES]?.title || 'EVzone';
  const isFullScreen = FULL_SCREEN_ROUTES.has(route.name);
  const isMainTab = ['DISCOVER', 'ACTIVITY', 'WALLET', 'PROFILE'].includes(route.name);

  // Full-screen routes (charging, booking flows)
  if (isFullScreen) {
    return (
      <div className="min-h-[100dvh] bg-white text-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={route.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-full"
          >
            {route.name === 'STATION_DETAILS' && <StationDetailsScreen />}
            {route.name === 'BOOK_FIXED_TIME' && (
              <TimePicker
                stationName={route.params?.station?.name || route.params?.stationName || 'Central Hub'}
                mode="fixed"
                onTimeSelect={(time, date) => {
                  // Create booking object from time selection
                  const booking = {
                    id: `BOOK-${Date.now()}`,
                    stationId: route.params?.stationId || route.params?.station?.id,
                    stationName: route.params?.station?.name || route.params?.stationName,
                    stationAddress: route.params?.station?.address,
                    startTime: new Date(date.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]))),
                    connectorType: 'CCS2',
                    status: 'pending' as const,
                    mode: 'fixed' as const,
                  };
                  push('BOOK_PAYMENT', { booking, time, date });
                }}
                onBack={back}
              />
            )}
            {route.name === 'BOOK_MOBILE_TIME' && (
              <TimePicker
                stationName={route.params?.station?.name || route.params?.stationName || 'Mobile Charging'}
                mode="mobile"
                onTimeSelect={(time, date) => {
                  const booking = {
                    id: `BOOK-${Date.now()}`,
                    stationId: route.params?.stationId || route.params?.station?.id,
                    stationName: route.params?.station?.name || route.params?.stationName,
                    startTime: new Date(date.setHours(parseInt(time.split(':')[0]), parseInt(time.split(':')[1]))),
                    connectorType: 'CCS2',
                    status: 'pending' as const,
                    mode: 'mobile' as const,
                  };
                  push('BOOK_PAYMENT', { booking, time, date });
                }}
                onBack={back}
              />
            )}
            {route.name === 'BOOK_PAYMENT' && (
              <BookingPaymentScreen
                amount={route.params?.booking?.cost || 50000}
                currency="UGX"
                onPay={(methodId) => {
                  const booking = {
                    ...route.params?.booking,
                    id: route.params?.booking?.id || `BOOK-${Date.now()}`,
                    status: 'confirmed' as const,
                  };
                  push('BOOK_CONFIRMATION', { booking });
                }}
                onBack={back}
              />
            )}
            {route.name === 'BOOK_CONFIRMATION' && (
              <BookingConfirmationScreen
                booking={route.params?.booking}
                onDone={() => {
                  replace('ACTIVITY');
                }}
              />
            )}
            {route.name === 'ACTIVATION_SCAN' && (
              <QRScanner
                onScan={(result) => {
                  push('CHARGING_READY', { scanResult: result });
                }}
                onEnterId={() => {
                  push('ACTIVATION_ENTER_ID');
                }}
                onBack={back}
              />
            )}
            {route.name === 'ACTIVATION_ENTER_ID' && (
              <div className="min-h-[100dvh] bg-white p-4">
                <div className="max-w-md mx-auto">
                  <button onClick={back} className="mb-4 text-slate-600">
                    ← Back
                  </button>
                  <h2 className="text-xl font-bold mb-4">Enter Charger ID</h2>
                  <input
                    type="text"
                    placeholder="Enter charger ID"
                    className="w-full p-3 border rounded-xl mb-4"
                  />
                  <button
                    onClick={() => {
                      push('CHARGING_READY', { chargerId: 'MANUAL-001' });
                    }}
                    className="w-full p-3 rounded-xl text-white font-medium"
                    style={{ backgroundColor: '#f77f00' }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            {route.name === 'ACTIVATION_CHOOSE_CONNECTOR' && (
              <div className="min-h-[100dvh] bg-white p-4">
                <div className="max-w-md mx-auto">
                  <button onClick={back} className="mb-4 text-slate-600">
                    ← Back
                  </button>
                  <h2 className="text-xl font-bold mb-4">Choose Connector</h2>
                  <div className="space-y-2">
                    {['CCS2', 'CHAdeMO', 'Type 2'].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          push('CHARGING_READY', { connectorType: type });
                        }}
                        className="w-full p-4 border rounded-xl text-left"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {route.name === 'CHARGING_READY' && (
              <ChargingReadyScreen
                onStart={() => {
                  push('CHARGING_IN_PROGRESS', route.params);
                }}
                onBack={back}
              />
            )}
            {route.name === 'CHARGING_IN_PROGRESS' && (
              <ChargingInProgressScreen
                sessionId={route.params?.sessionId}
                onStop={() => {
                  push('CHARGING_STOP', route.params);
                }}
                onBack={back}
              />
            )}
            {route.name === 'CHARGING_COMPLETE' && (
              <ChargingCompleteScreen
                session={route.params?.session}
                onBack={() => {
                  replace('ACTIVITY');
                }}
                onProceedToPayment={() => {
                  // Navigate to payment if needed
                  replace('ACTIVITY');
                }}
              />
            )}
            {route.name === 'CHARGING_STOP' && (
              <div className="min-h-[100dvh] bg-white p-4">
                <div className="max-w-md mx-auto text-center">
                  <h2 className="text-xl font-bold mb-4">Stop Charging?</h2>
                  <p className="text-slate-600 mb-6">Are you sure you want to stop charging?</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        push('CHARGING_COMPLETE', route.params);
                      }}
                      className="w-full p-3 rounded-xl text-white font-medium"
                      style={{ backgroundColor: '#f77f00' }}
                    >
                      Yes, Stop
                    </button>
                    <button
                      onClick={back}
                      className="w-full p-3 rounded-xl border border-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            {route.name === 'WALLET_ADD_METHOD' && (
              <div className="min-h-[100dvh] bg-white p-4">
                <div className="max-w-md mx-auto">
                  <button onClick={back} className="mb-4 text-slate-600">
                    ← Back
                  </button>
                  <h2 className="text-xl font-bold mb-4">Add Payment Method</h2>
                  <p className="text-slate-600">Payment method form coming soon...</p>
                </div>
              </div>
            )}
            {route.name === 'WALLET_TRANSACTIONS' && (
              <div className="min-h-[100dvh] bg-white p-4">
                <div className="max-w-md mx-auto">
                  <button onClick={back} className="mb-4 text-slate-600">
                    ← Back
                  </button>
                  <h2 className="text-xl font-bold mb-4">Transactions</h2>
                  <p className="text-slate-600">Transaction history coming soon...</p>
                </div>
              </div>
            )}
            {route.name === 'PROFILE_SETTINGS' && (
              <div className="min-h-[100dvh] bg-white p-4">
                <div className="max-w-md mx-auto">
                  <button onClick={back} className="mb-4 text-slate-600">
                    ← Back
                  </button>
                  <h2 className="text-xl font-bold mb-4">Settings</h2>
                  <p className="text-slate-600">Settings coming soon...</p>
                </div>
              </div>
            )}
            {route.name === 'PROFILE_NOTIFICATIONS' && (
              <div className="min-h-[100dvh] bg-white p-4">
                <div className="max-w-md mx-auto">
                  <button onClick={back} className="mb-4 text-slate-600">
                    ← Back
                  </button>
                  <h2 className="text-xl font-bold mb-4">Notifications</h2>
                  <p className="text-slate-600">Notification settings coming soon...</p>
                </div>
              </div>
            )}
            {route.name === 'PROFILE_LANGUAGE' && (
              <div className="min-h-[100dvh] bg-white p-4">
                <div className="max-w-md mx-auto">
                  <button onClick={back} className="mb-4 text-slate-600">
                    ← Back
                  </button>
                  <h2 className="text-xl font-bold mb-4">Language & Units</h2>
                  <p className="text-slate-600">Language settings coming soon...</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // In-app routes (main tabs with header and bottom nav)
  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {isMainTab && <Header title={title} />}
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
      {isMainTab && <BottomNav />}
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

