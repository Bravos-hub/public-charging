/**
 * Mobile Charging Location Screen (TypeScript)
 * Allows users to specify location for mobile EV charging and select a vehicle
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeft, MapPin, Target, ChevronDown, Car, Info } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';
import { useApp } from '../../../core';

export function MobileChargingLocationScreen(): React.ReactElement {
  const { route, back, push } = useNavigation();
  const { vehicle } = useApp();
  const [location, setLocation] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<{ id: string; name: string } | null>(
    vehicle.active ? { id: vehicle.active.id, name: vehicle.active.name } : null
  );
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

  function handleModeChange(mode: 'fixed' | 'mobile'): void {
    if (mode === 'fixed') {
      // Navigate to fixed station booking (TimePicker)
      const station = route.params?.station;
      push('BOOK_FIXED_TIME', {
        station,
        stationId: station?.id || route.params?.stationId,
        stationName: station?.name || route.params?.stationName,
      });
    }
    // If mode is 'mobile', we're already on the mobile charging screen, so do nothing
  }

  // Get vehicle list or use defaults
  const vehicleList = useMemo(() => {
    if (vehicle.list && vehicle.list.length > 0) {
      return vehicle.list.map(v => ({ id: v.id, name: v.name }));
    }
    // Default vehicles
    return [
      { id: '1', name: 'Model X — UAX 123A' },
      { id: '2', name: 'Model 3 — UAX 456B' },
      { id: '3', name: 'Model Y — UAX 789C' },
    ];
  }, [vehicle.list]);

  function handleFetchGPS(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter it manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  function handleContinue(): void {
    if (!location.trim()) {
      alert('Please enter a location');
      return;
    }

    if (!selectedVehicle) {
      alert('Please select a vehicle');
      return;
    }

    // Navigate to schedule screen for mobile charging
    push('BOOK_MOBILE_SCHEDULE', {
      location,
      vehicle: selectedVehicle,
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      mode: 'mobile',
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
          <span className="font-semibold">Mobile Charging — Location</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Mode Toggle */}
        <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-[12px] mb-6">
          <button
            onClick={() => handleModeChange('fixed')}
            className="h-9 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Fixed Station
          </button>
          <button
            onClick={() => handleModeChange('mobile')}
            className="h-9 rounded-lg bg-white shadow font-semibold"
          >
            Mobile Charging
          </button>
        </div>

        {/* Your Location Section */}
        <div className="mb-6">
          <div className="text-[13px] font-semibold text-slate-800 mb-2">Your Location</div>
          
          {/* Location Input */}
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <MapPin className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Type address or coordinates"
                className="w-full h-11 pl-10 pr-3 rounded-lg border border-slate-300 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleFetchGPS}
              className="h-11 px-4 rounded-lg text-white text-[12px] font-medium inline-flex items-center gap-1.5 whitespace-nowrap"
              style={{ backgroundColor: EVZ_COLORS.orange }}
            >
              <Target className="h-4 w-4" />
              Fetch GPS
            </button>
          </div>

          {/* Map Preview */}
          <div className="h-48 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-center mb-3">
            <span className="text-[12px] text-slate-500">Map preview (integrate Mapbox/Google later)</span>
          </div>

          {/* Info Text */}
          <div className="flex items-start gap-2 text-[11px] text-slate-600">
            <Info className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
            <span>We'll dispatch a mobile unit to this location at your chosen time.</span>
          </div>
        </div>

        {/* Vehicle Section */}
        <div className="mb-6">
          <div className="text-[13px] font-semibold text-slate-800 mb-2">Vehicle</div>
          <div className="relative">
            <button
              onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
              className="w-full h-11 px-3 rounded-lg border border-slate-300 bg-white flex items-center justify-between text-[13px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
            >
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-slate-500" />
                <span>{selectedVehicle?.name || 'Select a vehicle'}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>

            {/* Dropdown */}
            {showVehicleDropdown && (
              <div className="absolute z-20 w-full mt-1 rounded-lg border border-slate-300 bg-white shadow-lg max-h-48 overflow-y-auto">
                {vehicleList.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVehicle(v);
                      setShowVehicleDropdown(false);
                    }}
                    className="w-full px-3 py-2.5 text-left text-[13px] text-slate-800 hover:bg-slate-50 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <Car className="h-4 w-4 text-slate-500" />
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>
            )}
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
            Continue
          </button>
        </div>
      </main>

      {/* Overlay to close dropdown when clicking outside */}
      {showVehicleDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowVehicleDropdown(false)}
        />
      )}
    </div>
  );
}

