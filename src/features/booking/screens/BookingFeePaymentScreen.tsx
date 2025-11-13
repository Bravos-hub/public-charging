/**
 * Booking Fee Payment Screen (TypeScript)
 * Payment method selection for booking fee
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeft, MapPin, Calendar, Wallet, CreditCard, Smartphone, Globe, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

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

export function BookingFeePaymentScreen(): React.ReactElement {
  const { route, back, push } = useNavigation();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>('evzone');

  // Get booking data from route params
  const booking = route.params?.booking;
  const station = route.params?.station;
  const time = route.params?.time;
  const date = route.params?.date;

  // Calculate booking fee
  const bookingFee = 2000; // UGX
  const tax = 0; // UGX
  const total = bookingFee + tax;

  // Format date and time (1.5 hour slot)
  const formattedDate = useMemo(() => {
    if (!date || !time) return 'Thu, 20 Nov 2025 • 15:00 — 16:30';
    const d = new Date(date);
    const [startHour, startMin] = time.split(':');
    const startHourNum = parseInt(startHour);
    const startMinNum = parseInt(startMin);
    // Calculate end time (1.5 hours later)
    const endTotalMinutes = startHourNum * 60 + startMinNum + 90; // 90 minutes = 1.5 hours
    const endHour = Math.floor(endTotalMinutes / 60).toString().padStart(2, '0');
    const endMin = (endTotalMinutes % 60).toString().padStart(2, '0');
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()} • ${startHour}:${startMin} — ${endHour}:${endMin}`;
  }, [date, time]);

  const stationName = station?.name || booking?.stationName || 'Central Hub — Downtown Mall';
  const stationAddress = station?.address || booking?.stationAddress || 'Plot 10 Main St, Kampala, UG';

  function handlePayBookingFee(): void {
    if (!selectedPayment) return;

    // Build/augment booking for confirmation screen
    const start = (() => {
      if (!date || !time) return new Date();
      const d = new Date(date);
      const [h, m] = String(time).split(':').map((v: string) => parseInt(v, 10));
      d.setHours(h || 0, m || 0, 0, 0);
      return d;
    })();
    const end = new Date(start.getTime() + 90 * 60000); // default 90 min slot

    const confirmedBooking = {
      ...(booking || {}),
      id: booking?.id || `BOOK-${Date.now()}`,
      stationId: booking?.stationId || route.params?.stationId || route.params?.station?.id,
      stationName: station?.name || booking?.stationName,
      stationAddress: station?.address || booking?.stationAddress,
      startTime: booking?.startTime ? new Date(booking.startTime) : start,
      endTime: booking?.endTime ? new Date(booking.endTime) : end,
      connectorType: booking?.connectorType || 'CCS2',
      status: 'confirmed' as const,
      bookingFee: total,
      paymentMethod: selectedPayment,
    };

    // Route to reservation confirmation screen
    push('BOOK_CONFIRMATION', {
      booking: confirmedBooking,
      station,
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
          <span className="font-semibold">Booking Fee — Advance Scheduling</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        {/* Your Booking Section */}
        <div className="mb-4 p-4 rounded-2xl border border-slate-200 bg-slate-50">
          <div className="text-[13px] font-semibold text-slate-800 mb-3">Your booking</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[12px] text-slate-700">
              <MapPin className="h-4 w-4 text-slate-500" />
              {stationName}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-slate-700">
              <MapPin className="h-4 w-4 text-slate-500" />
              {stationAddress}
            </div>
            <div className="flex items-center gap-2 text-[12px] text-slate-700">
              <Calendar className="h-4 w-4 text-slate-500" />
              {formattedDate}
            </div>
          </div>
        </div>

        {/* Due Now Section */}
        <div className="mb-4 p-4 rounded-2xl border border-slate-200 bg-slate-50">
          <div className="text-[13px] font-semibold text-slate-800 mb-3">Due now</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-slate-600">Booking fee</span>
              <span className="text-[12px] font-semibold text-slate-800">UGX {bookingFee.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-slate-600">Tax</span>
              <span className="text-[12px] font-semibold text-slate-800">UGX {tax.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-[13px] font-semibold text-slate-800">Total</span>
              <span className="text-[13px] font-semibold text-slate-800">UGX {total.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-3 p-2 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
            <Info className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
            <div className="text-[11px] text-slate-600">
              Paying this fee secures your time slot. Session energy/time charges will be billed after charging per station policy.
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

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={back}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handlePayBookingFee}
            disabled={!selectedPayment}
            className="h-11 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Pay Booking Fee
          </button>
        </div>
      </main>
    </div>
  );
}
