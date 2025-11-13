/**
 * Grid Event Alert (TypeScript)
 * Reusable banner used on Station Details to inform users about
 * temporary grid events (e.g., peak pricing, throttling) with a countdown.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Info, Clock } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';

export interface GridEventAlertProps {
  // When the event ends. If omitted, a default 45-minute window is used from mount time.
  endsAt?: number; // epoch ms
  title?: string;
  description?: string;
  onAcknowledge?: () => void;
  onLearnMore?: () => void;
}

function formatHMS(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600).toString().padStart(2, '0');
  const m = Math.floor((total % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(total % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function GridEventAlert({
  endsAt,
  title = 'Peak grid event — High impact',
  description = 'Charging prices may be higher and power may be limited during the event.',
  onAcknowledge,
  onLearnMore,
}: GridEventAlertProps): React.ReactElement | null {
  const [now, setNow] = useState(() => Date.now());
  const [dismissed, setDismissed] = useState(false);
  const computedEndsAt = useMemo(() => endsAt ?? Date.now() + 45 * 60 * 1000, [endsAt]);
  const remaining = Math.max(0, computedEndsAt - now);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (dismissed) return null;

  return (
    <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/80">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl grid place-items-center bg-amber-100 border border-amber-200 flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-700" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold text-amber-900">{title}</div>
          <div className="mt-1 text-[13px] text-amber-900/80">{description}</div>
          <div className="mt-2 inline-flex items-center gap-2 text-[12px] text-amber-900/80">
            <Clock className="h-4 w-4" /> {formatHMS(remaining)} remaining
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              onClick={onLearnMore}
              className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700"
            >
              Learn more
            </button>
            <button
              onClick={() => { setDismissed(true); onAcknowledge?.(); }}
              className="h-11 rounded-xl text-white font-medium"
              style={{ backgroundColor: EVZ_COLORS.orange }}
            >
              Acknowledge
            </button>
          </div>

          <div className="mt-3 text-[12px] text-slate-700 inline-flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5" /> We’ll show the updated price on the order and session screens.
          </div>
        </div>
      </div>
    </div>
  );
}

