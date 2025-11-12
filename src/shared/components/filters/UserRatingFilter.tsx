/**
 * User Rating Filter Screen (TypeScript)
 * Allows users to select minimum user rating for filtering
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation, useApp } from '../../../core';

interface RatingOption {
  value: number | undefined; // undefined means "Any"
  label: string;
}

const RATING_OPTIONS: RatingOption[] = [
  { value: undefined, label: 'Any' },
  { value: 2, label: '≥2★' },
  { value: 3, label: '≥3★' },
  { value: 4, label: '≥4★' },
];

interface RatingButtonProps {
  option: RatingOption;
  selected: boolean;
  onSelect: () => void;
}

function RatingButton({ option, selected, onSelect }: RatingButtonProps): React.ReactElement {
  return (
    <button
      onClick={onSelect}
      className={`h-11 px-4 rounded-lg border text-[12px] font-medium transition-colors ${
        selected
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
      }`}
    >
      {option.label}
    </button>
  );
}

export function UserRatingFilter(): React.ReactElement {
  const { back } = useNavigation();
  const { filters, setFilters } = useApp();
  const [selectedRating, setSelectedRating] = useState<number | undefined>(filters.userRating);

  // Sync with global filters when they change externally
  useEffect(() => {
    setSelectedRating(filters.userRating);
  }, [filters]);

  function handleSelect(rating: number | undefined): void {
    setSelectedRating(rating);
  }

  function handleClear(): void {
    setSelectedRating(undefined);
  }

  function handleSave(): void {
    setFilters({
      ...filters,
      userRating: selectedRating,
    });
    back();
  }

  function handleCancel(): void {
    // Reset to original values
    setSelectedRating(filters.userRating);
    back();
  }

  const selectedLabel = selectedRating === undefined ? 'Any' : `≥${selectedRating}★`;

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={handleCancel}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">User Rating</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        {/* Minimum Rating Section */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="text-[12px] text-slate-600 mb-3">Minimum rating</div>
          <div className="grid grid-cols-2 gap-2">
            {RATING_OPTIONS.map((option) => (
              <RatingButton
                key={option.label}
                option={option}
                selected={selectedRating === option.value}
                onSelect={() => handleSelect(option.value)}
              />
            ))}
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            Selected: {selectedLabel}
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

