import React, { useState } from 'react';
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
} from 'lucide-react';
import { CraftProduct, UserRole, AuthUser } from '../types';
import { KalaSetuLogo } from './KalaSetuLogo';
import { speakAloud } from '../utils/audioService';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';

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

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'gi' | 'pottery' | 'metal' | 'textile'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlayingAudioTour, setIsPlayingAudioTour] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const filterChips = [
    { id: 'all', label: t('screens.marketplace.filterAll'), icon: '✨' },
    { id: 'gi', label: t('screens.marketplace.filterGi'), icon: '🏛️' },
    { id: 'pottery', label: t('screens.marketplace.filterPottery'), icon: '🏺' },
    { id: 'metal', label: t('screens.marketplace.filterMetal'), icon: '🔔' },
    { id: 'textile', label: t('screens.marketplace.filterTextile'), icon: '🧵' },
  ];

  const filteredProducts = products.filter((item) => {
    if (selectedFilter === 'gi' && !item.giTag) return false;
    const catLower = (item.category || '').toLowerCase();
    if (selectedFilter === 'pottery' && !catLower.includes('pottery') && !catLower.includes('terracotta') && !item.category.includes('मिट्टी')) return false;
    if (selectedFilter === 'metal' && !catLower.includes('metal') && !catLower.includes('dhokra') && !item.category.includes('धातु')) return false;
    if (selectedFilter === 'textile' && !catLower.includes('textile') && !catLower.includes('handloom') && !catLower.includes('khadi') && !item.category.includes('वस्त्र')) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.titleEnglish.toLowerCase().includes(q) ||
        item.artisanName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleListenCraftStory = (e: React.MouseEvent, item: CraftProduct) => {
    e.stopPropagation();
    speakAloud(
      `${item.artisanName}. ${item.title}. ${item.description}`,
      { lang: speechLang }
    );
  };

  const handleToggleAudioTour = () => {
    if (isPlayingAudioTour) {
      setIsPlayingAudioTour(false);
    } else {
      setIsPlayingAudioTour(true);
      speakAloud(
        `${t('screens.marketplace.audioTour')}. ${t('screens.marketplace.audioTourPrompt')}`,
        {
          lang: speechLang,
          onEnd: () => setIsPlayingAudioTour(false),
        }
      );
    }
  };

  const currentLangMeta = supportedLanguages.find((l) => l.id === language);

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#201A18] pb-24">
      {/* Top Header */}
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
            {/* Role switch button */}
            {onToggleRole && (
              <button
                id="btn-marketplace-switch-role"
                onClick={() => onToggleRole('artisan')}
                className="flex items-center gap-1 bg-[#FDF1EC] hover:bg-[#fbe4dc] text-[#9C3D25] border border-[#9C3D25]/40 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-xs"
                title={t('common.switch')}
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span className="text-[11px] whitespace-nowrap">{t('common.artisan')}</span>
              </button>
            )}

            {/* Orders Tab Shortcut for Buyer */}
            {onOpenOrders && (
              <button
                id="btn-marketplace-orders"
                onClick={onOpenOrders}
                className="flex items-center gap-1 bg-[#E2ECE6] hover:bg-[#d0dfd6] text-[#2D5A43] border border-[#2D5A43]/40 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-xs"
                title={t('screens.orders.title')}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#2D5A43]" />
                <span className="text-[11px] whitespace-nowrap">{t('screens.orders.purchasesTab')}</span>
              </button>
            )}

            {/* Language Selector Button */}
            {onOpenLanguageSelector && (
              <button
                id="btn-marketplace-select-lang"
                onClick={onOpenLanguageSelector}
                className="flex items-center gap-1 bg-[#FFFFFF] border border-[#E3D5C5] text-[#201A18] px-2 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-xs"
                title={t('common.changeLanguage')}
              >
                <Globe className="w-3.5 h-3.5 text-[#9C3D25]" />
                <span className="text-[11px] whitespace-nowrap">
                  {currentLangMeta?.nativeName || 'Language'}
                </span>
              </button>
            )}

            <button
              id="btn-marketplace-audio-guide"
              onClick={() =>
                speakAloud(
                  `${t('screens.marketplace.title')}. ${t('common.directFairTrade')}`,
                  { lang: speechLang }
                )
              }
              className="w-9 h-9 rounded-full bg-[#F4EBE1] text-[#9C3D25] border border-[#E3D5C5] flex items-center justify-center transition-transform active:scale-95"
              title={t('common.listen')}
              aria-label={t('common.listen')}
            >
              <Volume2 className="w-4 h-4" />
            </button>

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
        {/* Search Bar with Mic & Speaker */}
        <div className="relative flex items-center bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl px-3.5 py-1.5 shadow-xs">
          <Search className="w-5 h-5 text-[#8A726C] mr-2 flex-shrink-0" />
          <input
            id="input-marketplace-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('screens.marketplace.search')}
            className="w-full bg-transparent text-sm text-[#201A18] placeholder-[#8A726C] focus:outline-none py-1.5"
          />

          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
            <button
              id="btn-search-voice-mic"
              onClick={() => {
                speakAloud(t('screens.marketplace.search'), {
                  lang: speechLang,
                  onEnd: () => setSearchQuery('Terracotta'),
                });
              }}
              className="w-8 h-8 rounded-full bg-[#F8EBE6] hover:bg-[#ebdccf] text-[#9C3D25] flex items-center justify-center transition-colors"
              title={t('common.search')}
              aria-label={t('common.search')}
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              id="btn-search-audio-readout"
              onClick={() =>
                speakAloud(
                  t('screens.marketplace.resultsCount', { count: filteredProducts.length }),
                  { lang: speechLang }
                )
              }
              className="w-8 h-8 rounded-full bg-[#F8EBE6] hover:bg-[#ebdccf] text-[#7B5500] flex items-center justify-center transition-colors"
              title={t('common.listen')}
              aria-label={t('common.listen')}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Chips Scrollable Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterChips.map((chip) => {
            const isActive = selectedFilter === chip.id;
            return (
              <button
                key={chip.id}
                id={`filter-chip-${chip.id}`}
                onClick={() => setSelectedFilter(chip.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex-shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-[#2D5A43] text-white border-[#2D5A43] shadow-xs'
                    : 'bg-[#FFFFFF] text-[#201A18] border-[#E3D5C5] hover:border-[#8A726C]'
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Direct Fair Trade Trust Banner */}
        <section aria-label="Direct Fair Trade" className="bg-[#bceecf] border border-[#2D5A43]/20 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm-1 15.5l-4-4 1.41-1.41L11 14.67l6.59-6.59L19 9.5l-8 8z" />
            </svg>
          </div>

          <div>
            <div className="font-display font-bold text-xs text-[#1E3F2F]">
              {t('common.directFairTrade')}
            </div>
            <div className="text-[11px] text-[#406d55] font-medium">
              {t('common.verified')}
            </div>
          </div>
        </section>

        {/* Section Heading with Results Count */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9C3D25]" />
            <h2 className="font-display font-bold text-base text-[#201A18]">
              {t('screens.marketplace.title')}
            </h2>
            {isLoading && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-[#9C3D25] bg-[#FDF1EC] px-2 py-0.5 rounded-full border border-[#f3cec4]">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{t('common.loading')}</span>
              </span>
            )}
          </div>
          <span className="text-xs text-[#6B605B]">
            {filteredProducts.length}
          </span>
        </div>

        {/* Product Cards Feed */}
        <div className="space-y-4">
          {filteredProducts.map((item) => {
            const isFav = !!favorites[item.id];
            return (
              <article
                key={item.id}
                id={`marketplace-card-${item.id}`}
                onClick={() => onOpenProductDetail(item)}
                className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                {/* Hero Image Container */}
                <div className="relative aspect-[4/3] bg-[#F4EBE1]">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[80%]">
                    {item.giTag && (
                      <span className="bg-[#FEF3C7] border border-[#E5A93C] text-[#7B5500] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#E5A93C]" />
                        <span>GI: {item.giTagName || t('common.verified')}</span>
                      </span>
                    )}

                    {((item.category || '').toLowerCase().includes('metal') || item.category?.includes('धातु')) && (
                      <span className="bg-[#FFFFFF]/90 text-[#9C3D25] text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        ✨ {t('screens.marketplace.filterMetal')}
                      </span>
                    )}
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    id={`btn-fav-${item.id}`}
                    onClick={(e) => toggleFavorite(item.id, e)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-[#9C3D25] flex items-center justify-center shadow-xs active:scale-90 transition-transform"
                    aria-label="Favorite"
                  >
                    <Heart
                      className={`w-4 h-4 ${isFav ? 'fill-[#9C3D25] text-[#9C3D25]' : 'text-[#8A726C]'}`}
                    />
                  </button>

                  {/* Audio Craft Story Button Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                    <button
                      id={`btn-listen-story-${item.id}`}
                      onClick={(e) => handleListenCraftStory(e, item)}
                      className="bg-black/75 hover:bg-black/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t('screens.marketplace.listenStory')} ({item.audioDuration || '0:45'})</span>
                    </button>

                    <div className="bg-white/90 text-[#201A18] text-[10px] font-bold px-2.5 py-1.5 rounded-xl shadow-xs">
                      {item.materials.split(' ')[0]}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-bold text-base text-[#201A18] leading-snug">
                        {item.title}
                      </h3>
                      <div className="text-xs text-[#5E534D]">
                        {item.titleEnglish}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="font-display font-extrabold text-xl text-[#9C3D25]">
                        ₹{item.suggestedPrice}
                      </div>
                      <div className="text-[10px] font-semibold text-[#2D5A43]">
                        {t('common.freeShipping')}
                      </div>
                    </div>
                  </div>

                  {/* Artisan Miniature Profile Card */}
                  <div
                    id={`btn-artisan-subcard-${item.id}`}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenArtisanProfile(item.artisanId);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                        onOpenArtisanProfile(item.artisanId);
                      }
                    }}
                    className="w-full bg-[#FAF6F0] hover:bg-[#F4EBE1] border border-[#E3D5C5] rounded-xl p-2.5 flex items-center justify-between transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[#9C3D25] flex-shrink-0 bg-[#F5DDD6] flex items-center justify-center font-bold text-xs text-[#9C3D25]">
                        {item.artisanAvatar ? (
                          <img
                            src={item.artisanAvatar}
                            alt={item.artisanName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          item.artisanName[0]
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#201A18] flex items-center gap-1 truncate">
                          <span>{item.artisanName}</span>
                          {item.isVerified && (
                            <CheckCircle2 className="w-3 h-3 text-[#2D5A43] flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] text-[#6B605B] truncate">
                          {item.artisanRegion} • {item.artisanExperience}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakAloud(`${item.artisanName}, ${item.artisanRegion}`, { lang: speechLang });
                      }}
                      className="w-7 h-7 rounded-full bg-white text-[#9C3D25] flex items-center justify-center flex-shrink-0 shadow-2xs hover:bg-[#FAF6F0] transition-colors"
                      title={t('common.listen')}
                      aria-label={t('common.listen')}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Primary Purchase & Support Flow Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      id={`btn-buy-product-${item.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onBuyProduct) {
                          onBuyProduct(item);
                        } else {
                          onOpenProductDetail(item);
                        }
                      }}
                      className="h-11 bg-[#9C3D25] hover:bg-[#802913] active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t('screens.marketplace.buyNow')} • ₹{item.suggestedPrice}</span>
                    </button>

                    <button
                      id={`btn-support-product-${item.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSupportArtisan) {
                          onSupportArtisan(item);
                        } else {
                          onOpenArtisanProfile(item.artisanId);
                        }
                      }}
                      className="h-11 bg-[#2D5A43] hover:bg-[#1E3F2F] active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{t('screens.marketplace.supportArtisan')}</span>
                    </button>
                  </div>

                  {/* Secondary 2-Column Action Buttons: Chat with Artisan & WhatsApp */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      id={`btn-chat-artisan-${item.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenChatWithArtisan(item.artisanName, item.title);
                      }}
                      className="h-9 bg-[#FAF6F0] hover:bg-[#F4EBE1] text-[#201A18] border border-[#E3D5C5] active:scale-95 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#9C3D25]" />
                      <span>{t('screens.marketplace.chat')}</span>
                    </button>

                    <button
                      id={`btn-whatsapp-${item.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onWhatsAppOrder(item.artisanName, item.title);
                      }}
                      className="h-9 bg-[#FAF6F0] hover:bg-[#E2ECE6] text-[#002112] border border-[#25D366]/40 active:scale-95 font-bold rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                    >
                      <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.39 1.31-1.92 1.39-.5.08-1.15.12-3.32-.78-2.61-1.09-4.28-3.76-4.41-3.93-.13-.18-1.06-1.41-1.06-2.69s.67-1.9 1-2.18c.24-.22.53-.28.71-.28.18 0 .36 0 .52.01.17.01.39-.06.61.47.23.55.78 1.9.85 2.04.07.15.12.32.02.52-.09.2-.15.32-.3.49-.15.18-.31.4-.44.54-.15.15-.3.32-.13.62.17.29.76 1.25 1.63 2.02 1.12.99 2.07 1.3 2.36 1.45.29.15.46.13.63-.07.18-.2.76-.88.96-1.18.2-.3.41-.25.68-.15.28.1 1.78.84 2.09 1 .3.15.51.22.58.35.08.13.08.76-.16 1.44z" />
                      </svg>
                      <span>{t('screens.marketplace.whatsapp')}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Audio Journey Player at bottom */}
        <section aria-label="KalaSetu Audio Tour" className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#7B5500] text-white flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-[#201A18]">
                {t('screens.marketplace.audioTour')}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#9C3D25]">
              {t('screens.marketplace.audioTour')}
            </span>
          </div>

          <p className="text-xs text-[#5E534D] italic leading-relaxed">
            "{t('screens.marketplace.audioTourPrompt')}"
          </p>

          <div className="flex items-center justify-center gap-1.5 h-6">
            {[10, 22, 32, 16, 26, 30, 20, 14, 24, 12, 18, 8].map((h, i) => (
              <span
                key={i}
                className={`w-1.5 rounded-full ${
                  isPlayingAudioTour ? 'bg-[#9C3D25] animate-pulse' : 'bg-[#9C3D25]/70'
                }`}
                style={{ height: `${h}px` }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-xs font-mono text-[#6B605B]">0:18 / 1:12</div>

            <button
              id="btn-play-audio-tour"
              onClick={handleToggleAudioTour}
              className="bg-[#9C3D25] hover:bg-[#802913] active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
            >
              {isPlayingAudioTour ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{isPlayingAudioTour ? t('common.close') : t('common.listen')}</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
