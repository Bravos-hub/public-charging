import React from 'react';
import { MapPin, PlugZap, Clock3 } from 'lucide-react';

interface ReceiptCardProps {
  id: string;
  station: string;
  address?: string;
  connector?: string;
  start?: string;
  end?: string;
  duration?: string;
  energyKwh?: number;
  totalUgx?: number;
}

export function ReceiptCard({
  id,
  station,
  address,
  connector,
  start,
  end,
  duration,
  energyKwh,
  totalUgx,
}: ReceiptCardProps): React.ReactElement {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
      <div className="text-[12px] text-slate-500">Receipt ID</div>
      <div className="font-mono text-[13px]">{id}</div>

      <div className="mt-3 flex items-start gap-2 text-[12px] text-slate-700">
        <MapPin className="h-4 w-4" />
        <div>
          <div className="font-semibold text-[13px]">{station}</div>
          {address && <div className="opacity-80">{address}</div>}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {connector && (
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <PlugZap className="h-4 w-4" /> Connector
            </div>
            <div className="mt-1 text-[14px] font-semibold">{connector}</div>
          </div>
        )}
        {typeof energyKwh === 'number' && (
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-[11px] text-slate-500">Energy</div>
            <div className="mt-1 text-[14px] font-semibold">{energyKwh} kWh</div>
          </div>
        )}
        {(start || end || duration) && (
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 col-span-2">
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              Start / End
            </div>
            <div className="mt-1 text-[14px] font-semibold">
              {start || '—'} — {end || '—'} {duration ? `(${duration})` : ''}
            </div>
          </div>
        )}
      </div>

      {typeof totalUgx === 'number' && (
        <div className="mt-3 flex items-center justify-between py-2 border-t border-slate-200">
          <div className="text-slate-800 text-[12px]">Total</div>
          <div className="text-slate-800 font-semibold">UGX {totalUgx.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}

