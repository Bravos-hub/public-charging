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
    push('ACTIVATION_SCAN', { stationId: station.id });
  }

  if (activeTab === 'chargers') {
    return (
      <ChargersList
        connectors={station.connectors}
        onBack={() => setActiveTab('overview')}
        onReserve={(connector) => {
          // Handle reservation
        }}
      />
    );
  }

  if (activeTab === 'amenities') {
    return (
      <AmenitiesList
        amenities={station.amenities}
        onBack={() => setActiveTab('overview')}
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
    />
  );
}

