import React, { useState } from 'react';
import { Wrench, Ban, DollarSign, Smartphone, MessageSquare } from 'lucide-react';

const CATS = [
  { key: 'connector', label: 'Connector broken', icon: Wrench },
  { key: 'blocked', label: 'Blocked bay', icon: Ban },
  { key: 'price', label: 'Price mismatch', icon: DollarSign },
  { key: 'app', label: 'App issue', icon: Smartphone },
  { key: 'other', label: 'Other', icon: MessageSquare },
];

function CatBtn({ item, active, onClick }: { item: { key: string; label: string; icon: any }; active: boolean; onClick: () => void }): React.ReactElement {
  const Icon = item.icon;
  return (
    <button onClick={onClick} className={`h-11 px-3 rounded-xl border text-[12px] inline-flex items-center gap-2 ${active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'}`}>
      <Icon className="h-4 w-4" /> {item.label}
    </button>
  );
}

export function ReportProblem(): React.ReactElement {
  const [cat, setCat] = useState('');
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);
  function submit(): void { if (!cat) return; setSent(true); }
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="grid gap-2">
        {CATS.map((x) => (
          <CatBtn key={x.key} item={x} active={cat === x.key} onClick={() => setCat(x.key)} />
        ))}
      </div>
      <div className="mt-4">
        <div className="text-sm font-semibold text-slate-800">Details (optional)</div>
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe what happened…" className="mt-2 w-full h-28 p-3 rounded-xl border border-slate-300 text-[13px]" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700">Cancel</button>
        <button disabled={!cat} onClick={submit} className="h-11 rounded-xl text-white font-medium disabled:opacity-50" style={{ backgroundColor: '#f77f00' }}>Send Report</button>
      </div>
      {sent && <div className="mt-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-[12px]">Thanks — we’ll look into it.</div>}
    </div>
  );
}

