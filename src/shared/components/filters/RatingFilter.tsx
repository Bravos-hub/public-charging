import React, { useState } from 'react';

function Opt({ label, value, sel, onSelect }: { label: string; value: number; sel: number; onSelect: (v: number) => void }): React.ReactElement {
  const active = sel === value;
  return (
    <button onClick={() => onSelect(value)} className={`h-11 rounded-xl border text-[13px] ${active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'}`}>
      {label}
    </button>
  );
}

export function RatingFilter(): React.ReactElement {
  const [min, setMin] = useState(0); // 0 (any), 2,3,4
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white grid gap-3">
      <div className="text-[12px] text-slate-600">Minimum rating</div>
      <div className="grid grid-cols-4 gap-2">
        <Opt label="Any" value={0} sel={min} onSelect={setMin} />
        <Opt label="≥2★" value={2} sel={min} onSelect={setMin} />
        <Opt label="≥3★" value={3} sel={min} onSelect={setMin} />
        <Opt label="≥4★" value={4} sel={min} onSelect={setMin} />
      </div>
      <div className="mt-2 text-[12px] text-slate-600">Selected: {min === 0 ? 'Any' : `≥${min}★`}</div>
    </div>
  );
}

