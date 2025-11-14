/**
 * Pricing & Tariffs Screen (TypeScript)
 */

import React from 'react';
import { ArrowLeft, Clock3, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../core/utils/constants';
import { useNavigation } from '../../core';

export function PricingTariffsScreen(): React.ReactElement {
  const { route, back } = useNavigation();

  function handleOk(): void {
    const onOk = route.params?.onOk;
    if (onOk) onOk();
    else back();
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Pricing & Tariffs</span>
          <div className="w-5" />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-4 py-6 pb-28">
          {/* Tariff breakdown */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white mb-4">
            <div className="text-sm font-semibold text-slate-800">Tariff breakdown</div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
              <div className="text-slate-500">Base price / kWh</div>
              <div className="text-right font-medium">UGX 3,000</div>
              <div className="text-slate-500">Session fee</div>
              <div className="text-right font-medium">UGX 2,000</div>
              <div className="text-slate-500">Idle fee (after grace)</div>
              <div className="text-right font-medium">UGX 500 / min</div>
              <div className="text-slate-500">Grace period</div>
              <div className="text-right font-medium">15 minutes</div>
            </div>
          </div>

          {/* Time-of-use windows */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white">
            <div className="text-sm font-semibold text-slate-800">Time-of-use windows</div>
            <div className="mt-2 grid gap-2 text-[12px]">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" /> Off-peak (22:00–06:00)
                </span>
                <span className="font-medium">UGX 2,400 / kWh</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" /> Mid (06:00–16:00)
                </span>
                <span className="font-medium">UGX 3,000 / kWh</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4" /> Peak (16:00–22:00)
                </span>
                <span className="font-medium">UGX 3,600 / kWh</span>
              </div>
            </div>
            <div className="mt-2 text-[12px] inline-flex items-start gap-2 text-slate-700">
              <Info className="h-4 w-4 mt-0.5" />
              <span>
                During DR events, Peak price may increase temporarily. We’ll show the updated
                price on order/session screens.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer actions */}
      <div className="sticky bottom-0 w-full bg-white border-t border-slate-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={back}
              className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium"
            >
              Back
            </button>
            <button
              onClick={handleOk}
              className="h-11 rounded-xl text-white font-medium"
              style={{ backgroundColor: EVZ_COLORS.orange }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

