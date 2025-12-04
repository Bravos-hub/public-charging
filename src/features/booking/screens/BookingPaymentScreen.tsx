/**
 * Booking Payment Screen (TypeScript)
 */

import React, { useMemo, useState } from 'react';
import { ArrowLeft, MapPin, CreditCard, Wallet, Banknote } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useApp } from '../../../core';

interface BookingPaymentScreenProps {
  amount: number;
  currency?: string;
  onPay?: (methodId: string) => void;
  onBack?: () => void;
}

export function BookingPaymentScreen({
  amount,
  currency = 'UGX',
  onPay,
  onBack,
}: BookingPaymentScreenProps): React.ReactElement {
  const { wallet } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    wallet.methods.find((m) => m.isDefault)?.id || null
  );

  const methods = useMemo(() => {
    const walletMethods = wallet.methods.map((m) => ({
      ...m,
      label: m.brand ? `${m.brand} •••• ${m.last4 || '****'}` : 'Card',
      icon: CreditCard,
    }));

    return [
      ...walletMethods,
      {
        id: 'wallet',
        type: 'wallet' as const,
        label: `EVzone Pay (${currency} ${wallet.balance.toLocaleString()})`,
        icon: Wallet,
        isDefault: false,
      },
      {
        id: 'cash',
        type: 'cash' as const,
        label: 'Pay at Station',
        icon: Banknote,
        isDefault: false,
      },
    ];
  }, [wallet, currency]);

  function handlePay(): void {
    if (selectedMethod) {
      onPay?.(selectedMethod);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button className="inline-flex items-center gap-2" aria-label="Back" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="h-5 w-5" />
            <span className="font-semibold truncate">Payment</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-28">
        {/* Amount summary */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-[12px] text-slate-500">Total Amount</div>
          <div className="mt-1 text-[28px] font-bold tracking-tight">
            {currency} {amount.toLocaleString()}
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-4">
          <div className="text-sm font-semibold text-slate-800 mb-2">Select Payment Method</div>
          <div className="space-y-2">
            {methods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-xl grid place-items-center ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-[13px] font-semibold text-slate-800">{method.label}</div>
                      {method.isDefault && (
                        <div className="text-[11px] text-slate-600">Default</div>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="h-5 w-5 rounded-full bg-emerald-600 grid place-items-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <button
            onClick={handlePay}
            disabled={!selectedMethod}
            className="h-11 w-full rounded-xl text-white font-medium disabled:opacity-50"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Pay {currency} {amount.toLocaleString()}
          </button>
        </div>
      </main>
    </div>
  );
}

