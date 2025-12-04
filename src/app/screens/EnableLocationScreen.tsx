/**
 * Enable Location Screen (TypeScript)
 * Prompts user to grant location access for finding charging stations
 */

import React, { useEffect, useState } from 'react';
import { MapPin, Crosshair, CheckCircle2, XCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { EVZ_COLORS } from '../../core/utils/constants';

function cx(...c: (string | boolean | undefined)[]): string {
  return c.filter(Boolean).join(' ');
}

export function EnableLocationScreen(): React.ReactElement {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied' | 'error'>('idle');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [message, setMessage] = useState('');

  async function requestLocation(): Promise<void> {
    setStatus('requesting');
    setMessage('');
    if (!('geolocation' in navigator)) {
      setStatus('error');
      setMessage('Location is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus('granted');
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied');
        } else {
          setStatus('error');
          setMessage(err.message || 'Unable to get location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
    );
  }

  useEffect(() => {
    // Component mounted
  }, []);

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* FULL green header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center gap-2 text-white">
          <MapPin className="h-5 w-5" />
          <span className="font-semibold">Enable Location</span>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200">
          <div className="h-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100 via-white to-white" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
              <Crosshair className="h-5 w-5" style={{ color: EVZ_COLORS.green }} />
              <span className="text-sm text-slate-700">Find chargers near you instantly</span>
            </div>
          </div>
        </div>

        {/* Reasons */}
        <div className="mt-6 space-y-3 text-[13px] text-slate-700">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: EVZ_COLORS.green }} />
            <div>
              <b>Faster discovery.</b> We show the closest, compatible chargers first.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: EVZ_COLORS.green }} />
            <div>
              <b>Accurate availability.</b> Live status updates are scoped to your area.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: EVZ_COLORS.green }} />
            <div>
              <b>Turn‑by‑turn convenience.</b> Navigate to a stall with one tap.
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-6 flex flex-col gap-3">
          {status !== 'granted' && (
            <button
              onClick={requestLocation}
              disabled={status === 'requesting'}
              className={cx(
                'h-12 rounded-2xl text-white font-semibold shadow-lg',
                status === 'requesting' ? 'opacity-70 cursor-wait' : ''
              )}
              style={{ backgroundColor: EVZ_COLORS.orange }}
            >
              {status === 'requesting' ? 'Requesting permission…' : 'Enable Location'}
            </button>
          )}

          {status === 'granted' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Location enabled</div>
                  {coords && (
                    <div className="text-[12px] opacity-80">
                      {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                    </div>
                  )}
                </div>
              </div>
              <button
                className="mt-3 h-11 w-full rounded-xl text-white font-medium"
                style={{ backgroundColor: EVZ_COLORS.orange }}
              >
                Continue
              </button>
            </motion.div>
          )}

          {(status === 'denied' || status === 'error') && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-rose-800"
            >
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">We couldn't access your location</div>
                  <div className="text-[12px] opacity-80 mt-1">
                    {message || "Permission was denied. You can allow it from your browser or device settings."}
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700">
                  Maybe later
                </button>
                <button
                  type="button"
                  className="h-11 grid place-items-center rounded-xl text-white font-medium"
                  style={{ backgroundColor: EVZ_COLORS.orange }}
                  onClick={() => {
                    // Open device settings for location permissions
                    if (navigator.permissions) {
                      navigator.permissions.query({ name: 'geolocation' }).then(() => {
                        // Permission query complete
                      });
                    }
                  }}
                >
                  Open Settings
                </button>
              </div>
            </motion.div>
          )}

          <div className="flex items-start gap-2 text-[12px] text-slate-500 mt-2">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>We only use your location to find nearby charging stations. You can change this anytime in Settings.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

