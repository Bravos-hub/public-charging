# Component Mapping & Integration Guide

## 📊 Component Inventory

### Core Files (Convert First)
| Source File | Target Location | Priority | Notes |
|------------|----------------|----------|-------|
| `app_shell_evz_mobile_core_react_tailwind_js.jsx` | `src/app/AppShell.tsx` | 🔴 HIGH | Main app shell with navigation |
| `p_0_13_app_context_sdk_skeleton_react_js.js` | `src/core/context/AppContext.tsx` | 🔴 HIGH | State management & API SDK |
| `p_0_01_core_map_wrapper_search_mobile_react_tailwind_js.jsx` | `src/features/discovery/components/MapWrapper.tsx` | 🔴 HIGH | Map abstraction layer |
| `p_0_14_sse_client_with_backoff_js_module (2).js` | `src/core/sdk/sse.ts` | 🟡 MEDIUM | SSE client utility |
| `p_0_16_i_18_n_loader_js_module.js` | `src/core/utils/i18n.ts` | 🟡 MEDIUM | Internationalization |
| `p_0_15_service_worker_workbox_recipe_js.js` | `src/core/utils/serviceWorker.ts` | 🟢 LOW | PWA support |
| `p_0_04_calendar.js` | `src/core/utils/calendar.ts` | 🟢 LOW | Calendar utilities |

### Discovery & Map (Batch 01)
| Source File | Target Location | Priority |
|------------|----------------|----------|
| `batch_01_discover_map_list_legend_mobile_react_tailwind_js.jsx` | `src/features/discovery/screens/DiscoverScreen.tsx` | 🔴 HIGH |
| `batch_01_filter_hub_power_connector_availability_mobile_react_tailwind_js.jsx` | `src/shared/components/filters/FilterHub.tsx` | 🟡 MEDIUM |
| `batch_01_location_permission_mobile_react_tailwind_js.jsx` | `src/shared/components/LocationPermission.tsx` | 🟡 MEDIUM |

### Station Details (Batch 02)
| Source File | Target Location | Priority |
|------------|----------------|----------|
| `batch_02_station_details_overview_updated_mobile_react_tailwind_js.jsx` | `src/features/stations/components/StationOverview.tsx` | 🔴 HIGH |
| `batch_02_station_details_chargers_mobile_react_tailwind_js.jsx` | `src/features/stations/components/ChargersList.tsx` | 🔴 HIGH |
| `batch_02_station_details_amenities_chat_mobile_react_tailwind_js.jsx` | `src/features/stations/components/AmenitiesList.tsx` | 🟡 MEDIUM |
| `batch_02_station_card_preview_tap_sheet_mobile_react_tailwind_js.jsx` | `src/features/discovery/components/StationCard.tsx` | 🔴 HIGH |
| `batch_02_station_list_sheet_mobile_react_tailwind_js.jsx` | `src/features/discovery/components/StationList.tsx` | 🔴 HIGH |
| `batch_02_map_stations_mobile_react_tailwind_js.jsx` | `src/features/discovery/components/MapStations.tsx` | 🔴 HIGH |

### Booking System (Batch 03, 07-09)
| Source File | Target Location | Priority |
|------------|----------------|----------|
| `batch_03_booking_fixed_choose_time_mobile_react_tailwind_js.jsx` | `src/features/booking/components/TimePicker.tsx` | 🔴 HIGH |
| `batch_03_booking_fixed_payment_mobile_react_tailwind_js.jsx` | `src/features/booking/screens/BookingPaymentScreen.tsx` | 🔴 HIGH |
| `batch_03_booking_fixed_targets_estimates_mobile_react_tailwind_js.jsx` | `src/features/booking/components/BookingEstimates.tsx` | 🟡 MEDIUM |
| `batch_08_booking_fixed_confirmation_mobile_react_tailwind_js.jsx` | `src/features/booking/screens/BookingConfirmationScreen.tsx` | 🔴 HIGH |
| `batch_09_booking_mobile_location_mobile_react_tailwind_js.jsx` | `src/features/booking/screens/BookingMobileLocationScreen.tsx` | 🟡 MEDIUM |
| `batch_09_booking_mobile_time_targets_mobile_react_tailwind_js.jsx` | `src/features/booking/screens/BookingMobileTimeScreen.tsx` | 🟡 MEDIUM |
| `batch_07_booking_detail_mobile_react_tailwind_js.jsx` | `src/features/booking/screens/BookingDetailScreen.tsx` | 🟡 MEDIUM |

### Charging Flow (Batch 04-06)
| Source File | Target Location | Priority |
|------------|----------------|----------|
| `batch_04_activation_scan_qr_mobile_react_tailwind_js.jsx` | `src/features/charging/components/QRScanner.tsx` | 🔴 HIGH |
| `batch_04_activation_choose_connector_prepaid_order_mobile_react_tailwind_js.jsx` | `src/features/charging/screens/ActivationScreen.tsx` | 🔴 HIGH |
| `batch_04_activation_enter_charger_id_mobile_react_tailwind_js.jsx` | `src/features/charging/components/ChargerIdInput.tsx` | 🟡 MEDIUM |
| `batch_05_charging_in_progress_mobile_react_tailwind_js.jsx` | `src/features/charging/screens/ChargingInProgressScreen.tsx` | 🔴 HIGH |
| `batch_05_charging_ready_mobile_react_tailwind_js.jsx` | `src/features/charging/screens/ChargingReadyScreen.tsx` | 🔴 HIGH |
| `batch_05_charging_stop_confirmation_mobile_react_tailwind_js.jsx` | `src/features/charging/components/StopConfirmation.tsx` | 🟡 MEDIUM |
| `batch_06_charging_complete_mobile_react_tailwind_js.jsx` | `src/features/charging/screens/ChargingCompleteScreen.tsx` | 🔴 HIGH |
| `batch_06_receipt_detail_mobile_react_tailwind_js.jsx` | `src/features/activity/components/ReceiptCard.tsx` | 🟡 MEDIUM |

### Wallet & Payments (Batch 10)
| Source File | Target Location | Priority |
|------------|----------------|----------|
| `batch_10_wallet_home_mobile_react_tailwind_js.jsx` | `src/features/wallet/screens/WalletScreen.tsx` | 🔴 HIGH |
| `batch_10_add_payment_method_mobile_react_tailwind_js.jsx` | `src/features/wallet/components/AddPaymentMethod.tsx` | 🟡 MEDIUM |
| `batch_10_payment_error_timeout_mobile_react_tailwind_js.jsx` | `src/shared/components/PaymentError.tsx` | 🟡 MEDIUM |
| `payment_fixed_charging_postpaid_cash_enabled_mobile_react_tailwind_js.jsx` | `src/features/wallet/components/PaymentOptions.tsx` | 🟡 MEDIUM |
| `payment_mobile_charging_prepaid_mobile_react_tailwind_js.jsx` | `src/features/wallet/components/MobilePayment.tsx` | 🟡 MEDIUM |

### Activity & History
| Source File | Target Location | Priority |
|------------|----------------|----------|
| `activity_history_unified_toggle_mobile_react_tailwind_js.jsx` | `src/features/activity/screens/ActivityScreen.tsx` | 🔴 HIGH |
| `batch_07_ready_waiting_to_plug_in_mobile_react_tailwind_js.jsx` | `src/features/activity/components/WaitingPrompt.tsx` | 🟡 MEDIUM |

### User Features (Batch 11-12)
| Source File | Target Location | Priority |
|------------|----------------|----------|
| `batch_11_compatibility_helper_mobile_react_tailwind_js.jsx` | `src/shared/components/CompatibilityHelper.tsx` | 🟢 LOW |
| `batch_12_favorites_mobile_react_tailwind_js.jsx` | `src/features/profile/components/Favorites.tsx` | 🟡 MEDIUM |
| `batch_12_rate_station_mobile_react_tailwind_js.jsx` | `src/features/stations/components/RateStation.tsx` | 🟡 MEDIUM |
| `batch_12_report_a_problem_mobile_react_tailwind_js.jsx` | `src/features/stations/components/ReportProblem.tsx` | 🟢 LOW |

### Settings & System (Batch 13, 20-23)
| Source File | Target Location | Priority |
|------------|----------------|----------|
| `batch_13_system_location_off_mobile_react_tailwind_js.jsx` | `src/shared/components/errors/LocationOff.tsx` | 🟡 MEDIUM |
| `batch_13_system_no_stations_found_mobile_react_tailwind_js.jsx` | `src/shared/components/errors/NoStationsFound.tsx` | 🟡 MEDIUM |
| `batch_13_system_offline_mobile_react_tailwind_js.jsx` | `src/shared/components/errors/Offline.tsx` | 🟡 MEDIUM |
| `batch_20_charger_unavailable_mobile_react_tailwind_js.jsx` | `src/shared/components/errors/ChargerUnavailable.tsx` | 🟡 MEDIUM |
| `batch_20_connector_mismatch_mobile_react_tailwind_js.jsx` | `src/shared/components/errors/ConnectorMismatch.tsx` | 🟡 MEDIUM |
| `batch_20_reservation_not_ready_mobile_react_tailwind_js.jsx` | `src/shared/components/errors/ReservationNotReady.tsx` | 🟡 MEDIUM |
| `batch_21_notification_settings_mobile_react_tailwind_js.jsx` | `src/features/profile/components/NotificationSettings.tsx` | 🟡 MEDIUM |
| `batch_21_reminder_preferences_mobile_react_tailwind_js.jsx` | `src/features/profile/components/ReminderPreferences.tsx` | 🟢 LOW |
| `batch_22_language_units_mobile_react_tailwind_js.jsx` | `src/features/profile/components/LanguageUnits.tsx` | 🟡 MEDIUM |
| `batch_22_privacy_support_mobile_react_tailwind_js.jsx` | `src/features/profile/components/PrivacySupport.tsx` | 🟡 MEDIUM |
| `batch_22_profile_settings_mobile_react_tailwind_js.jsx` | `src/features/profile/screens/ProfileScreen.tsx` | 🔴 HIGH |
| `batch_23_offline_cache_screen_mobile_react_tailwind_js.jsx` | `src/shared/components/OfflineCache.tsx` | 🟢 LOW |

### Filters (Various Batches)
| Source File | Target Location | Priority |
|------------|----------------|----------|
| `batch_01_filter_hub_power_connector_availability_mobile_react_tailwind_js.jsx` | `src/shared/components/filters/FilterHub.tsx` | 🟡 MEDIUM |
| `batch_03_filter_connector_types_mobile_react_tailwind_js.jsx` | `src/shared/components/filters/ConnectorFilter.tsx` | 🟡 MEDIUM |
| `batch_03_filter_hub_sheet_mobile_react_tailwind_js.jsx` | `src/shared/components/filters/FilterSheet.tsx` | 🟡 MEDIUM |
| `batch_03_filter_power_k_w_mobile_react_tailwind_js.jsx` | `src/shared/components/filters/PowerFilter.tsx` | 🟡 MEDIUM |
| `batch_04_filter_access_mobile_react_tailwind_js.jsx` | `src/shared/components/filters/AccessFilter.tsx` | 🟢 LOW |
| `batch_04_filter_location_types_mobile_react_tailwind_js.jsx` | `src/shared/components/filters/LocationTypeFilter.tsx` | 🟢 LOW |
| `batch_04_filter_networks_mobile_react_tailwind_js.jsx` | `src/shared/components/filters/NetworkFilter.tsx` | 🟢 LOW |
| `batch_05_filter_multiple_devices_mobile_react_tailwind_js.jsx` | `src/shared/components/filters/MultipleDevicesFilter.tsx` | 🟢 LOW |
| `batch_05_filter_station_category_mobile_react_tailwind_js.jsx` | `src/shared/components/filters/StationCategoryFilter.tsx` | 🟢 LOW |
| `batch_05_filter_user_rating_mobile_react_tailwind_js.jsx` | `src/shared/components/filters/RatingFilter.tsx` | 🟢 LOW |

### Additional Components
| Source File | Target Location | Priority |
|------------|----------------|----------|
| `batch_14_pricing_info_sheet_mobile_react_tailwind_js.jsx` | `src/shared/components/PricingInfo.tsx` | 🟢 LOW |
| `batch_14_roaming_network_badges_mobile_react_tailwind_js.jsx` | `src/shared/components/NetworkBadges.tsx` | 🟢 LOW |
| `batch_10_contact_support_quick_action_mobile_react_tailwind_js.jsx` | `src/shared/components/ContactSupport.tsx` | 🟢 LOW |
| `p_0_02_booking_modify_reschedule_mobile_react_tailwind_js.jsx` | `src/features/booking/components/ModifyBooking.tsx` | 🟡 MEDIUM |
| `p_0_03_reservation_expired_cancelled_mobile_react_tailwind_js.jsx` | `src/shared/components/errors/ReservationExpired.tsx` | 🟡 MEDIUM |
| `p_0_05_mobile_charging_eta_tracking_mobile_react_tailwind_js.jsx` | `src/features/charging/components/ETATracking.tsx` | 🟡 MEDIUM |
| `p_0_06_payment_3_d_secure_otp_handoff_mobile_react_tailwind_js.jsx` | `src/features/wallet/components/Payment3DSecure.tsx` | 🟡 MEDIUM |
| `p_0_07_payment_refund_void_confirmation_mobile_react_tailwind_js.jsx` | `src/features/wallet/components/RefundConfirmation.tsx` | 🟢 LOW |
| `p_0_08_camera_permission_explainer_mobile_react_tailwind_js.jsx` | `src/shared/components/CameraPermission.tsx` | 🟡 MEDIUM |
| `p_0_09_scan_failed_retry_mobile_react_tailwind_js.jsx` | `src/shared/components/errors/ScanFailed.tsx` | 🟡 MEDIUM |
| `p_0_10_resume_active_charging_prompt_mobile_react_tailwind_js.jsx` | `src/features/charging/components/ResumePrompt.tsx` | 🟡 MEDIUM |
| `p_0_11_terms_of_service_mobile_react_tailwind_js.jsx` | `src/shared/components/TermsOfService.tsx` | 🟢 LOW |
| `booking_fee_advance_scheduling_preview_mobile_react_tailwind_js.jsx` | `src/features/booking/components/BookingPreview.tsx` | 🟡 MEDIUM |
| `prepaid_fixed_charging_mobile_react_tailwind_js.jsx` | `src/features/charging/components/PrepaidCharging.tsx` | 🟡 MEDIUM |
| `batch_08_export_center_mobile_react_tailwind_js.jsx` | `src/features/activity/components/ExportCenter.tsx` | 🟢 LOW |

---

## 🎯 Integration Priority Matrix

### Phase 1: Foundation (Week 1)
- ✅ TypeScript setup (DONE)
- 🔴 Core context & SDK
- 🔴 App shell & navigation
- 🔴 Map wrapper component
- 🔴 Basic type definitions

### Phase 2: Core Features (Week 2)
- 🔴 Discovery screen
- 🔴 Station details
- 🔴 Basic booking flow
- 🟡 Filters system

### Phase 3: Charging Flow (Week 3)
- 🔴 Activation & QR scanning
- 🔴 Charging progress
- 🔴 Completion & receipts
- 🟡 Error handling

### Phase 4: User Features (Week 4)
- 🔴 Wallet & payments
- 🔴 Activity history
- 🔴 Profile & settings
- 🟡 Additional features

---

## 📋 TypeScript Type Definitions Needed

```typescript
// src/core/types/station.ts
interface Station {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  address: string;
  rating: number;
  price: number;
  connectors: Connector[];
  availability: Availability;
  amenities: string[];
  images: string[];
}

// src/core/types/booking.ts
interface Booking {
  id: string;
  stationId: string;
  startTime: Date;
  endTime?: Date;
  connectorType: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
}

// src/core/types/session.ts
interface ChargingSession {
  id: string;
  stationId: string;
  connectorId: string;
  startTime: Date;
  endTime?: Date;
  energyDelivered: number;
  cost: number;
  status: 'ready' | 'charging' | 'completed' | 'stopped';
}
```

---

## 🔧 Quick Setup Commands

```bash
# Install dependencies
npm install framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p

# Start development
npm start
```

