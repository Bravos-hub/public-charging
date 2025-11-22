# EVzone Public Charging

Mobile-first React + Tailwind app that demonstrates the full EV public charging journey: discovery, booking, activation, live charging, payments/receipts, wallet, activity, and profile management.

## Features
- Discovery and filters: Map/list view with availability markers, search, QR entry, location permission prompt, compatibility helper, DR peak banner, and deep filter set (connector types, power, networks, access, location type, rating, multi-device, categories) in `src/shared/components/filters`.
- Station experience: Station overview with navigation, pricing, ratings, gallery, grid-event alert, favorite toggle, chargers/amenities tabs, and rating/report flows (`src/features/stations/screens`).
- Booking and scheduling: Fixed-time reservations, booking fee + payment selection, confirmation with calendar/share/directions, booking detail view, and mobile charging flows for location/time targets/on-the-way (`src/features/booking`).
- Charging activation and session: QR scan or manual ID, connector selection, scan failure fallback, prepaid and postpaid paths, charging ready/in-progress/complete screens with resume/stop, charger unavailable and reservation-not-ready states (`src/features/charging`).
- Receipts and exports: In-app receipts with PDF/PNG export via html2canvas + jsPDF, activity history, export center for CSV/PDF date ranges (`src/features/activity` and `src/features/charging/screens/ReceiptScreen.tsx`).
- Wallet and payments: Wallet balance/top-up demo, add payment methods (card/mobile money/Alipay/WeChat), default method selection, 3DS verification, refund/void flows, transactions list (`src/features/wallet`).
- Profile and settings: Favorites, notification and reminder preferences, language/units, test notification, project preview, privacy/support resources (`src/features/profile`).
- Support and compliance: Contact support, pricing/tariffs, terms of service, privacy policy, privacy-support screen (`src/features/support`, `src/app/screens`).
- Offline and reliability: Offline cache manager, system-offline screen, compatibility helper, update prompt tied to service worker, development reload guard to prevent SW loops (`src/shared/components/OfflineCache.tsx`, `src/app/screens/SystemOfflineScreen.tsx`, `src/index.tsx`).

## Tech Stack
- React 19 + TypeScript (Create React App) with feature-based folders.
- Tailwind CSS with EVZ palette (`tailwind.config.js`, `postcss.config.js`, `src/index.css`).
- Framer Motion animations and Lucide React icon set.
- Custom navigation and state via `src/core/context/NavigationContext.tsx` and `src/core/context/AppContext.tsx`.
- REST + SSE-ready SDK (`src/core/sdk/api.ts`, `src/core/sdk/sse.ts`) and PWA helpers (`src/core/utils/serviceWorker.ts`).
- Testing setup with React Testing Library and Jest.

## Project Structure
```
src/
  app/            # App shell, route wiring, tab layout
  core/           # Navigation/App contexts, types, SDK, utilities
  features/       # discovery, stations, booking, charging, activity, wallet, profile, support
  shared/         # Reusable UI (filters, errors, offline, permissions, navigation, banners)
  index.tsx       # Entry point with dev SW guards
```

## Getting Started
- Prerequisites: Node.js 18+ and npm.
- Install: `npm install`
- Run dev server: `npm start` (opens http://localhost:3000; service workers are disabled in development to avoid reload loops)
- Tests: `npm test`
- Production build: `npm run build`
- Eject CRA (optional): `npm run eject`

## Configuration
- `REACT_APP_API_BASE` (default `/api`) for the SDK in `src/core/sdk/api.ts`.
- `REACT_APP_APP_VERSION` (optional) shown in the update prompt.
- Map provider: `src/features/discovery/components/MapWrapper.tsx` ships a stub surface—replace with Google/Mapbox adapter and wire `onPinTap/onRegionChange` to live results.
- Backend integration: Replace mocked data in screens with SDK calls and hydrate state through `useApp` in `src/core/context/AppContext.tsx`.

## Key Flows
- Discover → Station Details → Book Fixed Time → Booking Fee/Payment → Confirmation → Activity.
- Discover → QR Scan or Enter ID → Choose Connector → Charging Ready → Charging In Progress → Charging Complete → Postpaid Payment/Receipt.
- Wallet → Add Payment Method → Transactions; Activity → Export Center; Profile → Settings/Notifications/Favorites.

## Notes
- UI ships with demo data to showcase flows; connect real APIs via the SDK and real-time SSE hooks.
- Service worker update prompt appears only in production; development aggressively unregisters SWs to avoid reload loops (see `RELOAD_LOOP_FIX.md`).
- Additional docs: `PROJECT_FINALIZATION.md`, `ANALYSIS_SUMMARY.md`, `COMPONENT_MAPPING.md`, `TAILWIND_SETUP.md`.
