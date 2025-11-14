import React from 'react';
import { Zap, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../core/utils/constants';
import { useNavigation } from '../../core';

interface DRPeakEventBannerProps {
  active?: boolean;
  untilLabel?: string; // e.g., '19:00'
  message?: string;
  onDismiss?: () => void;
}

export function DRPeakEventBanner({
  active = true,
  untilLabel = 'today',
  message = 'Peak price in effect due to demand response. Prices may be higher temporarily.',
  onDismiss,
}: DRPeakEventBannerProps): React.ReactElement | null {
  const { push } = useNavigation();
  if (!active) return null;
  return (
    <div className="max-w-md mx-auto px-4 mt-2">
      <div className="p-3 rounded-xl border border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full grid place-items-center" style={{ backgroundColor: '#FFE3B3' }}>
            <Zap className="h-4 w-4" style={{ color: EVZ_COLORS.orange }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-amber-900">Demand Response in effect</div>
            <div className="text-[12px] text-amber-800 mt-0.5">{message} Until {untilLabel}.</div>
            <button
              onClick={() => push('PRICING_TARIFFS')}
              className="mt-2 h-8 px-3 rounded-lg border border-amber-300 bg-white text-[12px] text-amber-800 hover:bg-amber-100"
            >
              View Pricing
            </button>
          </div>
          {onDismiss && (
            <button aria-label="Dismiss" onClick={onDismiss} className="text-amber-800 text-[12px]">
              ✕
            </button>
          )}
        </div>
        <div className="mt-2 text-[11px] text-amber-800 inline-flex items-start gap-1">
          <Info className="h-3.5 w-3.5 mt-0.5" />
          During DR events, Peak price may increase temporarily.
        </div>
      </div>
    </div>
  );
}

