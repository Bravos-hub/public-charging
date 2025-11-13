import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, RefreshCw, Info } from 'lucide-react';

export function Payment3DSecure({ challengeUrl }: { challengeUrl?: string }): React.ReactElement {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [status, setStatus] = useState<'challenge' | 'success' | 'failed'>('challenge');
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
  return (
    <div>
      <div className="h-[60vh] bg-white relative">
        <iframe ref={frameRef} title="psp-3ds" src={url} className="w-full h-full border-0" sandbox="allow-scripts allow-forms allow-top-navigation-by-user-activation" />
        {url === 'about:blank' && (
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="px-3 py-2 rounded-xl bg-white/90 border border-slate-200 text-[12px] text-slate-700">PSP 3‑D Secure / OTP challenge loads here.</div>
          </div>
        )}
      </div>
      {status === 'success' && (
        <div className="mt-3 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-[12px] inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Verified. Completing payment…</div>
      )}
      {status === 'failed' && (
        <div className="mt-3 p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-[12px]">Verification failed or canceled. Please retry.</div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700">Cancel</button>
        <button className="h-11 rounded-xl text-white font-medium inline-flex items-center justify-center gap-2" style={{ backgroundColor: '#f77f00' }}>
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
      <div className="mt-3 text-[12px] text-slate-600 inline-flex items-start gap-2"><Info className="h-4 w-4 mt-0.5" /> Your bank may open an additional window for OTP / biometric confirmation.</div>
    </div>
  );
}

