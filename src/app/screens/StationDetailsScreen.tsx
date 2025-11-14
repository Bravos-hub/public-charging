/**
 * Station Details Screen (TypeScript)
 * Full-screen station details with tabs
 */

import React, { useState } from 'react';
import { useNavigation } from '../../core';
import { StationOverview } from '../../features/stations/components/StationOverview';
import { ChargersList } from '../../features/stations/components/ChargersList';
import { AmenitiesList } from '../../features/stations/components/AmenitiesList';
import type { Station } from '../../core/types';

export function StationDetailsScreen(): React.ReactElement {
  const { route, back, push } = useNavigation();
  const [activeTab, setActiveTab] = useState<'overview' | 'chargers' | 'amenities'>('overview');
  
  // Get station from route params or use default
  const station: Station = route.params?.station || {
    id: route.params?.stationId || '1',
    name: 'Central Hub — Downtown Mall',
    location: { lat: 0.314, lng: 32.582 },
    address: 'Plot 10 Main Street, City Center, Kampala, UG',
    rating: 4.5,
    price: 3000,
    connectors: [],
    availability: { total: 4, available: 2, busy: 2, offline: 0 },
    amenities: [],
    images: [],
    open24_7: true,
    phone: '+256 700 000 001',
  };

  function handleNavigate(): void {
    // Open navigation app
    window.open(`https://maps.google.com/?q=${station.location.lat},${station.location.lng}`, '_blank');
  }

  function handleBook(): void {
    push('BOOK_FIXED_TIME', { stationId: station.id, station });
  }

  function handleStartNow(): void {
    // Follow flow: Choose Connector → Scan / Enter ID
    push('ACTIVATION_CHOOSE_CONNECTOR', { stationId: station.id, station });
  }

  function handleReserve(connector: typeof station.connectors[0]): void {
    push('BOOK_FIXED_TIME', { stationId: station.id, station, connector });
  }

  if (activeTab === 'chargers') {
    return (
      <ChargersList
        connectors={station.connectors.length > 0 ? station.connectors : [
          { id: 'EVZ-DC-01', type: 'CCS2', power: 60, status: 'available', price: 3000 },
          { id: 'EVZ-DC-02', type: 'CCS2', power: 60, status: 'busy', price: 3000 },
          { id: 'EVZ-AC-03', type: 'Type2', power: 22, status: 'available', price: 1800 },
        ]}
        onBack={() => setActiveTab('overview')}
        onReserve={handleReserve}
        onTabChange={setActiveTab}
      />
    );
  }

  if (activeTab === 'amenities') {
    return (
      <AmenitiesList
        amenities={station.amenities}
        onBack={() => setActiveTab('overview')}
        onTabChange={setActiveTab}
      />
    );
  }

  return (
    <StationOverview
      station={station}
      onBack={back}
      onNavigate={handleNavigate}
      onBook={handleBook}
      onStartNow={handleStartNow}
      onTabChange={setActiveTab}
    />
  );
}
