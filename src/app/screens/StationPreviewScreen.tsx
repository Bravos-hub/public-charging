/**
 * Station Preview Screen (TypeScript)
 * Preview card for station with quick actions
 */

import React, { useMemo } from 'react';
import { useNavigation } from '../../core';
import { StationCard } from '../../features/discovery/components/StationCard';
import type { Station } from '../../core/types';
import { useApp } from '../../core';

export function StationPreviewScreen(): React.ReactElement {
  const { route, push } = useNavigation();
  const { favorites, setFavorites } = useApp();
  
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
  };

  // Calculate distance (in a real app, this would be calculated from user location)
  const distance = route.params?.distance || '0.8 km';

  function handleViewDetails(): void {
    push('STATION_DETAILS', { station, stationId: station.id });
  }

  function handleBook(): void {
    push('BOOK_FIXED_TIME', { stationId: station.id, station });
  }

  function handleNavigate(): void {
    // Open navigation app
    window.open(`https://maps.google.com/?q=${station.location.lat},${station.location.lng}`, '_blank');
  }

  function handleStartNow(): void {
    push('ACTIVATION_SCAN', { stationId: station.id });
  }

  const isFavorite = useMemo(() => favorites.some((f) => f.id === station.id), [favorites, station.id]);
  function toggleFavorite(): void {
    setFavorites((list) => {
      const exists = list.some((f) => f.id === station.id);
      if (exists) return list.filter((f) => f.id !== station.id);
      return [
        ...list,
        {
          id: station.id,
          name: station.name,
          address: station.address,
          location: station.location,
          rating: station.rating,
          availability: { total: station.availability.total, available: station.availability.available },
          connectors: station.connectors.map((c) => ({ type: c.type, power: c.power })),
        },
      ];
    });
  }

  return (
    <StationCard
      station={station}
      distance={distance}
      onViewDetails={handleViewDetails}
      onBook={handleBook}
      onNavigate={handleNavigate}
      onStartNow={handleStartNow}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
    />
  );
}
