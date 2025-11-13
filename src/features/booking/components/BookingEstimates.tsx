import React from 'react';

export function BookingEstimates({ energyKwh = 20, pricePerKwh = 3000 }: { energyKwh?: number; pricePerKwh?: number }): React.ReactElement {
  const total = Math.round(energyKwh * pricePerKwh);
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
      <div className="text-slate-600">Energy (est.)</div><div className="text-right font-medium">{energyKwh} kWh</div>
      <div className="text-slate-600">Price per kWh</div><div className="text-right font-medium">UGX {pricePerKwh.toLocaleString()}</div>
      <div className="text-slate-600">Total (est.)</div><div className="text-right font-semibold">UGX {total.toLocaleString()}</div>
    </div>
  );
}

