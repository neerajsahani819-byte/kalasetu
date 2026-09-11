import { UserLocation } from '../types';

/**
 * Calculates great-circle distance between two geographic coordinates in kilometers
 * using the Haversine formula.
 */
export const haversineDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth radius in km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

export interface CityPreset {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  craftHighlight?: string;
}

export const INDIAN_CITIES_PRESETS: CityPreset[] = [
  {
    id: 'gorakhpur',
    name: 'Gorakhpur',
    state: 'Uttar Pradesh',
    lat: 26.7606,
    lng: 83.3732,
    craftHighlight: 'Terracotta Pottery & Deep Kalash',
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.8467,
    lng: 80.9462,
    craftHighlight: 'Chikankari Embroidery & Zari',
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    lat: 25.3176,
    lng: 82.9739,
    craftHighlight: 'Banarasi Brocade & Wooden Lacquer Toys',
  },
  {
    id: 'delhi',
    name: 'New Delhi / NCR',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.209,
    craftHighlight: 'National Crafts Museum & Zardozi',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    craftHighlight: 'Blue Pottery & Sanganeri Handblock',
  },
  {
    id: 'palghar',
    name: 'Palghar / Mumbai',
    state: 'Maharashtra',
    lat: 19.6967,
    lng: 72.7655,
    craftHighlight: 'Warli Tribal Folk Painting',
  },
  {
    id: 'yadadri',
    name: 'Yadadri / Pochampally',
    state: 'Telangana',
    lat: 17.5134,
    lng: 78.8931,
    craftHighlight: 'Pochampally Ikat Handloom Textiles',
  },
  {
    id: 'bastar',
    name: 'Bastar / Jagdalpur',
    state: 'Chhattisgarh',
    lat: 19.074,
    lng: 82.0232,
    craftHighlight: 'Dhokra Lost-Wax Bell Metal Casting',
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
    craftHighlight: 'Kantha Stitch & Terracotta Bankura',
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    craftHighlight: 'Channapatna Wooden Toys & Mysore Silk',
  },
];

export const DEFAULT_BUYER_LOCATION: UserLocation = {
  lat: 26.7606,
  lng: 83.3732,
  city: 'Gorakhpur',
  state: 'Uttar Pradesh',
  source: 'manual',
  updatedAt: new Date().toISOString(),
};

const STORAGE_KEY = 'kalasetu_buyer_location';

/**
 * Reads buyer location saved in localStorage
 */
export const getSavedBuyerLocation = (): UserLocation | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.lat === 'number' && typeof parsed?.lng === 'number') {
        return parsed as UserLocation;
      }
    }
  } catch (err) {
    console.warn('[Location] Error reading location from storage:', err);
  }
  return null;
};

/**
 * Persists buyer location to localStorage
 */
export const saveBuyerLocation = (loc: UserLocation): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch (err) {
    console.warn('[Location] Error saving location to storage:', err);
  }
};

/**
 * Requests location via the browser's Geolocation API.
 * Finds the nearest matching city name from presets.
 */
export const requestBrowserLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Find closest known craft city to assign a user-friendly city name
        let nearestCity = INDIAN_CITIES_PRESETS[0];
        let minDistance = Infinity;

        for (const city of INDIAN_CITIES_PRESETS) {
          const dist = haversineDistance(latitude, longitude, city.lat, city.lng);
          if (dist < minDistance) {
            minDistance = dist;
            nearestCity = city;
          }
        }

        const userLocation: UserLocation = {
          lat: latitude,
          lng: longitude,
          city: minDistance < 50 ? nearestCity.name : `${nearestCity.name} Area`,
          state: nearestCity.state,
          source: 'geolocation',
          updatedAt: new Date().toISOString(),
        };

        saveBuyerLocation(userLocation);
        resolve(userLocation);
      },
      (error) => {
        console.warn('[Location] Geolocation permission denied or failed:', error.message);
        reject(error);
      },
      { timeout: 8000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  });
};
