/**
 * Discover Screen (TypeScript)
 * Map view with charging stations - Fixed Stations and Mobile Charging toggle
 */

import React, { useState } from 'react';
import { MapPin, Filter, Layers, Crosshair, QrCode, Zap } from 'lucide-react';
import { useNavigation } from '../../core';
import { EVZ_COLORS } from '../../core/utils/constants';
import type { Station } from '../../core';

type StationMode = 'fixed' | 'mobile';

interface StationPoint {
  id: number;
  top: string;
  left: string;
  status: 'available' | 'inUse' | 'unavailable';
}

interface UserLocation {
  top: string;
  left: string;
}

// Hard-coded markers for 5 fixed stations scattered on the map
const STATION_POINTS: StationPoint[] = [
  { id: 1, top: '24%', left: '22%', status: 'available' },
  { id: 2, top: '32%', left: '63%', status: 'available' },
  { id: 3, top: '48%', left: '30%', status: 'available' },
  { id: 4, top: '58%', left: '72%', status: 'inUse' },
  { id: 5, top: '40%', left: '83%', status: 'unavailable' },
];

// Station data for each marker
const STATION_DATA: Record<number, Station> = {
  1: {
    id: 'KLA-001',
    name: 'Central Hub — Downtown Mall',
    location: { lat: 0.3141, lng: 32.5821 },
    address: 'Plot 10 Main Street, City Center, Kampala, UG',
    rating: 4.6,
    price: 3000,
    connectors: [
      { id: 'EVZ-DC-01', type: 'CCS2', power: 60, status: 'available', price: 3000 },
      { id: 'EVZ-DC-02', type: 'CCS2', power: 60, status: 'available', price: 3000 },
      { id: 'EVZ-AC-03', type: 'Type2', power: 22, status: 'available', price: 1800 },
    ],
    availability: { total: 4, available: 3, busy: 1, offline: 0 },
    amenities: ['WiFi', 'Restroom', 'Cafe'],
    images: [],
    open24_7: true,
  },
  2: {
    id: 'KLA-002',
    name: 'Airport Park Charging',
    location: { lat: 0.3137, lng: 32.5829 },
    address: 'Entebbe Road, Near Airport, Kampala, UG',
    rating: 4.3,
    price: 3200,
    connectors: [
      { id: 'EVZ-DC-04', type: 'CCS2', power: 50, status: 'available', price: 3200 },
      { id: 'EVZ-DC-05', type: 'CHAdeMO', power: 50, status: 'available', price: 3200 },
    ],
    availability: { total: 3, available: 2, busy: 1, offline: 0 },
    amenities: ['WiFi', 'Restroom'],
    images: [],
    open24_7: true,
  },
  3: {
    id: 'KLA-003',
    name: 'City Square Station',
    location: { lat: 0.3152, lng: 32.5815 },
    address: 'City Square, Central Business District, Kampala, UG',
    rating: 4.1,
    price: 2800,
    connectors: [
      { id: 'EVZ-AC-06', type: 'Type2', power: 22, status: 'available', price: 1800 },
      { id: 'EVZ-AC-07', type: 'Type2', power: 22, status: 'available', price: 1800 },
    ],
    availability: { total: 6, available: 3, busy: 2, offline: 1 },
    amenities: ['WiFi', 'Restroom', 'Shopping'],
    images: [],
    open24_7: false,
  },
  4: {
    id: 'KLA-004',
    name: 'Downtown Mall Fast Charge',
    location: { lat: 0.3135, lng: 32.5835 },
    address: 'Downtown Mall, Ground Floor, Kampala, UG',
    rating: 4.5,
    price: 3500,
    connectors: [
      { id: 'EVZ-DC-08', type: 'CCS2', power: 150, status: 'busy', price: 3500 },
      { id: 'EVZ-DC-09', type: 'NACS (Tesla) DC', power: 150, status: 'busy', price: 3500 },
    ],
    availability: { total: 4, available: 0, busy: 3, offline: 1 },
    amenities: ['WiFi', 'Restroom', 'Cafe', 'Shopping'],
    images: [],
    open24_7: true,
  },
  5: {
    id: 'KLA-005',
    name: 'Business Park Charging',
    location: { lat: 0.3155, lng: 32.5805 },
    address: 'Business Park, Industrial Area, Kampala, UG',
    rating: 4.0,
    price: 3000,
    connectors: [
      { id: 'EVZ-DC-10', type: 'CHAdeMO', power: 100, status: 'offline', price: 3000 },
      { id: 'EVZ-DC-11', type: 'GB/T DC', power: 100, status: 'offline', price: 3000 },
    ],
    availability: { total: 4, available: 0, busy: 0, offline: 4 },
    amenities: ['WiFi'],
    images: [],
    open24_7: true,
  },
};

// Placeholder for user's location in Mobile Station mode
const MOBILE_USER_LOCATION: UserLocation = { top: '52%', left: '50%' };

export function DiscoverScreen(): React.ReactElement {
  const { push } = useNavigation();
  const [stationMode, setStationMode] = useState<StationMode>('fixed');

  const isFixed = stationMode === 'fixed';
  const isMobile = stationMode === 'mobile';

  function handleFilterClick(): void {
    push('FILTERS');
  }

  function handleScanClick(): void {
    push('ACTIVATION_SCAN');
  }

  function handleOrderNow(): void {
    push('BOOK_MOBILE_LOCATION');
  }

  function handleSchedule(): void {
    // Navigate to mobile charging schedule screen
    push('BOOK_MOBILE_SCHEDULE', {
      location: 'Your current EV location',
    });
  }

  function handleStationClick(stationId: number): void {
    const station = STATION_DATA[stationId];
    if (station) {
      push('STATION_DETAILS', { station, stationId: station.id });
    }
  }

  return (
    <div className="relative w-full h-full bg-white text-slate-900 overflow-hidden" style={{ minHeight: '100%' }}>
      {/* Content area - fills the container */}
      <div className="relative w-full h-full">
        {/* Map placeholder */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white" />

            {/* Mode toggle: Fixed Stations vs Mobile Station */}
            <div className="absolute top-3 left-4 right-4 flex justify-center z-20">
              <div className="grid grid-cols-2 w-full rounded-full bg-white/90 border border-slate-200 shadow-sm text-[11px] font-medium overflow-hidden">
                <button
                  type="button"
                  onClick={() => setStationMode('fixed')}
                  className={
                    'px-2 py-1.5 flex items-center justify-center gap-1 transition-colors ' +
                    (isFixed ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50')
                  }
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Fixed Stations</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStationMode('mobile')}
                  className={
                    'px-2 py-1.5 flex items-center justify-center gap-1 transition-colors ' +
                    (isMobile ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50')
                  }
                >
                  <Crosshair className="h-3.5 w-3.5" />
                  <span>Mobile Charging</span>
                </button>
              </div>
            </div>

            {/* Station markers (colored pins for availability) - only in Fixed mode */}
            {isFixed &&
              STATION_POINTS.map((point) => {
                const color =
                  point.status === 'available'
                    ? '#10b981' // green
                    : point.status === 'inUse'
                    ? '#3b82f6' // blue
                    : '#9ca3af'; // grey

                return (
                  <button
                    key={point.id}
                    type="button"
                    onClick={() => handleStationClick(point.id)}
                    className="absolute -translate-x-1/2 -translate-y-full z-10 cursor-pointer hover:scale-110 transition-transform"
                    style={{ top: point.top, left: point.left }}
                    aria-label={`Station ${point.id} - ${STATION_DATA[point.id]?.name || 'Charging Station'}`}
                  >
                    <div className="relative">
                      <MapPin className="h-7 w-7 drop-shadow-sm" style={{ color }} fill={color} />
                      {/* Electricity / energy bolt inside the pin */}
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <Zap className="h-3 w-3 text-white" />
                      </span>
                    </div>
                  </button>
                );
              })}

            {/* User location marker - only in Mobile station mode */}
            {isMobile && (
              <div
                className="absolute -translate-x-1/2 -translate-y-full z-10"
                style={{
                  top: MOBILE_USER_LOCATION.top,
                  left: MOBILE_USER_LOCATION.left,
                }}
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className="absolute h-8 w-8 rounded-full opacity-30 animate-ping"
                    style={{ backgroundColor: EVZ_COLORS.green }}
                  />
                  <span
                    className="h-5 w-5 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: EVZ_COLORS.green }}
                  />
                </div>
              </div>
            )}

            {/* Floating Action Buttons (FABs) - right side */}
            <div className="absolute right-4 top-20 grid gap-2 z-20">
              {isFixed && (
                <button
                  type="button"
                  onClick={handleFilterClick}
                  title="Filters"
                  className="h-12 w-12 rounded-full bg-white shadow-lg border border-slate-200 grid place-items-center hover:bg-slate-50 transition-colors"
                >
                  <Filter className="h-5 w-5 text-slate-700" />
                </button>
              )}
              <button
                type="button"
                title="Layers"
                className="h-12 w-12 rounded-full bg-white shadow-lg border border-slate-200 grid place-items-center hover:bg-slate-50 transition-colors"
              >
                <Layers className="h-5 w-5 text-slate-700" />
              </button>
              {isFixed && (
                <button
                  type="button"
                  onClick={handleScanClick}
                  title="Scan QR"
                  className="h-14 w-14 rounded-full text-white shadow-xl grid place-items-center hover:shadow-2xl transition-shadow"
                  style={{ backgroundColor: EVZ_COLORS.orange }}
                >
                  <QrCode className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Availability legend – only relevant in Fixed Stations mode */}
            {isFixed && (
              <div
                className="absolute left-4 bg-white/90 backdrop-blur border border-slate-200 rounded-xl px-3 py-2 text-[11px] text-slate-700 shadow z-20"
                style={{ bottom: 80 }}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
                  Available
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block" />
                  In use
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-400 inline-block" />
                  Unavailable
                </div>
              </div>
            )}

            {/* Bottom search input (fixed mode only) */}
            {isFixed && (
              <div className="absolute inset-x-0 z-20" style={{ bottom: 24 }}>
                <div className="px-4">
                  <div className="h-12 rounded-xl bg-white shadow border border-slate-200 flex items-center px-4 text-[13px] text-slate-600">
                    Find EV Charging Station…
                  </div>
                </div>
              </div>
            )}


            {/* Mobile actions – shown only in Mobile Station mode */}
            {isMobile && (
              <div className="absolute inset-x-0 z-20" style={{ bottom: 24 }}>
                <div className="px-4 flex gap-2">
                  <button
                    type="button"
                    onClick={handleOrderNow}
                    className="flex-1 h-11 rounded-xl text-[13px] font-semibold text-white shadow-md hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: EVZ_COLORS.orange }}
                  >
                    Order Now
                  </button>
                  <button
                    type="button"
                    onClick={handleSchedule}
                    className="flex-1 h-11 rounded-xl text-[13px] font-semibold border bg-white text-slate-800 shadow-md hover:shadow-lg transition-shadow"
                    style={{ borderColor: EVZ_COLORS.green }}
                  >
                    Schedule
                  </button>
                </div>
              </div>
            )}
      </div>
    </div>
  );
}
