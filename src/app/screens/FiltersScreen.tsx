/**
 * Filters Screen (TypeScript)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, PlugZap, Gauge, Building2, MapPin, Users, Layers, Star, CheckSquare, Filter } from 'lucide-react';
import { EVZ_COLORS } from '../../core/utils/constants';
import { useNavigation, useApp } from '../../core';

interface FilterRowProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  count: number | string;
  onClick?: () => void;
}

function FilterRow({ icon: Icon, title, subtitle, count, onClick }: FilterRowProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className="w-full p-3 rounded-2xl border border-slate-200 bg-white flex items-center justify-between hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-center gap-3 text-left">
        <div className="h-9 w-9 rounded-xl bg-slate-100 grid place-items-center text-slate-700 flex-shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-slate-800">{title}</div>
          {subtitle && <div className="text-[11px] text-slate-500 mt-0.5">{subtitle}</div>}
        </div>
      </div>
      <div className="text-[11px] text-slate-500 ml-2 flex-shrink-0">
        {typeof count === 'number' ? `${count} selected` : count || ''}
      </div>
    </button>
  );
}

export function FiltersScreen(): React.ReactElement {
  const { back, replace, push } = useNavigation();
  const { filters, setFilters } = useApp();
  const [onlyAvail, setOnlyAvail] = useState(filters.onlyAvail ?? true);
  const [fastOnly, setFastOnly] = useState(filters.fastOnly ?? false);
  const [minKw, setMinKw] = useState(filters.minKw ?? 3);
  const [maxKw, setMaxKw] = useState(filters.maxKw ?? 350);
  const [sel, setSel] = useState<string[]>(filters.connectorTypes ?? ['CCS2', 'Type 2']);

  // Sync with global filters when they change externally
  useEffect(() => {
    setOnlyAvail(filters.onlyAvail ?? true);
    setFastOnly(filters.fastOnly ?? false);
    setMinKw(filters.minKw ?? 3);
    setMaxKw(filters.maxKw ?? 350);
    setSel(filters.connectorTypes ?? ['CCS2', 'Type 2']);
  }, [filters]);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    return {
      connectors: sel.length,
      power: `${minKw}–${maxKw} kW`,
      networks: filters.networks?.length || 0,
      location: filters.locationTypes?.length || 0,
      access: filters.access?.length || 0,
      rating: filters.userRating ? 1 : 0,
      devices: filters.multipleDevices ? 1 : 0,
      category: filters.category ? 1 : 0,
    };
  }, [sel, minKw, maxKw, filters]);

  function handleClearAll(): void {
    setOnlyAvail(false);
    setFastOnly(false);
    setMinKw(3);
    setMaxKw(350);
    setSel([]);
    const clearedFilters = {
      onlyAvail: false,
      fastOnly: false,
      minKw: 3,
      maxKw: 350,
      connectorTypes: [],
      networks: [],
      locationTypes: [],
      access: [],
      userRating: undefined,
      multipleDevices: undefined,
      category: undefined,
    };
    setFilters(clearedFilters);
  }

  function handleApplyFilters(): void {
    setFilters({
      onlyAvail,
      fastOnly,
      minKw,
      maxKw,
      connectorTypes: sel,
      networks: filters.networks,
      locationTypes: filters.locationTypes,
      access: filters.access,
      userRating: filters.userRating,
      multipleDevices: filters.multipleDevices,
      category: filters.category,
    });
    replace('DISCOVER');
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Filters</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-3 pb-28">
        {/* Quick toggles */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setOnlyAvail((v) => !v)}
            className={`h-11 rounded-xl border text-[13px] font-medium flex items-center justify-center gap-2 transition-colors ${
              onlyAvail
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <CheckSquare className={`h-4 w-4 ${onlyAvail ? 'text-emerald-600' : 'text-slate-600'}`} />
            Only show available
          </button>
          <button
            onClick={() => setFastOnly((v) => !v)}
            className={`h-11 rounded-xl border text-[13px] font-medium flex items-center justify-center gap-2 transition-colors ${
              fastOnly
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <Gauge className={`h-4 w-4 ${fastOnly ? 'text-amber-600' : 'text-slate-600'}`} />
            Fast chargers only
          </button>
        </div>

        {/* Filter sections */}
        <div className="mt-4 grid gap-3">
          <FilterRow
            icon={PlugZap}
            title="Connector Types"
            subtitle="CCS2, CHAdeMO, Type2, NACS…"
            count={filterCounts.connectors}
            onClick={() => {
              push('FILTER_CONNECTOR_TYPES');
            }}
          />
          <FilterRow
            icon={Gauge}
            title="Power (kW)"
            subtitle="Min–Max"
            count={filterCounts.power}
            onClick={() => {
              push('FILTER_POWER');
            }}
          />
          <FilterRow
            icon={Layers}
            title="Networks"
            subtitle="EVzone, partners"
            count={filterCounts.networks}
            onClick={() => {
              push('FILTER_NETWORKS');
            }}
          />
          <FilterRow
            icon={Building2}
            title="Location Types"
            subtitle="Mall, On‑street, Parking…"
            count={filterCounts.location}
            onClick={() => {
              push('FILTER_LOCATION_TYPES');
            }}
          />
          <FilterRow
            icon={MapPin}
            title="Access"
            subtitle="24/7, Public, No restrictions, Taxi only"
            count={filterCounts.access}
            onClick={() => {
              push('FILTER_ACCESS');
            }}
          />
          <FilterRow
            icon={Star}
            title="User Rating"
            subtitle="≥2★, ≥3★, ≥4★"
            count={filterCounts.rating}
            onClick={() => {
              push('FILTER_USER_RATING');
            }}
          />
          <FilterRow
            icon={Users}
            title="Multiple Devices"
            subtitle="Min. stalls at site"
            count={filterCounts.devices}
            onClick={() => {
              push('FILTER_MULTIPLE_DEVICES');
            }}
          />
          <FilterRow
            icon={Filter}
            title="Station Category"
            subtitle="Public / Corporate / Residential"
            count={filterCounts.category}
            onClick={() => {
              push('FILTER_STATION_CATEGORY');
            }}
          />
        </div>

        {/* Action buttons */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={handleClearAll}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleApplyFilters}
            className="h-11 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Apply Filters
          </button>
        </div>
      </main>
    </div>
  );
}

