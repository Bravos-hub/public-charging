import React from 'react';

export function BookingPreview({ station = 'Central Hub — Downtown Mall', time = '15:00', date = 'Today' }: { station?: string; time?: string; date?: string }): React.ReactElement {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="text-[12px] text-slate-600">Station</div>
      <div className="text-[14px] font-semibold">{station}</div>
      <div className="mt-2 text-[12px] text-slate-600">When</div>
      <div className="text-[14px] font-semibold">{date} • {time}</div>
    </div>
  );
}

