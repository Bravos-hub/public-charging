/**
 * Scan Failed Screen (TypeScript)
 * Full-screen wrapper for scan failure error
 */

import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, QrCode, Keyboard, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

export function ScanFailedScreen(): React.ReactElement {
  const { route, back, push } = useNavigation();
  const [id, setId] = useState('');

  function handleRetryScan(): void {
    // Navigate back to QR scanner
    push('ACTIVATION_SCAN', route.params);
  }

  function handleEnterId(): void {
    if (id.trim()) {
      // Navigate to enter charger ID screen with the entered ID
      push('ACTIVATION_ENTER_ID', {
        ...route.params,
        chargerId: id.trim(),
      });
    } else {
      // Navigate to enter charger ID screen without pre-filled ID
      push('ACTIVATION_ENTER_ID', route.params);
    }
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
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">Scan failed</span>
          </div>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Warning message box */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-4">
          <div className="text-sm font-medium text-amber-900">
            We couldn't read the QR code. Try again or enter the charger ID manually.
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleRetryScan}
            className="h-11 rounded-xl bg-orange-500 text-white font-medium inline-flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
          >
            <QrCode className="h-4 w-4" />
            <span>Retry scan</span>
          </button>
          <button
            onClick={handleEnterId}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium inline-flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <Keyboard className="h-4 w-4" />
            <span>Enter ID</span>
          </button>
        </div>

        {/* Tips section */}
        <div className="p-3 rounded-xl border border-slate-200 bg-white mb-4">
          <div className="text-sm font-semibold text-slate-800 mb-2">Tips</div>
          <ul className="list-disc pl-5 space-y-1.5 text-[12px] text-slate-700">
            <li>Clean the QR label and try again.</li>
            <li>Move closer and ensure the code is within the frame.</li>
            <li>If the label is damaged, use the printed Charger ID.</li>
          </ul>
        </div>

        {/* Privacy note */}
        <div className="text-xs text-slate-600 flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>We don't store camera images; access is used only for scanning.</span>
        </div>
      </main>
    </div>
  );
}

