# EVzone Public Charging - Developer Documentation

## 1. Project Overview

EVzone Public Charging is a mobile-first React application designed to manage the end-to-end electric vehicle public charging experience. It covers discovery, booking, activation, live charging, payments, wallet management, and user profile settings.

The application is built as a Progressive Web App (PWA) with offline capabilities, using Tailwind CSS for styling and a custom navigation stack for a native-app-like feel.

## 2. Architecture

### 2.1 Technology Stack

*   **Framework**: React 19 + TypeScript
*   **Build Tool**: Create React App (react-scripts)
*   **Styling**: Tailwind CSS (Utility-first)
*   **Animations**: Framer Motion
*   **Icons**: Lucide React
*   **State Management**: React Context API (`AppContext`, `NavigationContext`)
*   **PDF Generation**: html2canvas + jsPDF
*   **Testing**: Jest + React Testing Library

### 2.2 Directory Structure

The project follows a feature-based architecture:

```
src/
├── app/            # App shell, root component, and route wiring
├── core/           # Core infrastructure
│   ├── context/    # Global state (AppContext, NavigationContext)
│   ├── sdk/        # API client and SSE (Server-Sent Events) utilities
│   ├── utils/      # Shared utilities (i18n, formatting, service worker)
│   └── types/      # TypeScript type definitions
├── features/       # Feature modules (Business logic & UI)
│   ├── activity/   # History, receipts, exports
│   ├── booking/    # Reservation flows (Fixed & Mobile)
│   ├── charging/   # Active charging session management
│   ├── discovery/  # Map, search, and station list
│   ├── profile/    # User settings, preferences
│   ├── stations/   # Station details, amenities
│   ├── support/    # Help, legal, pricing info
│   └── wallet/     # Payment methods, balance, transactions
├── shared/         # Reusable UI components
│   ├── components/ # Generic components (Buttons, Cards, Modals)
│   └── filters/    # Filtering logic and UI
└── index.tsx       # Entry point
```

### 2.3 Navigation System

The app uses a custom stack-based router (`src/core/context/NavigationContext.tsx`) instead of a standard library like React Router. This provides fine-grained control over transitions and state preservation for a mobile-like experience.

*   **`useNavigation()` hook**: Exposes `push`, `replace`, `back` methods and the current `route`.
*   **`ROUTES` constant**: Defines all available screens (e.g., `DISCOVER`, `STATION_DETAILS`, `BOOK_FIXED_TIME`).
*   **Route Handling**: The `AppShell` component listens to the current route and renders the appropriate screen, handling full-screen modals vs. tabbed views.

### 2.4 State Management

Global state is managed via `AppContext` (`src/core/context/AppContext.tsx`), which provides a single source of truth for:

*   **Auth**: User user and token.
*   **Vehicle**: Active vehicle and vehicle list.
*   **Filters**: Active search filters.
*   **Booking**: Drafts for current booking flows.
*   **Session**: Active charging session state.
*   **Wallet**: Balance and payment methods.
*   **Preferences**: Notifications, reminders, favorites.

## 3. Feature Modules

### 3.1 Discovery (`src/features/discovery`)
*   **Map Interface**: Interactive map showing station clusters and availability.
*   **Station List**: Scrollable list of stations with availability indicators.
*   **Filtering**: Advanced filters for connector types, power, networks, etc.

### 3.2 Stations (`src/features/stations`)
*   **Station Overview**: Detailed view of a station, including location, rating, and images.
*   **Chargers List**: Real-time status of individual connectors (Available, Busy, Faulted).
*   **Amenities**: List of nearby amenities (Wifi, Cafe, etc.).

### 3.3 Booking (`src/features/booking`)
*   **Fixed Time**: Reserve a specific charger for a specific time slot.
*   **Mobile Charging**: Request a mobile charging van to a specific location or "on the way".
*   **Payment**: Handling booking fees and advance payments.

### 3.4 Charging (`src/features/charging`)
*   **Activation**: QR code scanning or manual ID entry.
*   **Monitoring**: Real-time progress (SOC, kWh delivered, time remaining).
*   **Completion**: Summary screen and receipt generation.
*   **Postpaid**: Handling payment after charging is complete.

### 3.5 Wallet (`src/features/wallet`)
*   **Payment Methods**: Add/Remove cards, mobile money.
*   **Transactions**: History of payments and refunds.
*   **Top-up**: Adding funds to the wallet balance.

### 3.6 Profile & Activity (`src/features/profile`, `src/features/activity`)
*   **Activity**: Historical record of charging sessions and bookings.
*   **Exports**: Export history as PDF or CSV.
*   **Settings**: Notification preferences, language, units.

## 4. Key User Flows

### 4.1 Discover & Book
1.  **Discover**: User finds a station on the map.
2.  **Details**: User views station details and clicks "Book".
3.  **Configure**: User selects time slot and connector.
4.  **Pay**: User confirms booking fee payment.
5.  **Confirm**: Booking is confirmed and added to activity.

### 4.2 Quick Charge (QR Scan)
1.  **Scan**: User taps generic QR scan button or scans specific charger.
2.  **Verify**: App identifies charger and checks availability.
3.  **Connect**: User plugs in.
4.  **Charge**: Session starts, user monitors progress.
5.  **Stop & Pay**: Session ends, receipt is generated.

## 5. Integration & Development

### 5.1 API Integration
The project currently uses mock data. To integrate with a real backend:
1.  Update `src/core/sdk/api.ts` to point to your API endpoints.
2.  Configure `REACT_APP_API_BASE` in your `.env` file.
3.  Replace the mock data in `AppContext` and feature screens with SDK calls.

### 5.2 Real-time Updates
Server-Sent Events (SSE) support is included in `src/core/sdk/sse.ts`. This can be used to subscribe to real-time updates for:
*   Charger status changes.
*   Charging session progress.
*   Booking confirmations.

### 5.3 Customizing
*   **Theme**: Edit `tailwind.config.js` to change colors and fonts.
*   **Map**: Replace the mock map in `MapWrapper.tsx` with Google Maps or Mapbox integration.

## 6. Running the Project

### Prerequisites
*   Node.js 18+
*   npm

### Commands
*   `npm install`: Install dependencies.
*   `npm start`: Run development server (http://localhost:3000).
*   `npm test`: Run test suite.
*   `npm run build`: Create production build.

## 7. Known Issues / Notes
*   **Service Workers**: Disabled in development to prevent reload loops. See `RELOAD_LOOP_FIX.md`.
*   **Map**: The map is currently a visual stub. Requires a real map provider for production use.
