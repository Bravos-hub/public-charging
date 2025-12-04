/**
 * Station Details Overview Component (TypeScript)
 */

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { MapPin, ArrowLeft, Share2, Heart, Navigation2, Phone, Images, MessageSquare, Star } from 'lucide-react';
import { EVZ_COLORS } from '../../../core/utils/constants';
import type { Station } from '../../../core/types';
import { useApp } from '../../../core';
import { useNavigation } from '../../../core';
import { GridEventAlert } from './GridEventAlert';

interface StarRatingProps {
  value?: number;
}

function StarRating({ value = 4.5 }: StarRatingProps): React.ReactElement {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${value}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill={i < full ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          color="#f59e0b"
          aria-hidden
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
      {half && <span className="sr-only">½</span>}
      <span className="ml-1 text-[11px] text-slate-500">{value.toFixed(1)}</span>
    </div>
  );
}

interface AvailabilityPillProps {
  label: string;
  count?: number;
  tone?: 'success' | 'neutral' | 'dark';
}

function AvailabilityPill({ label, count, tone = 'neutral' }: AvailabilityPillProps): React.ReactElement {
  const tones = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200',
    dark: 'bg-slate-900 text-white border-slate-900',
  };
  return (
    <div className={`px-3 py-1 rounded-full text-[12px] border ${tones[tone]}`}>
      <span className="font-medium">{label}</span>
      {typeof count === 'number' && <span className="ml-1 opacity-80">{count}</span>}
    </div>
  );
}

interface StationOverviewProps {
  station?: Station;
  onBack?: () => void;
  onNavigate?: () => void;
  onBook?: () => void;
  onStartNow?: () => void;
  onTabChange?: (tab: 'overview' | 'chargers' | 'amenities') => void;
}

export function StationOverview({
  station,
  onBack,
  onNavigate,
  onBook,
  onStartNow,
  onTabChange,
}: StationOverviewProps): React.ReactElement {
  const defaultStation: Station = {
    id: '1',
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

  const s = station || defaultStation;
  const { favorites, setFavorites } = useApp();
  const { push } = useNavigation();
  const isFavorite = useMemo(() => favorites.some((f) => f.id === s.id), [favorites, s.id]);
  function toggleFavorite(): void {
    setFavorites((list) => {
      const exists = list.some((f) => f.id === s.id);
      if (exists) return list.filter((f) => f.id !== s.id);
      return [
        ...list,
        {
          id: s.id,
          name: s.name,
          address: s.address,
          location: s.location,
          rating: s.rating,
          availability: { total: s.availability.total, available: s.availability.available },
          connectors: s.connectors.map((c) => ({ type: c.type, power: c.power })),
        },
      ];
    });
  }
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageCount = 5;

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    function handleScroll(): void {
      const galleryEl = gallery;
      if (!galleryEl) return;
      const scrollLeft = galleryEl.scrollLeft;
      const scrollWidth = galleryEl.scrollWidth;
      const clientWidth = galleryEl.clientWidth;
      const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);
      const index = Math.round(scrollPercentage * (imageCount - 1));
      setActiveImageIndex(Math.min(index, imageCount - 1));
    }

    gallery.addEventListener('scroll', handleScroll);
    return () => {
      gallery.removeEventListener('scroll', handleScroll);
    };
  }, [imageCount]);

  return (
    <div className="min-h-[100dvh] bg-white text-slate-900">
      <div className="sticky top-0 z-10 w-full" style={{ backgroundColor: EVZ_COLORS.green }}>
        <div className="max-w-md mx-auto h-14 px-4 flex items-center justify-between text-white">
          <button className="inline-flex items-center gap-2" aria-label="Back" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="h-5 w-5" />
            <span className="font-semibold truncate">Station Details</span>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label="Share">
              <Share2 className="h-5 w-5" />
            </button>
            <button aria-label="Save" onClick={toggleFavorite} title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
              <Heart className={`h-5 w-5 ${isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto">
        {/* Segmented tabs */}
        <div className="px-4 pt-3">
          <div className="grid grid-cols-3 rounded-xl bg-slate-100 p-1 text-[12px]">
            <button 
              className="h-9 rounded-lg bg-white shadow font-semibold"
              onClick={() => onTabChange?.('overview')}
            >
              Overview
            </button>
            <button 
              className="h-9 rounded-lg text-slate-600"
              onClick={() => onTabChange?.('chargers')}
            >
              Chargers
            </button>
            <button 
              className="h-9 rounded-lg text-slate-600"
              onClick={() => onTabChange?.('amenities')}
            >
              Amenities/Chat
            </button>
          </div>
        </div>

        {/* Grid Event (demo) */}
        <div className="mt-4 px-4">
          <GridEventAlert />
        </div>

        {/* Gallery */}
        <div className="mt-4 px-4">
          <div className="relative">
            <div
              ref={galleryRef}
              className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {Array.from({ length: imageCount }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[85%] snap-center rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-40 grid place-items-center flex-shrink-0"
                >
                  <Images className="h-8 w-8 text-slate-400" />
                  <span className="sr-only">Image {i + 1}</span>
                </div>
              ))}
            </div>
            {/* Scroll indicator dots */}
            <div className="flex justify-center gap-1.5 mt-2">
              {Array.from({ length: imageCount }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeImageIndex
                      ? 'w-6 bg-slate-600'
                      : 'w-1.5 bg-slate-300'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="px-4 mt-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-slate-900 truncate">{s.name}</div>
              <div className="mt-1 flex items-center gap-2">
                <StarRating value={s.rating} />
                <span className="text-[12px] text-slate-500">• UGX {s.price.toLocaleString()}/kWh</span>
              </div>
            </div>
            <div className="text-right text-[12px] text-slate-600">
              <div>{s.open24_7 ? 'Open 24/7' : 'Hours vary'}</div>
              <div>{s.network || 'EVzone Network'}</div>
            </div>
          </div>

          <div className="mt-3 text-[12px] text-slate-700 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {s.address}
          </div>
          <div className="mt-1 text-[12px] text-slate-700 flex items-center gap-2">
            <Navigation2 className="h-4 w-4" />
            Get directions
          </div>
          {s.phone && (
            <div className="mt-1 text-[12px] text-slate-700 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {s.phone}
            </div>
          )}
        </div>

        {/* Connectors & availability */}
        <div className="px-4 mt-4">
          <div className="text-[12px] text-slate-500 mb-2">Connectors & availability</div>
          <div className="flex flex-wrap gap-2">
            {s.connectors.map((connector, idx) => {
              const availCount = s.availability.available;
              const tone = availCount > 0 ? 'success' : availCount === 0 ? 'neutral' : 'dark';
              return (
                <AvailabilityPill key={idx} label={connector.type} count={availCount} tone={tone} />
              );
            })}
            {s.connectors.length === 0 && (
              <>
                <AvailabilityPill label="CHAdeMO" count={4} tone="success" />
                <AvailabilityPill label="CCS2" count={2} tone="dark" />
                <AvailabilityPill label="Type 2" count={0} tone="neutral" />
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 mt-5 grid grid-cols-3 gap-3">
          <button
            className="h-11 rounded-xl text-white font-medium"
            style={{ backgroundColor: EVZ_COLORS.orange }}
            onClick={onNavigate}
          >
            Navigate
          </button>
          <button
            className="h-11 rounded-xl text-white font-medium"
            style={{ backgroundColor: EVZ_COLORS.orange }}
            onClick={onBook}
          >
            Book
          </button>
          <button
            className="h-11 rounded-xl text-white font-medium"
            style={{ backgroundColor: EVZ_COLORS.orange }}
            onClick={onStartNow}
          >
            Start Now
          </button>
        </div>

        {/* Secondary actions */}
        <div className="px-4 mt-3 pb-24 grid grid-cols-2 gap-3">
          <button
            onClick={() => push('STATION_RATE', { station: s })}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2"
          >
            <Star className="h-4 w-4" /> Rate Station
          </button>
          <button
            onClick={() => push('STATION_REPORT', { station: s })}
            className="h-11 rounded-xl border border-slate-300 bg-white text-slate-700 inline-flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-4 w-4" /> Report a Problem
          </button>
        </div>
      </main>
    </div>
  );
}
