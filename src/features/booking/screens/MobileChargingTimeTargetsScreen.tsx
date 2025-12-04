/**
 * Mobile Charging Time & Targets Screen (TypeScript)
 * Allows users to set time window and target state of charge for mobile charging
 */

import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, RotateCcw, Clock, Zap } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';

export function MobileChargingTimeTargetsScreen(): React.ReactElement {
  const { route, back, push } = useNavigation();
  const [startHour, setStartHour] = useState(15);
  const [startMin, setStartMin] = useState(0);
  const [endHour, setEndHour] = useState(17);
  const [endMin, setEndMin] = useState(0);
  const [currentSOC, setCurrentSOC] = useState(25);
  const [targetSOC, setTargetSOC] = useState(80);

  // Vehicle battery capacity (kWh) - default or from vehicle data
  const batteryCapacity = 75; // kWh
  const pricePerKwh = 3000; // UGX
  const serviceFee = 5000; // UGX

  // Calculate energy needed
  const energyNeeded = useMemo(() => {
    const socDifference = targetSOC - currentSOC;
    return Math.round((batteryCapacity * socDifference) / 100 * 10) / 10;
  }, [currentSOC, targetSOC, batteryCapacity]);

  // Calculate duration (assuming 60kW charging power)
  const chargingPower = 60; // kW
  const durationMinutes = useMemo(() => {
    return Math.round((energyNeeded / chargingPower) * 60);
  }, [energyNeeded, chargingPower]);

  const durationHours = Math.floor(durationMinutes / 60);
  const durationMins = durationMinutes % 60;

  // Calculate fee
  const energyFee = useMemo(() => {
    return Math.round(energyNeeded * pricePerKwh);
  }, [energyNeeded, pricePerKwh]);

  const totalFee = energyFee + serviceFee;

  // Time picker handlers
  function adjustTime(type: 'start' | 'end', unit: 'hour' | 'min', direction: 'up' | 'down'): void {
    const change = direction === 'up' ? 1 : -1;
    
    if (type === 'start') {
      if (unit === 'hour') {
        setStartHour((prev) => (prev + change + 24) % 24);
      } else {
        setStartMin((prev) => (prev + change + 60) % 60);
      }
    } else {
      if (unit === 'hour') {
        setEndHour((prev) => (prev + change + 24) % 24);
      } else {
        setEndMin((prev) => (prev + change + 60) % 60);
      }
    }
  }

  // SOC slider handlers
  function handleSOCChange(type: 'current' | 'target', value: number): void {
    if (type === 'current') {
      setCurrentSOC(Math.max(0, Math.min(100, value)));
      // Ensure target is always >= current
      if (value > targetSOC) {
        setTargetSOC(value);
      }
    } else {
      setTargetSOC(Math.max(currentSOC, Math.min(100, value)));
    }
  }

  const [dragging, setDragging] = useState<{ type: 'current' | 'target' | null; startX: number }>({
    type: null,
    startX: 0,
  });

  function handleSliderMouseDown(
    e: React.MouseEvent<HTMLDivElement>,
    type: 'current' | 'target'
  ): void {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    if (type === 'current') {
      handleSOCChange('current', Math.round(percentage));
    } else {
      handleSOCChange('target', Math.round(percentage));
    }
    
    setDragging({ type, startX: e.clientX });
  }

  useEffect(() => {
    if (!dragging.type) return;

    function handleMouseMove(e: MouseEvent): void {
      const slider = document.querySelector(`[data-slider="${dragging.type}"]`) as HTMLElement;
      if (!slider) return;
      
      const rect = slider.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const value = Math.round(percentage);
      
      if (dragging.type === 'current') {
        setCurrentSOC(Math.max(0, Math.min(100, value)));
        // Ensure target is always >= current
        if (value > targetSOC) {
          setTargetSOC(value);
        }
      } else {
        setTargetSOC(Math.max(currentSOC, Math.min(100, value)));
      }
    }

    function handleMouseUp(): void {
      setDragging({ type: null, startX: 0 });
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, currentSOC, targetSOC]);

  function handleContinue(): void {
    // Create booking object
    const startDate = new Date();
    startDate.setHours(startHour, startMin, 0, 0);
    
    const endDate = new Date();
    endDate.setHours(endHour, endMin, 0, 0);
    
    // If end time is before start time, assume next day
    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const booking = {
      id: `BOOK-${Date.now()}`,
      stationId: route.params?.stationId,
      stationName: route.params?.location || 'Mobile Charging Location',
      startTime: startDate,
      endTime: endDate,
      connectorType: 'CCS2',
      status: 'pending' as const,
      mode: 'mobile' as const,
      vehicleId: route.params?.vehicleId,
      vehicleName: route.params?.vehicleName,
      energyTarget: energyNeeded,
      cost: totalFee,
    };

    push('BOOK_FEE_PAYMENT', {
      booking,
      location: route.params?.location,
      vehicle: route.params?.vehicle,
      currentSOC,
      targetSOC,
      energyNeeded,
      duration: durationMinutes,
      totalFee,
    });
  }

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button aria-label="Back" onClick={back}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold">Mobile — Time & Targets</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Time Window Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white mb-4">
          <div className="text-[13px] font-semibold text-slate-800 mb-3">Time Window</div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <div className="text-[11px] text-slate-500 mb-2">Start Time</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center justify-center gap-1 bg-slate-50 rounded-lg p-2">
                  <button
                    onClick={() => adjustTime('start', 'hour', 'up')}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <ChevronUp className="h-3 w-3 text-slate-600" />
                  </button>
                  <span className="text-[16px] font-semibold text-slate-800 w-8 text-center">
                    {String(startHour).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => adjustTime('start', 'hour', 'down')}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <ChevronDown className="h-3 w-3 text-slate-600" />
                  </button>
                </div>
                <span className="text-[16px] font-semibold text-slate-800">:</span>
                <div className="flex-1 flex items-center justify-center gap-1 bg-slate-50 rounded-lg p-2">
                  <button
                    onClick={() => adjustTime('start', 'min', 'up')}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <ChevronUp className="h-3 w-3 text-slate-600" />
                  </button>
                  <span className="text-[16px] font-semibold text-slate-800 w-8 text-center">
                    {String(startMin).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => adjustTime('start', 'min', 'down')}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <ChevronDown className="h-3 w-3 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* End Time */}
            <div>
              <div className="text-[11px] text-slate-500 mb-2">End Time</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center justify-center gap-1 bg-slate-50 rounded-lg p-2">
                  <button
                    onClick={() => adjustTime('end', 'hour', 'up')}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <ChevronUp className="h-3 w-3 text-slate-600" />
                  </button>
                  <span className="text-[16px] font-semibold text-slate-800 w-8 text-center">
                    {String(endHour).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => adjustTime('end', 'hour', 'down')}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <ChevronDown className="h-3 w-3 text-slate-600" />
                  </button>
                </div>
                <span className="text-[16px] font-semibold text-slate-800">:</span>
                <div className="flex-1 flex items-center justify-center gap-1 bg-slate-50 rounded-lg p-2">
                  <button
                    onClick={() => adjustTime('end', 'min', 'up')}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <ChevronUp className="h-3 w-3 text-slate-600" />
                  </button>
                  <span className="text-[16px] font-semibold text-slate-800 w-8 text-center">
                    {String(endMin).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => adjustTime('end', 'min', 'down')}
                    className="p-1 hover:bg-slate-200 rounded"
                  >
                    <ChevronDown className="h-3 w-3 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Target State of Charge Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white mb-4">
          <div className="text-[13px] font-semibold text-slate-800 mb-4">Target State of Charge</div>
          
          {/* Current SoC */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-slate-600">Current SoC</span>
              <span className="text-[12px] font-semibold text-slate-800">{currentSOC}%</span>
            </div>
            <div
              data-slider="current"
              className="relative h-2 bg-slate-200 rounded-full cursor-pointer"
              onMouseDown={(e) => handleSliderMouseDown(e, 'current')}
            >
              <div
                className="absolute h-full rounded-full"
                style={{
                  width: `${currentSOC}%`,
                  backgroundColor: '#3B82F6',
                }}
              />
              <div
                className="absolute w-4 h-4 bg-blue-500 rounded-full -top-1 cursor-grab active:cursor-grabbing"
                style={{
                  left: `calc(${currentSOC}% - 8px)`,
                }}
              />
            </div>
          </div>

          {/* Target SoC */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-slate-600">Target SoC</span>
              <span className="text-[12px] font-semibold text-slate-800">{targetSOC}%</span>
            </div>
            <div
              data-slider="target"
              className="relative h-2 bg-slate-200 rounded-full cursor-pointer"
              onMouseDown={(e) => handleSliderMouseDown(e, 'target')}
            >
              <div
                className="absolute h-full rounded-full"
                style={{
                  width: `${targetSOC}%`,
                  backgroundColor: '#3B82F6',
                }}
              />
              <div
                className="absolute w-4 h-4 bg-blue-500 rounded-full -top-1 cursor-grab active:cursor-grabbing"
                style={{
                  left: `calc(${targetSOC}% - 8px)`,
                }}
              />
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {/* Energy */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-1.5 mb-1">
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[10px] text-slate-500">Energy</span>
              </div>
              <div className="text-[13px] font-semibold text-slate-800">{energyNeeded} kWh</div>
            </div>

            {/* Duration */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[10px] text-slate-500">Duration</span>
              </div>
              <div className="text-[13px] font-semibold text-slate-800">
                {durationHours}h {durationMins}m
              </div>
            </div>

            {/* Fee */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-1.5 mb-1">
                <Zap className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[10px] text-slate-500">Fee</span>
              </div>
              <div className="text-[13px] font-semibold text-slate-800">
                UGX {totalFee.toLocaleString()}
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">
                incl. service fee UGX {serviceFee.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={back}
            className="h-12 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium text-[14px]"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            className="h-12 rounded-xl text-white font-medium text-[14px]"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Continue to Payment
          </button>
        </div>
      </main>
    </div>
  );
}

