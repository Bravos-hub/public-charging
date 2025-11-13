import React, { useState } from 'react';
import { WifiOff, RefreshCw, Bookmark, MapPin } from 'lucide-react';

export function Offline(): React.ReactElement {
  const [retrying, setRetrying] = useState(false);
  function retry(): void { setRetrying(true); setTimeout(() => setRetrying(false), 800); }
  return (
    <div className="p-6 rounded-3xl border border-slate-200 bg-white text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl grid place-items-center bg-slate-100">
        <WifiOff className="h-7 w-7 text-slate-500" />
      </div>
      <div className="mt-3 text-[15px] font-semibold text-slate-800">You’re offline</div>
      <div className="mt-1 text-[13px] text-slate-600">Check your connection. Limited features are available until you’re back online.</div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <button onClick={retry} className="h-11 rounded-xl text-white font-medium inline-flex items-center justify-center gap-2 col-span-2" style={{ backgroundColor: '#f77f00' }}>
          {retrying ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Retry
        </button>
        <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2">
          <Bookmark className="h-4 w-4" /> Favorites
        </button>
      </div>
      <div className="mt-3">
        <button className="h-11 w-full rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2">
          <MapPin className="h-4 w-4" /> Open Map (limited)
        </button>
      </div>
    </div>
  );
}

