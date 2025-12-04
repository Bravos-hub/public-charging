/**
 * Station Chargers List Component (TypeScript)
 */

import React from 'react';
import { MapPin, ArrowLeft, PlugZap } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import type { Connector } from '../../../core/types';

interface StatusDotProps {
  state?: 'Available' | 'In use' | 'Offline';
}

function StatusDot({ state = 'Available' }: StatusDotProps): React.ReactElement {
  const color =
    state === 'Available'
      ? 'bg-emerald-500'
      : state === 'In use'
      ? 'bg-blue-500'
      : 'bg-slate-400';
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} aria-label={state} />;
}

interface ChargerRowProps {
  connector: Connector;
  price?: number;
  onReserve?: () => void;
}

function ChargerRow({ connector, price = 3000, onReserve }: ChargerRowProps): React.ReactElement {
  const state =
    connector.status === 'available'
      ? 'Available'
      : connector.status === 'busy'
      ? 'In use'
      : 'Offline';
  
  // Determine if connector is DC or AC based on type
  // DC connectors: CCS2, CCS1, CHAdeMO, NACS (Tesla) DC, GB/T DC
  // AC connectors: Type2, Type 2, Type1, Type 1, NACS (Tesla) AC, GB/T AC
  const dcTypes = ['CCS2', 'CCS1', 'CHAdeMO', 'NACS (Tesla) DC', 'GB/T DC'];
  const typeUpper = connector.type.toUpperCase();
  const isDC = dcTypes.some(dcType => typeUpper.includes(dcType.toUpperCase())) || 
               typeUpper.includes('DC') ||
               typeUpper.includes('CCS') ||
               typeUpper.includes('CHADEMO');
  const chargeType = isDC ? 'DC' : 'AC';
  const typeLabel = `${connector.power}kW ${chargeType}`;

  return (
    <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[13px] font-semibold text-slate-800 flex items-center gap-2">
            <PlugZap className="h-4 w-4" /> {typeLabel}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">ID: {connector.id}</div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600">
            <StatusDot state={state} /> {state} • UGX {price.toLocaleString()}/kWh
          </div>
        </div>
        <button
          className="h-9 px-3 rounded-lg text-white text-[12px] font-medium"
          style={{ backgroundColor: EVZ_COLORS.orange }}
          onClick={onReserve}
        >
          Reserve
        </button>
      </div>
    </div>
  );
}

interface ChargersListProps {
  connectors: Connector[];
  onBack?: () => void;
  onReserve?: (connector: Connector) => void;
  onTabChange?: (tab: 'overview' | 'chargers' | 'amenities') => void;
}

export function ChargersList({ connectors, onBack, onReserve, onTabChange }: ChargersListProps): React.ReactElement {
  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center gap-2 text-white">
          <button aria-label="Back" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <MapPin className="h-5 w-5" />
          <span className="font-semibold">Chargers</span>
        </div>
      </div>

      {/* Segmented header */}
      <div className="max-w-md mx-auto px-4 pt-3">
        <div className="grid grid-cols-3 rounded-xl bg-slate-100 p-1 text-[12px]">
          <button 
            className="h-9 rounded-lg text-slate-600"
            onClick={() => onTabChange?.('overview')}
          >
            Overview
          </button>
          <button className="h-9 rounded-lg bg-white shadow font-semibold">Chargers</button>
          <button 
            className="h-9 rounded-lg text-slate-600"
            onClick={() => onTabChange?.('amenities')}
          >
            Amenities/Chat
          </button>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 pt-4 pb-20 space-y-3">
        {connectors.length > 0 ? (
          connectors.map((connector) => (
            <ChargerRow
              key={connector.id}
              connector={connector}
              price={connector.price || 3000}
              onReserve={() => onReserve?.(connector)}
            />
          ))
        ) : (
          <>
            <ChargerRow
              connector={{ id: 'EVZ-DC-01', type: 'CCS2', power: 60, status: 'available' }}
              price={3000}
              onReserve={() => onReserve?.({ id: 'EVZ-DC-01', type: 'CCS2', power: 60, status: 'available' })}
            />
            <ChargerRow
              connector={{ id: 'EVZ-DC-02', type: 'CCS2', power: 60, status: 'busy' }}
              price={3000}
              onReserve={() => onReserve?.({ id: 'EVZ-DC-02', type: 'CCS2', power: 60, status: 'busy' })}
            />
            <ChargerRow
              connector={{ id: 'EVZ-AC-03', type: 'Type2', power: 22, status: 'available' }}
              price={1800}
              onReserve={() => onReserve?.({ id: 'EVZ-AC-03', type: 'Type2', power: 22, status: 'available' })}
            />
          </>
        )}
      </main>
    </div>
  );
}

