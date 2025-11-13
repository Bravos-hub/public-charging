/**
 * Payment Verification Screen (TypeScript)
 * Full-screen wrapper for 3D Secure / OTP payment verification
 */

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, RefreshCw, Info, CheckCircle, XCircle } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

export function PaymentVerificationScreen(): React.ReactElement {
  const { route, back } = useNavigation();
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [status, setStatus] = useState<'challenge' | 'success' | 'failed'>('challenge');
  
  // Get challenge URL from route params
  const challengeUrl = route.params?.challengeUrl;
  
  useEffect(() => {
    function onMsg(e: MessageEvent): void {
      const data = String((e as any)?.data || '');
      if (data === 'psp:ok') setStatus('success');
      else if (data === 'psp:fail') setStatus('failed');
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const url = challengeUrl || 'about:blank';

  function handleCancel(): void {
    back();
  }

  function handleRetry(): void {
    setStatus('challenge');
    if (frameRef.current) {
      frameRef.current.src = url;
    }
  }

  function handleSimulateSuccess(): void {
    setStatus('success');
    // In a real app, this would trigger the success callback
    window.postMessage('psp:ok', '*');
  }

  function handleSimulateFailure(): void {
    setStatus('failed');
    // In a real app, this would trigger the failure callback
    window.postMessage('psp:fail', '*');
  }

  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Green header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Payment Verification</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Main content area with placeholder */}
        <div className="h-[50vh] bg-white relative border border-slate-200 rounded-xl overflow-hidden">
          <iframe
            ref={frameRef}
            title="psp-3ds"
            src={url}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-forms allow-top-navigation-by-user-activation"
          />
          {url === 'about:blank' && (
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
                PSP 3-D Secure / OTP challenge loads here.
              </div>
            </div>
          )}
        </div>

        {/* Action buttons in 2x2 grid */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {/* Top-left: Cancel */}
          <button
            onClick={handleCancel}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          {/* Top-right: Retry */}
          <button
            onClick={handleRetry}
            className="h-11 rounded-xl bg-orange-500 text-white font-medium inline-flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>

          {/* Bottom-left: Simulate Success */}
          <button
            onClick={handleSimulateSuccess}
            className="h-11 rounded-xl border border-green-300 bg-green-50 text-green-700 font-medium inline-flex items-center justify-center gap-2 hover:bg-green-100 transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Simulate Success</span>
          </button>

          {/* Bottom-right: Simulate Failure */}
          <button
            onClick={handleSimulateFailure}
            className="h-11 rounded-xl border border-pink-300 bg-pink-50 text-red-700 font-medium inline-flex items-center justify-center gap-2 hover:bg-pink-100 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            <span>Simulate Failure</span>
          </button>
        </div>

        {/* Informational note */}
        <div className="mt-4 text-xs text-slate-600 flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            Your bank may open an additional window for OTP / biometric confirmation. In testing, use the Simulate buttons above.
          </span>
        </div>
      </main>
    </div>
  );
}

