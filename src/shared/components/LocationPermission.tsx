import React from 'react';
import { Crosshair, Settings as SettingsIcon, Info, MapPin } from 'lucide-react';

export function LocationPermission(): React.ReactElement {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="text-[13px] font-semibold text-slate-800">Enable Location</div>
      <div className="mt-1 text-[12px] text-slate-600">We use your location to show nearby chargers and live availability.</div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700">Maybe Later</button>
        <button className="h-11 rounded-xl text-white font-medium inline-flex items-center justify-center gap-2" style={{ backgroundColor: '#f77f00' }}>
          <SettingsIcon className="h-4 w-4" /> Open Settings
        </button>
      </div>
      <div className="mt-2 text-[12px] text-slate-600 inline-flex items-start gap-2"><Info className="h-4 w-4 mt-0.5" /> You can change this anytime in your device or browser settings.</div>
    </div>
  );
}

