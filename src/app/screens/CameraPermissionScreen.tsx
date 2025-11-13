/**
 * Camera Permission Screen (TypeScript)
 * Full-screen wrapper for camera permission request
 */

import React, { useState } from 'react';
import { Camera, QrCode, Info, ArrowLeft } from 'lucide-react';
import { EVZ_COLORS } from '../../core/utils/constants';
import { useNavigation } from '../../core';

export function CameraPermissionScreen(): React.ReactElement {
  const { back, push } = useNavigation();
  const [ack, setAck] = useState(false);

  function handleNotNow(): void {
    back();
  }

  function handleContinue(): void {
    if (!ack) return;
    // Navigate to QR scanner or request camera permission
    push('ACTIVATION_SCAN');
  }

  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Green header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            <span className="font-semibold">Use your camera</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* White card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="text-sm font-semibold text-slate-800 mb-4">Scan QR codes on chargers</div>
          
          {/* First information point */}
          <div className="text-[12px] text-slate-600 inline-flex items-start gap-2 mb-3">
            <QrCode className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>We need temporary camera access to scan the charger's QR for instant activation.</span>
          </div>
          
          {/* Second information point */}
          <div className="text-[12px] text-slate-600 inline-flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>We don't store images or videos; access is used only while scanning.</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={handleNotNow}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Not now
          </button>
          <button
            onClick={handleContinue}
            disabled={!ack}
            className="h-11 rounded-xl bg-orange-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
          >
            Continue
          </button>
        </div>

        {/* Agreement checkbox */}
        <div className="mt-4">
          <label className="inline-flex items-center gap-2 text-[12px] text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
            />
            <span>I understand and agree</span>
          </label>
        </div>
      </main>
    </div>
  );
}

