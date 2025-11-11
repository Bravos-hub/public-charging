/**
 * Discover Screen (TypeScript)
 */

import React from 'react';
import { QrCode, Filter } from 'lucide-react';
import { useNavigation } from '../../core';
import { EVZ_COLORS } from '../../core/utils/constants';

export function DiscoverScreen(): React.ReactElement {
  const { push } = useNavigation();

  return (
    <div className="relative w-full" style={{ minHeight: 'calc(100dvh - 3.5rem - 56px)' }}>
      {/* Map placeholder */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-white" />

      {/* Top controls */}
      <div className="absolute top-3 left-4 right-4 flex items-center gap-2">
        <button className="flex-1 h-11 rounded-xl px-4 bg-white shadow border border-slate-200 text-left text-[13px] text-slate-600">
          Search this area
        </button>
        <button
          className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-white shadow border border-slate-200"
          title="Filters"
          onClick={() => push('FILTERS')}
        >
          <Filter className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      {/* Station list teaser */}
      <div className="absolute inset-x-0" style={{ bottom: 24 }}>
        <div className="px-4 space-y-2">
          {[1, 2, 3].map((i) => {
            const station = {
              id: `station-${i}`,
              name: `Central Hub ${i}`,
              location: { lat: 0.314, lng: 32.582 },
              address: `Plot ${10 + i} Main Street, City Center, Kampala, UG`,
              rating: 4.5,
              price: 3000,
              connectors: [],
              availability: { total: 4, available: 2, busy: 2, offline: 0 },
              amenities: [],
              images: [],
              open24_7: true,
            };
            return (
              <button
                key={i}
                onClick={() => push('STATION_DETAILS', { station, stationId: station.id })}
                className="w-full p-3 rounded-2xl border border-slate-200 bg-white shadow-sm text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] font-semibold text-slate-800">{station.name}</div>
                    <div className="text-[11px] text-slate-500">0.{i} km • ★★★★☆ • 2/3 Available</div>
                  </div>
                  <div className="text-[11px] text-slate-600">CCS2 • 50kW</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scan FAB */}
      <div className="absolute inset-x-0" style={{ bottom: 88 }}>
        <div className="px-4 max-w-md mx-auto flex justify-end">
          <button
            onClick={() => push('ACTIVATION_SCAN')}
            className="h-14 w-14 rounded-2xl text-white shadow-xl flex items-center justify-center hover:shadow-2xl transition-shadow"
            style={{ background: `linear-gradient(135deg, ${EVZ_COLORS.green}, #10b981)` }}
            title="Scan to charge"
          >
            <QrCode className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

