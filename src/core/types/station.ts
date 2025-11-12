/**
 * Station-related TypeScript types
 */

export interface Location {
  lat: number;
  lng: number;
}

export interface Connector {
  id: string;
  type: 'CCS2' | 'Type2' | 'CHAdeMO' | 'NACS' | string;
  power: number; // kW
  status: 'available' | 'busy' | 'offline' | 'maintenance';
  price?: number;
}

export interface Station {
  id: string;
  name: string;
  location: Location;
  address: string;
  rating: number;
  price: number; // per kWh
  connectors: Connector[];
  availability: {
    total: number;
    available: number;
    busy: number;
    offline: number;
  };
  amenities: string[];
  images: string[];
  network?: string;
  open24_7?: boolean;
  phone?: string;
  category?: string;
}

export interface StationFilters {
  onlyAvail?: boolean;
  fastOnly?: boolean;
  minKw?: number;
  maxKw?: number;
  connectorTypes?: string[];
  networks?: string[];
  access?: string[];
  locationTypes?: string[];
  userRating?: number;
  multipleDevices?: number;
  category?: string;
}

