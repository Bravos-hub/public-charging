import React, { useState } from 'react';
import { Download, WifiOff, CheckCircle2, Info } from 'lucide-react';

export function OfflineCache(): React.ReactElement {
  const [cached, setCached] = useState(false);
  const [updating, setUpdating] = useState(false);
  const size = '12.4 MB';
  const last = cached ? 'Just now' : '—';
  function cacheNow(): void {
    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
      setCached(true);
    }, 1000);
  }
  return (
    <div>
      <div className="p-4 rounded-2xl border border-slate-200 bg-white">
        <div className="text-[13px] font-semibold text-slate-800">Work reliably when you’re offline</div>
        <div className="mt-1 text-[12px] text-slate-600">We’ll cache key UI assets and your latest favorites so you can still open EVzone without a connection.</div>
        {cached && (
          <div className="mt-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-[12px] inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Cached successfully.
          </div>
        )}
      </div>
      <div className="mt-3 p-4 rounded-2xl border border-slate-200 bg-white grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
        <div className="text-slate-600">Estimated size</div><div className="text-right font-medium">{size}</div>
        <div className="text-slate-600">Last updated</div><div className="text-right font-medium">{last}</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button onClick={cacheNow} className="h-11 rounded-xl text-white font-medium inline-flex items-center justify-center gap-2" style={{ backgroundColor: '#f77f00' }}>
          <Download className="h-4 w-4" /> {updating ? 'Updating…' : cached ? 'Update cache' : 'Cache now'}
        </button>
        <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700">Manage storage</button>
      </div>
      <div className="mt-3 text-[12px] text-slate-600 inline-flex items-start gap-2"><Info className="h-4 w-4 mt-0.5" /> On first install, your browser may automatically cache assets as part of the PWA.</div>
    </div>
  );
}

