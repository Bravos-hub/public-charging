/**
 * Charging In Progress Screen (TypeScript)
 */

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { ArrowLeft, Zap, Gauge, Clock3, Fuel, AlertTriangle } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { motion, AnimatePresence } from 'framer-motion';

function formatDuration(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h > 0 ? h + 'h ' : ''}${m}m ${s}s`;
}

interface ChargingInProgressScreenProps {
  sessionId?: string;
  onStop?: () => void;
  onAutoStop?: () => void; // Called when charging automatically reaches 100%
  onBack?: () => void;
}

export function ChargingInProgressScreen({
  sessionId,
  onStop,
  onAutoStop,
  onBack,
}: ChargingInProgressScreenProps): React.ReactElement {
  // Demo ticking state (does not connect to hardware)
  const [start] = useState(() => Date.now() - 12 * 60 * 1000); // started 12m ago
  const [percent, setPercent] = useState(27);
  const [energyKwh, setEnergyKwh] = useState(5.4);
  const [showStopConfirmation, setShowStopConfirmation] = useState(false);
  const [hasAutoStopped, setHasAutoStopped] = useState(false);
  const pricePerKwh = 3000;

  // Swipe state
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const swipeContainerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const currentXRef = useRef<number>(0);
  const swipeProgressRef = useRef<number>(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPercent((p) => {
        const newPercent = Math.min(100, +(p + 0.4).toFixed(1));
        // Auto-stop when reaching 100%
        if (newPercent >= 100 && p < 100 && !hasAutoStopped) {
          setHasAutoStopped(true);
          // Small delay to show 100% before stopping
          setTimeout(() => {
            // Use onAutoStop if provided, otherwise fall back to onStop
            if (onAutoStop) {
              onAutoStop();
            } else {
              onStop?.();
            }
          }, 1500);
        }
        return newPercent;
      });
      setEnergyKwh((e) => +(e + 0.08).toFixed(2));
    }, 1500);
    return () => clearInterval(id);
  }, [onStop, onAutoStop, hasAutoStopped]);

  const total = useMemo(() => Math.round(energyKwh * pricePerKwh), [energyKwh]);
  const startedAt = useMemo(
    () => new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    [start]
  );
  const duration = useMemo(() => formatDuration(Date.now() - start), [start]);

  // Swipe handlers
  function handleSwipeStart(e: React.TouchEvent | React.MouseEvent): void {
    e.preventDefault();
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
    currentXRef.current = clientX;
  }

  function updateSwipeProgress(clientX: number): void {
    if (!swipeContainerRef.current) return;
    
    const container = swipeContainerRef.current;
    const containerWidth = container.offsetWidth;
    const buttonWidth = 220; // Button width (increased for text)
    const maxDrag = Math.max(1, containerWidth - buttonWidth);
    
    const deltaX = clientX - startXRef.current;
    const progress = Math.max(0, Math.min(1, deltaX / maxDrag));
    
    swipeProgressRef.current = progress;
    setSwipeProgress(progress);
  }

  function handleSwipeEnd(): void {
    if (!isDragging) return;
    
    const finalProgress = swipeProgressRef.current;
    setIsDragging(false);
    
    // If swiped more than 85%, trigger the action
    if (finalProgress >= 0.85) {
      setShowStopConfirmation(true);
    }
    
    // Reset swipe progress
    setTimeout(() => {
      setSwipeProgress(0);
      swipeProgressRef.current = 0;
    }, 300);
  }

  // Add global mouse/touch listeners when dragging
  useEffect(() => {
    if (!isDragging) return;

    function handleMouseMove(e: MouseEvent): void {
      e.preventDefault();
      updateSwipeProgress(e.clientX);
    }

    function handleMouseUp(): void {
      handleSwipeEnd();
    }

    function handleTouchMove(e: TouchEvent): void {
      e.preventDefault();
      updateSwipeProgress(e.touches[0].clientX);
    }

    function handleTouchEnd(): void {
      handleSwipeEnd();
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Charging — In Progress</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Progress circle */}
        <div className="mt-2 grid place-items-center">
          <div
            className="h-44 w-44 rounded-full grid place-items-center relative"
            style={{ background: `conic-gradient(${EVZ_COLORS.green} ${percent}%, #e2e8f0 0)` }}
          >
            <div className="h-36 w-36 rounded-full bg-white grid place-items-center border border-slate-200 relative">
              <div className="text-3xl font-bold text-slate-800">{percent}%</div>
              {percent >= 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-semibold text-white whitespace-nowrap"
                  style={{ backgroundColor: EVZ_COLORS.green }}
                >
                  Charging Complete
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <Gauge className="h-4 w-4" /> Energy
            </div>
            <div className="mt-1 text-[15px] font-semibold">{energyKwh} kWh</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <Fuel className="h-4 w-4" /> Accumulated Range
            </div>
            <div className="mt-1 text-[15px] font-semibold">{Math.round(energyKwh * 6)} km</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <Clock3 className="h-4 w-4" /> Started at
            </div>
            <div className="mt-1 text-[15px] font-semibold">{startedAt}</div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <Clock3 className="h-4 w-4" /> Duration
            </div>
            <div className="mt-1 text-[15px] font-semibold">{duration}</div>
          </div>
        </div>

        {/* Total Amount */}
        <div className="mt-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
          <div className="text-[12px] text-slate-500">Total Amount</div>
          <div className="text-[16px] font-semibold text-slate-800">UGX {total.toLocaleString()}</div>
        </div>

        {/* Swipe to End */}
        <div className="mt-6">
          <motion.div
            ref={swipeContainerRef}
            className="relative h-12 rounded-xl border border-slate-200 overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleSwipeStart}
            onTouchStart={handleSwipeStart}
            animate={{
              backgroundColor: swipeProgress > 0.3
                ? `rgba(247, 127, 0, ${0.1 + swipeProgress * 0.15})`
                : 'rgb(241, 245, 249)',
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute left-0 top-0 h-full rounded-xl text-white font-medium inline-flex items-center justify-center gap-2 select-none px-5 whitespace-nowrap"
              style={{
                width: '220px',
              }}
              animate={{
                x: swipeProgress * (swipeContainerRef.current ? Math.max(0, swipeContainerRef.current.offsetWidth - 220) : 0),
                backgroundColor: (() => {
                  // Start: Orange #f77f00 (rgb(247, 127, 0))
                  // End: Green #03cd8c (rgb(3, 205, 140))
                  if (swipeProgress <= 0.3) {
                    return EVZ_COLORS.orange; // rgb(247, 127, 0)
                  }
                  const progress = (swipeProgress - 0.3) / 0.7; // Normalize 0.3-1.0 to 0-1
                  const r = Math.floor(247 - progress * 244); // 247 -> 3
                  const g = Math.floor(127 + progress * 78);  // 127 -> 205
                  const b = Math.floor(0 + progress * 140);    // 0 -> 140
                  return `rgb(${r}, ${g}, ${b})`;
                })(),
              }}
              transition={isDragging ? { type: 'tween', duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
            >
              <motion.div
                animate={{
                  scale: swipeProgress > 0.75 ? 1.15 : 1,
                  rotate: swipeProgress > 0.8 ? [0, -10, 10, 0] : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <Zap className="h-4 w-4 flex-shrink-0" />
              </motion.div>
              <span className="text-[13px] font-medium">Swipe to End Session</span>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Stop Confirmation Modal */}
      <AnimatePresence>
        {showStopConfirmation && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStopConfirmation(false)}
              className="fixed inset-0 z-50 bg-black/40"
            />
            {/* Modal */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-x-0 bottom-0 z-50 pointer-events-none"
            >
              <div className="max-w-md mx-auto p-4 pointer-events-auto">
                <div className="rounded-2xl bg-white shadow-xl border border-slate-200 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-[14px] font-semibold text-slate-800">End charging session?</div>
                      <div className="text-[12px] text-slate-600 mt-1">
                        You can resume later, but the connector may become unavailable if others are waiting.
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      className="h-10 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                      onClick={() => setShowStopConfirmation(false)}
                    >
                      Keep Charging
                    </button>
                    <button
                      className="h-10 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: EVZ_COLORS.orange }}
                      onClick={() => {
                        setShowStopConfirmation(false);
                        // Small delay to allow modal to close smoothly
                        setTimeout(() => {
                          onStop?.();
                        }, 200);
                      }}
                    >
                      Stop Charging
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

