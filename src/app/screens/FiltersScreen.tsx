/**
 * Filters Screen (TypeScript)
 */

import React, { useState } from 'react';
import { EVZ_COLORS } from '../../core/utils/constants';
import { CONNECTOR_TYPES } from '../../core/utils/constants';

export function FiltersScreen(): React.ReactElement {
  const [onlyAvail, setOnlyAvail] = useState(true);
  const [minKw, setMinKw] = useState(3);
  const [maxKw, setMaxKw] = useState(350);
  const [sel, setSel] = useState<string[]>(['CCS2', 'Type 2']);

  const toggle = (x: string): void => {
    setSel((xs) => (xs.includes(x) ? xs.filter((v) => v !== x) : [...xs, x]));
  };

  return (
    <div className="h-full p-4 max-w-md mx-auto">
      <div className="p-4 rounded-2xl border border-slate-200 bg-white grid gap-3">
        <div className="text-sm font-semibold text-slate-800">Filters</div>
        <label className="inline-flex items-center gap-2 text-[13px]">
          <input
            type="checkbox"
            checked={onlyAvail}
            onChange={(e) => setOnlyAvail(e.target.checked)}
          />{' '}
          Only show available
        </label>
        <div>
          <div className="text-[12px] text-slate-600 mb-1">
            Power (kW): {minKw} – {maxKw}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="range"
              min={3}
              max={350}
              value={minKw}
              onChange={(e) => setMinKw(parseInt(e.target.value, 10))}
              className="w-full"
            />
            <input
              type="range"
              min={3}
              max={350}
              value={maxKw}
              onChange={(e) => setMaxKw(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
        </div>
        <div>
          <div className="text-[12px] text-slate-600 mb-1">Connector Types</div>
          <div className="flex flex-wrap gap-2 text-[12px]">
            {CONNECTOR_TYPES.map((c) => (
              <button
                key={c}
                onClick={() => toggle(c)}
                className={`px-2 py-1 rounded-lg border ${
                  sel.includes(c)
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700">
            Clear
          </button>
          <button
            className="h-11 rounded-xl text-white font-medium"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

