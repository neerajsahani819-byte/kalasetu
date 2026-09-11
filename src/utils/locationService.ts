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
    id: 'medchal',
    name: 'Medchal',
    state: 'Telangana',
    lat: 17.6296,
    lng: 78.4822,
    craftHighlight: 'Handmade Terracotta & Traditional Pottery',
  },
  {
    id: 'shamirpet',
    name: 'Shamirpet',
    state: 'Telangana',
    lat: 17.5947,
    lng: 78.5765,
    craftHighlight: 'Pochampally Handloom & Terracotta Vases',
  },
  {
    id: 'kompally',
    name: 'Kompally',
    state: 'Telangana',
    lat: 17.5407,
    lng: 78.4909,
    craftHighlight: 'Clay Cookware & Beaded Tribal Bangles',
  },
  {
    id: 'gajularamaram',
    name: 'Gajularamaram',
    state: 'Telangana',
    lat: 17.5407,
    lng: 78.4208,
    craftHighlight: 'Clay Diyas & Woven Bamboo Baskets',
  },
  {
    id: 'kukatpally',
    name: 'Kukatpally',
    state: 'Telangana',
    lat: 17.4849,
    lng: 78.4138,
    craftHighlight: 'Kalamkari Hand-block Prints & Embroidered Crafts',
  },
  {
    id: 'bachupally',
    name: 'Bachupally',
    state: 'Telangana',
    lat: 17.5387,
    lng: 78.3681,
    craftHighlight: 'Terracotta Water Jugs & Earthen Art',
  },
  {
    id: 'miyapur',
    name: 'Miyapur',
    state: 'Telangana',
    lat: 17.4968,
    lng: 78.3567,
    craftHighlight: 'Handloom Cotton Bedsheets & Bamboo Trays',
  },
  {
    id: 'alwal',
    name: 'Alwal',
    state: 'Telangana',
    lat: 17.5061,
    lng: 78.5089,
    craftHighlight: 'Handmade Heritage Crafts & Textiles',
  },
  {
    id: 'quthbullapur',
    name: 'Quthbullapur',
    state: 'Telangana',
    lat: 17.5105,
    lng: 78.4572,
    craftHighlight: 'Terracotta Handcrafted Jewelry',
  },
  {
    id: 'yapral',
    name: 'Yapral',
    state: 'Telangana',
    lat: 17.5255,
    lng: 78.5421,
    craftHighlight: 'Wooden Folk Toys & Handspun Textiles',
  },
  {
    id: 'bolarum',
    name: 'Bolarum',
    state: 'Telangana',
    lat: 17.5642,
    lng: 78.5394,
    craftHighlight: 'Cheriyal Scroll Paintings & Wood Carvings',
  },
  {
    id: 'nizampet',
    name: 'Nizampet',
    state: 'Telangana',
    lat: 17.5148,
    lng: 78.3863,
    craftHighlight: 'Bamboo Vases & Woven Crafts',
  },
  {
    id: 'shamshabad',
    name: 'Shamshabad',
    state: 'Telangana',
    lat: 17.2403,
    lng: 78.4294,
    craftHighlight: 'Telangana Traditional Folk Crafts',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad (Central)',
    state: 'Telangana',
    lat: 17.385,
    lng: 78.4867,
    craftHighlight: 'Bidriware, Lac Bangles & Zari',
  },
];

export const DEFAULT_BUYER_LOCATION: UserLocation = {
  lat: 17.6296,
  lng: 78.4822,
  city: 'Medchal',
  state: 'Telangana',
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
