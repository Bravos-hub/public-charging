/**
 * Charging Ready Screen (TypeScript)
 */

import React from 'react';
import { ArrowLeft, PlugZap } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';

interface ChargingReadyScreenProps {
  onStart?: () => void;
  onBack?: () => void;
}

export function ChargingReadyScreen({ onStart, onBack }: ChargingReadyScreenProps): React.ReactElement {
  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Charging — Ready</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Progress circle (0%) */}
        <div className="mt-4 grid place-items-center">
          <div
            className="h-40 w-40 rounded-full grid place-items-center"
            style={{ background: `conic-gradient(${EVZ_COLORS.green} 0%, #e2e8f0 0)` }}
          >
            <div className="h-32 w-32 rounded-full bg-white grid place-items-center border border-slate-200">
              <div className="text-3xl font-bold text-slate-800">0%</div>
            </div>
          </div>
        </div>

        {/* Instruction */}
        <div className="mt-6 text-center text-[13px] text-slate-700">
          Plug in your vehicle, then <b>swipe to Start</b>.
        </div>

        {/* Swipe to Start */}
        <div className="mt-4">
          <div className="h-12 rounded-full bg-slate-100 border border-slate-200 grid place-items-center">
            <button
              className="h-10 px-6 rounded-full text-white font-medium inline-flex items-center gap-2"
              style={{ backgroundColor: EVZ_COLORS.orange }}
              title="Swipe to Start"
              onClick={onStart}
            >
              <PlugZap className="h-4 w-4" /> Swipe to Start
            </button>
          </div>
        </div>

        {/* Metrics placeholders */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {['Energy (kWh)', 'Accumulated Range', 'Started at', 'Remaining Time'].map((label) => (
            <div key={label} className="p-3 rounded-xl border border-slate-200 bg-white">
              <div className="text-[11px] text-slate-500">{label}</div>
              <div className="mt-1 text-[14px] font-semibold text-slate-600">—</div>
            </div>
          ))}
        </div>

        {/* Total Amount */}
        <div className="mt-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
          <div className="text-[12px] text-slate-500">Total Amount</div>
          <div className="text-[16px] font-semibold text-slate-800">UGX 0</div>
        </div>
      </main>
    </div>
  );
}

