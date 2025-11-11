/**
 * Discover Screen (TypeScript)
 * Map view with charging stations
 */

import React, { useMemo, useState } from 'react';
import { QrCode, Filter, Layers, Crosshair, Search } from 'lucide-react';
import { useNavigation } from '../../core';
import { EVZ_COLORS } from '../../core/utils/constants';
import { MapSurface, type MapMarker } from '../../features/discovery/components/MapWrapper';
import type { Location } from '../../core/types';

export function DiscoverScreen(): React.ReactElement {
  const { push } = useNavigation();
  const [center] = useState<Location>({ lat: 0.314, lng: 32.582 });
  const [searchQuery, setSearchQuery] = useState('');

  // Generate markers with different statuses
  const markers = useMemo<MapMarker[]>(
    () => [
      { id: 'KLA-001', lat: 0.3141, lng: 32.5821, title: 'Central Hub', status: 'available' },
      { id: 'KLA-002', lat: 0.3137, lng: 32.5829, title: 'Airport Park', status: 'busy' },
      { id: 'KLA-003', lat: 0.3152, lng: 32.5815, title: 'City Square', status: 'offline' },
      { id: 'KLA-004', lat: 0.3135, lng: 32.5835, title: 'Downtown Mall', status: 'available' },
      { id: 'KLA-005', lat: 0.3155, lng: 32.5805, title: 'Business Park', status: 'busy' },
      { id: 'KLA-006', lat: 0.3125, lng: 32.5845, title: 'Tech Hub', status: 'available' },
    ],
    []
  );

  function handlePinTap(marker: MapMarker): void {
    const station = {
      id: marker.id,
      name: marker.title,
      location: { lat: marker.lat, lng: marker.lng },
      address: `${marker.title} Street, Kampala, UG`,
      rating: 4.5,
      price: 3000,
      connectors: [],
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
    push('STATION_DETAILS', { station, stationId: marker.id });
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
        <button className="w-full h-11 rounded-xl px-4 bg-white shadow border border-slate-200 text-left text-[13px] text-slate-600 hover:bg-slate-50 transition-colors">
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

      {/* QR Scanner Button - Bottom Right */}
      <div className="absolute bottom-28 right-4 z-10">
        <button
          onClick={() => push('ACTIVATION_SCAN')}
          className="h-14 w-14 rounded-2xl text-white shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow"
          style={{ background: `linear-gradient(135deg, ${EVZ_COLORS.green}, #10b981)` }}
          title="Scan to charge"
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
    </div>
  );
}

