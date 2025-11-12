/**
 * Prepaid Charging Screen (TypeScript)
 * Allows users to prepay for fixed charging session
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeft, MapPin, Bolt, Shield, Wallet, CreditCard, Smartphone, Globe } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';
import type { Station, Connector } from '../../../core/types';

type ChargingMode = 'duration' | 'energy';
type PaymentMethod = 'evzone' | 'card' | 'mobile' | 'alipay' | 'wechat';

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
];

export function PrepaidChargingScreen(): React.ReactElement {
  const { route, back, push } = useNavigation();
  const [mode, setMode] = useState<ChargingMode>('duration');
  const [duration, setDuration] = useState(4);
  const [energy, setEnergy] = useState(4);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  // Get station and connector from route params
  const station: Station | undefined = route.params?.station;
  const connector: Connector | undefined = route.params?.connector;
  const scanResult = route.params?.scanResult;
  const chargerId = route.params?.chargerId;

  // Default values
  const connectorType = connector?.type || 'CCS2';
  const power = connector?.power || 60;
  const energyPrice = connector?.price || station?.price || 3000;
  const timePrice = 50; // UGX per minute

  // Calculate derived values
  const derivedEnergy = useMemo(() => {
    if (mode === 'duration') {
      // Energy (kWh) = (Power (kW) * Duration (min)) / 60
      return Math.round((power * duration) / 60 * 10) / 10;
    }
    return energy;
  }, [mode, duration, energy, power]);

  const derivedRange = useMemo(() => {
    // Approximate: 1 kWh ≈ 6 km range
    return Math.round(derivedEnergy * 6);
  }, [derivedEnergy]);

  const prepaymentAmount = useMemo(() => {
    if (mode === 'duration') {
      return duration * timePrice;
    } else {
      return energy * energyPrice;
    }
  }, [mode, duration, energy, timePrice, energyPrice]);

  function handleProceedToPay(): void {
    if (!selectedPayment) {
      return;
    }

    // Navigate to payment processing, then to charging ready
    push('CHARGING_READY', {
      ...route.params,
      prepayment: {
        amount: prepaymentAmount,
        mode,
        duration: mode === 'duration' ? duration : undefined,
        energy: mode === 'energy' ? energy : undefined,
        paymentMethod: selectedPayment,
      },
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
          <span className="font-semibold">Prepaid — Fixed Charging</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-32">
        {/* Station Information */}
        <div className="mb-4">
          <div className="text-[12px] text-slate-600 mb-2">Station</div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-800 mb-3">
              <MapPin className="h-4 w-4" />
              {station?.name || 'Central Hub — Downtown Mall'}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-slate-50">
                <div className="text-[10px] text-slate-500 mb-1">Connector</div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-800">
                  <Bolt className="h-3 w-3" /> {connectorType}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <div className="text-[10px] text-slate-500 mb-1">Power</div>
                <div className="text-[11px] font-semibold text-slate-800">{power} kW</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50">
                <div className="text-[10px] text-slate-500 mb-1">Tariff</div>
                <div className="text-[10px] text-slate-700">
                  Energy: UGX {energyPrice.toLocaleString()}/kWh
                </div>
                <div className="text-[10px] text-slate-700">
                  Time: UGX {timePrice.toLocaleString()}/min
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charging Selection Tabs */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => setMode('duration')}
              className={`h-10 rounded-lg text-[12px] font-medium transition-colors ${
                mode === 'duration'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-300'
              }`}
            >
              By Duration (min)
            </button>
            <button
              onClick={() => setMode('energy')}
              className={`h-10 rounded-lg text-[12px] font-medium transition-colors ${
                mode === 'energy'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-300'
              }`}
            >
              By Energy (kWh)
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <label className="block text-[12px] text-slate-600 mb-2">
                  {mode === 'duration' ? 'Duration (min)' : 'Energy (kWh)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max={mode === 'duration' ? '60' : '100'}
                  value={mode === 'duration' ? duration : energy}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 1;
                    if (mode === 'duration') {
                      setDuration(Math.min(60, Math.max(1, val)));
                    } else {
                      setEnergy(Math.min(100, Math.max(1, val)));
                    }
                  }}
                  className="w-full h-12 px-3 border border-slate-300 rounded-xl text-[14px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                {mode === 'duration' && (
                  <div className="mt-2 text-[11px] text-slate-500">Power: {power}kW</div>
                )}
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 mb-1">Derived Energy</div>
                <div className="text-[14px] font-bold text-slate-800">{derivedEnergy} kWh</div>
                <div className="text-[10px] text-slate-500 mt-1">≈ {derivedRange} km range</div>
              </div>
            </div>
          </div>
        </div>

        {/* Prepayment Summary */}
        <div className="mb-4 p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="text-[12px] text-slate-600 mb-2">You will prepay</div>
          <div className="text-2xl font-bold text-slate-900">UGX {prepaymentAmount.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            ({mode === 'duration' ? 'Time' : 'Energy'} tariff: UGX{' '}
            {mode === 'duration' ? timePrice : energyPrice}/{mode === 'duration' ? 'min' : 'kWh'})
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-4">
          <div className="text-[12px] text-slate-600 mb-3">Choose a payment method</div>
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
          <div className="mt-3 text-[11px] text-slate-500">
            Unused funds are <strong>automatically refunded</strong>. Final settlement occurs after the session ends.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={back}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
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

        {/* Security Banner */}
        <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: EVZ_COLORS.green + '15' }}>
          <Shield className="h-4 w-4" style={{ color: EVZ_COLORS.green }} />
          <div className="text-[11px] text-slate-700">
            <strong>Payments are secured.</strong> You'll receive a receipt after the session.
          </div>
        </div>
      </main>
    </div>
  );
}

