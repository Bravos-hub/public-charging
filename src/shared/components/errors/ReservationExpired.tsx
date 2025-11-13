import React from 'react';
import { AlertOctagon, MapPin, Info } from 'lucide-react';

export function ReservationExpired(): React.ReactElement {
  const station = 'Central Hub — Downtown Mall';
  return (
    <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50">
      <div className="text-sm font-semibold text-rose-900 inline-flex items-center gap-2">
        <AlertOctagon className="h-4 w-4" /> Your reservation is no longer active
      </div>
      <div className="mt-3 p-3 rounded-xl border border-slate-200 bg-white">
        <div className="text-[12px] text-slate-600">Station</div>
        <div className="mt-0.5 text-[13px] font-semibold inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {station}</div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <button className="col-span-2 h-10 rounded-xl text-white font-medium" style={{ backgroundColor: '#f77f00' }}>Rebook</button>
        <button className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700">Alternatives</button>
      </div>
      <div className="mt-3 text-[12px] text-slate-600 inline-flex items-start gap-2"><Info className="h-4 w-4 mt-0.5" /> If you prepaid, we’ll release any unused funds automatically.</div>
    </div>
  );
}

