import React from 'react';
import { AlertTriangle, PlugZap, Car, Info } from 'lucide-react';

export function ConnectorMismatch(): React.ReactElement {
  const selected = { type: 'CHAdeMO', power: '50kW' };
  const vehicle = { supported: ['CCS2', 'Type2'] };
  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Green banner at the top */}
      <div className="bg-green-600 px-4 py-3 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-white" />
        <span className="text-white font-semibold">Connector Mismatch</span>
      </div>

      <div className="px-4 pt-4 pb-6">
        {/* Light yellow/cream warning box */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-amber-900">Selected connector isn't compatible</div>
              <div className="text-xs text-amber-800 mt-1">Pick a connector supported by your vehicle or use an approved adapter.</div>
            </div>
          </div>
        </div>

        {/* Selected connector and Vehicle supports cards */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[11px] text-slate-600 mb-1">Selected connector</div>
            <div className="text-[13px] font-semibold inline-flex items-center gap-1.5">
              <PlugZap className="h-4 w-4 text-slate-900" />
              <span>{selected.type} • {selected.power}</span>
            </div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[11px] text-slate-600 mb-1">Vehicle supports</div>
            <div className="text-[13px] font-semibold inline-flex items-center gap-1.5">
              <Car className="h-4 w-4 text-slate-900" />
              <span>{vehicle.supported.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Informational message */}
        <div className="mt-4 text-xs text-slate-600 inline-flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>Update your active vehicle in Vehicles if this looks wrong.</span>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          <button className="flex-1 h-10 rounded-xl text-white font-medium bg-orange-500 hover:bg-orange-600 transition-colors">
            Choose Connector
          </button>
          <button className="flex-1 h-10 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            View Compatibility
          </button>
        </div>
      </div>
    </div>
  );
}

