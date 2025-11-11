/**
 * QR Scanner Component (TypeScript)
 */

import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Camera, Flashlight, AlertCircle, QrCode, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';

interface ScanResult {
  stationId: string;
  evseId: string;
  connectorId: number;
  billingType: string;
  price: number;
}

interface QRScannerProps {
  onScan?: (result: ScanResult) => void;
  onBack?: () => void;
  onEnterId?: () => void;
}

export function QRScanner({ onScan, onBack, onEnterId }: QRScannerProps): React.ReactElement {
  const [supported, setSupported] = useState(!!navigator.mediaDevices);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  async function startCamera(): Promise<void> {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      trackRef.current = stream.getVideoTracks()[0];
      setStreaming(true);
    } catch (e: any) {
      setError((e && e.message) || 'Unable to access camera.');
      setStreaming(false);
    }
  }

  function stopCamera(): void {
    try {
      trackRef.current?.stop();
    } catch (_) {
      // Ignore
    }
    const video = videoRef.current;
    if (video && video.srcObject) {
      (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    }
    setStreaming(false);
  }

  async function toggleTorch(): Promise<void> {
    const track = trackRef.current;
    if (!track) return;
    try {
      const caps = track.getCapabilities?.();
      if (caps && 'torch' in caps) {
        // Type assertion for torch constraint (not in standard MediaTrackConstraintSet)
        await track.applyConstraints({
          advanced: [{ torch: !torchOn } as MediaTrackConstraints],
        });
        setTorchOn((v) => !v);
      }
    } catch (_) {
      // Ignore
    }
  }

  function simulateScan(): void {
    const scanResult: ScanResult = {
      stationId: 'KLA-001',
      evseId: 'EVZ-123',
      connectorId: 1,
      billingType: 'Prepaid',
      price: 3000,
    };
    setResult(scanResult);
    onScan?.(scanResult);
  }

  useEffect(() => {
    setSupported(!!navigator.mediaDevices);
    return stopCamera;
  }, []);

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Activate — Scan QR</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        {/* Camera preview */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-64 grid place-items-center">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          {/* Frame overlay */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="h-40 w-40 border-2 border-white/90 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
          </div>
          {!streaming && (
            <div className="absolute inset-0 grid place-items-center text-slate-600">
              <div className="flex flex-col items-center gap-2">
                <QrCode className="h-10 w-10" />
                <div className="text-[12px]">Align the charger's QR code within the frame</div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={streaming ? stopCamera : startCamera}
            className="h-11 rounded-xl text-white font-medium"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            {streaming ? 'Stop Camera' : 'Start Camera'}
          </button>
          <button
            onClick={toggleTorch}
            disabled={!streaming}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Flashlight className="h-4 w-4" /> Torch
          </button>
          <button
            onClick={simulateScan}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 flex items-center justify-center gap-2"
          >
            <Camera className="h-4 w-4" /> Simulate
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-4 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-[12px]">
            <div className="font-semibold">Charger detected</div>
            <div className="mt-1">
              Station: <b>{result.stationId}</b> • EVSE: <b>{result.evseId}</b> • Connector:{' '}
              <b>{result.connectorId}</b>
            </div>
            <div className="mt-1">
              Billing: <b>{result.billingType}</b> • Price: <b>UGX {result.price.toLocaleString()}</b>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                className="h-10 rounded-lg border border-slate-300 bg-white text-slate-700"
                onClick={() => setResult(null)}
              >
                Rescan
              </button>
              <button
                className="h-10 rounded-lg text-white font-medium"
                style={{ backgroundColor: EVZ_COLORS.orange }}
                onClick={() => onScan?.(result)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Errors / hints */}
        {error && (
          <div className="mt-3 p-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-[12px] flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <div>{error}</div>
          </div>
        )}
        {!supported && (
          <div className="mt-3 p-3 rounded-xl border border-slate-200 bg-slate-50 text-[12px] flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5" />
            <div>
              Your browser doesn't support camera access. You can still activate by entering the Charger ID.
            </div>
          </div>
        )}

        <div className="mt-4 text-[12px] text-slate-600">
          Can't scan?{' '}
          <button onClick={onEnterId} className="underline">
            Enter Charger ID
          </button>
        </div>
      </main>
    </div>
  );
}

