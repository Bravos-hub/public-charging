/**
 * Access Filter Screen (TypeScript)
 * Allows users to select access options for filtering
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Users, Key } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation, useApp } from '../../../core';

interface AccessOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ACCESS_OPTIONS: AccessOption[] = [
  { id: '24hours', label: '24 hours access', icon: Clock },
  { id: 'public', label: 'Public access', icon: Users },
  { id: 'noRestrictions', label: 'No physical restrictions', icon: Key },
  { id: 'taxiOnly', label: 'Show Taxi Only', icon: Users },
];

interface AccessOptionRowProps {
  option: AccessOption;
  checked: boolean;
  onToggle: () => void;
}

function AccessOptionRow({ option, checked, onToggle }: AccessOptionRowProps): React.ReactElement {
  const Icon = option.icon;

  return (
    <button
      onClick={onToggle}
      className="w-full p-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
    >
      {/* Checkbox */}
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
          checked
            ? 'bg-blue-500 border-blue-500'
            : 'bg-white border-slate-300'
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      {/* Icon */}
      <Icon className="h-5 w-5 text-slate-700 flex-shrink-0" />
      {/* Label */}
      <span className="text-[13px] font-medium text-slate-800 flex-1">{option.label}</span>
    </button>
  );
}

export function AccessFilter(): React.ReactElement {
  const { back } = useNavigation();
  const { filters, setFilters } = useApp();
  const [selected, setSelected] = useState<string[]>(filters.access ?? ['public']);

  // Sync with global filters when they change externally
  useEffect(() => {
    setSelected(filters.access ?? ['public']);
  }, [filters]);

  function toggle(optionId: string): void {
    setSelected((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  }

  function handleReset(): void {
    setSelected([]);
  }

  function handleSave(): void {
    setFilters({
      ...filters,
      access: selected,
    });
    back();
  }

  function handleCancel(): void {
    // Reset to original values
    setSelected(filters.access ?? ['public']);
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
          <span className="font-semibold">Access</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        {/* Access Options List */}
        <div className="space-y-3">
          {ACCESS_OPTIONS.map((option) => (
            <AccessOptionRow
              key={option.id}
              option={option}
              checked={selected.includes(option.id)}
              onToggle={() => toggle(option.id)}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={handleReset}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Reset
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

