import React from 'react';
import { AlertTriangle, PlugZap, MapPin, Bell, RefreshCw } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';

interface Props {
  stationName?: string;
  unitId?: string;
  connectorType?: string;
  powerKw?: number | string;
  status?: string;
  onFindNearby?: () => void;
  onNotify?: () => void;
  onRetry?: () => void;
}

export function ChargerUnavailable({
  stationName = 'Central Hub — Downtown Mall',
  unitId = 'EVSE EVZ-123',
  connectorType = 'CCS2',
  powerKw = '60kW',
  status = 'Faulted',
  onFindNearby,
  onNotify,
  onRetry,
}: Props): React.ReactElement {
  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Green banner at the top */}
      <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: EVZ_COLORS.green }}>
        <AlertTriangle className="h-5 w-5 text-white" />
        <span className="text-white font-semibold">Charger Unavailable</span>
      </div>

      <div className="px-4 pt-4 pb-6">
        {/* Light pink warning box */}
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
          <div className="text-sm font-semibold text-red-900">This charger can't be used right now</div>
          <div className="text-xs text-red-800 mt-1">Status: {status}</div>
        </div>

        {/* Station and Unit/Connector cards */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[11px] text-slate-600 mb-1">Station</div>
            <div className="text-[13px] font-semibold inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-600" />
              <span>{stationName}</span>
            </div>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[11px] text-slate-600 mb-1">Unit / Connector</div>
            <div className="text-[13px] font-semibold inline-flex items-center gap-1.5">
              <PlugZap className="h-4 w-4 text-slate-600" />
              <span>
                {unitId} • {connectorType}
              </span>
            </div>
            <div className="text-[13px] font-semibold mt-1">{typeof powerKw === 'number' ? `${powerKw}kW` : powerKw}</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={onFindNearby}
            className="flex-1 h-10 rounded-xl text-white font-medium"
            style={{ backgroundColor: EVZ_COLORS.orange }}
          >
            Find Nearby Stations
          </button>
          <button
            onClick={onNotify}
            className="h-10 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="text-sm">Notify me</span>
          </button>
        </div>

        {/* Retry Status button */}
        <div className="mt-3">
          <button
            onClick={onRetry}
            className="h-10 w-full rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm">Retry Status</span>
          </button>
        </div>
      </div>
    </div>
  );
}
