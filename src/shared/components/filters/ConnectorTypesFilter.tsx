/**
 * Connector Types Filter Screen (TypeScript)
 * Allows users to select connector types for filtering
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation, useApp } from '../../../core';

const DC_CONNECTORS = ['CCS1', 'CCS2', 'CHAdeMO', 'GB/T DC', 'NACS (Tesla) DC'] as const;
const AC_CONNECTORS = ['Type 1', 'Type 2', 'GB/T AC', 'NACS (Tesla) AC'] as const;

interface ConnectorChipProps {
  label: string;
  active: boolean;
  onToggle: () => void;
}

function ConnectorChip({ label, active, onToggle }: ConnectorChipProps): React.ReactElement {
  return (
    <button
      onClick={onToggle}
      className={`h-9 px-3 rounded-lg border text-[12px] font-medium transition-colors ${
        active
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
      }`}
    >
      {label}
    </button>
  );
}

export function ConnectorTypesFilter(): React.ReactElement {
  const { back } = useNavigation();
  const { filters, setFilters } = useApp();
  const [selected, setSelected] = useState<string[]>(filters.connectorTypes ?? ['CCS2', 'Type 2']);

  // Sync with global filters when they change externally
  useEffect(() => {
    setSelected(filters.connectorTypes ?? ['CCS2', 'Type 2']);
  }, [filters]);

  function toggle(connector: string): void {
    setSelected((prev) =>
      prev.includes(connector) ? prev.filter((c) => c !== connector) : [...prev, connector]
    );
  }

  function selectAll(): void {
    setSelected([...DC_CONNECTORS, ...AC_CONNECTORS]);
  }

  function clearAll(): void {
    setSelected([]);
  }

  function handleSave(): void {
    setFilters({
      ...filters,
      connectorTypes: selected,
    });
    back();
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Connector Types</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        {/* DC Section */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="text-[12px] text-slate-600 mb-2">DC (fast charging)</div>
          <div className="flex flex-wrap gap-2">
            {DC_CONNECTORS.map((connector) => (
              <ConnectorChip
                key={connector}
                label={connector}
                active={selected.includes(connector)}
                onToggle={() => toggle(connector)}
              />
            ))}
          </div>
        </div>

        {/* AC Section */}
        <div className="mt-3 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="text-[12px] text-slate-600 mb-2">AC (destination charging)</div>
          <div className="flex flex-wrap gap-2">
            {AC_CONNECTORS.map((connector) => (
              <ConnectorChip
                key={connector}
                label={connector}
                active={selected.includes(connector)}
                onToggle={() => toggle(connector)}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <button
            onClick={selectAll}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
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

