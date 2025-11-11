/**
 * Charging In Progress Screen (TypeScript)
 */

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Zap, Gauge, Clock3, Fuel } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';

function formatDuration(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
}

interface ChargingInProgressScreenProps {
  sessionId?: string;
  onStop?: () => void;
  onBack?: () => void;
}

export function ChargingInProgressScreen({
  sessionId,
  onStop,
  onBack,
}: ChargingInProgressScreenProps): React.ReactElement {
  // Demo ticking state (does not connect to hardware)
  const [start] = useState(() => Date.now() - 12 * 60 * 1000); // started 12m ago
  const [percent, setPercent] = useState(27);
  const [energyKwh, setEnergyKwh] = useState(5.4);
  const pricePerKwh = 3000;

  useEffect(() => {
    const id = setInterval(() => {
      setPercent((p) => Math.min(100, +(p + 0.4).toFixed(1)));
      setEnergyKwh((e) => +(e + 0.08).toFixed(2));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const total = useMemo(() => Math.round(energyKwh * pricePerKwh), [energyKwh]);
  const startedAt = useMemo(
    () => new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    [start]
  );
  const duration = useMemo(() => formatDuration(Date.now() - start), [start]);

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Charging — In Progress</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Progress circle */}
        <div className="mt-2 grid place-items-center">
          <div
            className="h-44 w-44 rounded-full grid place-items-center"
            style={{ background: `conic-gradient(${EVZ_COLORS.green} ${percent}%, #e2e8f0 0)` }}
          >
            <div className="h-36 w-36 rounded-full bg-white grid place-items-center border border-slate-200">
              <div className="text-3xl font-bold text-slate-800">{percent}%</div>
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

        {/* Total Amount */}
        <div className="mt-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
          <div className="text-[12px] text-slate-500">Total Amount</div>
          <div className="text-[16px] font-semibold text-slate-800">UGX {total.toLocaleString()}</div>
        </div>

        {/* Swipe to End */}
        <div className="mt-6">
          <div className="h-12 rounded-full bg-slate-100 border border-slate-200 grid place-items-center">
            <button
              className="h-10 px-6 rounded-full text-white font-medium inline-flex items-center gap-2"
              style={{ backgroundColor: EVZ_COLORS.orange }}
              onClick={onStop}
            >
              <Zap className="h-4 w-4" /> Swipe to End Session
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

