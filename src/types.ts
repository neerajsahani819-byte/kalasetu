export type AppLanguage = {
  id: string;
  name: string;
  nativeName: string;
  region: string;
  scriptGlyph: string;
};

export type UserRole = 'artisan' | 'buyer';

export type ProductStatus = 'live' | 'in_review' | 'order_pending' | 'draft';

export interface CraftProduct {
  id: string;
  title: string;
  titleLocal?: string;
  titleEnglish?: string;
  category: string;
  categoryEnglish?: string;
  description: string;
  descriptionEnglish?: string;
  craftHours?: number;
  laborHours?: number;
  materialCost?: number;
  materials?: string | string[];
  materialsEnglish?: string;
  suggestedPrice: number;
  price?: number; // Normalized price for Firestore compatibility
  imageUrl?: string; // Main image URL for Firestore compatibility
  artisanCut?: number;
  packagingCut?: number;
  status?: ProductStatus;
  images: string[];
  audioStoryUrl?: string;
  audioDuration?: string;
  artisanId: string;
  artisanName?: string;
  artisanAvatar?: string;
  artisanRegion?: string;
  artisanExperience?: string;
  village?: string;
  district?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  coordinates?: { lat: number; lng: number };
  distanceKm?: number;
  shippingMode?: 'ship' | 'pickup' | 'both';
  verifiedSeller?: boolean;
  isVerified?: boolean;
  viewsCount?: number;
  isFairTrade?: boolean;
  createdAt?: string;
  directEarnings?: number;
  voiceTranscript?: string;
  tags?: string[];
}

export interface UserLocation {
  lat: number;
  lng: number;
  city: string;
  state: string;
  source?: 'geolocation' | 'manual';
  updatedAt?: string;
}

export interface ArtisanLocation {
  lat: number;
  lng: number;
  city: string;
  state: string;
}

export interface NearbyArtisanSummary {
  id: string;
  name: string;
  englishName: string;
  craft: string;
  craftHindi: string;
  region: string;
  avatarUrl: string;
  isVerified?: boolean;
  experienceYears: number;
  coordinates: { lat: number; lng: number };
  distanceKm?: number;
  sampleProductImage?: string;
  productsCount?: number;
}

export interface ArtisanProfileData {
  id: string;
  name: string;
  englishName: string;
  title: string;
  region: string;
  experienceYears: number;
  generation: string;
  avatarUrl: string;
  isVerified?: boolean;
  coordinates?: { lat: number; lng: number };
  distanceKm?: number;
  award: {
    title: string;
    year: string;
    organization: string;
  };
  audioStory: {
    language: string;
    duration: string;
    transcript: string;
    audioUrl?: string;
  };
  tradition: {
    title: string;
    description: string;
    photos: {
      url: string;
      caption: string;
    }[];
  };
  products: CraftProduct[];
}

export type ArtisanProfile = ArtisanProfileData;

export type AuthProvider = 'phone' | 'google' | 'email';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl: string;
  avatar?: string;
  role: UserRole;
  language?: string;
  authProvider: AuthProvider;
  isVerified: boolean;
  joinedDate: string;
  bio?: string;
  hasCompletedOnboarding?: boolean;
  location?: UserLocation;
}

export interface FirestoreUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  language: string;
  phone?: string;
  authProvider?: AuthProvider;
  isVerified?: boolean;
  joinedDate?: string;
  bio?: string;
  hasCompletedOnboarding?: boolean;
  location?: UserLocation;
}

export interface FirestoreMessage {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
  senderName?: string;
  senderRole?: UserRole;
  productTitle?: string;
  time?: string;
}

export interface MarketplaceOrder {
  orderId: string;
  buyerId: string;
  buyerName?: string;
  artisanId: string;
  artisanName?: string;
  productId: string;
  productTitle?: string;
  productImageUrl?: string;
  amount: number;
  status: 'paid' | 'pending' | 'shipped' | 'delivered';
  createdAt: string;
  paymentMethod: 'demo';
  orderType?: 'purchase' | 'support';
  deliveryEstimate?: string;
  deliveryMode?: 'ship' | 'pickup';
  shippingCost?: number;
  shippingType?: 'standard' | 'express' | 'pickup';
  pickupAddress?: {
    artisanName: string;
    village: string;
    district: string;
    state: string;
    lat?: number;
    lng?: number;
    phone?: string;
  };
  deliveryAddress?: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
  };
}

export interface UserAccountRecord extends AuthUser {
  password?: string;
  customAvatar?: boolean;
}

export type ScreenName =
  | 'onboarding'
  | 'my_shop'
  | 'add_product'
  | 'ai_preview'
  | 'marketplace'
  | 'artisan_profile';

export interface MonthlyTrendData {
  month: string; // e.g. "Aug 2025"
  monthLabel: string; // e.g. "Aug"
  monthHindi: string; // e.g. "अगस्त"
  sales: number; // in Rupees (e.g. 14200)
  ordersCount: number; // number of orders fulfilled (e.g. 16)
  views: number; // product views count (e.g. 580)
  highlight?: string; // festive or craft event highlight (e.g. "दिवाली पर्व • Diwali Sale")
}
