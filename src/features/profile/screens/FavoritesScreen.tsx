/**
 * Favorites Screen
 * Shows user's favorite chargers with navigate/remove and Add from Map
 */

import React from 'react';
import { Heart, MapPin, Navigation2, Trash2, Zap } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useApp } from '../../../core';
import { useNavigation } from '../../../core';

export function FavoritesScreen(): React.ReactElement {
  const { favorites, setFavorites } = useApp();
  const { back, push } = useNavigation();

  function remove(id: string): void {
    setFavorites((list) => list.filter((f) => f.id !== id));
  }

  function navigateTo(lat: number, lng: number, name?: string): void {
    const q = name ? encodeURIComponent(name) : `${lat},${lng}`;
    window.open(`https://maps.google.com/?q=${q}`, '_blank');
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center text-white">
          <Heart className="h-5 w-5" />
          <span className="ml-2 font-semibold">Favorites</span>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {favorites.map((f) => (
          <div key={f.id} className="mb-3 p-4 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-slate-800">{f.name}</div>
                <div className="mt-0.5 text-[12px] text-slate-600 inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {f.address}
                </div>
                <div className="mt-1 text-[11px] text-slate-600">
                  {typeof f.distanceKm === 'number' ? `${f.distanceKm} km` : '—'} • {typeof f.rating === 'number' ? `★ ${f.rating}` : '—'} •
                  {f.availability ? ` ${f.availability.available}/${f.availability.total} Available` : ' Availability N/A'}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(f.connectors || []).map((c, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-full text-[11px] border border-slate-200 bg-slate-50 inline-flex items-center gap-1">
                      <Zap className="h-3 w-3" /> {c.type}{c.power ? ` ${c.power}kW` : ''}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <button
                  onClick={() => navigateTo(f.location.lat, f.location.lng, f.name)}
                  className="h-9 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-1 text-[12px]"
                >
                  <Navigation2 className="h-4 w-4" /> Navigate
                </button>
                <button
                  onClick={() => remove(f.id)}
                  className="h-9 px-3 rounded-xl text-white inline-flex items-center justify-center gap-1 text-[12px]"
                  style={{ backgroundColor: EVZ_COLORS.orange }}
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-4">
          <button
            onClick={() => push('DISCOVER')}
            className="h-12 w-full rounded-xl text-white font-medium"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Add from Map
          </button>
        </div>
      </main>
    </div>
  );
}

