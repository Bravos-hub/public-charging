/**
 * Charging Complete Screen (TypeScript)
 */

import React, { useMemo } from 'react';
import { ArrowLeft, CheckCircle2, Gauge, Clock3, Fuel } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import type { ChargingSession } from '../../../core/types';

interface ChargingCompleteScreenProps {
  session?: ChargingSession;
  onBack?: () => void;
  onProceedToPayment?: () => void;
}

export function ChargingCompleteScreen({
  session,
  onBack,
  onProceedToPayment,
}: ChargingCompleteScreenProps): React.ReactElement {
  // Example final values (would come from session state)
  const energyKwh = session?.energyDelivered || 32.8;
  const pricePerKwh = 3000;
  const total = useMemo(() => Math.round(energyKwh * pricePerKwh), [energyKwh]);
  const startedAt = session?.startTime
    ? new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '14:05';
  const duration = session
    ? `${Math.floor((new Date(session.endTime || Date.now()).getTime() - new Date(session.startTime).getTime()) / 3600000)}h ${Math.floor(((new Date(session.endTime || Date.now()).getTime() - new Date(session.startTime).getTime()) % 3600000) / 60000)}m`
    : '00h 42m';

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Charging — Complete</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Progress circle (100%) */}
        <div className="mt-2 grid place-items-center">
          <div
            className="h-44 w-44 rounded-full grid place-items-center"
            style={{ background: `conic-gradient(${EVZ_COLORS.green} 100%, #e2e8f0 0)` }}
          >
            <div className="h-36 w-36 rounded-full bg-white grid place-items-center border border-slate-200">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
                <div className="text-2xl font-bold">100%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <Gauge className="h-4 w-4" /> Energy
            </div>
            <div className="mt-1 text-[15px] font-semibold">{energyKwh} kWh</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <Fuel className="h-4 w-4" /> Accumulated Range
            </div>
            <div className="mt-1 text-[15px] font-semibold">{Math.round(energyKwh * 6)} km</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <Clock3 className="h-4 w-4" /> Started at
            </div>
            <div className="mt-1 text-[15px] font-semibold">{startedAt}</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <Clock3 className="h-4 w-4" /> Duration
            </div>
            <div className="mt-1 text-[15px] font-semibold">{duration}</div>
          </div>
        </div>

        {/* Total Amount & Next */}
        <div className="mt-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
          <div className="text-[12px] text-slate-500">Total Amount</div>
          <div className="text-[16px] font-semibold text-slate-800">UGX {total.toLocaleString()}</div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700"
            onClick={onBack}
          >
            Back
          </button>
          <button
            className="h-11 rounded-xl text-white font-medium"
            style={{ backgroundColor: EVZ_COLORS.orange }}
            onClick={onProceedToPayment}
          >
            Proceed to Payment
          </button>
        </div>
      </main>
    </div>
  );
}

