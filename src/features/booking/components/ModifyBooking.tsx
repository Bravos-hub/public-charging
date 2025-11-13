import React from 'react';

export function ModifyBooking({ onConfirm }: { onConfirm?: () => void }): React.ReactElement {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white grid gap-3">
      <div className="text-[12px] text-slate-600">Modify your booking</div>
      <button className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700">Change time</button>
      <button className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700">Change connector</button>
      <button onClick={onConfirm} className="h-10 rounded-xl text-white font-medium" style={{ backgroundColor: '#03cd8c' }}>Confirm changes</button>
    </div>
  );
}

