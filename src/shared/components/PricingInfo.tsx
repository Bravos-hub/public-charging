import React from 'react';
import { ArrowLeft, Gauge, Zap, Clock3, Info } from 'lucide-react';

export function PricingInfo(): React.ReactElement {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="text-sm font-semibold text-slate-800">Tariff breakdown</div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
        <div className="text-slate-500">Base price / kWh</div><div className="text-right font-medium">UGX 3,000</div>
        <div className="text-slate-500">Session fee</div><div className="text-right font-medium">UGX 2,000</div>
        <div className="text-slate-500">Idle fee (after grace)</div><div className="text-right font-medium">UGX 500 / min</div>
        <div className="text-slate-500">Grace period</div><div className="text-right font-medium">15 minutes</div>
      </div>
      <div className="mt-4">
        <div className="text-sm font-semibold text-slate-800">Time-of-use windows</div>
        <div className="mt-2 grid gap-2 text-[12px]">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" /> Off-peak (22:00–06:00)</span>
            <span className="font-medium">UGX 2,400 / kWh</span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" /> Mid (06:00–16:00)</span>
            <span className="font-medium">UGX 3,000 / kWh</span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" /> Peak (16:00–22:00)</span>
            <span className="font-medium">UGX 3,600 / kWh</span>
          </div>
        </div>
        <div className="mt-2 text-[12px] inline-flex items-start gap-2 text-slate-700"><Info className="h-4 w-4 mt-0.5" /> During DR events, Peak price may increase temporarily.</div>
      </div>
    </div>
  );
}

