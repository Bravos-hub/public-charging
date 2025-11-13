/**
 * Payment Error Component (TypeScript)
 * Displays payment failure alert with retry and change method options
 */

import React, { useEffect, useState } from 'react';
import { AlertTriangle, RotateCcw, CreditCard, HelpCircle } from 'lucide-react';
import { EVZ_COLORS } from '../../core/utils/constants';

interface PaymentErrorProps {
  errorCode?: string;
  errorMessage?: string;
  onRetry?: () => void;
  onChangeMethod?: () => void;
  onViewHelp?: () => void;
  autoRetryDelay?: number; // seconds
}

export function PaymentError({
  errorCode = 'PAY-408 (Timeout)',
  errorMessage = 'We couldn\'t confirm your payment. You can retry or choose a different method.',
  onRetry,
  onChangeMethod,
  onViewHelp,
  autoRetryDelay = 5,
}: PaymentErrorProps): React.ReactElement {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      onRetry?.();
      setCountdown(null);
    }
  }, [countdown, onRetry]);

  function handleRetry(): void {
    if (autoRetryDelay > 0) {
      setCountdown(autoRetryDelay);
    } else {
      onRetry?.();
    }
  }

  return (
    <div className="p-4 rounded-xl border border-rose-200 bg-rose-50">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-5 w-5 text-rose-700 flex-shrink-0" />
        <span className="text-[14px] font-semibold text-rose-800">Payment failed</span>
      </div>

      {/* Error Message */}
      <div className="text-[12px] text-rose-700 mb-3 ml-7">
        <div>{errorMessage}</div>
        <div className="mt-1">Error code: {errorCode}</div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={handleRetry}
          className="h-10 px-3 rounded-lg text-white font-medium inline-flex items-center justify-center gap-2 text-[12px]"
          style={{ backgroundColor: EVZ_COLORS.orange }}
        >
          <RotateCcw className="h-4 w-4" />
          {countdown !== null ? `Retry in ${countdown}s` : 'Retry in 5s'}
        </button>
        <button
          onClick={onChangeMethod}
          className="h-10 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium inline-flex items-center justify-center gap-2 text-[12px]"
        >
          <CreditCard className="h-4 w-4" />
          Change Method
        </button>
      </div>

      {/* Help Link */}
      <button
        onClick={onViewHelp}
        className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-slate-800"
      >
        <HelpCircle className="h-3.5 w-3.5" />
        View help
      </button>
    </div>
  );
}

