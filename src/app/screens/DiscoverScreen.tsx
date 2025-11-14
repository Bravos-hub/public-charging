/**
 * Discover Screen (TypeScript)
 * Map view with charging stations
 */

import React, { useMemo, useState } from 'react';
import { QrCode, Filter, Layers, Crosshair, Search, Star, Bolt, MapPin, Navigation2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation, useApp } from '../../core';
import { EVZ_COLORS } from '../../core/utils/constants';
import { MapSurface, type MapMarker } from '../../features/discovery/components/MapWrapper';
import { NoStationsFound } from '../../shared/components/errors/NoStationsFound';
import type { Location, Station } from '../../core/types';

// Sample station data with connector types and power ratings
const ALL_STATIONS = [
  {
    id: 'KLA-001',
    lat: 0.3141,
    lng: 32.5821,
    title: 'Central Hub',
    status: 'available' as const,
    connectors: ['CCS2', 'Type 2'],
    maxPower: 60,
  },
  {
    id: 'KLA-002',
    lat: 0.3137,
    lng: 32.5829,
    title: 'Airport Park',
    status: 'busy' as const,
    connectors: ['CCS1', 'CHAdeMO'],
    maxPower: 50,
  },
  {
    id: 'KLA-003',
    lat: 0.3152,
    lng: 32.5815,
    title: 'City Square',
    status: 'offline' as const,
    connectors: ['Type 1', 'Type 2'],
    maxPower: 22,
  },
  {
    id: 'KLA-004',
    lat: 0.3135,
    lng: 32.5835,
    title: 'Downtown Mall',
    status: 'available' as const,
    connectors: ['CCS2', 'NACS (Tesla) DC'],
    maxPower: 150,
  },
  {
    id: 'KLA-005',
    lat: 0.3155,
    lng: 32.5805,
    title: 'Business Park',
    status: 'busy' as const,
    connectors: ['CHAdeMO', 'GB/T DC'],
    maxPower: 100,
  },
  {
    id: 'KLA-006',
    lat: 0.3125,
    lng: 32.5845,
    title: 'Tech Hub',
    status: 'available' as const,
    connectors: ['CCS2', 'Type 2', 'NACS (Tesla) AC'],
    maxPower: 350,
  },
  {
    id: 'KLA-007',
    lat: 0.3165,
    lng: 32.5855,
    title: 'Shopping Center',
    status: 'available' as const,
    connectors: ['Type 2', 'GB/T AC'],
    maxPower: 11,
  },
  {
    id: 'KLA-008',
    lat: 0.3115,
    lng: 32.5795,
    title: 'Residential Area',
    status: 'available' as const,
    connectors: ['Type 1', 'Type 2'],
    maxPower: 7,
  },
];

export function DiscoverScreen(): React.ReactElement {
  const { push } = useNavigation();
  const { filters, setFilters } = useApp();
  const [center] = useState<Location>({ lat: 0.314, lng: 32.582 });
  const [searchQuery, setSearchQuery] = useState('');
  const [showStationList, setShowStationList] = useState(false);
  const [selectedStation, setSelectedStation] = useState<{ station: Station; distance: string } | null>(null);

  // Apply filters to stations
  const filteredStations = useMemo(() => {
    let filtered = [...ALL_STATIONS];

    // Filter by availability
    if (filters.onlyAvail) {
      filtered = filtered.filter((s) => s.status === 'available');
    }

    // Filter by power range
    if (filters.minKw !== undefined || filters.maxKw !== undefined) {
      const min = filters.minKw ?? 3;
      const max = filters.maxKw ?? 350;
      filtered = filtered.filter((s) => s.maxPower >= min && s.maxPower <= max);
    }

    // Filter by connector types
    if (filters.connectorTypes && filters.connectorTypes.length > 0) {
      filtered = filtered.filter((s) =>
        s.connectors.some((connector) => filters.connectorTypes!.includes(connector))
      );
    }

    return filtered;
  }, [filters]);

  // Convert to MapMarker format
  const markers = useMemo<MapMarker[]>(
    () =>
      filteredStations.map((s) => ({
        id: s.id,
        lat: s.lat,
        lng: s.lng,
        title: s.title,
        status: s.status,
      })),
    [filteredStations]
  );

  // Convert filtered stations to Station format for the list
  const stationList = useMemo<Station[]>(() => {
    return filteredStations.map((s, idx) => {
      const rating = idx === 0 ? 4.6 : idx === 1 ? 4.3 : idx === 2 ? 4.1 : 4.5;
      const availability =
        s.status === 'available'
          ? { total: idx === 0 ? 4 : idx === 1 ? 3 : idx === 2 ? 6 : 4, available: idx === 0 ? 2 : idx === 1 ? 1 : idx === 2 ? 3 : 2, busy: 1, offline: 0 }
          : s.status === 'busy'
          ? { total: 4, available: 0, busy: 3, offline: 1 }
          : { total: 4, available: 0, busy: 0, offline: 4 };

      return {
        id: s.id,
        name: s.title.includes('—') ? s.title : `${s.title} — ${idx === 0 ? 'Downtown Mall' : idx === 1 ? 'Lot B' : idx === 2 ? 'Tower A' : 'Location'}`,
        location: { lat: s.lat, lng: s.lng },
        address: `${s.title} Street, Kampala, UG`,
        rating,
        price: 3000,
        connectors: s.connectors.map((type, i) => ({
          id: `${s.id}-conn-${i}`,
          type,
          power: s.maxPower,
          status: s.status === 'available' ? 'available' : s.status === 'busy' ? 'busy' : 'offline',
        })),
        availability,
        amenities: [],
        images: [],
        open24_7: true,
      };
    });
  }, [filteredStations]);

  function handlePinTap(marker: MapMarker): void {
    // Find the full station data
    const stationData = ALL_STATIONS.find((s) => s.id === marker.id);
    const station = {
      id: marker.id,
      name: marker.title,
      location: { lat: marker.lat, lng: marker.lng },
      address: `${marker.title} Street, Kampala, UG`,
      rating: 4.5,
      price: 3000,
      connectors:
        stationData?.connectors.map((type, idx) => ({
          id: `${marker.id}-conn-${idx}`,
          type,
          power: stationData.maxPower,
          status: (marker.status === 'available' ? 'available' : marker.status === 'busy' ? 'busy' : 'offline') as 'available' | 'busy' | 'offline' | 'maintenance',
        })) || [],
      availability:
        marker.status === 'available'
          ? { total: 4, available: 3, busy: 1, offline: 0 }
          : marker.status === 'busy'
          ? { total: 4, available: 0, busy: 3, offline: 1 }
          : { total: 4, available: 0, busy: 0, offline: 4 },
      amenities: [],
      images: [],
      open24_7: true,
    };
    setSelectedStation({ station, distance: '0.8 km' });
  }

  function handleLocateMe(): void {
    // In a real app, this would get user's current location
    // For now, just center on a default location
    console.log('Locate me');
  }

  return (
    <div className="relative w-full" style={{ minHeight: 'calc(100dvh - 3.5rem - 56px)' }}>
      {/* Map */}
      <div className="absolute inset-0" style={{ minHeight: 'calc(100dvh - 3.5rem - 56px)' }}>
        <MapSurface center={center} markers={markers} onPinTap={handlePinTap} onRegionChange={() => {}} />
      </div>

      {/* Top Search Bar */}
      <div className="absolute top-3 left-4 right-4 z-10">
        <button
          onClick={() => setShowStationList(true)}
          className="w-full h-11 rounded-xl px-4 bg-white shadow border border-slate-200 text-left text-[13px] text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Search this area
        </button>
      </div>

      {/* Left Control Buttons */}
      <div className="absolute top-20 left-4 z-10 grid gap-2">
        <button
          onClick={() => push('FILTERS')}
          className="h-10 w-10 rounded-xl bg-white shadow border border-slate-200 grid place-items-center hover:bg-slate-50 transition-colors"
          title="Filters"
        >
          <Filter className="h-5 w-5 text-slate-700" />
        </button>
        <button
          className="h-10 w-10 rounded-xl bg-white shadow border border-slate-200 grid place-items-center hover:bg-slate-50 transition-colors"
          title="Layers"
        >
          <Layers className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      {/* Right Control Button - Locate Me */}
      <div className="absolute top-20 right-4 z-10">
        <button
          onClick={handleLocateMe}
          className="h-10 w-10 rounded-xl bg-white shadow border border-slate-200 grid place-items-center hover:bg-slate-50 transition-colors"
          title="Locate Me"
        >
          <Crosshair className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      {/* Legend - Bottom Left */}
      <div className="absolute bottom-28 left-4 z-10 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl px-3 py-2 text-[11px] text-slate-700 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" /> Available
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block" /> In use
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-400 inline-block" /> Unavailable
        </div>
      </div>

      {/* QR / Activation Button - Bottom Right */}
      <div className="absolute bottom-28 right-4 z-10">
        <button
          onClick={() => push('ACTIVATION_CHOOSE_CONNECTOR')}
          className="h-14 w-14 rounded-2xl text-white shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow"
          style={{ background: `linear-gradient(135deg, ${EVZ_COLORS.green}, #10b981)` }}
          title="Activate to charge"
        >
          <QrCode className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom Search Field */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="h-12 rounded-xl bg-white shadow-lg border border-slate-200 flex items-center px-3">
          <Search className="h-4 w-4 text-slate-600 mr-2 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find EV Charger Station…"
            className="flex-1 h-10 outline-none text-[13px] text-slate-700 placeholder:text-slate-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                // Handle search
                console.log('Searching for:', searchQuery);
              }
            }}
          />
        </div>
      </div>

      {/* Empty state when no stations after filters */}
      {filteredStations.length === 0 && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          {/* Header */}
          <div className="sticky top-0 w-full pointer-events-auto" style={{ backgroundColor: EVZ_COLORS.green }}>
            <div className="max-w-md mx-auto h-14 px-4 flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5" />
              <span className="font-semibold">No Stations Found</span>
            </div>
          </div>
          {/* Card */}
          <div className="max-w-md mx-auto px-4 mt-4 pointer-events-auto">
            <NoStationsFound
              onResetFilters={() => {
                setFilters({
                  onlyAvail: false,
                  fastOnly: false,
                  minKw: 3,
                  maxKw: 350,
                  connectorTypes: [],
                  networks: [],
                  locationTypes: [],
                  access: [],
                  userRating: undefined,
                  multipleDevices: undefined,
                  category: undefined,
                });
              }}
              onSearchArea={() => {
                // Placeholder for refreshing stations in current map viewport
                console.log('Search this area');
              }}
            />
          </div>
        </div>
      )}

      {/* Station List Bottom Sheet */}
      <AnimatePresence>
        {showStationList && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStationList(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-xl max-h-[85vh] overflow-hidden"
            >
              {/* Handle */}
              <div
                className="py-3 grid place-items-center cursor-pointer"
                onClick={() => setShowStationList(false)}
              >
                <div className="h-1.5 w-12 rounded-full bg-slate-300" />
              </div>
              {/* Content */}
              <div className="px-4 pb-24 overflow-y-auto max-h-[calc(85vh-3rem)]">
                <div className="space-y-3">
                  {stationList.map((station, idx) => {
                    const distance = idx === 0 ? '0.8 km' : idx === 1 ? '4.2 km' : idx === 2 ? '6.5 km' : `${(idx + 1) * 2.5} km`;
                    const availText = `${station.availability.available}/${station.availability.total}`;
                    const primaryConnector = station.connectors[0];
                    return (
                      <button
                        key={station.id}
                        onClick={() => {
                          setShowStationList(false);
                          setSelectedStation({ station, distance });
                        }}
                        className="w-full p-3 rounded-2xl border border-slate-200 bg-white text-left hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] font-semibold text-slate-800 truncate">
                              {station.name}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-600 flex items-center gap-3">
                              <span>{distance}</span>
                              <span className="inline-flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />{' '}
                                {station.rating.toFixed(1)}
                              </span>
                              <span>{availText} Available</span>
                            </div>
                            {primaryConnector && (
                              <div className="mt-2 text-[11px] text-slate-700 flex items-center gap-1">
                                <Bolt className="h-3.5 w-3.5" />
                                {primaryConnector.type} • {primaryConnector.power}kW
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Station Preview Overlay */}
      <AnimatePresence>
        {selectedStation && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStation(null)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            {/* Preview Card */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-x-0 bottom-0 z-50 pointer-events-none"
              style={{ paddingBottom: '56px' }}
            >
              <div className="max-w-md mx-auto px-4 pb-4">
                <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-4 pointer-events-auto">
                  {/* Top Section: Station name with View Details button on the right */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-slate-800 truncate flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" /> {selectedStation.station.name}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-600 flex items-center gap-3">
                        <span>{selectedStation.distance}</span>
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> {selectedStation.station.rating.toFixed(1)}
                        </span>
                        <span>{selectedStation.station.availability.available}/{selectedStation.station.availability.total} Available</span>
                      </div>
                    </div>
                    <button
                      className="h-8 px-3 rounded-lg text-white text-[12px] font-medium shrink-0"
                      style={{ backgroundColor: EVZ_COLORS.orange }}
                      onClick={() => {
                        setSelectedStation(null);
                        push('STATION_DETAILS', { station: selectedStation.station, stationId: selectedStation.station.id });
                      }}
                    >
                      View Details
                    </button>
                  </div>

                  {/* Middle Section: Connector types with Book button on the right */}
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-700">
                      {selectedStation.station.connectors.slice(0, 2).map((connector, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 inline-flex items-center gap-1"
                        >
                          <Bolt className="h-3 w-3" /> {connector.type} {connector.power}kW
                        </span>
                      ))}
                    </div>
                    <button
                      className="h-8 px-3 rounded-lg border border-slate-300 bg-white text-[12px] text-slate-700 shrink-0"
                      onClick={() => {
                        setSelectedStation(null);
                        push('BOOK_FIXED_TIME', { stationId: selectedStation.station.id, station: selectedStation.station });
                      }}
                    >
                      Book
                    </button>
                  </div>

                  {/* Bottom Section: Navigate and Start Now buttons */}
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2"
                      onClick={() => {
                        window.open(`https://maps.google.com/?q=${selectedStation.station.location.lat},${selectedStation.station.location.lng}`, '_blank');
                      }}
                    >
                      <Navigation2 className="h-4 w-4" /> Navigate
                    </button>
                    <button
                      className="h-10 rounded-xl text-white font-medium"
                      style={{ backgroundColor: EVZ_COLORS.orange }}
                      onClick={() => {
                        // Follow flow: Choose Connector → Scan QR / Enter ID
                        setSelectedStation(null);
                        push('ACTIVATION_CHOOSE_CONNECTOR', {
                          stationId: selectedStation.station.id,
                          station: selectedStation.station,
                        });
                      }}
                    >
                      Start Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
