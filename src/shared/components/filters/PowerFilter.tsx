/**
 * Power (kW) Filter Screen (TypeScript)
 * Allows users to set power range for filtering
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation, useApp } from '../../../core';

export function PowerFilter(): React.ReactElement {
  const { back } = useNavigation();
  const { filters, setFilters } = useApp();
  const [min, setMin] = useState(filters.minKw ?? 3);
  const [max, setMax] = useState(filters.maxKw ?? 350);
  const [activeHandle, setActiveHandle] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Sync with global filters when they change externally
  useEffect(() => {
    setMin(filters.minKw ?? 3);
    setMax(filters.maxKw ?? 350);
  }, [filters]);

  // Ensure min <= max and clamp values
  const clampedMin = useMemo(() => Math.max(3, Math.min(min, max)), [min, max]);
  const clampedMax = useMemo(() => Math.min(350, Math.max(max, min)), [min, max]);

  // Calculate positions for handles (0-100%)
  const minPosition = useMemo(() => ((clampedMin - 3) / (350 - 3)) * 100, [clampedMin]);
  const maxPosition = useMemo(() => ((clampedMax - 3) / (350 - 3)) * 100, [clampedMax]);

  function handleSliderClick(e: React.MouseEvent<HTMLDivElement>): void {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const value = Math.round(3 + (percentage / 100) * (350 - 3));

    // Determine which handle to move based on proximity
    const minDist = Math.abs(value - clampedMin);
    const maxDist = Math.abs(value - clampedMax);

    if (minDist < maxDist) {
      setMin(Math.min(value, clampedMax));
    } else {
      setMax(Math.max(value, clampedMin));
    }
  }

  function handleHandleMouseDown(handle: 'min' | 'max'): void {
    setActiveHandle(handle);
  }

  function handleHandleTouchStart(handle: 'min' | 'max', e: React.TouchEvent): void {
    e.stopPropagation();
    setActiveHandle(handle);
  }

  useEffect(() => {
    if (!activeHandle) return;

    function handleMove(x: number): void {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
      const value = Math.round(3 + (percentage / 100) * (350 - 3));

      if (activeHandle === 'min') {
        setMin((prevMin) => Math.min(value, clampedMax));
      } else {
        setMax((prevMax) => Math.max(value, clampedMin));
      }
    }

    function handleMouseMove(e: MouseEvent): void {
      handleMove(e.clientX);
    }

    function handleTouchMove(e: TouchEvent): void {
      e.preventDefault();
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    }

    function handleMouseUp(): void {
      setActiveHandle(null);
    }

    function handleTouchEnd(): void {
      setActiveHandle(null);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeHandle, clampedMin, clampedMax]);

  function handlePreset(presetType: 'AC' | 'FAST' | 'ULTRA'): void {
    if (presetType === 'AC') {
      setMin(3);
      setMax(22);
    } else if (presetType === 'FAST') {
      setMin(50);
      setMax(100);
    } else if (presetType === 'ULTRA') {
      setMin(150);
      setMax(350);
    }
  }

  function handleSave(): void {
    setFilters({
      ...filters,
      minKw: clampedMin,
      maxKw: clampedMax,
    });
    back();
  }

  function handleCancel(): void {
    // Reset to original values
    setMin(filters.minKw ?? 3);
    setMax(filters.maxKw ?? 350);
    back();
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={handleCancel}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Power (kW)</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        {/* Range Section */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="text-[12px] text-slate-600 mb-2">Range</div>
          <div className="text-[14px] font-semibold text-slate-900 mb-4">
            {clampedMin} – {clampedMax} kW
          </div>
          
          {/* Dual-handle slider */}
          <div className="relative mt-4">
            <div className="text-[11px] text-slate-600 mb-2 flex justify-between">
              <span>Min</span>
              <span>Max</span>
            </div>
            <div
              ref={sliderRef}
              onClick={handleSliderClick}
              className="relative h-2 bg-slate-200 rounded-full cursor-pointer"
            >
              {/* Active range (between min and max) */}
              <div
                className="absolute h-2 bg-slate-300 rounded-full"
                style={{
                  left: `${minPosition}%`,
                  width: `${maxPosition - minPosition}%`,
                }}
              />
              {/* Max range (to the right of max) */}
              <div
                className="absolute h-2 rounded-full"
                style={{
                  left: `${maxPosition}%`,
                  width: `${100 - maxPosition}%`,
                  backgroundColor: '#3b82f6', // blue-500
                }}
              />
              {/* Min handle */}
              <div
                className="absolute w-5 h-5 bg-blue-500 rounded-full cursor-grab active:cursor-grabbing shadow-md transform -translate-x-1/2 -translate-y-1.5 touch-none"
                style={{ left: `${minPosition}%` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleHandleMouseDown('min');
                }}
                onTouchStart={(e) => handleHandleTouchStart('min', e)}
              />
              {/* Max handle */}
              <div
                className="absolute w-5 h-5 bg-blue-500 rounded-full cursor-grab active:cursor-grabbing shadow-md transform -translate-x-1/2 -translate-y-1.5 touch-none"
                style={{ left: `${maxPosition}%` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleHandleMouseDown('max');
                }}
                onTouchStart={(e) => handleHandleTouchStart('max', e)}
              />
            </div>
          </div>
        </div>

        {/* Quick Presets Section */}
        <div className="mt-3 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="text-[12px] text-slate-600 mb-2">Quick presets</div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <button
              onClick={() => handlePreset('AC')}
              className="h-10 rounded-lg border border-slate-300 bg-white text-[12px] text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              AC only
            </button>
            <button
              onClick={() => handlePreset('FAST')}
              className="h-10 rounded-lg border border-slate-300 bg-white text-[12px] text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Fast DC
            </button>
            <button
              onClick={() => handlePreset('ULTRA')}
              className="h-10 rounded-lg border border-slate-300 bg-white text-[12px] text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Ultra-fast
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={handleCancel}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-11 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Save
          </button>
        </div>
      </main>
    </div>
  );
}


