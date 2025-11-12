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
import { StationPreviewScreen } from './screens/StationPreviewScreen';
import { StationDetailsScreen } from './screens/StationDetailsScreen';
import { EnableLocationScreen } from './screens/EnableLocationScreen';
import { TimePicker } from '../features/booking/components/TimePicker';
import { BookingPaymentScreen } from '../features/booking/screens/BookingPaymentScreen';
import { BookingConfirmationScreen } from '../features/booking/screens/BookingConfirmationScreen';
import { QRScanner } from '../features/charging/components/QRScanner';
import { ChargingReadyScreen } from '../features/charging/screens/ChargingReadyScreen';
import { ChargingInProgressScreen } from '../features/charging/screens/ChargingInProgressScreen';
import { ChargingCompleteScreen } from '../features/charging/screens/ChargingCompleteScreen';
import { ChooseConnectorScreen } from '../features/charging/screens/ChooseConnectorScreen';
import { EnterChargerIdScreen } from '../features/charging/screens/EnterChargerIdScreen';
import { PrepaidChargingScreen } from '../features/charging/screens/PrepaidChargingScreen';
import { PostpaidPaymentScreen } from '../features/charging/screens/PostpaidPaymentScreen';
import { ConnectorTypesFilter, PowerFilter, NetworksFilter, LocationTypesFilter, AccessFilter, UserRatingFilter, MultipleDevicesFilter, StationCategoryFilter } from '../shared/components/filters';

// Routes that should be full-screen (no header/bottom nav)
const FULL_SCREEN_ROUTES = new Set([
  'STATION_PREVIEW',
  'STATION_DETAILS',
  'BOOK_FIXED_TIME',
  'BOOK_MOBILE_TIME',
  'BOOK_PAYMENT',
  'BOOK_CONFIRMATION',
  'BOOK_DETAIL',
  'ACTIVATION_SCAN',
  'ACTIVATION_ENTER_ID',
  'ACTIVATION_CHOOSE_CONNECTOR',
  'PREPAID_CHARGING',
  'CHARGING_READY',
  'CHARGING_IN_PROGRESS',
  'CHARGING_COMPLETE',
  'POSTPAID_PAYMENT',
  'CHARGING_STOP',
  'WALLET_ADD_METHOD',
  'WALLET_TRANSACTIONS',
  'PROFILE_SETTINGS',
  'PROFILE_NOTIFICATIONS',
  'PROFILE_LANGUAGE',
  'ENABLE_LOCATION',
  'FILTER_CONNECTOR_TYPES',
  'FILTER_POWER',
  'FILTER_NETWORKS',
  'FILTER_LOCATION_TYPES',
  'FILTER_ACCESS',
  'FILTER_USER_RATING',
  'FILTER_MULTIPLE_DEVICES',
  'FILTER_STATION_CATEGORY',
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
            {route.name === 'STATION_PREVIEW' && <StationPreviewScreen />}
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
            {route.name === 'BOOK_DETAIL' && (
              <div className="min-h-[100dvh] bg-white p-4">
                <div className="max-w-md mx-auto">
                  <button onClick={back} className="mb-4 text-slate-600">
                    ← Back
                  </button>
                  <h2 className="text-xl font-bold mb-4">Booking Details</h2>
                  <div className="space-y-4">
                    {route.params?.booking?.stationName && (
                      <div>
                        <div className="text-[12px] text-slate-500 mb-1">Station</div>
                        <div className="text-[14px] font-semibold text-slate-800">
                          {route.params.booking.stationName}
                        </div>
                      </div>
                    )}
                    {route.params?.booking?.vehicleName && (
                      <div>
                        <div className="text-[12px] text-slate-500 mb-1">Vehicle</div>
                        <div className="text-[14px] font-semibold text-slate-800">
                          {route.params.booking.vehicleName}
                        </div>
                      </div>
                    )}
                    {route.params?.booking?.connectorType && (
                      <div>
                        <div className="text-[12px] text-slate-500 mb-1">Connector</div>
                        <div className="text-[14px] font-semibold text-slate-800">
                          {route.params.booking.connectorType}
                        </div>
                      </div>
                    )}
                    {route.params?.booking?.startTime && (
                      <div>
                        <div className="text-[12px] text-slate-500 mb-1">Start Time</div>
                        <div className="text-[14px] font-semibold text-slate-800">
                          {new Date(route.params.booking.startTime).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {route.name === 'ACTIVATION_SCAN' && (
              <QRScanner
                onScan={(result) => {
                  push('PREPAID_CHARGING', {
                    ...route.params,
                    scanResult: result,
                  });
                }}
                onEnterId={() => {
                  push('ACTIVATION_ENTER_ID', route.params);
                }}
                onBack={back}
              />
            )}
            {route.name === 'ACTIVATION_ENTER_ID' && <EnterChargerIdScreen />}
            {route.name === 'ACTIVATION_CHOOSE_CONNECTOR' && <ChooseConnectorScreen />}
            {route.name === 'PREPAID_CHARGING' && <PrepaidChargingScreen />}
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
                  // Create session object from route params
                  const session = {
                    id: route.params?.sessionId || `SESSION-${Date.now()}`,
                    stationId: route.params?.stationId || route.params?.station?.id || '1',
                    connectorId: route.params?.connector?.id || route.params?.connectorType || '1',
                    startTime: new Date(),
                    endTime: new Date(),
                    energyDelivered: 32.8, // Would come from actual charging data
                    cost: 98400, // Would be calculated
                    status: 'completed' as const,
                    power: route.params?.connector?.power || 60,
                  };
                  push('CHARGING_COMPLETE', {
                    ...route.params,
                    session,
                  });
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
                  push('POSTPAID_PAYMENT', route.params);
                }}
              />
            )}
            {route.name === 'POSTPAID_PAYMENT' && <PostpaidPaymentScreen />}
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
            {route.name === 'ENABLE_LOCATION' && <EnableLocationScreen />}
            {route.name === 'FILTER_CONNECTOR_TYPES' && <ConnectorTypesFilter />}
            {route.name === 'FILTER_POWER' && <PowerFilter />}
            {route.name === 'FILTER_NETWORKS' && <NetworksFilter />}
            {route.name === 'FILTER_LOCATION_TYPES' && <LocationTypesFilter />}
            {route.name === 'FILTER_ACCESS' && <AccessFilter />}
            {route.name === 'FILTER_USER_RATING' && <UserRatingFilter />}
            {route.name === 'FILTER_MULTIPLE_DEVICES' && <MultipleDevicesFilter />}
            {route.name === 'FILTER_STATION_CATEGORY' && <StationCategoryFilter />}
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

