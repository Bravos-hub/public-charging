/**
 * Networks Screen (Roaming badges demo)
 * Shows stations grouped by network with color badges and a simple filter.
 */

import React, { useMemo, useState } from 'react';
import { Network as NetworkIcon, MapPin, BadgeCheck } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';

type NetworkName = 'EVzone' | 'Partner A' | 'Partner B';

interface StationRowData {
  id: string;
  name: string;
  distance: string;
  rating: number;
  available: string; // e.g. "2/4"
  network: NetworkName;
}

function Chip({ label, active, onToggle }: { label: NetworkName; active: boolean; onToggle: () => void }): React.ReactElement {
  return (
    <button
      onClick={onToggle}
      className={`h-9 px-3 rounded-lg border text-[12px] ${
        active
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-white text-slate-700 border-slate-300'
      }`}
    >
      {label}
    </button>
  );
}

function Badge({ name }: { name: NetworkName }): React.ReactElement {
  const tone = name === 'EVzone' ? 'bg-emerald-600' : name === 'Partner A' ? 'bg-indigo-600' : 'bg-fuchsia-600';
  return <span className={`px-2 py-0.5 rounded-full text-[11px] text-white ${tone}`}>{name}</span>;
}

function StationRow({ s }: { s: StationRowData }): React.ReactElement {
  return (
    <div className="p-3 rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-slate-800 truncate flex items-center gap-2">
            <MapPin className="h-4 w-4" /> {s.name}
          </div>
          <div className="mt-0.5 text-[11px] text-slate-600">
            {s.distance} • ★ {s.rating.toFixed(1)} • {s.available} Available
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge name={s.network} />
            <span className="text-[11px] text-slate-500">Roaming enabled</span>
          </div>
        </div>
        <div className="shrink-0">
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
            <BadgeCheck className="h-3.5 w-3.5" /> Compatible
          </span>
        </div>
      </div>
    </div>
  );
}

export function NetworksScreen(): React.ReactElement {
  const NETWORKS: NetworkName[] = ['EVzone', 'Partner A', 'Partner B'];
  const [selected, setSelected] = useState<NetworkName[]>(NETWORKS);

  const stations = useMemo<StationRowData[]>(
    () => [
      { id: 's1', name: 'Central Hub — Downtown Mall', distance: '0.8 km', rating: 4.6, available: '2/4', network: 'EVzone' },
      { id: 's2', name: 'Airport Park — Lot B', distance: '4.2 km', rating: 4.3, available: '1/3', network: 'Partner A' },
      { id: 's3', name: 'City Square — Tower A', distance: '6.5 km', rating: 4.1, available: '3/6', network: 'Partner B' },
    ],
    []
  );

  function toggle(n: NetworkName): void {
    setSelected((xs) => (xs.includes(n) ? xs.filter((x) => x !== n) : [...xs, n]));
  }

  const filtered = stations.filter((s) => selected.includes(s.network));

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center text-white">
          <NetworkIcon className="h-5 w-5" />
          <span className="ml-2 font-semibold">Networks</span>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-28">
        {/* Filter chips */}
        <div className="p-3 rounded-2xl border border-slate-200 bg-white">
          <div className="text-[12px] text-slate-600">Filter by network</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {NETWORKS.map((n) => (
              <Chip key={n} label={n} active={selected.includes(n)} onToggle={() => toggle(n)} />
            ))}
          </div>
        </div>

        {/* Station list */}
        <div className="mt-3 grid gap-3">
          {filtered.map((s) => (
            <StationRow key={s.id} s={s} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-3 p-4 rounded-2xl border border-slate-200 bg-white text-[13px] text-slate-700">
            No stations for selected networks.
          </div>
        )}
      </main>
    </div>
  );
}

