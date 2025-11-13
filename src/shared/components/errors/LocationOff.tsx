import React from 'react';
import { Crosshair, Settings as SettingsIcon, Info, MapPin } from 'lucide-react';

export function LocationOff(): React.ReactElement {
  return (
    <div className="p-6 rounded-3xl border border-slate-200 bg-white">
      <div className="mx-auto h-14 w-14 rounded-2xl grid place-items-center bg-slate-100">
        <MapPin className="h-7 w-7 text-slate-500" />
      </div>
      <div className="mt-3 text-[15px] font-semibold text-slate-800">Find nearby chargers faster</div>
      <div className="mt-1 text-[13px] text-slate-600">We use your location to show the closest compatible stations and live availability.</div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700">Maybe Later</button>
        <button className="h-11 rounded-xl text-white font-medium inline-flex items-center justify-center gap-2" style={{ backgroundColor: '#f77f00' }}>
          <SettingsIcon className="h-4 w-4" /> Open Settings
        </button>
      </div>
      <div className="mt-3 text-[12px] text-slate-600 inline-flex items-start gap-2">
        <Info className="h-4 w-4 mt-0.5" /> You can change this anytime in your device or browser settings.
      </div>
    </div>
  );
}

