import React, { useMemo, useState } from 'react';
import { Filter as FilterIcon, Info } from 'lucide-react';

const ALL = ['CCS2', 'Type2', 'CHAdeMO', 'NACS', 'Type1', 'GB/T AC', 'GB/T DC'];

function StatusTag({ state }: { state: 'compatible' | 'adapter' | 'incompatible' }): React.ReactElement {
  const map: Record<string, string> = {
    compatible: 'bg-green-50 border-green-200 text-green-700',
    adapter: 'bg-yellow-50 border-yellow-200 text-orange-700',
    incompatible: 'bg-pink-50 border-pink-200 text-red-700',
  };
  const label = state === 'compatible' ? 'Compatible' : state === 'adapter' ? 'Requires adapter' : 'Incompatible';
  return <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${map[state]}`}>{label}</span>;
}

export function CompatibilityHelper(): React.ReactElement {
  const vehicle = useMemo(() => ({ name: 'Model X', connectors: ['CCS2', 'Type2'], acMax: 22, dcMax: 60 }), []);
  const [onlyCompat, setOnlyCompat] = useState(true);
  const [powerMin, setPowerMin] = useState(0);
  const rows = useMemo(
    () =>
      ALL.map((c) => ({
        type: c,
        state: (vehicle.connectors as string[]).includes(c) ? 'compatible' : c === 'NACS' ? 'adapter' : 'incompatible',
      })),
    [vehicle]
  );
  return (
    <div className="grid gap-3">
      <div className="p-4 rounded-2xl border border-slate-200 bg-white">
        <div className="text-[12px] text-slate-600 mb-1">Active vehicle</div>
        <div className="text-[14px] font-semibold text-slate-900">{vehicle.name}</div>
        <div className="mt-1 text-[12px] text-slate-600">AC Max: {vehicle.acMax} kW • DC Max: {vehicle.dcMax} kW</div>
        <div className="mt-1 text-[12px] text-slate-600">Supported: {vehicle.connectors.join(', ')}</div>
      </div>
      <div className="p-4 rounded-2xl border border-slate-200 bg-white">
        <div className="text-sm font-semibold text-slate-800 mb-2">Connector types</div>
        <div className="grid gap-2">
          {rows.map((r) => (
            <div key={r.type} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div className="text-[13px] font-medium text-slate-900">{r.type}</div>
              <StatusTag state={r.state as any} />
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 rounded-2xl border border-slate-200 bg-white">
        <div className="text-sm font-semibold text-slate-800 mb-2">Filter preferences</div>
        <div className="flex items-center gap-2">
          <input
            id="compat"
            type="checkbox"
            checked={onlyCompat}
            onChange={(e) => setOnlyCompat(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="compat" className="text-[12px] text-slate-700 cursor-pointer">
            Only show compatible stations
          </label>
        </div>
        <div className="mt-4">
          <label className="block text-[12px] text-slate-700 mb-2">Minimum power (kW)</label>
          <input
            type="range"
            min={0}
            max={350}
            value={powerMin}
            onChange={(e) => setPowerMin(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(powerMin / 350) * 100}%, #e2e8f0 ${(powerMin / 350) * 100}%, #e2e8f0 100%)`,
            }}
          />
          <div className="mt-1 text-[12px] text-slate-600">{powerMin} kW</div>
        </div>
        <div className="mt-3 text-[12px] text-slate-600 flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>We'll apply these to your Discover filters.</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors">
          Cancel
        </button>
        <button className="h-11 rounded-xl text-white font-medium inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors">
          <FilterIcon className="h-4 w-4" />
          <span>Apply to Filters</span>
        </button>
      </div>
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}

