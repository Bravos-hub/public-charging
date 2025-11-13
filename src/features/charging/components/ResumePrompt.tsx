import React, { useMemo } from 'react';
import { Zap } from 'lucide-react';

interface ResumePromptProps {
  onResume?: () => void;
  onDismiss?: () => void;
  startedAt?: Date | string;
  energyKwh?: number;
  connectorType?: string;
  power?: number;
}

export function ResumePrompt({
  onResume,
  onDismiss,
  startedAt,
  energyKwh = 5.8,
  connectorType = 'CCS2',
  power = 60,
}: ResumePromptProps): React.ReactElement {
  const startedTime = useMemo(() => {
    if (!startedAt) return '14:05';
    const date = typeof startedAt === 'string' ? new Date(startedAt) : startedAt;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [startedAt]);

  const energyDisplay = useMemo(() => {
    return `${energyKwh.toFixed(1)} kWh so far`;
  }, [energyKwh]);

  const connectorDisplay = `${connectorType} ${power}kW`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none">
      <div className="max-w-md mx-auto p-4 pointer-events-auto">
        <div className="rounded-xl border border-slate-200 bg-white shadow-lg p-4">
          {/* Title with icon */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-green-600" />
            </div>
            <div className="text-sm font-semibold text-slate-800">Charging session in progress</div>
          </div>

          {/* Session details */}
          <div className="text-xs text-slate-600 mb-4">
            Started {startedTime} • {energyDisplay} • {connectorDisplay}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onDismiss}
              className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={onResume}
              className="h-10 rounded-xl bg-orange-500 text-white font-medium inline-flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
            >
              <Zap className="h-4 w-4" />
              <span>Resume</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

