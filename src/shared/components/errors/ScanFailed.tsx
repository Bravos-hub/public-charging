import React, { useState } from 'react';
import { AlertTriangle, QrCode, Keyboard, Info } from 'lucide-react';

export function ScanFailed(): React.ReactElement {
  const [id, setId] = useState('');
  return (
    <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50">
      <div className="text-[12px] text-amber-800">We couldn't read the QR code. Try again or enter the charger ID manually.</div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button className="h-10 rounded-xl text-white font-medium inline-flex items-center justify-center gap-2" style={{ backgroundColor: '#f77f00' }}>
          <QrCode className="h-4 w-4" /> Retry scan
        </button>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Charger ID" className="h-10 px-3 rounded-xl border border-slate-300 text-[13px]" />
          <button className="h-10 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2">
            <Keyboard className="h-4 w-4" /> Enter
          </button>
        </div>
      </div>
      <div className="mt-3 p-3 rounded-xl border border-slate-200 bg-white text-[12px] text-slate-700">
        <div className="font-medium mb-1">Tips</div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Clean the QR label and try again.</li>
          <li>Move closer and ensure the code is within the frame.</li>
          <li>If the label is damaged, use the printed Charger ID.</li>
        </ul>
      </div>
      <div className="mt-2 text-[12px] text-slate-600 inline-flex items-start gap-2"><Info className="h-4 w-4 mt-0.5" /> We don’t store camera images; access is used only for scanning.</div>
    </div>
  );
}

