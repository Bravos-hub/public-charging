/**
 * Networks Filter Screen (TypeScript)
 * Allows users to select network operators for filtering
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation, useApp } from '../../../core';

const ALL_NETWORKS = [
  'EVzone',
  'Partner A',
  'Partner B',
  'GridX',
  'Electra',
  'PowerGo',
  'FastWay',
  'VoltNet',
] as const;

interface NetworkChipProps {
  label: string;
  active: boolean;
  onToggle: () => void;
}

function NetworkChip({ label, active, onToggle }: NetworkChipProps): React.ReactElement {
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

export function NetworksFilter(): React.ReactElement {
  const { back } = useNavigation();
  const { filters, setFilters } = useApp();
  const [selected, setSelected] = useState<string[]>(filters.networks ?? ['EVzone', 'Partner A']);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with global filters when they change externally
  useEffect(() => {
    setSelected(filters.networks ?? ['EVzone', 'Partner A']);
  }, [filters]);

  // Filter networks based on search query
  const filteredNetworks = useMemo(() => {
    if (!searchQuery.trim()) {
      return [...ALL_NETWORKS];
    }
    const query = searchQuery.toLowerCase();
    return ALL_NETWORKS.filter((network) => network.toLowerCase().includes(query));
  }, [searchQuery]);

  function toggle(network: string): void {
    setSelected((prev) =>
      prev.includes(network) ? prev.filter((n) => n !== network) : [...prev, network]
    );
  }

  function handleClear(): void {
    setSelected([]);
  }

  function handleSave(): void {
    setFilters({
      ...filters,
      networks: selected,
    });
    back();
  }

  function handleCancel(): void {
    // Reset to original values
    setSelected(filters.networks ?? ['EVzone', 'Partner A']);
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
          <span className="font-semibold">Networks</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="h-11 rounded-xl bg-white border border-slate-200 flex items-center px-3">
            <Search className="h-4 w-4 text-slate-600 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search networks..."
              className="flex-1 h-10 outline-none text-[13px] text-slate-700 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Operator Networks Section */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="text-[12px] text-slate-600 mb-3">Operator networks</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredNetworks.map((network) => (
              <NetworkChip
                key={network}
                label={network}
                active={selected.includes(network)}
                onToggle={() => toggle(network)}
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

