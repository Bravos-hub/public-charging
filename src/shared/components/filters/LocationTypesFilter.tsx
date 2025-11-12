/**
 * Location Types Filter Screen (TypeScript)
 * Allows users to select venue categories for filtering
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation, useApp } from '../../../core';

const LOCATION_TYPES = [
  'Accommodation',
  'Car Park',
  'Dealership',
  'Education',
  'Fuel Forecourt',
  'Health Services',
  'Home',
  'Leisure',
  'Motorway Services',
  'On-Street',
  'Other',
  'Park and Ride',
  'Public Services',
  'Restaurant/Pub/Café',
  'Retail Car Park',
  'Supermarket',
  'Travel Interchange',
  'Workplace Car Park',
] as const;

interface LocationTypeChipProps {
  label: string;
  active: boolean;
  onToggle: () => void;
}

function LocationTypeChip({ label, active, onToggle }: LocationTypeChipProps): React.ReactElement {
  return (
    <button
      onClick={onToggle}
      className={`h-10 px-4 rounded-lg border text-[12px] font-medium transition-colors ${
        active
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
      }`}
    >
      {label}
    </button>
  );
}

export function LocationTypesFilter(): React.ReactElement {
  const { back } = useNavigation();
  const { filters, setFilters } = useApp();
  const [selected, setSelected] = useState<string[]>(filters.locationTypes ?? ['Car Park', 'Supermarket']);

  // Sync with global filters when they change externally
  useEffect(() => {
    setSelected(filters.locationTypes ?? ['Car Park', 'Supermarket']);
  }, [filters]);

  function toggle(locationType: string): void {
    setSelected((prev) =>
      prev.includes(locationType) ? prev.filter((lt) => lt !== locationType) : [...prev, locationType]
    );
  }

  function handleClear(): void {
    setSelected([]);
  }

  function handleSave(): void {
    setFilters({
      ...filters,
      locationTypes: selected,
    });
    back();
  }

  function handleCancel(): void {
    // Reset to original values
    setSelected(filters.locationTypes ?? ['Car Park', 'Supermarket']);
    back();
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={handleCancel}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Location Types</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        {/* Venue Categories Section */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="text-[12px] text-slate-600 mb-3">Venue categories</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LOCATION_TYPES.map((locationType) => (
              <LocationTypeChip
                key={locationType}
                label={locationType}
                active={selected.includes(locationType)}
                onToggle={() => toggle(locationType)}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={handleClear}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleSave}
            className="h-11 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Save
          </button>
        </div>
      </main>
    </div>
  );
}

