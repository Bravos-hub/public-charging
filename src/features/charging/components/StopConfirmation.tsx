/**
 * Stop Charging Confirmation Component (TypeScript)
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';

interface StopConfirmationProps {
  onStop?: () => void;
  onKeepCharging?: () => void;
}

export function StopConfirmation({ onStop, onKeepCharging }: StopConfirmationProps): React.ReactElement {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-end" onClick={onKeepCharging}>
      <div className="w-full" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-md mx-auto p-4">
          <div className="rounded-2xl bg-white shadow-xl border border-slate-200 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-slate-800">End charging session?</div>
                <div className="text-[12px] text-slate-600 mt-1">
                  You can resume later, but the connector may become unavailable if others are waiting.
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                className="h-10 rounded-lg border border-slate-300 bg-white text-slate-700"
                onClick={onKeepCharging}
              >
                Keep Charging
              </button>
              <button
                className="h-10 rounded-lg text-white font-medium"
                style={{ backgroundColor: EVZ_COLORS.orange }}
                onClick={onStop}
              >
                Stop Charging
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

