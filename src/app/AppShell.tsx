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
import { ExportCenterScreen } from '../features/activity/screens/ExportCenterScreen';
import { WalletScreen } from './screens/WalletScreen';
import { AddPaymentMethodScreen } from '../features/wallet/screens/AddPaymentMethodScreen';
import { PaymentVerificationScreen } from '../features/wallet/screens/PaymentVerificationScreen';
import { RefundVoidScreen } from '../features/wallet/screens/RefundVoidScreen';
import { TransactionsScreen } from '../features/wallet/screens/TransactionsScreen';
import { ContactSupportScreen } from '../features/support/screens/ContactSupportScreen';
import { TermsOfServiceScreen } from './screens/TermsOfServiceScreen';
import { PricingTariffsScreen } from './screens/PricingTariffsScreen';
import { PrivacyPolicyScreen } from './screens/PrivacyPolicyScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { FavoritesScreen } from '../features/profile/screens/FavoritesScreen';
import { NotificationSettingsScreen } from '../features/profile/screens/NotificationSettingsScreen';
import { ReminderPreferencesScreen } from '../features/profile/screens/ReminderPreferencesScreen';
import { ProfileSettingsScreen } from '../features/profile/screens/ProfileSettingsScreen';
import { PrivacySupportScreen } from '../features/profile/screens/PrivacySupportScreen';
import { LanguageUnitsScreen } from '../features/profile/screens/LanguageUnitsScreen';
import { TestNotificationScreen } from '../features/profile/screens/TestNotificationScreen';
import { ProjectSettingsPreviewScreen } from '../features/profile/screens/ProjectSettingsPreviewScreen';
import { FiltersScreen } from './screens/FiltersScreen';
import { StationPreviewScreen } from './screens/StationPreviewScreen';
import { StationDetailsScreen } from './screens/StationDetailsScreen';
import { RateStationScreen } from '../features/stations/screens/RateStationScreen';
import { ReportProblemScreen } from '../features/stations/screens/ReportProblemScreen';
import { EnableLocationScreen } from './screens/EnableLocationScreen';
import { CameraPermissionScreen } from './screens/CameraPermissionScreen';
import { TimePicker } from '../features/booking/components/TimePicker';
import { BookingFeePaymentScreen } from '../features/booking/screens/BookingFeePaymentScreen';
import { BookingPaymentScreen } from '../features/booking/screens/BookingPaymentScreen';
import { BookingConfirmationScreen } from '../features/booking/screens/BookingConfirmationScreen';
import { BookingDetailScreen } from '../features/booking/screens/BookingDetailScreen';
import { MobileChargingLocationScreen } from '../features/booking/screens/MobileChargingLocationScreen';
import { MobileChargingTimeTargetsScreen } from '../features/booking/screens/MobileChargingTimeTargetsScreen';
import { MobileChargingScheduleScreen } from '../features/booking/screens/MobileChargingScheduleScreen';
import { MobileChargingOnTheWayScreen } from '../features/booking/screens/MobileChargingOnTheWayScreen';
import { QRScanner } from '../features/charging/components/QRScanner';
import { ChargingReadyScreen } from '../features/charging/screens/ChargingReadyScreen';
import { ChargingInProgressScreen } from '../features/charging/screens/ChargingInProgressScreen';
import { ChargingCompleteScreen } from '../features/charging/screens/ChargingCompleteScreen';
import { ChooseConnectorScreen } from '../features/charging/screens/ChooseConnectorScreen';
import { EnterChargerIdScreen } from '../features/charging/screens/EnterChargerIdScreen';
import { ScanFailedScreen } from '../features/charging/screens/ScanFailedScreen';
import { PrepaidChargingScreen } from '../features/charging/screens/PrepaidChargingScreen';
import { PostpaidPaymentScreen } from '../features/charging/screens/PostpaidPaymentScreen';
import { ReceiptScreen } from '../features/charging/screens/ReceiptScreen';
import { ChargerUnavailable } from '../shared/components/errors/ChargerUnavailable';
import { ConnectorTypesFilter, PowerFilter, NetworksFilter, LocationTypesFilter, AccessFilter, UserRatingFilter, MultipleDevicesFilter, StationCategoryFilter } from '../shared/components/filters';
import { CompatibilityHelperScreen } from '../features/discovery/screens/CompatibilityHelperScreen';
import { SystemOfflineScreen } from './screens/SystemOfflineScreen';
import { OfflineCacheScreen } from './screens/OfflineCacheScreen';
import { DRPeakEventBanner } from '../shared/components/DRPeakEventBanner';
import { UpdatePrompt } from '../shared/components/UpdatePrompt';
import { registerWithUpdate, activateUpdate } from '../core/utils/serviceWorker';
import { useApp } from '../core';
import { ReservationNotReady } from '../shared/components/errors/ReservationNotReady';

// Routes that should be full-screen (no header/bottom nav)
const FULL_SCREEN_ROUTES = new Set([
  'STATION_PREVIEW',
  'STATION_DETAILS',
  'STATION_RATE',
  'STATION_REPORT',
  'BOOK_FIXED_TIME',
  'BOOK_MOBILE_LOCATION',
  'BOOK_MOBILE_TIME_TARGETS',
  'BOOK_MOBILE_TIME',
  'BOOK_MOBILE_SCHEDULE',
  'BOOK_MOBILE_ON_THE_WAY',
  'BOOK_FEE_PAYMENT',
  'BOOK_PAYMENT',
  'BOOK_CONFIRMATION',
  'BOOK_DETAIL',
  'ACTIVATION_SCAN',
  'ACTIVATION_ENTER_ID',
  'ACTIVATION_CHOOSE_CONNECTOR',
  'SCAN_FAILED',
  'PREPAID_CHARGING',
  'CHARGING_READY',
  'CHARGING_IN_PROGRESS',
  'CHARGING_COMPLETE',
  'POSTPAID_PAYMENT',
  'RECEIPT',
  'CHARGING_STOP',
  'WALLET_ADD_METHOD',
  'WALLET_TRANSACTIONS',
  'PAYMENT_VERIFICATION',
  'REFUND_VOID',
  'PROFILE_SETTINGS',
  'PROFILE_NOTIFICATIONS',
  'PROFILE_LANGUAGE',
  'PROFILE_TEST_NOTIFICATION',
  'PROFILE_PROJECT_PREVIEW',
  'PROFILE_FAVORITES',
  'PROFILE_REMINDERS',
  'PRIVACY_SUPPORT',
  'ENABLE_LOCATION',
  'CAMERA_PERMISSION',
  'FILTER_CONNECTOR_TYPES',
  'FILTER_POWER',
  'FILTER_NETWORKS',
  'FILTER_LOCATION_TYPES',
  'FILTER_ACCESS',
  'FILTER_USER_RATING',
  'FILTER_MULTIPLE_DEVICES',
  'FILTER_STATION_CATEGORY',
  'EXPORT_CENTER',
  'CONTACT_SUPPORT',
  'TERMS_OF_SERVICE',
  'PRIVACY_POLICY',
  'PRICING_TARIFFS',
  'SYSTEM_OFFLINE',
  'OFFLINE_CACHE',
  'COMPATIBILITY_HELPER',
  'CHARGER_UNAVAILABLE',
  'RESERVATION_NOT_READY',
]);

function AppContent(): React.ReactElement {
  const { route, back, push, replace } = useNavigation();
  const { drPeak } = useApp();
  const [swUpdate, setSwUpdate] = React.useState<ServiceWorkerRegistration | null>(null);
  const [showUpdate, setShowUpdate] = React.useState(false);
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      registerWithUpdate((reg) => {
        setSwUpdate(reg);
        setShowUpdate(true);
      });
    } else {
      // In development, aggressively unregister any existing service workers to avoid reload loops
      if ('serviceWorker' in navigator) {
        // Unregister all service workers
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((r) => {
            r.unregister().catch(() => {});
          });
        }).catch(() => {});
        
        // Also try to unregister the controller directly
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'UNREGISTER' });
        }
        
        // Clear any reload flags
        delete (window as any).__swReloading;
        delete (window as any).__swReloaded;
        
        // Prevent any service worker from taking control
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          // In dev, don't allow controller changes
          console.warn('Service worker controller change blocked in development');
        });
      }
    }
  }, []);
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
            {route.name === 'STATION_RATE' && <RateStationScreen />}
            {route.name === 'STATION_REPORT' && <ReportProblemScreen />}
            {route.name === 'PRICING_TARIFFS' && <PricingTariffsScreen />}
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
                  push('BOOK_FEE_PAYMENT', { booking, station: route.params?.station, time, date });
                }}
                onBack={back}
              />
            )}
            {route.name === 'BOOK_MOBILE_LOCATION' && <MobileChargingLocationScreen />}
            {route.name === 'BOOK_MOBILE_TIME_TARGETS' && <MobileChargingTimeTargetsScreen />}
            {route.name === 'BOOK_MOBILE_SCHEDULE' && <MobileChargingScheduleScreen />}
            {route.name === 'BOOK_MOBILE_ON_THE_WAY' && <MobileChargingOnTheWayScreen />}
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
                  push('BOOK_FEE_PAYMENT', { booking, station: route.params?.station, time, date });
                }}
                onBack={back}
              />
            )}
            {route.name === 'BOOK_FEE_PAYMENT' && <BookingFeePaymentScreen />}
            {route.name === 'BOOK_PAYMENT' && (
              <BookingPaymentScreen
                amount={route.params?.booking?.cost || 50000}
                currency="UGX"
                onPay={(methodId) => {
                  const raw = route.params?.booking || {};
                  const start = raw.startTime ? new Date(raw.startTime) : new Date();
                  const end = raw.endTime ? new Date(raw.endTime) : new Date(start.getTime() + 90 * 60000);
                  const booking = {
                    ...raw,
                    id: raw.id || `BOOK-${Date.now()}`,
                    status: 'confirmed' as const,
                    startTime: start,
                    endTime: end,
                    paymentMethod: methodId,
                  };
                  push('BOOK_CONFIRMATION', {
                    booking,
                    station: route.params?.station,
                  });
                }}
                onBack={back}
              />
            )}
            {route.name === 'BOOK_CONFIRMATION' && (
              <BookingConfirmationScreen
                booking={route.params?.booking}
                onAddToCalendar={() => {
                  // Create calendar event from booking
                  const bookingData = route.params?.booking;
                  if (bookingData?.startTime) {
                    const start = new Date(bookingData.startTime);
                    const end = bookingData.endTime ? new Date(bookingData.endTime) : new Date(start.getTime() + 90 * 60000);
                    const stationName = bookingData.stationName || 'Charging Station';
                    const address = bookingData.stationAddress || bookingData.location?.address || '';
                    
                    // Create Google Calendar URL
                    const startStr = start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                    const endStr = end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                    const title = encodeURIComponent(`EV Charging - ${stationName}`);
                    const details = encodeURIComponent(`EV Charging session at ${stationName}${address ? ` - ${address}` : ''}`);
                    const location = encodeURIComponent(`${stationName}${address ? `, ${address}` : ''}`);
                    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
                    window.open(url, '_blank');
                  }
                }}
                onDirections={() => {
                  // Open navigation to station
                  const bookingData = route.params?.booking;
                  const station = route.params?.station;
                  
                  if (station?.location) {
                    window.open(`https://maps.google.com/?q=${station.location.lat},${station.location.lng}`, '_blank');
                  } else if (bookingData?.location) {
                    window.open(`https://maps.google.com/?q=${bookingData.location.lat},${bookingData.location.lng}`, '_blank');
                  } else if (bookingData?.stationName) {
                    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bookingData.stationName)}`;
                    window.open(url, '_blank');
                  }
                }}
                onViewBooking={() => {
                  push('BOOK_DETAIL', { booking: route.params?.booking });
                }}
                onShare={async () => {
                  // Share booking details
                  const bookingData = route.params?.booking;
                  if (bookingData) {
                    const startDate = new Date(bookingData.startTime);
                    const endDate = bookingData.endTime ? new Date(bookingData.endTime) : new Date(startDate.getTime() + 90 * 60000);
                    const text = `EV Charging Reservation\n${bookingData.stationName || 'Charging Station'}\n${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\nReference: ${bookingData.id || 'N/A'}`;
                    
                    if (navigator.share) {
                      try {
                        await navigator.share({ text });
                      } catch (err) {
                        // User cancelled or error
                        console.log('Share cancelled');
                      }
                    } else {
                      // Fallback: copy to clipboard
                      await navigator.clipboard.writeText(text);
                      alert('Booking details copied to clipboard!');
                    }
                  }
                }}
                onDone={() => {
                  replace('ACTIVITY');
                }}
              />
            )}
            {route.name === 'BOOK_DETAIL' && <BookingDetailScreen />}
            {route.name === 'ACTIVATION_SCAN' && (
              <QRScanner
                onScan={(result) => {
                  const start = route.params?.booking?.startTime || route.params?.startTime;
                  if (start && Date.now() < new Date(start).getTime()) {
                    push('RESERVATION_NOT_READY', {
                      ...route.params,
                      startTime: new Date(start),
                    });
                    return;
                  }
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
            {route.name === 'SCAN_FAILED' && <ScanFailedScreen />}
            {route.name === 'ACTIVATION_CHOOSE_CONNECTOR' && <ChooseConnectorScreen />}
            {route.name === 'PREPAID_CHARGING' && <PrepaidChargingScreen />}
            {route.name === 'CHARGING_READY' && (
              <ChargingReadyScreen
                onStart={() => {
                  const start = route.params?.booking?.startTime || route.params?.startTime;
                  if (start) {
                    const startDate = new Date(start);
                    if (Date.now() < startDate.getTime()) {
                      push('RESERVATION_NOT_READY', {
                        station: route.params?.station,
                        stationName: route.params?.station?.name || route.params?.stationName,
                        startTime: startDate,
                        booking: route.params?.booking,
                        bookingId: route.params?.booking?.id,
                      });
                      return;
                    }
                  }
                  push('CHARGING_IN_PROGRESS', route.params);
                }}
                onBack={back}
                onCancel={back}
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
            {route.name === 'RECEIPT' && <ReceiptScreen />}
            {route.name === 'RESERVATION_NOT_READY' && (
              <ReservationNotReady
                stationName={route.params?.station?.name || route.params?.stationName || 'Central Hub — Downtown Mall'}
                startTime={route.params?.startTime}
                onViewBooking={() =>
                  push('BOOK_DETAIL', {
                    booking: route.params?.booking,
                    bookingId: route.params?.booking?.id || route.params?.bookingId,
                    stationName: route.params?.station?.name || route.params?.stationName,
                    startTime: route.params?.startTime,
                  })
                }
                onOk={() => back()}
                onChangeTime={() =>
                  push('BOOK_FIXED_TIME', {
                    station: route.params?.station,
                    stationId: route.params?.station?.id,
                    stationName: route.params?.station?.name || route.params?.stationName,
                    booking: route.params?.booking,
                    bookingId: route.params?.booking?.id || route.params?.bookingId,
                  })
                }
              />
            )}
            {route.name === 'CHARGER_UNAVAILABLE' && (
              <ChargerUnavailable
                stationName={route.params?.station?.name || 'Central Hub — Downtown Mall'}
                unitId={route.params?.unitId || 'EVSE EVZ-123'}
                connectorType={route.params?.connectorType || 'CCS2'}
                powerKw={route.params?.powerKw || 60}
                status={route.params?.status || 'Faulted'}
                onFindNearby={() => replace('DISCOVER')}
                onNotify={() => alert('We will notify you when this charger is available.')}
                onRetry={() => alert('Retrying status…')}
              />
            )}
            {route.name === 'SYSTEM_OFFLINE' && <SystemOfflineScreen />}
            {route.name === 'OFFLINE_CACHE' && <OfflineCacheScreen />}
            {route.name === 'COMPATIBILITY_HELPER' && <CompatibilityHelperScreen />}
            {route.name === 'WALLET_ADD_METHOD' && <AddPaymentMethodScreen />}
            {route.name === 'PAYMENT_VERIFICATION' && <PaymentVerificationScreen />}
            {route.name === 'REFUND_VOID' && <RefundVoidScreen />}
            {route.name === 'WALLET_TRANSACTIONS' && <TransactionsScreen />}
            {route.name === 'PROFILE_SETTINGS' && (
              <ProfileSettingsScreen />
            )}
            {route.name === 'PROFILE_NOTIFICATIONS' && <NotificationSettingsScreen />}
            {route.name === 'PROFILE_TEST_NOTIFICATION' && <TestNotificationScreen />}
            {route.name === 'PROFILE_PROJECT_PREVIEW' && <ProjectSettingsPreviewScreen />}
            {route.name === 'PROFILE_LANGUAGE' && <LanguageUnitsScreen />}
            {route.name === 'PROFILE_FAVORITES' && <FavoritesScreen />}
            {route.name === 'PROFILE_REMINDERS' && <ReminderPreferencesScreen />}
            {route.name === 'PRIVACY_SUPPORT' && <PrivacySupportScreen />}
            {route.name === 'ENABLE_LOCATION' && <EnableLocationScreen />}
            {route.name === 'CAMERA_PERMISSION' && <CameraPermissionScreen />}
            {route.name === 'FILTER_CONNECTOR_TYPES' && <ConnectorTypesFilter />}
            {route.name === 'FILTER_POWER' && <PowerFilter />}
            {route.name === 'FILTER_NETWORKS' && <NetworksFilter />}
            {route.name === 'FILTER_LOCATION_TYPES' && <LocationTypesFilter />}
            {route.name === 'FILTER_ACCESS' && <AccessFilter />}
            {route.name === 'FILTER_USER_RATING' && <UserRatingFilter />}
            {route.name === 'FILTER_MULTIPLE_DEVICES' && <MultipleDevicesFilter />}
            {route.name === 'FILTER_STATION_CATEGORY' && <StationCategoryFilter />}
            {route.name === 'EXPORT_CENTER' && <ExportCenterScreen />}
            {route.name === 'CONTACT_SUPPORT' && <ContactSupportScreen />}
            {route.name === 'TERMS_OF_SERVICE' && <TermsOfServiceScreen />}
            {route.name === 'PRIVACY_POLICY' && <PrivacyPolicyScreen />}
          </motion.div>
        </AnimatePresence>
        <UpdatePrompt
          visible={showUpdate}
          currentVersion={(process.env.REACT_APP_APP_VERSION as string) || 'v1.0.0'}
          latestVersion="latest"
          notes={[
            'Improved map performance and smoother panning.',
            'Charging session accuracy improvements.',
            'Minor UI polish and bug fixes.',
          ]}
          onLater={() => setShowUpdate(false)}
          onRefresh={() => {
            if (swUpdate) activateUpdate(swUpdate);
            else window.location.reload();
          }}
        />
      </div>
    );
  }

  // In-app routes (main tabs with header and bottom nav)
  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {isMainTab && <Header title={title} />}
      {/* Optional DR Peak Event banner (toggle via window.DR_PEAK_ACTIVE) */}
      {route.name === 'DISCOVER' && (
        <DRPeakEventBanner
          active={drPeak.active}
          untilLabel={drPeak.until || 'today'}
        />
      )}
      <main className={`max-w-md mx-auto ${route.name === 'DISCOVER' ? 'h-[calc(100dvh-3.5rem-56px)] overflow-hidden' : 'h-[calc(100dvh-3.5rem-56px)] overflow-y-auto'} overscroll-behavior-contain`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={route.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={route.name === 'DISCOVER' ? 'h-full' : 'min-h-full'}
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
