import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Mic,
  Volume2,
  Heart,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Play,
  Pause,
  Globe,
  ArrowLeftRight,
  Loader2,
  ShoppingBag,
  X,
  MapPin,
  Navigation,
  Check,
  Compass,
  ChevronDown,
  ChevronUp,
  Info,
  Phone,
} from 'lucide-react';
import { CraftProduct, UserRole, AuthUser, UserLocation, NearbyArtisanSummary } from '../types';
import { KalaSetuLogo } from './KalaSetuLogo';
import { speakAloud } from '../utils/audioService';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';
import {
  haversineDistance,
  requestBrowserLocation,
  getSavedBuyerLocation,
  saveBuyerLocation,
  DEFAULT_BUYER_LOCATION,
  INDIAN_CITIES_PRESETS,
  CityPreset,
} from '../utils/locationService';
import { updateUserLocationInFirestore } from '../services/firestoreService';
import { ARTISANS_CATALOG } from '../data/mockData';

export const searchProducts = (products: CraftProduct[], query: string): CraftProduct[] => {
  if (!query || !query.trim()) return products;

  const words = query.toLowerCase().trim().split(/\s+/);

  // Synonym expansion for common craft terms
  const synonymGroups = [
    ['pot', 'pottery', 'terracotta', 'clay', 'earthen', 'matka', 'diya', 'handi'],
    ['cloth', 'textile', 'fabric', 'weave', 'handloom', 'saree', 'dupatta', 'bedsheet', 'khadi'],
    ['painting', 'art', 'canvas', 'scroll', 'cheriyal', 'warli', 'gond'],
    ['metal', 'brass', 'bronze', 'copper', 'dhokra', 'dokra'],
    ['wood', 'wooden', 'carved', 'carving', 'toy', 'ganesha', 'elephant'],
    ['bamboo', 'cane', 'wicker', 'basket', 'vase', 'tray'],
    ['jewelry', 'jewellery', 'necklace', 'earring', 'bangle', 'bangles'],
    ['decor', 'cushion', 'runner', 'hanging', 'embroidery']
  ];

  const expandWord = (word: string) => {
    const expanded = new Set<string>([word]);
    for (const group of synonymGroups) {
      if (group.some((s) => s.includes(word) || word.includes(s))) {
        group.forEach((s) => expanded.add(s));
      }
    }
    return [...expanded];
  };

  const expandedWords = words.flatMap(expandWord);

  const scored = products.map((p) => {
    const haystack = [
      p.title,
      p.titleEnglish,
      p.titleLocal,
      p.description,
      p.descriptionEnglish,
      p.category,
      p.categoryEnglish,
      p.craftTradition,
      p.materials,
      p.materialsEnglish,
      p.artisanName,
      p.artisanRegion,
      p.village,
      p.district,
      p.state,
      ...(Array.isArray(p.materials) ? p.materials : typeof p.materials === 'string' ? [p.materials] : []),
      ...(Array.isArray(p.tags) ? p.tags : typeof p.tags === 'string' ? [p.tags] : [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matches = expandedWords.filter((w) => haystack.includes(w));
    return { product: p, score: matches.length };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.product);
};

interface BuyerMarketplaceScreenProps {
  products: CraftProduct[];
  isLoading?: boolean;
  onOpenArtisanProfile: (artisanId?: string) => void;
  onOpenProductDetail: (product: CraftProduct) => void;
  onOpenChatWithArtisan: (artisanName: string, productTitle: string) => void;
  onWhatsAppOrder: (artisanName: string, productTitle: string) => void;
  onBuyProduct?: (product: CraftProduct) => void;
  onSupportArtisan?: (product: CraftProduct) => void;
  onOpenOrders?: () => void;
  language?: string;
  currentRole?: UserRole;
  onToggleRole?: (newRole: UserRole) => void;
  onOpenLanguageSelector?: () => void;
  currentUser?: AuthUser | null;
  onOpenAuthModal?: () => void;
}

interface ProductWithDistance extends CraftProduct {
  distanceKm: number;
}

export const BuyerMarketplaceScreen: React.FC<BuyerMarketplaceScreenProps> = ({
  products,
  isLoading = false,
  onOpenArtisanProfile,
  onOpenProductDetail,
  onOpenChatWithArtisan,
  onWhatsAppOrder,
  onBuyProduct,
  onSupportArtisan,
  onOpenOrders,
  currentRole = 'buyer',
  onToggleRole,
  onOpenLanguageSelector,
  currentUser = null,
  onOpenAuthModal,
}) => {
  const { language, t, supportedLanguages } = useLanguage();
  const speechLang = getSpeechLangCode(language);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [radiusFilter, setRadiusFilter] = useState<'nearby' | 'region' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductWithDistance | null>(null);
  const [isArtisanInfoOpen, setIsArtisanInfoOpen] = useState(false);

  // Buyer location defaults to Medchal (Section 5)
  const [buyerLocation, setBuyerLocation] = useState<UserLocation>(() => {
    return currentUser?.location || getSavedBuyerLocation() || DEFAULT_BUYER_LOCATION;
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Geolocation effect
  useEffect(() => {
    const saved = getSavedBuyerLocation();
    if (!saved && !currentUser?.location) {
      requestBrowserLocation()
        .then((loc) => {
          setBuyerLocation(loc);
          if (currentUser?.id) {
            updateUserLocationInFirestore(currentUser.id, loc).catch(() => {});
          }
        })
        .catch((err) => {
          console.warn('[Location] Geolocation permission denied or failed:', err?.message || 'Secure origin required');
          console.log('[Location] Using manual location: Medchal');
          saveBuyerLocation(DEFAULT_BUYER_LOCATION);
          setBuyerLocation(DEFAULT_BUYER_LOCATION);
        });
    } else if (currentUser?.location) {
      setBuyerLocation(currentUser.location);
    }
  }, [currentUser]);

  const handleSelectCityPreset = (preset: CityPreset) => {
    console.log(`[Location] Using manual location: ${preset.name}`);
    const newLoc: UserLocation = {
      lat: preset.lat,
      lng: preset.lng,
      city: preset.name,
      state: preset.state,
      source: 'manual',
      updatedAt: new Date().toISOString(),
    };
    setBuyerLocation(newLoc);
    saveBuyerLocation(newLoc);
    if (currentUser?.id) {
      updateUserLocationInFirestore(currentUser.id, newLoc).catch(() => {});
    }
    setIsLocationModalOpen(false);
    setLocationError(null);
  };

  const handleUseGPS = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const loc = await requestBrowserLocation();
      setBuyerLocation(loc);
      if (currentUser?.id) {
        updateUserLocationInFirestore(currentUser.id, loc).catch(() => {});
      }
      setIsLocationModalOpen(false);
    } catch (err: any) {
      console.warn('[Location] Geolocation permission denied or failed:', err?.message);
      setLocationError("We couldn't get your location automatically. Please select your city:");
    } finally {
      setIsLocating(false);
    }
  };

  // Calculate distance for all products
  const productsWithDistance: ProductWithDistance[] = useMemo(() => {
    return products.map((p) => {
      const pLat = p.latitude ?? p.coordinates?.lat ?? 17.6296;
      const pLng = p.longitude ?? p.coordinates?.lng ?? 78.4822;
      const dist = haversineDistance(buyerLocation.lat, buyerLocation.lng, pLat, pLng);
      return {
        ...p,
        distanceKm: dist,
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [products, buyerLocation]);

  // Search and category filtering with distance sorting (Section 6)
  const filteredProducts = useMemo(() => {
    let result = productsWithDistance;

    // Search query matching
    if (searchQuery.trim()) {
      result = searchProducts(result, searchQuery) as ProductWithDistance[];
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => {
        const cat = (p.category || '').toLowerCase() + ' ' + (p.categoryEnglish || '').toLowerCase();
        return cat.includes(selectedCategory.toLowerCase());
      });
    }

    // Radius filter chip: nearby (< 20km), region (< 100km), all
    if (radiusFilter === 'nearby') {
      result = result.filter((p) => p.distanceKm <= 20);
    } else if (radiusFilter === 'region') {
      result = result.filter((p) => p.distanceKm <= 100);
    }

    return result.sort((a, b) => a.distanceKm - b.distanceKm);
  }, [productsWithDistance, searchQuery, selectedCategory, radiusFilter]);

  // Section 5: Group products into progressive distance tiers
  const distanceTiers = useMemo(() => {
    const tier20 = filteredProducts.filter((p) => p.distanceKm <= 20);
    const tier50 = filteredProducts.filter((p) => p.distanceKm > 20 && p.distanceKm <= 50);
    const tier100 = filteredProducts.filter((p) => p.distanceKm > 50 && p.distanceKm <= 100);
    const tierState = filteredProducts.filter((p) => p.distanceKm > 100 && (p.state === 'Telangana' || p.distanceKm <= 300));
    const tierIndia = filteredProducts.filter((p) => p.distanceKm > 300 && p.state !== 'Telangana');

    const sections: { title: string; subtitle?: string; items: ProductWithDistance[] }[] = [];

    if (tier20.length > 0) {
      sections.push({
        title: `Within 20 km of ${buyerLocation.city}`,
        subtitle: 'Local artisans & village creators',
        items: tier20,
      });
    }

    if (tier50.length > 0 && radiusFilter !== 'nearby') {
      sections.push({
        title: 'Within 50 km',
        subtitle: 'Nearby craft clusters',
        items: tier50,
      });
    }

    if (tier100.length > 0 && radiusFilter !== 'nearby') {
      sections.push({
        title: 'Within 100 km',
        subtitle: 'Regional handicrafts',
        items: tier100,
      });
    }

    if (tierState.length > 0 && radiusFilter === 'all') {
      sections.push({
        title: 'Across Telangana',
        subtitle: 'State craft heritage',
        items: tierState,
      });
    }

    if (tierIndia.length > 0 && radiusFilter === 'all') {
      sections.push({
        title: 'Across India',
        subtitle: 'National folk traditions',
        items: tierIndia,
      });
    }

    return sections;
  }, [filteredProducts, buyerLocation.city, radiusFilter]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentLangMeta = supportedLanguages.find((l) => l.id === language);

  const categoryChips = [
    { id: 'all', label: 'All Crafts' },
    { id: 'pottery', label: '🏺 Pottery' },
    { id: 'textile', label: '🧵 Handloom' },
    { id: 'painting', label: '🎨 Art & Painting' },
    { id: 'wood', label: '🪵 Woodcraft' },
    { id: 'bamboo', label: '🎋 Bamboo' },
    { id: 'jewelry', label: '💍 Jewelry' },
    { id: 'decor', label: '🏡 Home Decor' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#201A18] pb-24">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 bg-[#FAF6F0]/95 backdrop-blur-sm border-b border-[#E3D5C5] px-4 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <KalaSetuLogo size={34} showText={false} />
            <div>
              <div className="font-display font-bold text-base text-[#201A18] leading-tight">
                {t('common.appName')}
              </div>
              <div className="text-xs text-[#5E534D]">{t('screens.marketplace.title')}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Role Switch */}
            {onToggleRole && (
              <button
                id="btn-marketplace-switch-role"
                onClick={() => onToggleRole('artisan')}
                className="flex items-center gap-1 bg-[#FDF1EC] hover:bg-[#fbe4dc] text-[#9C3D25] border border-[#9C3D25]/40 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-2xs"
                title={t('common.switch')}
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span className="text-[11px] whitespace-nowrap">{t('common.artisan')}</span>
              </button>
            )}

            {/* Orders Tab */}
            {onOpenOrders && (
              <button
                id="btn-marketplace-orders"
                onClick={onOpenOrders}
                className="flex items-center gap-1 bg-[#E2ECE6] hover:bg-[#d0dfd6] text-[#2D5A43] border border-[#2D5A43]/40 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-2xs"
                title={t('screens.orders.title')}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#2D5A43]" />
                <span className="text-[11px] whitespace-nowrap">{t('screens.orders.purchasesTab')}</span>
              </button>
            )}

            {/* Language Selector */}
            {onOpenLanguageSelector && (
              <button
                id="btn-marketplace-select-lang"
                onClick={onOpenLanguageSelector}
                className="flex items-center gap-1 bg-[#FFFFFF] border border-[#E3D5C5] text-[#201A18] px-2 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-2xs"
                title={t('common.changeLanguage')}
              >
                <Globe className="w-3.5 h-3.5 text-[#9C3D25]" />
                <span className="text-[11px] whitespace-nowrap">
                  {currentLangMeta?.nativeName || 'Language'}
                </span>
              </button>
            )}

            {/* User Profile Avatar */}
            <button
              id="btn-marketplace-profile-avatar"
              onClick={() => (onOpenAuthModal ? onOpenAuthModal() : onOpenArtisanProfile())}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#9C3D25] ring-1 ring-white active:scale-95 transition-transform flex items-center justify-center bg-[#FAF6F0]"
              title={currentUser ? currentUser.name : t('common.login')}
            >
              <img
                src={
                  currentUser?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                }
                alt={currentUser ? currentUser.name : 'User'}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-3 space-y-3.5">
        {/* Section 5: Buyer Location Bar with Top Chip */}
        <section
          aria-label="Buyer Location Bar"
          className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-2.5 flex items-center justify-between shadow-2xs"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-[#E2ECE6] text-[#2D5A43] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#201A18] truncate block">
                📍 {buyerLocation.city}, {buyerLocation.state}
              </span>
            </div>
          </div>

          <button
            id="btn-change-location"
            onClick={() => setIsLocationModalOpen(true)}
            className="text-xs font-bold text-[#9C3D25] hover:text-[#802913] bg-[#FAF6F0] hover:bg-[#F4EBE1] border border-[#E3D5C5] px-3 py-1 rounded-full transition-all active:scale-95 flex items-center gap-1 flex-shrink-0 cursor-pointer shadow-2xs"
          >
            <Compass className="w-3 h-3" />
            <span>Change</span>
          </button>
        </section>

        {/* Search Bar with Mic & Speaker */}
        <div className="relative flex items-center bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl px-3.5 py-1.5 shadow-2xs">
          <Search className="w-4 h-4 text-[#8A726C] mr-2 flex-shrink-0" />
          <input
            id="input-marketplace-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('screens.marketplace.searchPlaceholder') || 'Search pottery, handloom, paintings, crafts...'}
            className="w-full bg-transparent text-xs text-[#201A18] placeholder-[#8A726C] focus:outline-none py-1.5"
          />

          {searchQuery && (
            <button
              id="btn-clear-search-input"
              type="button"
              onClick={() => setSearchQuery('')}
              className="w-6 h-6 rounded-full hover:bg-[#FAF6F0] text-[#8A726C] hover:text-[#201A18] flex items-center justify-center transition-colors mr-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
            <button
              id="btn-search-voice-mic"
              onClick={() => {
                speakAloud('Listening for craft name...', {
                  lang: speechLang,
                  onEnd: () => setSearchQuery('pottery'),
                });
              }}
              className="w-7 h-7 rounded-full bg-[#F8EBE6] hover:bg-[#ebdccf] text-[#9C3D25] flex items-center justify-center transition-colors"
              title="Voice Search"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Section 5: Filter Chips: [ Nearby (< 20 km) ] [ Region (< 100 km) ] [ All India ] */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            <button
              id="chip-radius-nearby"
              type="button"
              onClick={() => setRadiusFilter('nearby')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1 active:scale-95 cursor-pointer ${
                radiusFilter === 'nearby'
                  ? 'bg-[#2D5A43] text-white border-[#2D5A43] shadow-xs'
                  : 'bg-white text-[#201A18] border-[#E3D5C5] hover:border-[#8A726C]'
              }`}
            >
              <span>📍</span>
              <span>Nearby (&lt; 20 km)</span>
            </button>

            <button
              id="chip-radius-region"
              type="button"
              onClick={() => setRadiusFilter('region')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1 active:scale-95 cursor-pointer ${
                radiusFilter === 'region'
                  ? 'bg-[#2D5A43] text-white border-[#2D5A43] shadow-xs'
                  : 'bg-white text-[#201A18] border-[#E3D5C5] hover:border-[#8A726C]'
              }`}
            >
              <span>🚗</span>
              <span>Region (&lt; 100 km)</span>
            </button>

            <button
              id="chip-radius-all"
              type="button"
              onClick={() => setRadiusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1 active:scale-95 cursor-pointer ${
                radiusFilter === 'all'
                  ? 'bg-[#2D5A43] text-white border-[#2D5A43] shadow-xs'
                  : 'bg-white text-[#201A18] border-[#E3D5C5] hover:border-[#8A726C]'
              }`}
            >
              <span>🇮🇳</span>
              <span>All India</span>
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categoryChips.map((chip) => {
              const isActive = selectedCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  id={`cat-chip-${chip.id}`}
                  onClick={() => setSelectedCategory(chip.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border flex-shrink-0 active:scale-95 ${
                    isActive
                      ? 'bg-[#9C3D25] text-white border-[#9C3D25]'
                      : 'bg-white text-[#5E534D] border-[#E3D5C5] hover:text-[#201A18]'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 6: Empty Search Results with Expand Distance CTAs */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-6 text-center space-y-3.5 shadow-2xs my-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF6F0] border border-[#E3D5C5] flex items-center justify-center text-2xl">
              🔍
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-sm text-[#201A18]">
                {searchQuery
                  ? `No crafts found matching "${searchQuery}" in this radius`
                  : 'No crafts found matching your filter'}
              </h3>
              <p className="text-xs text-[#6B605B]">
                Try expanding your search distance:
              </p>
            </div>

            {/* Expand Radius Buttons (Section 6) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
              <button
                id="btn-expand-search-50km"
                type="button"
                onClick={() => setRadiusFilter('region')}
                className="w-full sm:w-auto bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 shadow-xs cursor-pointer"
              >
                Show products up to 100 km
              </button>

              <button
                id="btn-expand-search-all"
                type="button"
                onClick={() => {
                  setRadiusFilter('all');
                  setSelectedCategory('all');
                }}
                className="w-full sm:w-auto bg-[#FAF6F0] hover:bg-[#F4EBE1] text-[#9C3D25] border border-[#9C3D25]/40 text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 shadow-2xs cursor-pointer"
              >
                Show all India
              </button>
            </div>
          </div>
        ) : (
          /* Progressive Radius Tier Sections (Section 5) */
          <div className="space-y-6">
            {distanceTiers.map((tier) => (
              <section key={tier.title} className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#E3D5C5]/60 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2D5A43]" />
                    <h2 className="font-display font-bold text-sm text-[#201A18]">
                      {tier.title}
                    </h2>
                  </div>
                  <span className="text-[11px] font-bold text-[#2D5A43] bg-[#E2ECE6] px-2 py-0.5 rounded-full">
                    {tier.items.length} items
                  </span>
                </div>

                {/* Section 7: Cleaner UI Product Cards Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {tier.items.map((item) => {
                    const isFav = !!favorites[item.id];
                    return (
                      <article
                        key={item.id}
                        id={`product-card-${item.id}`}
                        onClick={() => setSelectedProductForModal(item)}
                        className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
                      >
                        {/* Image Container with Badges */}
                        <div className="relative aspect-square bg-[#F4EBE1] overflow-hidden">
                          <img
                            src={item.imageUrl || item.images[0]}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Section 3: Small green "✅ Verified" badge */}
                          <div className="absolute top-2 left-2">
                            <span className="bg-[#E2ECE6]/95 backdrop-blur-xs text-[#2D5A43] text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-[#bceecf] shadow-xs">
                              <span>✅</span>
                              <span>Verified</span>
                            </span>
                          </div>

                          {/* Shipping Badge (Part 1) */}
                          <div className="absolute bottom-2 left-2">
                            <span className="bg-white/90 backdrop-blur-xs text-[#201A18] text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-[#E3D5C5] shadow-xs">
                              <span>
                                {item.shippingMode === 'ship'
                                  ? '📦 Ships'
                                  : item.shippingMode === 'pickup'
                                  ? '📍 Pickup'
                                  : '📦 Ships / 📍 Pickup'}
                              </span>
                            </span>
                          </div>

                          {/* Save / Heart Button */}
                          <button
                            id={`btn-fav-${item.id}`}
                            type="button"
                            onClick={(e) => toggleFavorite(item.id, e)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-[#9C3D25] flex items-center justify-center shadow-xs active:scale-90 transition-transform"
                            aria-label="Save craft"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${isFav ? 'fill-[#9C3D25] text-[#9C3D25]' : 'text-[#8A726C]'}`}
                            />
                          </button>
                        </div>

                        {/* Card Body — Section 7: ONLY Image, Title, Price, Distance, Verified, Heart */}
                        <div className="p-3 flex-1 flex flex-col justify-between space-y-1.5">
                          <div>
                            <h3 className="font-display font-bold text-xs text-[#201A18] leading-tight line-clamp-2">
                              {item.title}
                            </h3>
                          </div>

                          <div className="pt-1 flex items-center justify-between">
                            <div className="font-extrabold text-sm text-[#9C3D25]">
                              ₹{item.price || item.suggestedPrice}
                            </div>
                            <div className="text-[10px] font-semibold text-[#5E534D] flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5 text-[#2D5A43]" />
                              <span>{item.distanceKm === 0 ? '< 1 km' : `${item.distanceKm} km`}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Section 7: Reorganized Cleaner Product Detail Modal */}
      {selectedProductForModal && (
        <div
          id="modal-product-detail"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedProductForModal(null)}
        >
          <div
            className="bg-[#FAF6F0] border border-[#E3D5C5] rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar with Close */}
            <div className="relative">
              <img
                src={selectedProductForModal.imageUrl || selectedProductForModal.images[0]}
                alt={selectedProductForModal.title}
                className="w-full aspect-[4/3] object-cover"
              />
              <button
                id="btn-close-product-modal"
                type="button"
                onClick={() => setSelectedProductForModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-1.5">
                <div className="bg-[#E2ECE6]/95 backdrop-blur-xs text-[#2D5A43] text-xs font-bold px-2.5 py-1 rounded-full border border-[#bceecf] flex items-center gap-1 shadow-sm">
                  <span>✅</span>
                  <span>Verified Seller</span>
                </div>
                <div className="bg-white/95 backdrop-blur-xs text-[#201A18] text-xs font-bold px-2.5 py-1 rounded-full border border-[#E3D5C5] flex items-center gap-1 shadow-sm">
                  <span>
                    {selectedProductForModal.shippingMode === 'ship'
                      ? '📦 Ships to you'
                      : selectedProductForModal.shippingMode === 'pickup'
                      ? '📍 Pickup only'
                      : '📦 Ships or 📍 Pickup'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {/* Title, Price, Distance & Verified Badge */}
              <div className="space-y-1 border-b border-[#E3D5C5]/60 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-bold text-base text-[#201A18] leading-snug">
                    {selectedProductForModal.title}
                  </h3>
                  <div className="font-display font-extrabold text-xl text-[#9C3D25] flex-shrink-0">
                    ₹{selectedProductForModal.price || selectedProductForModal.suggestedPrice}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#5E534D] pt-1">
                  <span className="flex items-center gap-1 text-[#2D5A43] font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {selectedProductForModal.village ? `${selectedProductForModal.village} • ` : ''}
                      {selectedProductForModal.distanceKm === 0 ? '< 1 km away' : `${selectedProductForModal.distanceKm} km away`}
                    </span>
                  </span>
                  <span className="text-[11px] bg-[#FAF6F0] border border-[#E3D5C5] px-2 py-0.5 rounded-full text-[#6B605B]">
                    {selectedProductForModal.category}
                  </span>
                </div>

                {/* Verified Seller Tooltip Info */}
                <div className="bg-[#E2ECE6]/70 border border-[#bceecf] rounded-xl p-2 flex items-center gap-1.5 text-[11px] text-[#1E3F2F] mt-2">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 text-[#2D5A43]" />
                  <span>This artisan's identity has been verified by KalaSetu.</span>
                </div>
              </div>

              {/* About this craft */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#201A18]">About this craft</h4>
                <p className="text-xs text-[#5E534D] leading-relaxed">
                  {selectedProductForModal.description}
                </p>
                {selectedProductForModal.materials && (
                  <div className="text-[11px] text-[#6B605B] pt-1 font-medium">
                    <span className="font-bold">Materials: </span>
                    {typeof selectedProductForModal.materials === 'string'
                      ? selectedProductForModal.materials
                      : selectedProductForModal.materials.join(', ')}
                  </div>
                )}
              </div>

              {/* Collapsible About the Artisan */}
              <div className="border border-[#E3D5C5] rounded-2xl overflow-hidden bg-white">
                <button
                  id="btn-toggle-artisan-details"
                  type="button"
                  onClick={() => setIsArtisanInfoOpen(!isArtisanInfoOpen)}
                  className="w-full p-3 flex items-center justify-between text-left cursor-pointer hover:bg-[#FAF6F0] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={selectedProductForModal.artisanAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                      alt={selectedProductForModal.artisanName}
                      className="w-8 h-8 rounded-full object-cover border border-[#9C3D25]"
                    />
                    <div>
                      <div className="font-bold text-xs text-[#201A18] flex items-center gap-1">
                        <span>{selectedProductForModal.artisanName || 'Village Artisan'}</span>
                        <CheckCircle2 className="w-3 h-3 text-[#2D5A43]" />
                      </div>
                      <div className="text-[10px] text-[#6B605B]">
                        {selectedProductForModal.village || 'Medchal'}, Telangana
                      </div>
                    </div>
                  </div>
                  {isArtisanInfoOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#8A726C]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8A726C]" />
                  )}
                </button>

                {isArtisanInfoOpen && (
                  <div className="px-3 pb-3 pt-1 border-t border-[#E3D5C5]/60 text-xs text-[#5E534D] space-y-2 bg-[#FAF6F0]/50">
                    <p>
                      Authentic local artisan dedicated to preserving regional Indian handmade crafts and fair trade.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProductForModal(null);
                        onOpenArtisanProfile(selectedProductForModal.artisanId);
                      }}
                      className="text-[#9C3D25] font-bold text-xs underline cursor-pointer"
                    >
                      View full artisan profile & creations
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons: [Chat with Artisan] [Buy] [WhatsApp] */}
              <div className="space-y-2 pt-2">
                <button
                  id="btn-modal-buy-product"
                  type="button"
                  onClick={() => {
                    const prod = selectedProductForModal;
                    setSelectedProductForModal(null);
                    if (onBuyProduct) {
                      onBuyProduct(prod);
                    }
                  }}
                  className="w-full h-11 bg-[#9C3D25] hover:bg-[#802913] active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Direct • ₹{selectedProductForModal.price || selectedProductForModal.suggestedPrice}</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="btn-modal-chat-artisan"
                    type="button"
                    onClick={() => {
                      const name = selectedProductForModal.artisanName || 'Artisan';
                      const title = selectedProductForModal.title;
                      setSelectedProductForModal(null);
                      onOpenChatWithArtisan(name, title);
                    }}
                    className="h-10 bg-white hover:bg-[#FAF6F0] text-[#201A18] border border-[#E3D5C5] active:scale-95 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#9C3D25]" />
                    <span>Chat with Artisan</span>
                  </button>

                  <button
                    id="btn-modal-whatsapp"
                    type="button"
                    onClick={() => {
                      const name = selectedProductForModal.artisanName || 'Artisan';
                      const title = selectedProductForModal.title;
                      onWhatsAppOrder(name, title);
                    }}
                    className="h-10 bg-[#E2ECE6] hover:bg-[#d0dfd6] text-[#002112] border border-[#25D366]/40 active:scale-95 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.39 1.31-1.92 1.39-.5.08-1.15.12-3.32-.78-2.61-1.09-4.28-3.76-4.41-3.93-.13-.18-1.06-1.41-1.06-2.69s.67-1.9 1-2.18c.24-.22.53-.28.71-.28.18 0 .36 0 .52.01.17.01.39-.06.61.47.23.55.78 1.9.85 2.04.07.15.12.32.02.52-.09.2-.15.32-.3.49-.15.18-.31.4-.44.54-.15.15-.3.32-.13.62.17.29.76 1.25 1.63 2.02 1.12.99 2.07 1.3 2.36 1.45.29.15.46.13.63-.07.18-.2.76-.88.96-1.18.2-.3.41-.25.68-.15.28.1 1.78.84 2.09 1 .3.15.51.22.58.35.08.13.08.76-.16 1.44z" />
                    </svg>
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Selector Modal */}
      {isLocationModalOpen && (
        <div
          id="modal-location-selector"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsLocationModalOpen(false)}
        >
          <div
            className="bg-[#FAF6F0] border border-[#E3D5C5] rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#9C3D25] text-white flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-base text-[#201A18]">
                  Select Location
                </h3>
              </div>
              <button
                id="btn-close-location-modal"
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white text-[#5E534D] hover:text-[#201A18] flex items-center justify-center border border-[#E3D5C5] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* GPS Detection Button */}
            <button
              id="btn-use-gps-location"
              type="button"
              disabled={isLocating}
              onClick={handleUseGPS}
              className="w-full bg-[#2D5A43] hover:bg-[#1E3F2F] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              <span>
                {isLocating
                  ? t('common.loading')
                  : 'Detect My Current GPS Location'}
              </span>
            </button>

            {locationError && (
              <div className="text-xs text-[#9C3D25] bg-[#FDF1EC] p-2.5 rounded-xl border border-[#f3cec4]">
                {locationError}
              </div>
            )}

            {/* Telangana & Major Cities Dropdown & List */}
            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <label htmlFor="select-city-dropdown" className="text-xs font-bold text-[#5E534D] block">
                  Quick Select City / District:
                </label>
                <select
                  id="select-city-dropdown"
                  value={INDIAN_CITIES_PRESETS.find((p) => p.name === buyerLocation.city)?.id || 'medchal'}
                  onChange={(e) => {
                    const found = INDIAN_CITIES_PRESETS.find((p) => p.id === e.target.value);
                    if (found) handleSelectCityPreset(found);
                  }}
                  className="w-full bg-white border border-[#E3D5C5] rounded-xl px-3 py-2 text-xs font-bold text-[#201A18] focus:outline-none focus:ring-2 focus:ring-[#9C3D25]/20 cursor-pointer"
                >
                  <optgroup label="📍 Telangana Districts & Craft Hubs">
                    {INDIAN_CITIES_PRESETS.filter((p) => p.state === 'Telangana').map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name}, {preset.state}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🏛️ Major Indian Cultural Hubs">
                    {INDIAN_CITIES_PRESETS.filter((p) => p.state !== 'Telangana').map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name}, {preset.state}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="text-xs font-bold text-[#5E534D]">
                Or Choose from Craft Hubs:
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {INDIAN_CITIES_PRESETS.map((preset) => {
                  const isCurrent = buyerLocation.city === preset.name;
                  return (
                    <button
                      key={preset.id}
                      id={`btn-select-city-${preset.id}`}
                      type="button"
                      onClick={() => handleSelectCityPreset(preset)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? 'bg-white border-[#9C3D25] text-[#9C3D25] font-bold shadow-xs'
                          : 'bg-white/70 hover:bg-white border-[#E3D5C5] text-[#201A18]'
                      }`}
                    >
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{preset.name}</span>
                          <span className="text-[10px] font-normal text-[#6B605B]">
                            ({preset.state})
                          </span>
                        </div>
                        {preset.craftHighlight && (
                          <div className="text-[10px] text-[#6B605B] mt-0.5">
                            ✨ {preset.craftHighlight}
                          </div>
                        )}
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-[#9C3D25]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
