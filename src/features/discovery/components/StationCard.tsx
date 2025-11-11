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
}

export function StationCard({
  station,
  distance = '0.8 km',
  onViewDetails,
  onBook,
  onNavigate,
  onStartNow,
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
              <div className="shrink-0 grid gap-2">
                <button
                  className="h-8 px-3 rounded-lg text-white text-[12px] font-medium"
                  style={{ backgroundColor: EVZ_COLORS.orange }}
                  onClick={onViewDetails}
                >
                  View Details
                </button>
                <button
                  className="h-8 px-3 rounded-lg border border-slate-300 bg-white text-[12px] text-slate-700"
                  onClick={onBook}
                >
                  Book
                </button>
              </div>
            </div>

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

