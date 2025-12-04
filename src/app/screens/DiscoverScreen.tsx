/**
 * Discover Screen (TypeScript)
 * Map view with charging stations - Fixed Stations and Mobile Charging toggle
 */

import React, { useState, useMemo, useRef } from 'react';
import { MapPin, Filter, Layers, Crosshair, QrCode, Zap, Search, X, Star, Bolt, Navigation2 } from 'lucide-react';
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

// Calculate distance (mock - in real app, use geolocation)
function calculateDistance(stationId: number): string {
  const distances: Record<number, string> = {
    1: '0.8 km',
    2: '4.2 km',
    3: '6.5 km',
    4: '10 km',
    5: '12.5 km',
  };
  return distances[stationId] || '0 km';
}

export function DiscoverScreen(): React.ReactElement {
  const { push } = useNavigation();
  const [stationMode, setStationMode] = useState<StationMode>('fixed');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedStation, setSelectedStation] = useState<{ station: Station; distance: string; pointId: number } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isFixed = stationMode === 'fixed';
  const isMobile = stationMode === 'mobile';

  // Get stations to display (all or filtered)
  const stationsToDisplay = useMemo(() => {
    if (!searchQuery.trim()) {
      return STATION_POINTS;
    }

    const query = searchQuery.toLowerCase().trim();
    return STATION_POINTS.filter((point) => {
      const station = STATION_DATA[point.id];
      if (!station) return false;

      // Search by name
      const nameMatch = station.name.toLowerCase().includes(query);
      
      // Search by location/address
      const locationMatch = station.address.toLowerCase().includes(query);
      
      // Search by availability status
      const statusMatch = 
        (query === 'available' && point.status === 'available') ||
        (query === 'in use' && point.status === 'inUse') ||
        (query === 'unavailable' && point.status === 'unavailable') ||
        (query === 'busy' && point.status === 'inUse') ||
        (query === 'free' && point.status === 'available');
      
      // Search by availability count (e.g., "3 available", "available 3")
      const availMatch = 
        query.includes('available') && station.availability.available > 0 ||
        /^\d+\s*available/.test(query) && station.availability.available >= parseInt(query) ||
        /available\s*\d+/.test(query) && station.availability.available >= parseInt(query.replace(/\D/g, ''));
      
      return nameMatch || locationMatch || statusMatch || availMatch;
    });
  }, [searchQuery]);

  // Get station data for list display
  const stationsListData = useMemo(() => {
    return stationsToDisplay.map((point) => ({
      point,
      station: STATION_DATA[point.id],
      distance: calculateDistance(point.id),
    })).filter((item) => item.station !== undefined);
  }, [stationsToDisplay]);

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
      const distance = calculateDistance(stationId);
      setSelectedStation({ station, distance, pointId: stationId });
      setIsSearchFocused(false); // Close bottom sheet when showing popup
    }
  }

  function handleClosePopup(): void {
    setSelectedStation(null);
  }

  function handleViewDetails(): void {
    if (selectedStation) {
      push('STATION_DETAILS', { station: selectedStation.station, stationId: selectedStation.station.id });
      setSelectedStation(null);
    }
  }

  function handleBook(): void {
    if (selectedStation) {
      push('BOOK_FIXED_TIME', { stationId: selectedStation.station.id, station: selectedStation.station });
      setSelectedStation(null);
    }
  }

  function handleNavigate(): void {
    if (selectedStation) {
      const { lat, lng } = selectedStation.station.location;
      window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
    }
  }

  function handleStartNow(): void {
    if (selectedStation) {
      push('ACTIVATION_CHOOSE_CONNECTOR', { stationId: selectedStation.station.id, station: selectedStation.station });
      setSelectedStation(null);
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
              stationsToDisplay.map((point) => {
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

            {/* Bottom sheet with nearby stations - shown when search is focused */}
            {isFixed && isSearchFocused && (
              <div 
                className="absolute inset-x-0 z-30 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300"
                style={{ bottom: 88, maxHeight: 'calc(100% - 100px)' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drag handle */}
                <div className="py-3 grid place-items-center">
                  <div className="h-1.5 w-12 rounded-full bg-slate-300" />
                </div>

                {/* Header */}
                <div className="px-4 pb-3">
                  <h3 className="text-[15px] font-semibold text-slate-900">
                    {searchQuery ? 'Search Results' : 'Nearby Chargers'}
                  </h3>
                  <p className="text-[12px] text-slate-500 mt-0.5">
                    {stationsListData.length} station{stationsListData.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                {/* Stations list */}
                <div className="px-4 pb-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                  {stationsListData.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-[13px]">
                      No stations found matching "{searchQuery}"
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stationsListData.map(({ point, station, distance }) => {
                        if (!station) return null;
                        const availText = `${station.availability.available}/${station.availability.total}`;
                        
                        return (
                          <button
                            key={point.id}
                            type="button"
                              onMouseDown={(e) => {
                                // Prevent blur from closing the sheet before click
                                e.preventDefault();
                              }}
                              onClick={() => {
                                handleStationClick(point.id);
                              }}
                            className="w-full p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="text-[13px] font-semibold text-slate-800 truncate flex items-center gap-2">
                                  <MapPin className="h-4 w-4 flex-shrink-0" />
                                  <span className="truncate">{station.name}</span>
                                </div>
                                <div className="mt-0.5 text-[11px] text-slate-600 flex items-center gap-3 flex-wrap">
                                  <span>{distance}</span>
                                  <span className="inline-flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                    {station.rating.toFixed(1)}
                                  </span>
                                  <span>{availText} Available</span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
                                  {station.connectors.slice(0, 2).map((connector, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 inline-flex items-center gap-1"
                                    >
                                      <Bolt className="h-3 w-3" />
                                      {connector.type} {connector.power}kW
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="shrink-0">
                                <div
                                  className="h-9 px-3 rounded-lg text-white text-[12px] font-medium flex items-center justify-center"
                                  style={{ backgroundColor: EVZ_COLORS.orange }}
                                >
                                  Details
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* QR Code button - positioned just above search bar */}
            {isFixed && (
              <div className="absolute right-4 z-40" style={{ bottom: 88 }}>
                <button
                  type="button"
                  onClick={handleScanClick}
                  title="Scan QR"
                  className="h-14 w-14 rounded-xl text-white shadow-xl grid place-items-center hover:shadow-2xl transition-shadow"
                  style={{ backgroundColor: EVZ_COLORS.orange }}
                >
                  <QrCode className="h-6 w-6" />
                </button>
              </div>
            )}

            {/* Bottom search input (fixed mode only) - always visible */}
            {isFixed && (
              <div className="absolute inset-x-0 z-40" style={{ bottom: 24 }}>
                <div className="px-4">
                  <div className="h-12 rounded-xl bg-white shadow-lg border border-slate-200 flex items-center px-4 gap-3">
                    <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => {
                        // Delay to allow clicks on list items
                        setTimeout(() => setIsSearchFocused(false), 200);
                      }}
                      placeholder="Find EV Charging Station…"
                      className="flex-1 h-full outline-none text-[13px] text-slate-700 placeholder:text-slate-400"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          searchInputRef.current?.focus();
                        }}
                        className="h-6 w-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors flex-shrink-0"
                        aria-label="Clear search"
                      >
                        <X className="h-3.5 w-3.5 text-slate-600" />
                      </button>
                    )}
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

            {/* Station Popup Modal */}
            {selectedStation && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black/50 z-50"
                  onClick={handleClosePopup}
                />
                {/* Popup Card */}
                <div className="fixed inset-x-4 bottom-24 z-50 max-w-md mx-auto">
                  <div className="rounded-3xl bg-white border border-slate-200 shadow-2xl p-4">
                    {/* Top Section: Station name with View Details button */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-semibold text-slate-800 flex items-center gap-2">
                          <MapPin className="h-4 w-4 flex-shrink-0 text-slate-500" />
                          <span className="truncate">{selectedStation.station.name}</span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-600 flex items-center gap-3 flex-wrap">
                          <span>{selectedStation.distance}</span>
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                            {selectedStation.station.rating.toFixed(1)}
                          </span>
                          <span>
                            {selectedStation.station.availability.available}/{selectedStation.station.availability.total} Available
                          </span>
                        </div>
                      </div>
                      <button
                        className="h-8 px-3 rounded-lg text-white text-[12px] font-medium shrink-0"
                        style={{ backgroundColor: EVZ_COLORS.orange }}
                        onClick={handleViewDetails}
                      >
                        View Details
                      </button>
                    </div>

                    {/* Middle Section: Connector types with Book button */}
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-700">
                        {selectedStation.station.connectors.slice(0, 2).map((connector, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 inline-flex items-center gap-1"
                          >
                            <Bolt className="h-3 w-3" />
                            {connector.type} {connector.power}kW
                          </span>
                        ))}
                      </div>
                      <button
                        className="h-8 px-3 rounded-lg border border-slate-300 bg-white text-[12px] text-slate-700 shrink-0"
                        onClick={handleBook}
                      >
                        Book
                      </button>
                    </div>

                    {/* Bottom Section: Navigate and Start Now buttons */}
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <button
                        className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2 text-[13px] font-medium"
                        onClick={handleNavigate}
                      >
                        <Navigation2 className="h-4 w-4" />
                        Navigate
                      </button>
                      <button
                        className="h-10 rounded-xl text-white font-medium text-[13px]"
                        style={{ backgroundColor: EVZ_COLORS.orange }}
                        onClick={handleStartNow}
                      >
                        Start Now
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
      </div>
    </div>
  );
}
