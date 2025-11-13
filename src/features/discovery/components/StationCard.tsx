/**
 * Station Card Component (TypeScript)
 * Bottom sheet preview for station on map
 */

import React from 'react';
import { MapPin, Star, Bolt, Navigation2 } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import type { Station } from '../../../core/types';

interface StationCardProps {
  station: Station;
  distance?: string;
  onViewDetails?: () => void;
  onBook?: () => void;
  onNavigate?: () => void;
  onStartNow?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function StationCard({
  station,
  distance = '0.8 km',
  onViewDetails,
  onBook,
  onNavigate,
  onStartNow,
  isFavorite = false,
  onToggleFavorite,
}: StationCardProps): React.ReactElement {
  const availText = `${station.availability.available}/${station.availability.total}`;

  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Map backdrop */}
      <div className="h-[60vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white" />

      {/* Tap sheet */}
      <div className="relative -mt-8">
        <div className="max-w-md mx-auto px-4">
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-4">
            {/* Top Section: Station name with View Details button on the right */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-slate-800 truncate flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" /> {station.name}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-600 flex items-center gap-3">
                  <span>{distance}</span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> {station.rating.toFixed(1)}
                  </span>
                  <span>{availText} Available</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  aria-label="Favorite"
                  onClick={onToggleFavorite}
                  className="h-8 w-8 grid place-items-center rounded-lg border border-slate-300 bg-white"
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`}>
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.53C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
                <button
                  className="h-8 px-3 rounded-lg text-white text-[12px] font-medium"
                  style={{ backgroundColor: EVZ_COLORS.orange }}
                  onClick={onViewDetails}
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Middle Section: Connector types with Book button on the right */}
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-700">
                {station.connectors.slice(0, 2).map((connector, i) => (
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
                onClick={onBook}
              >
                Book
              </button>
            </div>

            {/* Bottom Section: Navigate and Start Now buttons */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2"
                onClick={onNavigate}
              >
                <Navigation2 className="h-4 w-4" /> Navigate
              </button>
              <button
                className="h-10 rounded-xl text-white font-medium"
                style={{ backgroundColor: EVZ_COLORS.orange }}
                onClick={onStartNow}
              >
                Start Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
