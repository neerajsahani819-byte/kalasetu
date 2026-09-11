import React, { useState, useMemo, useEffect } from 'react';
import {
  Volume2,
  Package,
  Edit3,
  PhoneCall,
  Sparkles,
  ArrowRight,
  Camera,
  Mic,
  Store,
  CheckCircle2,
  Clock,
  HelpCircle,
  Globe,
  ArrowLeftRight,
  Loader2,
} from 'lucide-react';
import { CraftProduct, UserRole, AuthUser } from '../types';
import { KalaSetuLogo } from './KalaSetuLogo';
import { VoicePulseButton } from './VoicePulseButton';
import { speakAloud } from '../utils/audioService';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';
import { getUserFromFirestore } from '../services/firestoreService';

interface MyShopScreenProps {
  products: CraftProduct[];
  isLoading?: boolean;
  onNavigateToAddProduct: () => void;
  onOpenProductPreview: (product: CraftProduct) => void;
  onOpenArtisanProfile: () => void;
  language?: string;
  currentRole?: UserRole;
  onToggleRole?: (newRole: UserRole) => void;
  onOpenLanguageSelector?: () => void;
  currentUser?: AuthUser | null;
  onOpenAuthModal?: () => void;
}

export const MyShopScreen: React.FC<MyShopScreenProps> = ({
  products,
  isLoading = false,
  onNavigateToAddProduct,
  onOpenProductPreview,
  onOpenArtisanProfile,
  language: propLanguage,
  onToggleRole,
  onOpenLanguageSelector,
  currentUser = null,
  onOpenAuthModal,
}) => {
  const { language: currentLang, t, supportedLanguages } = useLanguage();
  const activeLang = propLanguage || currentLang;
  const speechLang = getSpeechLangCode(activeLang);
  const currentLangObj = supportedLanguages.find((l) => l.id === activeLang) || supportedLanguages[0];

  const [showEmptyState, setShowEmptyState] = useState(false);
  const [isRecordingNewProduct, setIsRecordingNewProduct] = useState(false);
  const [firestoreDisplayName, setFirestoreDisplayName] = useState<string | null>(null);

  // FIX 1: Deduplicate products by product.id (or composite title+image key) before rendering
  const uniqueProducts = useMemo(() => {
    return Array.from(
      new Map(
        products.map((p) => {
          const key = p.id || `${(p.title || '').trim().toLowerCase()}_${(p.images?.[0] || p.imageUrl || '').trim()}`;
          return [key, p];
        })
      ).values()
    );
  }, [products]);

  // FIX 3: Fetch displayName from Firestore if needed, fix greeting fallback so it never renders "₹"
  useEffect(() => {
    if (currentUser?.id && (!currentUser.name || currentUser.name === '₹' || currentUser.name.trim() === '')) {
      getUserFromFirestore(currentUser.id)
        .then((u) => {
          if (u?.name && u.name !== '₹' && u.name.trim() !== '') {
            setFirestoreDisplayName(u.name);
          }
        })
        .catch((err) => console.warn('[Dashboard] Could not fetch firestore user:', err));
    }
  }, [currentUser?.id, currentUser?.name]);

  const rawDisplayName =
    (currentUser?.name && currentUser.name !== '₹' && currentUser.name.trim() !== '' ? currentUser.name : null) ||
    ((currentUser as any)?.displayName && (currentUser as any).displayName !== '₹' && (currentUser as any).displayName.trim() !== '' ? (currentUser as any).displayName : null) ||
    firestoreDisplayName ||
    (currentUser?.email ? currentUser.email.split('@')[0] : null);

  const cleanDisplayName =
    rawDisplayName && rawDisplayName !== '₹' && rawDisplayName.trim() !== ''
      ? rawDisplayName.trim()
      : 'Parvati';

  // Debug logs as specified in FIX 3
  useEffect(() => {
    console.log('[Dashboard] user:', currentUser);
    console.log('[Dashboard] displayName:', cleanDisplayName);
  }, [currentUser, cleanDisplayName]);

  const handleListenShopOverview = () => {
    if (showEmptyState) {
      speakAloud(`${t('screens.myShop.title')}. ${t('screens.myShop.emptyTitle')}. ${t('screens.myShop.emptySubtitle')}`, {
        lang: speechLang,
      });
    } else {
      speakAloud(
        `${t('dashboard.namaste', { name: cleanDisplayName })}. ${t('dashboard.activeListings')}: ${uniqueProducts.length}.`,
        { lang: speechLang }
      );
    }
  };

  const handleStartPacking = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    speakAloud(`${title} - ${t('screens.myShop.startPacking')}`, { lang: speechLang });
  };

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
              <div className="text-xs text-[#5E534D] font-medium">{t('screens.myShop.title')}</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Role switch button */}
            {onToggleRole && (
              <button
                id="btn-myshop-switch-role"
                onClick={() => onToggleRole('buyer')}
                className="flex items-center gap-1 bg-[#E2ECE6] hover:bg-[#d0dfd6] text-[#2D5A43] border border-[#2D5A43]/40 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-xs"
                title={t('common.switch')}
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span className="text-[11px] whitespace-nowrap">{t('common.buyer')}</span>
              </button>
            )}

            {/* Language Selector Button */}
            {onOpenLanguageSelector && (
              <button
                id="btn-myshop-select-lang"
                onClick={onOpenLanguageSelector}
                className="flex items-center gap-1 bg-[#FFFFFF] border border-[#E3D5C5] text-[#201A18] px-2 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-xs"
                title={t('common.changeLanguage')}
              >
                <Globe className="w-3.5 h-3.5 text-[#9C3D25]" />
                <span className="text-[11px] whitespace-nowrap">
                  {currentLangObj.nativeName}
                </span>
              </button>
            )}

            <button
              id="btn-myshop-listen-overview"
              onClick={handleListenShopOverview}
              className="w-9 h-9 rounded-full bg-[#F4EBE1] text-[#9C3D25] border border-[#E3D5C5] flex items-center justify-center transition-transform active:scale-95 hover:bg-[#ebdccf]"
              title={t('common.listen')}
              aria-label={t('common.listen')}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              id="btn-myshop-artisan-profile"
              onClick={onOpenArtisanProfile}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#9C3D25] ring-1 ring-white active:scale-95 transition-transform"
              title={cleanDisplayName}
              aria-label={cleanDisplayName}
            >
              <img
                src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"}
                alt={cleanDisplayName}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* FIX 3: Artisan Greeting & Verified Banner */}
        <section aria-label="Artisan Details" className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={onOpenAuthModal || onOpenArtisanProfile}
                className="relative w-12 h-12 rounded-full overflow-hidden border border-[#E3D5C5] flex-shrink-0 transition-transform active:scale-95"
                title={cleanDisplayName}
              >
                <img
                  src={
                    currentUser?.avatarUrl ||
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={cleanDisplayName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#2D5A43] text-white flex items-center justify-center text-[10px]">
                  ✓
                </div>
              </button>

              <div className="min-w-0">
                <div className="font-display font-bold text-base text-[#201A18] flex items-center gap-1.5 flex-wrap truncate">
                  <span>{t('dashboard.namaste', { name: cleanDisplayName })}</span>
                </div>
                <div className="text-xs font-semibold text-[#2D5A43] flex items-center gap-1 mt-0.5 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    {currentUser
                      ? `${currentUser.authProvider.toUpperCase()} • ${t('common.verified')}`
                      : t('screens.myShop.verifiedBadge')}
                  </span>
                </div>
              </div>
            </div>

            {/* Toggle between Empty View and Filled View */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                id="btn-toggle-empty-view"
                onClick={() => {
                  const next = !showEmptyState;
                  setShowEmptyState(next);
                  speakAloud(next ? t('screens.myShop.emptyTitle') : t('screens.myShop.title'), { lang: speechLang });
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#F4EBE1] hover:bg-[#ebdccf] text-[#9C3D25] border border-[#E3D5C5] transition-colors"
                title={showEmptyState ? t('dashboard.activeListings') : t('screens.myShop.emptyTitle')}
              >
                {showEmptyState ? t('dashboard.activeListings') : t('screens.myShop.emptyTitle')}
              </button>
            </div>
          </div>

          {/* Audio Guide Ribbon */}
          <div className="mt-3 pt-3 border-t border-[#E3D5C5] flex items-center justify-between bg-[#FAF6F0] rounded-xl px-3 py-2">
            <button
              id="btn-play-audio-guide-pill"
              onClick={() => speakAloud(`${t('screens.myShop.audioGuide')}: ${t('screens.myShop.step1')}, ${t('screens.myShop.step2')}, ${t('screens.myShop.step3')}`, { lang: speechLang })}
              className="flex items-center gap-2.5 text-left"
            >
              <div className="w-7 h-7 rounded-full bg-[#9C3D25] text-white flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold">▶</span>
              </div>
              <div>
                <div className="font-bold text-xs text-[#201A18]">
                  {t('screens.myShop.audioGuide')}
                </div>
                <div className="text-[11px] text-[#5E534D]">
                  {t('screens.myShop.helpDeskSub')}
                </div>
              </div>
            </button>

            {/* Waveform glyph */}
            <div className="flex items-center gap-1 text-[#9C3D25]">
              <span className="w-1 h-3 bg-[#9C3D25] rounded-full" />
              <span className="w-1 h-5 bg-[#9C3D25] rounded-full" />
              <span className="w-1 h-2 bg-[#9C3D25] rounded-full" />
            </div>
          </div>
        </section>

        {/* CASE 1: EMPTY STATE VIEW */}
        {showEmptyState ? (
          <section aria-label="Empty Shop View" className="space-y-4 animate-fade-in">
            <div className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-3xl p-6 shadow-xs text-center space-y-4">
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                <div className="w-36 h-36 rounded-full bg-[#F4EBE1] flex items-center justify-center relative">
                  <div className="w-24 h-28 relative flex flex-col items-center">
                    <div className="w-16 h-3 bg-[#9C3D25] rounded-t-lg" />
                    <div className="w-10 h-4 bg-[#C2593F]" />
                    <div className="w-22 h-20 bg-[#9C3D25] rounded-2xl relative flex items-center justify-center shadow-inner">
                      <div className="w-7 h-7 border-2 border-dashed border-[#FAF6F0] rotate-45 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-1 right-2 w-8 h-8 rounded-full bg-[#FEF3C7] border border-[#E5A93C] text-[#7B5500] flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-[#E5A93C]" />
                  </div>

                  <div className="absolute -bottom-2 bg-[#F8EBE6] text-[#9C3D25] border border-[#ddc0ba] text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    <span>{t('screens.myShop.emptyTitle')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-display font-bold text-xl text-[#201A18] leading-snug">
                  {t('screens.myShop.emptyTitle')}
                </h2>
                <p className="text-xs text-[#5E534D] mt-2 leading-relaxed max-w-xs mx-auto">
                  {t('screens.myShop.emptySubtitle')}
                </p>
              </div>

              {/* Master Mic Button */}
              <div className="pt-2">
                <VoicePulseButton
                  id="btn-empty-state-mic"
                  isRecording={isRecordingNewProduct}
                  onToggleRecord={() => {
                    if (!isRecordingNewProduct) {
                      setIsRecordingNewProduct(true);
                      speakAloud(t('screens.addProduct.voiceGuideTitle'), { lang: speechLang });
                    } else {
                      setIsRecordingNewProduct(false);
                      onNavigateToAddProduct();
                    }
                  }}
                  onClick={() => {
                    if (!isRecordingNewProduct) {
                      setIsRecordingNewProduct(true);
                      speakAloud(t('screens.addProduct.voiceGuideTitle'), { lang: speechLang });
                    } else {
                      setIsRecordingNewProduct(false);
                      onNavigateToAddProduct();
                    }
                  }}
                  size="lg"
                />

                <div className="pt-2">
                  <div className="font-display font-bold text-base text-[#9C3D25]">
                    {t('screens.myShop.startListing')}
                  </div>
                  <div className="text-xs text-[#2D5A43] font-semibold mt-0.5">
                    {t('screens.addProduct.voiceGuideTitle')}
                  </div>
                </div>
              </div>

              {/* 3 Easy Steps */}
              <div className="bg-[#FAF6F0] border border-[#E3D5C5] rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#201A18]">
                  <span>{t('screens.myShop.startListing')}</span>
                  <span className="text-[#9C3D25] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    2 mins
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white border border-[#E3D5C5] rounded-xl p-2.5 text-center space-y-1">
                    <div className="w-8 h-8 rounded-full bg-[#E2ECE6] text-[#2D5A43] mx-auto flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#201A18]">{t('screens.myShop.step1')}</div>
                    <div className="text-[10px] text-[#6B605B]">{t('screens.myShop.step1Sub')}</div>
                  </div>

                  <div className="bg-white border border-[#E3D5C5] rounded-xl p-2.5 text-center space-y-1">
                    <div className="w-8 h-8 rounded-full bg-[#F5DDD6] text-[#9C3D25] mx-auto flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#201A18]">{t('screens.myShop.step2')}</div>
                    <div className="text-[10px] text-[#6B605B]">{t('screens.myShop.step2Sub')}</div>
                  </div>

                  <div className="bg-white border border-[#E3D5C5] rounded-xl p-2.5 text-center space-y-1">
                    <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#7B5500] mx-auto flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#201A18]">{t('screens.myShop.step3')}</div>
                    <div className="text-[10px] text-[#6B605B]">{t('screens.myShop.step3Sub')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Center Card */}
            <div className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-display font-bold text-sm text-[#201A18]">
                  <HelpCircle className="w-4 h-4 text-[#9C3D25]" />
                  <span>{t('screens.myShop.helpDesk')}</span>
                </div>
                <span className="text-[10px] font-bold bg-[#E2ECE6] text-[#2D5A43] px-2 py-0.5 rounded-full">
                  {t('common.verified')}
                </span>
              </div>

              <button
                id="btn-help-audio-instructions"
                onClick={() => speakAloud(`${t('screens.myShop.helpDesk')}: ${t('screens.myShop.helpDeskSub')}`, { lang: speechLang })}
                className="w-full bg-[#FAF6F0] hover:bg-[#F4EBE1] border border-[#E3D5C5] rounded-xl p-3 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#7B5500] text-white flex items-center justify-center flex-shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#201A18]">
                      {t('screens.myShop.helpDesk')}
                    </div>
                    <div className="text-[11px] text-[#5E534D]">
                      {t('screens.myShop.helpDeskSub')}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8A726C]" />
              </button>

              <a
                id="btn-call-shilp-mitra"
                href="tel:1800000123"
                className="w-full bg-[#2D5A43] hover:bg-[#1E3F2F] text-white rounded-xl p-3 flex items-center justify-between transition-colors shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">
                      {t('screens.myShop.callSupport')}
                    </div>
                    <div className="text-[11px] text-white/80">
                      {t('screens.myShop.helpDeskSub')}
                    </div>
                  </div>
                </div>
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs">
                  📞
                </span>
              </a>
            </div>
          </section>
        ) : (
          /* CASE 2: ACTIVE SHOP WITH LISTINGS */
          <section aria-label="Active Shop Listings" className="space-y-4 animate-fade-in">
            {/* FIX 2: 3 Metric Summary Cards (Kept as requested) */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-3 text-center space-y-1 shadow-xs">
                <div className="w-7 h-7 rounded-full bg-[#E2ECE6] text-[#2D5A43] mx-auto flex items-center justify-center text-xs">
                  🏺
                </div>
                <div className="font-display font-extrabold text-xl text-[#201A18]">
                  {uniqueProducts.length}
                </div>
                <div className="text-xs font-bold text-[#201A18] leading-tight">
                  {t('dashboard.activeListings')}
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-3 text-center space-y-1 shadow-xs">
                <div className="w-7 h-7 rounded-full bg-[#FEF3C7] text-[#7B5500] mx-auto flex items-center justify-center text-xs">
                  💳
                </div>
                <div className="font-display font-extrabold text-lg text-[#9C3D25]">
                  ₹13,500
                </div>
                <div className="text-xs font-bold text-[#201A18] leading-tight">
                  {t('dashboard.directEarnings')}
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-3 text-center space-y-1 shadow-xs">
                <div className="w-7 h-7 rounded-full bg-[#F5DDD6] text-[#9C3D25] mx-auto flex items-center justify-center text-xs">
                  💬
                </div>
                <div className="font-display font-extrabold text-xl text-[#201A18]">
                  15
                </div>
                <div className="text-xs font-bold text-[#201A18] leading-tight">
                  {t('dashboard.inquiries')}
                </div>
              </div>
            </div>

            {/* FIX 2 & FIX 4: "Mar (Mar 2026)" earnings card with localized seasonal badge (Chart removed) */}
            <div
              id="artisan-mar-earnings-card"
              className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-4 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-base text-[#201A18]">
                    {t('dashboard.marEarnings')}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#7B5500] border border-[#E5A93C]/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>{t('dashboard.seasonalBadge')}</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E3D5C5]/70">
                <div className="bg-[#FAF6F0] rounded-xl p-2.5">
                  <div className="text-[10px] text-[#5E534D] font-bold">
                    {t('dashboard.directEarnings')}
                  </div>
                  <div className="font-display font-extrabold text-base text-[#9C3D25] mt-0.5">
                    ₹13,500
                  </div>
                </div>
                <div className="bg-[#FAF6F0] rounded-xl p-2.5">
                  <div className="text-[10px] text-[#5E534D] font-bold">
                    {t('screens.trends.views')}
                  </div>
                  <div className="font-display font-extrabold text-base text-[#2D5A43] mt-0.5">
                    590
                  </div>
                </div>
                <div className="bg-[#FAF6F0] rounded-xl p-2.5">
                  <div className="text-[10px] text-[#5E534D] font-bold">
                    {t('screens.trends.orders')}
                  </div>
                  <div className="font-display font-extrabold text-base text-[#201A18] mt-0.5">
                    15
                  </div>
                </div>
              </div>
            </div>

            {/* FIX 1: Products Section Header */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base text-[#201A18]">
                  {t('dashboard.myProducts')}
                </h2>
                <span className="text-xs font-bold bg-[#E3D5C5] text-[#201A18] px-2 py-0.5 rounded-full">
                  {uniqueProducts.length}
                </span>
                {isLoading && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#9C3D25] bg-[#FDF1EC] px-2 py-0.5 rounded-full border border-[#f3cec4]">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>{t('common.loading')}</span>
                  </span>
                )}
              </div>

              <button
                id="btn-listen-products-summary"
                onClick={() =>
                  speakAloud(`${t('dashboard.myProducts')}: ${uniqueProducts.length} ${t('dashboard.activeListings')}.`, {
                    lang: speechLang,
                  })
                }
                className="w-8 h-8 rounded-full bg-[#F4EBE1] text-[#9C3D25] flex items-center justify-center"
                title={t('common.listen')}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* FIX 1: Deduplicated Product Grid */}
            <div className="grid grid-cols-2 gap-3">
              {uniqueProducts.map((prod) => (
                <div
                  key={prod.id}
                  id={`product-card-${prod.id}`}
                  onClick={() => onOpenProductPreview(prod)}
                  className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl overflow-hidden shadow-xs cursor-pointer hover:border-[#9C3D25] transition-all group"
                >
                  <div className="relative aspect-square bg-[#F4EBE1]">
                    <img
                      src={prod.images?.[0] || prod.imageUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#2D5A43] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>{prod.status === 'live' ? 'Live' : 'Review'}</span>
                    </div>

                    {prod.verifiedSeller !== false && (
                      <div className="absolute top-2.5 right-2.5 bg-[#E2ECE6] text-[#2D5A43] text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-[#bceecf]">
                        ✅ Verified
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakAloud(`${prod.title}, ₹${prod.suggestedPrice}`, { lang: speechLang });
                      }}
                      className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 text-[#9C3D25] flex items-center justify-center shadow-sm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-2.5 space-y-1">
                    <div className="font-bold text-xs text-[#201A18] truncate">
                      {prod.title}
                    </div>
                    <div className="text-[10px] text-[#6B605B] truncate">
                      {prod.titleEnglish || prod.title}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="font-display font-extrabold text-sm text-[#9C3D25]">
                          ₹{prod.suggestedPrice}
                        </span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-[#F4EBE1] text-[#201A18] flex items-center justify-center">
                        <Edit3 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Order Notification Card */}
            <div
              id="product-card-order-pending"
              className="bg-[#FFFFFF] border-2 border-[#2D5A43]/30 rounded-2xl p-3 shadow-xs space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#E3D5C5] flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80"
                    alt="Order Item"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => speakAloud(t('screens.myShop.ordersPending'), { lang: speechLang })}
                    className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white/90 text-[#9C3D25] flex items-center justify-center shadow-xs"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 bg-[#bceecf] text-[#1E3F2F] text-[11px] font-bold px-2 py-0.5 rounded-full mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43] animate-ping" />
                    <span>{t('screens.myShop.ordersPending')}</span>
                  </div>

                  <h3 className="font-bold text-xs text-[#201A18] truncate">
                    Pochampally Handloom Weave
                  </h3>
                  <div className="font-display font-extrabold text-sm text-[#9C3D25] mt-0.5">
                    ₹1,200
                  </div>
                </div>
              </div>

              {/* Action Bar for Pending Order */}
              <div className="pt-2 border-t border-[#E3D5C5] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs text-[#2D5A43] font-semibold">
                  <Package className="w-4 h-4" />
                  <span>{t('screens.myShop.startPacking')}</span>
                </div>

                <button
                  id="btn-start-packing"
                  onClick={(e) => handleStartPacking(e, 'Pochampally')}
                  className="bg-[#9C3D25] hover:bg-[#802913] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <span>{t('screens.myShop.startPacking')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom Mic Voice Action Trigger Card */}
            <div className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
              <button
                id="btn-myshop-add-product-mic"
                onClick={onNavigateToAddProduct}
                className="flex items-center gap-3 text-left flex-1 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-[#9C3D25] text-white flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform shadow-xs">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-[#201A18]">
                    {t('screens.myShop.addProduct')}
                  </div>
                  <div className="text-xs text-[#5E534D]">
                    {t('screens.myShop.startListing')}
                  </div>
                </div>
              </button>

              <button
                id="btn-myshop-mic-guide"
                onClick={() => speakAloud(`${t('screens.myShop.addProduct')}. ${t('screens.myShop.startListing')}.`, { lang: speechLang })}
                className="w-9 h-9 rounded-full bg-[#F4EBE1] text-[#9C3D25] flex items-center justify-center"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Help Callout Card */}
            <div className="bg-[#FAF6F0] border border-[#E5A93C]/40 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7B5500] text-white flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#201A18]">
                    {t('screens.myShop.helpDesk')}
                  </div>
                  <div className="text-[11px] text-[#5E534D]">
                    {t('screens.myShop.helpDeskSub')}
                  </div>
                </div>
              </div>

              <button
                id="btn-myshop-listen-help"
                onClick={() => speakAloud(`${t('screens.myShop.helpDesk')}. ${t('screens.myShop.helpDeskSub')}.`, { lang: speechLang })}
                className="bg-white border border-[#E3D5C5] text-[#7B5500] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs hover:bg-[#FAF6F0]"
              >
                <span>▶</span>
                <span>{t('common.listen')}</span>
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
