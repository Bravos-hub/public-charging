import React, { useMemo } from 'react';
import { AlertTriangle, CreditCard, Info } from 'lucide-react';

export function RefundConfirmation(): React.ReactElement {
  const tx = useMemo(() => ({ amount: 100000, used: 38000, fee: 2000 }), []);
  const refundable = Math.max(0, tx.amount - tx.used - tx.fee);
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="text-sm font-semibold text-slate-800">Summary</div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
        <div className="text-slate-600">Original amount</div><div className="text-right font-medium">UGX {tx.amount.toLocaleString()}</div>
        <div className="text-slate-600">Used</div><div className="text-right font-medium">UGX {tx.used.toLocaleString()}</div>
        <div className="text-slate-600">Fees</div><div className="text-right font-medium">UGX {tx.fee.toLocaleString()}</div>
        <div className="text-slate-600">Refundable</div><div className="text-right font-semibold">UGX {refundable.toLocaleString()}</div>
      </div>
      <div className="mt-2 text-[12px] text-slate-600 inline-flex items-start gap-2"><AlertTriangle className="h-4 w-4 mt-0.5 text-amber-600" /> Refunds may take 3–5 business days depending on your issuer.</div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700">Keep Funds</button>
        <button className="h-11 rounded-xl text-white font-medium" style={{ backgroundColor: '#f77f00' }}>Confirm Refund</button>
      </div>
    </div>
  );
}

