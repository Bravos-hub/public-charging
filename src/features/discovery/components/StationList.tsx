/**
 * Station List Component (TypeScript)
 * Draggable list bottom sheet for stations
 */

import React from 'react';
import { MapPin, Star, Bolt, Navigation2 } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import type { Station } from '../../../core/types';

interface StationRowProps {
  station: Station;
  distance?: string;
  onViewDetails?: () => void;
}

function StationRow({ station, distance = '0.8 km', onViewDetails }: StationRowProps): React.ReactElement {
  const availText = `${station.availability.available}/${station.availability.total}`;

  return (
    <div className="p-3 rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-slate-800 truncate flex items-center gap-2">
            <MapPin className="h-4 w-4" /> {station.name}
          </div>
          <div className="mt-0.5 text-[11px] text-slate-600 flex items-center gap-3">
            <span>{distance}</span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-400" /> {station.rating.toFixed(1)}
            </span>
            <span>{availText} Available</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
            {station.connectors.slice(0, 2).map((connector, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 inline-flex items-center gap-1"
              >
                <Bolt className="h-3 w-3" /> {connector.type} {connector.power}kW
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0">
          <button
            className="h-9 px-3 rounded-lg text-white text-[12px] font-medium"
            style={{ backgroundColor: EVZ_COLORS.orange }}
            onClick={onViewDetails}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

interface StationListProps {
  stations: Station[];
  onStationClick?: (station: Station) => void;
  onNavigate?: () => void;
}

export function StationList({ stations, onStationClick, onNavigate }: StationListProps): React.ReactElement {
  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Map backdrop */}
      <div className="h-[45vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white" />

      {/* Sheet */}
      <div className="relative -mt-6">
        <div className="max-w-md mx-auto px-4">
          <div className="rounded-t-3xl bg-white border-t border-slate-200 shadow-xl">
            <div className="py-3 grid place-items-center">
              <div className="h-1.5 w-12 rounded-full bg-slate-300" />
            </div>
            <div className="px-4 pb-24 space-y-3">
              {stations.map((station) => (
                <StationRow
                  key={station.id}
                  station={station}
                  onViewDetails={() => onStationClick?.(station)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating navigate button */}
      <div className="fixed right-4 bottom-4 max-w-md mx-auto">
        <button
          className="h-12 px-3 rounded-xl bg-white border border-slate-200 shadow inline-flex items-center gap-2 text-[13px]"
          onClick={onNavigate}
        >
          <Navigation2 className="h-4 w-4" /> Start navigation
        </button>
      </div>
    </div>
  );
}

