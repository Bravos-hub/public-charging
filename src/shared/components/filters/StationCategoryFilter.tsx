/**
 * Station Category Filter Screen (TypeScript)
 * Allows users to select station category for filtering
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation, useApp } from '../../../core';

interface CategoryOption {
  value: string | undefined; // undefined means "Any"
  label: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: undefined, label: 'Any' },
  { value: 'Public', label: 'Public' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Residential', label: 'Residential' },
];

interface CategoryButtonProps {
  option: CategoryOption;
  selected: boolean;
  onSelect: () => void;
}

function CategoryButton({ option, selected, onSelect }: CategoryButtonProps): React.ReactElement {
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

export function StationCategoryFilter(): React.ReactElement {
  const { back } = useNavigation();
  const { filters, setFilters } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(filters.category ?? 'Public');

  // Sync with global filters when they change externally
  useEffect(() => {
    setSelectedCategory(filters.category ?? 'Public');
  }, [filters]);

  function handleSelect(category: string | undefined): void {
    setSelectedCategory(category);
  }

  function handleClear(): void {
    setSelectedCategory(undefined);
  }

  function handleSave(): void {
    setFilters({
      ...filters,
      category: selectedCategory,
    });
    back();
  }

  function handleCancel(): void {
    // Reset to original values
    setSelectedCategory(filters.category ?? 'Public');
    back();
  }

  const selectedLabel = selectedCategory === undefined ? 'Any' : selectedCategory;

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={handleCancel}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Station Category</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        {/* Type Section */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="text-[12px] text-slate-600 mb-3">Type</div>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORY_OPTIONS.map((option) => (
              <CategoryButton
                key={option.label}
                option={option}
                selected={selectedCategory === option.value}
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

