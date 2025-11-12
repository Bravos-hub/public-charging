/**
 * Choose Connector Screen (TypeScript)
 * Allows users to select a connector at the station
 */

import React, { useMemo } from 'react';
import { ArrowLeft, Bolt } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import { useNavigation } from '../../../core';
import type { Connector, Station } from '../../../core/types';

interface ConnectorCardProps {
  connector: Connector;
  price: number;
  onSelect: () => void;
}

function ConnectorCard({ connector, price, onSelect }: ConnectorCardProps): React.ReactElement {
  // Determine if connector is DC or AC based on type
  const dcTypes = ['CCS2', 'CCS1', 'CHAdeMO', 'NACS (Tesla) DC', 'GB/T DC'];
  const typeUpper = connector.type.toUpperCase();
  const isDC = dcTypes.some(dcType => typeUpper.includes(dcType.toUpperCase())) || 
               typeUpper.includes('DC') ||
               typeUpper.includes('CCS') ||
               typeUpper.includes('CHADEMO');
  const chargeType = isDC ? 'DC' : 'AC';
  const typeLabel = `${connector.type} • ${chargeType}`;

  return (
    <button
      onClick={onSelect}
      className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          <Bolt className="h-5 w-5 text-slate-700 flex-shrink-0" />
          {/* Connector Info */}
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-slate-800">
              {typeLabel}
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              UGX {price.toLocaleString()}/kWh
            </div>
          </div>
        </div>
        {/* Power */}
        <div className="text-[13px] font-semibold text-slate-800 ml-4 flex-shrink-0">
          {connector.power}kW
        </div>
      </div>
    </button>
  );
}

export function ChooseConnectorScreen(): React.ReactElement {
  const { route, back, push } = useNavigation();
  
  // Get station from route params
  const station: Station | undefined = route.params?.station;
  
  // Get available connectors from station or use defaults
  const availableConnectors = useMemo<Connector[]>(() => {
    if (station?.connectors && station.connectors.length > 0) {
      // Filter to only show available connectors
      return station.connectors.filter(c => c.status === 'available');
    }
    
    // Default connectors if none provided
    return [
      { id: 'EVZ-DC-01', type: 'CCS2', power: 60, status: 'available' as const, price: 3000 },
      { id: 'EVZ-AC-01', type: 'Type2', power: 22, status: 'available' as const, price: 1800 },
    ];
  }, [station]);

  function handleSelectConnector(connector: Connector): void {
    push('ACTIVATION_SCAN', {
      stationId: station?.id || route.params?.stationId,
      station,
      connector,
      connectorType: connector.type,
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
          <span className="font-semibold">Activate — Choose Connector</span>
          <div className="w-5" />
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 py-4">
        {/* Available Connectors Label */}
        <div className="text-[12px] text-slate-600 mb-3">Available connectors</div>
        
        {/* Connector Cards */}
        <div className="space-y-3">
          {availableConnectors.map((connector) => (
            <ConnectorCard
              key={connector.id}
              connector={connector}
              price={connector.price || station?.price || 3000}
              onSelect={() => handleSelectConnector(connector)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

