/**
 * Filters Screen (TypeScript)
 */

import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { EVZ_COLORS } from '../../core/utils/constants';
import { useNavigation, useApp } from '../../core';

const DC_CONNECTORS = ['CCS1', 'CCS2', 'CHAdeMO', 'GB/T DC', 'NACS (Tesla) DC'] as const;
const AC_CONNECTORS = ['Type 1', 'Type 2', 'GB/T AC', 'NACS (Tesla) AC'] as const;

export function FiltersScreen(): React.ReactElement {
  const { replace } = useNavigation();
  const { filters, setFilters } = useApp();
  const [onlyAvail, setOnlyAvail] = useState(filters.onlyAvail ?? true);
  const [minKw, setMinKw] = useState(filters.minKw ?? 3);
  const [maxKw, setMaxKw] = useState(filters.maxKw ?? 350);
  const [sel, setSel] = useState<string[]>(filters.connectorTypes ?? ['CCS2', 'Type 2']);

  // Sync with global filters when they change externally
  useEffect(() => {
    setOnlyAvail(filters.onlyAvail ?? true);
    setMinKw(filters.minKw ?? 3);
    setMaxKw(filters.maxKw ?? 350);
    setSel(filters.connectorTypes ?? ['CCS2', 'Type 2']);
  }, [filters]);

  const toggle = (x: string): void => {
    setSel((xs) => (xs.includes(x) ? xs.filter((v) => v !== x) : [...xs, x]));
  };

  return (
    <div className="w-full">
      {/* Green Header */}
      <div
        className="sticky top-0 z-10 w-full"
        style={{ backgroundColor: EVZ_COLORS.green }}
      >
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <span className="font-semibold">Filters</span>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <div className="w-full p-4">
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm grid gap-4">

        {/* Availability Checkbox */}
        <label className="inline-flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={onlyAvail}
            onChange={(e) => setOnlyAvail(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
          />
          Only show available
        </label>

        {/* Power Range */}
        <div>
          <div className="text-[12px] text-slate-600 mb-2">
            Power (kW): {minKw} – {maxKw} kW
          </div>
          <div className="relative">
            {/* Min/Max Labels */}
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>Min</span>
              <span>Max</span>
            </div>
            {/* Dual range slider container */}
            <div className="relative h-2 bg-slate-200 rounded-full">
              {/* Active range track */}
              <div
                className="absolute h-2 bg-blue-600 rounded-full"
                style={{
                  left: `${((minKw - 3) / (350 - 3)) * 100}%`,
                  width: `${((maxKw - minKw) / (350 - 3)) * 100}%`,
                }}
              />
              {/* Min slider */}
              <input
                type="range"
                min={3}
                max={350}
                value={minKw}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setMinKw(Math.min(val, maxKw - 1));
                }}
                className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer z-10"
                style={{ zIndex: minKw > maxKw - 10 ? 5 : 10 }}
              />
              {/* Max slider */}
              <input
                type="range"
                min={3}
                max={350}
                value={maxKw}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setMaxKw(Math.max(val, minKw + 1));
                }}
                className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer z-10"
                style={{ zIndex: maxKw < minKw + 10 ? 5 : 10 }}
              />
            </div>
            {/* Slider handles (visual) */}
            <div className="relative -mt-2">
              <div
                className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md transform -translate-x-1/2"
                style={{ left: `${((minKw - 3) / (350 - 3)) * 100}%` }}
              />
              <div
                className="absolute w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md transform -translate-x-1/2"
                style={{ left: `${((maxKw - 3) / (350 - 3)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Connector Types */}
        <div>
          <div className="text-[12px] text-slate-600 mb-2">Connector types</div>
          
          {/* DC Connectors */}
          <div className="mb-3">
            <div className="text-[11px] font-medium text-slate-700 mb-2">DC</div>
            <div className="flex flex-wrap gap-2">
              {DC_CONNECTORS.map((c) => {
                const isSelected = sel.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggle(c)}
                    className={`px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AC Connectors */}
          <div>
            <div className="text-[11px] font-medium text-slate-700 mb-2">AC</div>
            <div className="flex flex-wrap gap-2">
              {AC_CONNECTORS.map((c) => {
                const isSelected = sel.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggle(c)}
                    className={`px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              const clearedFilters = {
                onlyAvail: false,
                minKw: 3,
                maxKw: 350,
                connectorTypes: [],
              };
              setOnlyAvail(false);
              setMinKw(3);
              setMaxKw(350);
              setSel([]);
              // Also clear global filters
              setFilters(clearedFilters);
            }}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => {
              // Save filters to global state
              setFilters({
                onlyAvail,
                minKw,
                maxKw,
                connectorTypes: sel,
              });
              // Apply filters and navigate back to Discover
              replace('DISCOVER');
            }}
            className="h-11 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Apply Filters
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

