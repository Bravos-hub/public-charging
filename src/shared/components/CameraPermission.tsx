import React, { useState } from 'react';
import { Camera, QrCode, Info } from 'lucide-react';

export function CameraPermission(): React.ReactElement {
  const [ack, setAck] = useState(false);
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="text-[13px] font-semibold text-slate-800">Scan QR codes on chargers</div>
      <div className="mt-1 text-[12px] text-slate-600 inline-flex items-start gap-2"><QrCode className="h-4 w-4 mt-0.5" /> We need temporary camera access to scan the charger’s QR for instant activation.</div>
      <div className="mt-2 text-[12px] text-slate-600 inline-flex items-start gap-2"><Info className="h-4 w-4 mt-0.5" /> We don’t store images or videos; access is used only while scanning.</div>
      <div className="mt-3 text-[12px] text-slate-600">
        <label className="inline-flex items-center gap-2"><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /> I understand and agree</label>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700">Not now</button>
        <button disabled={!ack} className="h-11 rounded-xl text-white font-medium disabled:opacity-50" style={{ backgroundColor: '#f77f00' }}>Continue</button>
      </div>
    </div>
  );
}

