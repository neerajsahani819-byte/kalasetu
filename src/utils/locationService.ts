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
  // Telangana Districts & Craft Hubs
  {
    id: 'medchal',
    name: 'Medchal',
    state: 'Telangana',
    lat: 17.6296,
    lng: 78.4822,
    craftHighlight: 'Handmade Terracotta & Traditional Pottery',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3850,
    lng: 78.4867,
    craftHighlight: 'Bidriware, Lac Bangles & Zari Embroidery',
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
    id: 'warangal',
    name: 'Warangal',
    state: 'Telangana',
    lat: 17.9784,
    lng: 79.5941,
    craftHighlight: 'Warangal Dhurries & Brassware',
  },
  {
    id: 'karimnagar',
    name: 'Karimnagar',
    state: 'Telangana',
    lat: 18.4386,
    lng: 79.1288,
    craftHighlight: 'Silver Filigree & Fine Metalwork',
  },
  {
    id: 'nizamabad',
    name: 'Nizamabad',
    state: 'Telangana',
    lat: 18.6725,
    lng: 78.0941,
    craftHighlight: 'Black Pottery & Bell Metal Crafts',
  },
  {
    id: 'khammam',
    name: 'Khammam',
    state: 'Telangana',
    lat: 17.2473,
    lng: 80.1514,
    craftHighlight: 'Tribal Dokra Metal Casting & Woodcraft',
  },
  {
    id: 'nalgonda',
    name: 'Nalgonda',
    state: 'Telangana',
    lat: 17.0577,
    lng: 79.2684,
    craftHighlight: 'Ikat Handloom & Stone Sculpture',
  },
  {
    id: 'mahbubnagar',
    name: 'Mahbubnagar',
    state: 'Telangana',
    lat: 16.7488,
    lng: 77.9942,
    craftHighlight: 'Gadwal Silk & Cotton Weaves',
  },
  {
    id: 'adilabad',
    name: 'Adilabad',
    state: 'Telangana',
    lat: 19.6641,
    lng: 78.5320,
    craftHighlight: 'Dhokra Brass Craft & Bamboo Weaving',
  },
  {
    id: 'siddipet',
    name: 'Siddipet',
    state: 'Telangana',
    lat: 18.1018,
    lng: 78.8520,
    craftHighlight: 'Gollabhama Handloom Sarees',
  },
  {
    id: 'sangareddy',
    name: 'Sangareddy',
    state: 'Telangana',
    lat: 17.6190,
    lng: 78.0818,
    craftHighlight: 'Terracotta Sculptures & Folk Toys',
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
    id: 'kukatpally',
    name: 'Kukatpally',
    state: 'Telangana',
    lat: 17.4849,
    lng: 78.4138,
    craftHighlight: 'Kalamkari Hand-block Prints',
  },

  // Major Indian Cultural & Commercial Metros
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    craftHighlight: 'Mysore Sandalwood & Channapatna Toys',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
    craftHighlight: 'Warli Art & Kolhapuri Leather Crafts',
  },
  {
    id: 'delhi',
    name: 'Delhi NCR',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.2090,
    craftHighlight: 'Zardozi Embroidery & Blue Pottery',
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    craftHighlight: 'Kanchipuram Silk & Tanjore Paintings',
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
    craftHighlight: 'Terracotta Horses, Kantha & Sholapith',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    craftHighlight: 'Blue Pottery & Handblock Prints',
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    lat: 25.3176,
    lng: 82.9739,
    craftHighlight: 'Banarasi Brocade & Wooden Lacquerware',
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    craftHighlight: 'Paithani Sarees & Brass Utensils',
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    lat: 23.0225,
    lng: 72.5714,
    craftHighlight: 'Patola Silk & Rogan Painting',
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    state: 'Odisha',
    lat: 20.2961,
    lng: 85.8245,
    craftHighlight: 'Pattachitra & Applique Work (Pipili)',
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.8467,
    lng: 80.9462,
    craftHighlight: 'Chikankari & Zari Zardozi',
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
