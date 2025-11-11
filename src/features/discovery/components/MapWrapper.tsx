/**
 * Map Wrapper Component (TypeScript)
 * Provider-agnostic map abstraction
 */

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Search, Crosshair, Layers, Filter } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import type { Location, Station } from '../../../core/types';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  status: 'available' | 'busy' | 'offline';
}

export interface MapSurfaceProps {
  center: Location;
  zoom?: number;
  markers?: MapMarker[];
  onPinTap?: (marker: MapMarker) => void;
  onRegionChange?: (region: { center: Location; zoom: number }) => void;
}

function Pin({
  status = 'available',
  onClick,
}: {
  status?: 'available' | 'busy' | 'offline';
  onClick?: () => void;
}): React.ReactElement {
  const color =
    status === 'available'
      ? 'bg-emerald-500'
      : status === 'busy'
      ? 'bg-blue-500'
      : 'bg-slate-400';
  return (
    <button
      onClick={onClick}
      className={`h-6 w-6 rounded-full ${color} shadow border border-white`}
      aria-label={`Station ${status}`}
    />
  );
}

export function MapSurface({
  center,
  zoom = 14,
  markers = [],
  onPinTap,
  onRegionChange,
}: MapSurfaceProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Provider adapter attach point; call onRegionChange when panned/zoomed.
    const el = ref.current;
    function handle(): void {
      onRegionChange?.({ center, zoom });
    }
    const id = setInterval(handle, 2000); // stub
    return () => clearInterval(id);
  }, [center.lat, center.lng, zoom, onRegionChange]);

  // Calculate marker positions (simplified - in real app, use map projection)
  const markerPositions = useMemo(() => {
    // Distribute markers across the map viewport
    const positions: Array<{ left: string; top: string; marker: MapMarker }> = [];
    const positionsMap = [
      { left: '35%', top: '40%' },
      { left: '58%', top: '55%' },
      { left: '72%', top: '30%' },
      { left: '25%', top: '60%' },
      { left: '65%', top: '70%' },
      { left: '45%', top: '25%' },
      { left: '80%', top: '50%' },
      { left: '20%', top: '35%' },
    ];
    
    markers.forEach((marker, index) => {
      const pos = positionsMap[index % positionsMap.length];
      if (pos) {
        positions.push({ ...pos, marker });
      }
    });
    
    return positions;
  }, [markers]);

  return (
    <div ref={ref} className="relative h-full w-full" style={{ minHeight: '100%' }}>
      <div className="absolute inset-0 provider-placeholder bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white" />
      {/* Map provider placeholder text */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-slate-500">
          Map provider here
        </div>
      </div>
      {/* Render all markers */}
      {markerPositions.map(({ left, top, marker }, index) => (
        <div
          key={marker.id || index}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20"
          style={{ left, top }}
        >
          <Pin
            status={marker.status}
            onClick={() => onPinTap?.(marker)}
          />
        </div>
      ))}
    </div>
  );
}

interface GeocoderResult {
  lat: number;
  lng: number;
  label: string;
}

function useGeocoder(): {
  geocode: (query: string) => Promise<GeocoderResult>;
  loading: boolean;
} {
  const [loading, setLoading] = useState(false);

  async function geocode(q: string): Promise<GeocoderResult> {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    // Return a fake coordinate - replace with real geocoder
    return { lat: 0.314, lng: 32.582, label: `Result for "${q}"` };
  }

  return { geocode, loading };
}

export default function MapWrapperSearch(): React.ReactElement {
  const { geocode, loading } = useGeocoder();
  const [center, setCenter] = useState<Location>({ lat: 0.314, lng: 32.582 });
  const [query, setQuery] = useState('');

  const markers = useMemo<MapMarker[]>(
    () => [
      { id: 'KLA-001', lat: 0.3141, lng: 32.5821, title: 'Central Hub', status: 'available' },
      { id: 'KLA-002', lat: 0.3137, lng: 32.5829, title: 'Airport Park', status: 'busy' },
      { id: 'KLA-003', lat: 0.3152, lng: 32.5815, title: 'City Square', status: 'offline' },
    ],
    []
  );

  async function doSearch(): Promise<void> {
    if (!query.trim()) return;
    const r = await geocode(query.trim());
    setCenter({ lat: r.lat, lng: r.lng });
  }

  function onPinTap(marker: MapMarker): void {
    const go = (window as any).go;
    if (go && marker) {
      go('STATION_DETAILS', { stationId: marker.id });
    }
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center text-white">
          <MapPin className="h-5 w-5" />
          <span className="ml-2 font-semibold truncate">Discover chargers</span>
        </div>
      </div>

      <div className="max-w-md mx-auto relative h-[calc(100dvh-56px)]">
        <MapSurface center={center} markers={markers} onPinTap={onPinTap} onRegionChange={() => {}} />

        {/* Search this area & geocoder */}
        <div className="absolute top-3 left-4 right-4 flex items-center gap-2">
          <button
            className="flex-1 h-11 rounded-xl px-4 bg-white shadow border border-slate-200 text-left text-[13px] text-slate-600"
            onClick={() => {
              /* hook to refresh stations */
            }}
          >
            Search this area
          </button>
        </div>
        <div className="absolute inset-x-0" style={{ bottom: 24 }}>
          <div className="px-4 flex gap-2">
            <div className="h-12 flex-1 rounded-xl bg-white shadow border border-slate-200 flex items-center px-3">
              <Search className="h-4 w-4 text-slate-600 mr-2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find EV Charger Station…"
                className="flex-1 h-10 outline-none text-[13px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    doSearch();
                  }
                }}
              />
            </div>
            <button
              onClick={doSearch}
              disabled={loading}
              className="h-12 px-3 rounded-xl text-white font-medium disabled:opacity-50"
              style={{ backgroundColor: EVZ_COLORS.orange }}
            >
              {loading ? '...' : 'Go'}
            </button>
          </div>
        </div>

        {/* Map tools & legend */}
        <div className="absolute top-20 left-4 grid gap-2">
          <button
            title="Filters"
            onClick={() => {
              const go = (window as any).go;
              if (go) go('FILTER_HUB');
            }}
            className="h-10 w-10 rounded-xl bg-white shadow border border-slate-200 grid place-items-center"
          >
            <Filter className="h-5 w-5 text-slate-700" />
          </button>
          <button
            title="Layers"
            className="h-10 w-10 rounded-xl bg-white shadow border border-slate-200 grid place-items-center"
          >
            <Layers className="h-5 w-5 text-slate-700" />
          </button>
        </div>
        <div className="absolute top-20 right-4">
          <button
            title="Recenter"
            className="h-10 w-10 rounded-xl bg-white shadow border border-slate-200 grid place-items-center"
          >
            <Crosshair className="h-5 w-5 text-slate-700" />
          </button>
        </div>
        <div className="absolute bottom-28 left-4 bg-white/90 backdrop-blur border border-slate-200 rounded-xl px-3 py-2 text-[11px] text-slate-700 shadow">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" /> Available
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block" /> In use
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400 inline-block" /> Unavailable
          </div>
        </div>
      </div>
    </div>
  );
}

