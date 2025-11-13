import React from 'react';
import { CreditCard, Smartphone } from 'lucide-react';

export function PaymentOptions(): React.ReactElement {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white grid gap-3">
      <div className="text-[12px] text-slate-600">Choose a payment method</div>
      <button className="h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2">
        <CreditCard className="h-4 w-4" /> Credit/Debit Card
      </button>
      <button className="h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center gap-2">
        <Smartphone className="h-4 w-4" /> Mobile Money
      </button>
    </div>
  );
}

