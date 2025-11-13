/**
 * Postpaid Payment Screen (TypeScript)
 * Payment method selection after charging session
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Wallet, CreditCard, Smartphone, Globe, Banknote, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';
import type { ChargingSession, Station, Connector } from '../../../core/types';

type PaymentMethod = 'evzone' | 'card' | 'mobile' | 'alipay' | 'wechat' | 'cash';

interface PaymentMethodOption {
  id: PaymentMethod;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: 'evzone', label: 'EVzone Pay', icon: Wallet },
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'mobile', label: 'Mobile Money', icon: Smartphone },
  { id: 'alipay', label: 'Alipay', icon: Globe },
  { id: 'wechat', label: 'WeChat Pay', icon: Globe },
  { id: 'cash', label: 'Cash', icon: Banknote },
];

export function PostpaidPaymentScreen(): React.ReactElement {
  const { route, back, push } = useNavigation();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  // Get session and related data from route params
  const session: ChargingSession | undefined = route.params?.session;
  const station: Station | undefined = route.params?.station;
  const connector: Connector | undefined = route.params?.connector;

  // Calculate session values
  const energyKwh = session?.energyDelivered || 32.8;
  const power = connector?.power || 60;
  const pricePerKwh = connector?.price || station?.price || 3000;
  const totalCost = useMemo(() => Math.round(energyKwh * pricePerKwh), [energyKwh, pricePerKwh]);
  const connectorType = connector?.type || 'CCS2';

  function handleProceedToPay(): void {
    if (!selectedPayment) {
      return;
    }

    // Navigate to receipt screen after payment
    push('RECEIPT', {
      session,
      station,
      connector,
      amount: totalCost,
      paymentMethod: selectedPayment,
    });
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Payment — Fixed (Postpaid)</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        {/* Session Summary */}
        <div className="mb-4">
          <div className="text-[13px] font-semibold text-slate-800 mb-3">Session Summary</div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-slate-600">Max Power</span>
              <span className="text-[12px] font-semibold text-slate-800">{power} kW</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-slate-600">Connector</span>
              <span className="text-[12px] font-semibold text-slate-800">{connectorType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-slate-600">Energy</span>
              <span className="text-[12px] font-semibold text-slate-800">{energyKwh} kWh</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-slate-600">Cost per kWh</span>
              <span className="text-[12px] font-semibold text-slate-800">UGX {pricePerKwh.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-[13px] font-semibold text-slate-800">Total Cost</span>
              <span className="text-[13px] font-semibold text-slate-800">UGX {totalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-4">
          <div className="text-[13px] font-semibold text-slate-800 mb-3">Choose a payment method</div>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedPayment === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className="w-full p-3 rounded-xl border-2 bg-white flex items-center gap-3 transition-colors"
                  style={{
                    borderColor: isSelected ? EVZ_COLORS.orange : '#e2e8f0',
                    backgroundColor: isSelected ? '#fff7ed' : 'white',
                  }}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <Icon className="h-5 w-5 text-slate-700" />
                  <span className="text-[13px] font-medium text-slate-800 flex-1 text-left">
                    {method.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Information Text */}
        <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
          <Info className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
          <div className="text-[11px] text-slate-600">
            You will be charged the total shown above. A receipt will be issued after payment.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={back}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleProceedToPay}
            disabled={!selectedPayment}
            className="h-11 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Proceed to Pay
          </button>
        </div>
      </main>
    </div>
  );
}

