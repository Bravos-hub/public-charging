import React from 'react';
import { MapPin } from 'lucide-react';

export function NoStationsFound(): React.ReactElement {
  return (
    <div className="p-6 rounded-3xl border border-slate-200 bg-white text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl grid place-items-center bg-slate-100">
        <MapPin className="h-7 w-7 text-slate-500" />
      </div>
      <div className="mt-3 text-[15px] font-semibold text-slate-800">No stations found</div>
      <div className="mt-1 text-[13px] text-slate-600">Try expanding your search area or adjust filters.</div>
    </div>
  );
}

