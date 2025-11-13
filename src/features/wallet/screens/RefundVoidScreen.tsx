/**
 * Refund / Void Screen (TypeScript)
 * Full-screen wrapper for refund/void operations
 */

import React, { useMemo } from 'react';
import { ArrowLeft, CreditCard, AlertTriangle } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

export function RefundVoidScreen(): React.ReactElement {
  const { route, back } = useNavigation();
  
  // Get transaction data from route params or use defaults
  const transaction = useMemo(() => ({
    amount: route.params?.amount || 100000,
    used: route.params?.used || 38000,
    fee: route.params?.fee || 2000,
  }), [route.params]);
  
  const refundable = Math.max(0, transaction.amount - transaction.used - transaction.fee);

  function handleKeepFunds(): void {
    back();
  }

  function handleConfirmRefund(): void {
    // In a real app, this would process the refund
    console.log('Processing refund:', refundable);
    // Navigate back or to confirmation screen
    back();
  }

  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Green header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span className="font-semibold">Refund / Void</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Summary card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="text-sm font-semibold text-slate-800 mb-4">Summary</div>
          
          {/* Financial details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-slate-600">Original amount</span>
              <span className="font-medium text-slate-900">UGX {transaction.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-slate-600">Used</span>
              <span className="font-medium text-slate-900">UGX {transaction.used.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-slate-600">Fees</span>
              <span className="font-medium text-slate-900">UGX {transaction.fee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[12px] pt-2 border-t border-slate-100">
              <span className="text-slate-600">Refundable</span>
              <span className="font-semibold text-slate-900">UGX {refundable.toLocaleString()}</span>
            </div>
          </div>

          {/* Warning message */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="text-[12px] text-slate-600 inline-flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-orange-600 flex-shrink-0" />
              <span>Refunds may take 3–5 business days depending on your issuer.</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={handleKeepFunds}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Keep Funds
          </button>
          <button
            onClick={handleConfirmRefund}
            className="h-11 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
          >
            Confirm Refund
          </button>
        </div>
      </main>
    </div>
  );
}

