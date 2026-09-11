import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  Play,
  Pause,
  MapPin,
  Clock,
  Users,
  Award,
  Heart,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  Camera,
  ArrowLeftRight,
  LogOut,
} from 'lucide-react';
import { ArtisanProfile, CraftProduct, AuthUser, UserRole } from '../types';
import { KalaSetuLogo } from './KalaSetuLogo';
import { speakAloud } from '../utils/audioService';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';
import { mockArtisanProfile } from '../data/mockData';
import { ProfilePhotoUploader } from './ProfilePhotoUploader';
import { OrdersTab } from './OrdersTab';

interface ArtisanProfileScreenProps {
  artisanId?: string;
  onBack: () => void;
  onSelectProduct: (product: CraftProduct) => void;
  onWhatsAppOrder: (artisanName: string) => void;
  onDirectCall: (phone: string) => void;
  onBuyProduct?: (product: CraftProduct) => void;
  onSupportArtisan?: (product: CraftProduct) => void;
  initialTab?: 'profile' | 'orders';
  language?: string;
  currentUser?: AuthUser | null;
  currentRole?: UserRole;
  onToggleRole?: () => void;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  onUpdateAvatar?: (newAvatarUrl: string) => void;
}

export const ArtisanProfileScreen: React.FC<ArtisanProfileScreenProps> = ({
  artisanId,
  onBack,
  onSelectProduct,
  onWhatsAppOrder,
  onDirectCall,
  onBuyProduct,
  onSupportArtisan,
  initialTab = 'profile',
  currentUser = null,
  currentRole = 'artisan',
  onToggleRole,
  onLogout,
  onUpdateAvatar,
}) => {
  const { language, t } = useLanguage();
  const speechLang = getSpeechLangCode(language);

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>(initialTab);
  const [isPlayingStory, setIsPlayingStory] = useState(false);
  const [hasDonated, setHasDonated] = useState(false);
  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(
    currentUser?.avatarUrl || mockArtisanProfile.avatarUrl
  );

  const artisan: ArtisanProfile = {
    ...mockArtisanProfile,
    avatarUrl: currentAvatarUrl,
  };

  const handleAvatarUpdated = (newUrl: string) => {
    setCurrentAvatarUrl(newUrl);
    onUpdateAvatar?.(newUrl);
    setShowPhotoEditor(false);
  };

  const handleToggleStory = () => {
    if (isPlayingStory) {
      setIsPlayingStory(false);
    } else {
      setIsPlayingStory(true);
      speakAloud(artisan.audioStory.transcript, {
        lang: speechLang,
        onEnd: () => setIsPlayingStory(false),
      });
    }
  };

  const handleListenBio = () => {
    speakAloud(
      `${artisan.name}, ${artisan.title}. ${artisan.region}. ${artisan.experienceYears} ${t('screens.profile.experience', { years: artisan.experienceYears })}. ${artisan.award.title}.`,
      { lang: speechLang }
    );
  };

  const handleSupportDonation = () => {
    if (onSupportArtisan && artisan.products && artisan.products.length > 0) {
      onSupportArtisan(artisan.products[0]);
    } else {
      setHasDonated(true);
      speakAloud(`${t('screens.profile.kilnSupport')}: ₹100 direct support sent to ${artisan.name}.`, {
        lang: speechLang,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#201A18] pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#FAF6F0]/95 backdrop-blur-sm border-b border-[#E3D5C5] px-4 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              id="btn-artisan-profile-back"
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-[#F4EBE1] hover:bg-[#ebdccf] active:scale-95 flex items-center justify-center text-[#201A18] border border-[#E3D5C5] transition-transform"
              aria-label={t('common.back')}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <KalaSetuLogo size={32} showText={false} />
            <div>
              <div className="font-display font-bold text-base text-[#201A18] leading-tight">
                {t('common.appName')}
              </div>
              <div className="text-xs text-[#5E534D]">{t('screens.profile.title')}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-artisan-profile-listen-bio"
              onClick={handleListenBio}
              className="w-10 h-10 rounded-full bg-[#F4EBE1] text-[#9C3D25] border border-[#E3D5C5] flex items-center justify-center transition-transform active:scale-95"
              title={t('common.listen')}
              aria-label={t('common.listen')}
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#9C3D25]">
              <img
                src={artisan.avatarUrl}
                alt={artisan.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* Artisan Hero Banner Card */}
        <section aria-label="Artisan Banner" className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-3xl overflow-hidden shadow-xs">
          <div className="h-24 bg-gradient-to-r from-[#9C3D25] via-[#C2593F] to-[#2D5A43] relative p-3">
            <div className="inline-flex items-center gap-1.5 bg-white/95 text-[#2D5A43] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A43]" />
              <span>{artisan.giTagName}</span>
            </div>
          </div>

          <div className="px-4 pb-4 pt-0 -mt-10 relative">
            <div className="flex items-end justify-between">
              <div className="relative group">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-[#F4EBE1]">
                  <img
                    src={artisan.avatarUrl}
                    alt={artisan.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                {/* Camera upload button */}
                <button
                  id="btn-edit-artisan-photo"
                  type="button"
                  onClick={() => setShowPhotoEditor(!showPhotoEditor)}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#9C3D25] text-white border-2 border-white flex items-center justify-center text-xs shadow-xs active:scale-95 transition-transform"
                  title={t('screens.profile.changePhoto')}
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 pb-1">
                <button
                  id="btn-hero-listen"
                  onClick={handleListenBio}
                  className="w-10 h-10 rounded-full bg-[#FAF6F0] text-[#9C3D25] border border-[#E3D5C5] flex items-center justify-center active:scale-95 transition-transform shadow-2xs"
                  title={t('common.listen')}
                  aria-label={t('common.listen')}
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <button
                  id="btn-hero-support-pill"
                  onClick={handleSupportDonation}
                  className="bg-[#bceecf] text-[#002112] text-xs font-bold px-3.5 py-2 rounded-full border border-[#2D5A43]/30 flex items-center gap-1.5 shadow-xs active:scale-95 transition-transform"
                >
                  <Heart className="w-3.5 h-3.5 fill-[#2D5A43] text-[#2D5A43]" />
                  <span>{hasDonated ? '✓ ' + t('screens.profile.supportReceived') : t('screens.profile.supportBtn')}</span>
                </button>
              </div>
            </div>

            {/* Collapsible Custom Photo Uploader */}
            {showPhotoEditor && (
              <div className="mt-3 p-3 bg-[#FAF6F0] border border-[#9C3D25]/30 rounded-2xl animate-fade-in space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#9C3D25]">
                  <span>{t('screens.profile.changePhoto')}</span>
                  <button
                    type="button"
                    onClick={() => setShowPhotoEditor(false)}
                    className="text-[#5E534D] hover:text-[#201A18] text-xs"
                  >
                    ✕
                  </button>
                </div>
                <ProfilePhotoUploader
                  currentAvatar={artisan.avatarUrl}
                  onAvatarChange={handleAvatarUpdated}
                  role="artisan"
                  size="sm"
                  idPrefix="artisan-hero-edit"
                />
              </div>
            )}

            <div className="mt-3 space-y-1">
              <h1 className="font-display font-bold text-xl text-[#201A18] leading-tight">
                {artisan.name}{' '}
                <span className="text-sm font-medium text-[#5E534D]">
                  ({artisan.englishName})
                </span>
              </h1>
              <div className="text-xs font-bold text-[#9C3D25]">
                {artisan.title}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-3">
              <div className="bg-[#FAF6F0] border border-[#E3D5C5] text-[#201A18] text-xs font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#9C3D25]" />
                <span>{artisan.region}</span>
              </div>

              <div className="bg-[#FAF6F0] border border-[#E3D5C5] text-[#201A18] text-xs font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#7B5500]" />
                <span>{t('screens.profile.experience', { years: artisan.experienceYears })}</span>
              </div>

              <div className="bg-[#FAF6F0] border border-[#E3D5C5] text-[#201A18] text-xs font-semibold px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#2D5A43]" />
                <span>{artisan.generation}</span>
              </div>
            </div>

            {/* Role Switcher in Profile */}
            {onToggleRole && (
              <div className="mt-3 pt-3 border-t border-[#E3D5C5]/60 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wide font-bold text-[#8A726C]">
                    {t('common.switch')}
                  </div>
                  <div className="text-xs font-bold text-[#201A18] flex items-center gap-1.5 pt-0.5">
                    <span>
                      {currentRole === 'artisan' ? `🏺 ${t('common.artisan')}` : `🛍️ ${t('common.buyer')}`}
                    </span>
                    <span className="text-[9px] text-[#2D5A43] bg-[#E2ECE6] px-1.5 py-0.5 rounded-full font-semibold border border-[#2D5A43]/20">
                      Cloud
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-toggle-role-from-profile"
                  onClick={onToggleRole}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl border border-[#9C3D25] bg-white hover:bg-[#FDF1EC] text-[#9C3D25] shadow-2xs transition-all active:scale-95 flex items-center gap-1.5 flex-shrink-0"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>
                    {currentRole === 'artisan'
                      ? t('screens.auth.buyerRoleTitle')
                      : t('screens.auth.artisanRoleTitle')}
                  </span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Profile Tabs: Profile & Crafts vs. Orders */}
        <nav aria-label="Artisan Views" className="bg-[#FAF6F0] p-1 rounded-2xl border border-[#E3D5C5] flex items-center gap-1 shadow-2xs">
          <button
            id="tab-btn-artisan-profile"
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-white text-[#9C3D25] shadow-xs border border-[#E3D5C5]'
                : 'text-[#5E534D] hover:text-[#201A18]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('screens.profile.title')}</span>
          </button>

          <button
            id="tab-btn-artisan-orders"
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-white text-[#2D5A43] shadow-xs border border-[#E3D5C5]'
                : 'text-[#5E534D] hover:text-[#201A18]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('screens.orders.title')}</span>
          </button>
        </nav>

        {activeTab === 'orders' ? (
          <OrdersTab
            currentRole={currentUser?.role || 'artisan'}
            currentUser={currentUser}
            artisanId={artisan.id}
            onBrowseMarketplace={() => setActiveTab('profile')}
          />
        ) : (
          <>
            {/* Audio Story Card */}
            <section aria-label="Audio Story" className="bg-[#FAF6F0] border border-[#E3D5C5] rounded-3xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#F5DDD6] text-[#9C3D25] flex items-center justify-center">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-sm text-[#201A18]">
                      {t('screens.profile.story')}
                    </h2>
                    <div className="text-[11px] text-[#6B605B]">
                      {artisan.audioStory.language}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#7B5500] bg-[#FEF3C7] px-2.5 py-1 rounded-full border border-[#E5A93C]/40">
                  {artisan.audioStory.duration}
                </span>
              </div>

              <div className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-3 flex items-center gap-3 shadow-xs">
                <button
                  id="btn-play-artisan-story"
                  onClick={handleToggleStory}
                  className="w-11 h-11 rounded-full bg-[#9C3D25] hover:bg-[#802913] text-white flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform shadow-xs"
                  aria-label={isPlayingStory ? 'Pause Story' : 'Play Story'}
                >
                  {isPlayingStory ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>

                <div className="flex-1 flex items-center justify-between gap-1 h-8 px-2">
                  {[12, 24, 32, 18, 28, 30, 20, 14, 26, 16, 22, 10, 18].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full ${
                        isPlayingStory ? 'bg-[#9C3D25] animate-pulse' : 'bg-[#9C3D25]/70'
                      }`}
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              </div>

              <blockquote className="bg-[#FFFFFF] border-l-4 border-[#9C3D25] rounded-r-xl p-3 text-xs italic text-[#5E534D] leading-relaxed shadow-2xs">
                {artisan.audioStory.transcript}
              </blockquote>
            </section>

            {/* Tradition & Holy Clay with Process Photos */}
            <section aria-label="Heritage" className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-3xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E2ECE6] text-[#2D5A43] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 className="font-display font-bold text-base text-[#201A18]">
                    {artisan.tradition.title}
                  </h2>
                </div>

                <button
                  id="btn-listen-tradition"
                  onClick={() => speakAloud(artisan.tradition.description, { lang: speechLang })}
                  className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#9C3D25] flex items-center justify-center"
                  title={t('common.listen')}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {artisan.tradition.photos.map((photo, i) => (
                  <div key={i} className="space-y-1">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#E3D5C5] bg-[#F4EBE1]">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-[11px] font-bold text-[#201A18] text-center">
                      {photo.caption}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#5E534D] leading-relaxed">
                {artisan.tradition.description}
              </p>

              <div className="bg-[#FEF3C7]/60 border border-[#E5A93C]/40 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#E5A93C] text-[#7B5500] flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-[#E5A93C]" />
                </div>
                <div>
                  <div className="font-display font-bold text-xs text-[#201A18]">
                    {artisan.award.title}
                  </div>
                  <div className="text-[11px] text-[#7B5500] font-medium">
                    {artisan.award.year} • {artisan.award.organization}
                  </div>
                </div>
              </div>
            </section>

            {/* Handcrafted Catalog */}
            <section aria-label="Artisan Creations" className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-base text-[#201A18]">
                    {t('screens.profile.works')}
                  </h2>
                  <div className="text-xs text-[#5E534D]">
                    {t('common.directFairTrade')}
                  </div>
                </div>

                <span className="text-xs font-bold text-[#9C3D25] bg-[#F5DDD6] px-2.5 py-0.5 rounded-full">
                  {artisan.products.length} {t('common.appName')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {artisan.products.map((item) => (
                  <div
                    key={item.id}
                    id={`artisan-catalog-item-${item.id}`}
                    onClick={() => onSelectProduct(item)}
                    className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl overflow-hidden shadow-xs hover:border-[#9C3D25] transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square bg-[#F4EBE1]">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        {item.giTag && (
                          <span className="absolute top-2 left-2 bg-[#FEF3C7] text-[#7B5500] text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-[#E5A93C]">
                            GI
                          </span>
                        )}
                      </div>

                      <div className="p-2.5 space-y-1">
                        <h3 className="font-bold text-xs text-[#201A18] line-clamp-1">
                          {item.title}
                        </h3>
                        <div className="text-[10px] text-[#6B605B] truncate">
                          {item.materials.split(' ')[0]}
                        </div>
                        <div className="font-display font-extrabold text-sm text-[#9C3D25] pt-0.5">
                          ₹{item.suggestedPrice}
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 pt-0">
                      <button
                        id={`btn-buy-catalog-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onBuyProduct) {
                            onBuyProduct(item);
                          } else {
                            onSelectProduct(item);
                          }
                        }}
                        className="w-full h-9 bg-[#9C3D25] hover:bg-[#802913] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t('screens.marketplace.buyNow')} • ₹{item.suggestedPrice}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Direct Connection & Zero Commission Guarantee Card */}
            <section aria-label="Direct Support" className="bg-[#FAF6F0] border border-[#2D5A43]/30 rounded-3xl p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xs text-[#1E3F2F]">
                    {t('common.directFairTrade')}
                  </h2>
                  <div className="text-[11px] text-[#406d55]">
                    100% Direct to Artisan
                  </div>
                </div>
              </div>

              {/* Kiln Donation Box */}
              <div className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#bceecf] text-[#2D5A43] flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 fill-[#2D5A43]" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#201A18]">
                      {t('screens.profile.kilnSupport')}
                    </div>
                    <div className="text-[10px] text-[#6B605B]">
                      {t('screens.profile.kilnSupportSub')}
                    </div>
                  </div>
                </div>

                <button
                  id="btn-artisan-kiln-bhent"
                  onClick={handleSupportDonation}
                  className="bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <span>{hasDonated ? '✓ ' + t('screens.profile.supportReceived') : '₹100 ' + t('screens.profile.supportBtn')}</span>
                </button>
              </div>

              {/* Direct Call & WhatsApp Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  id="btn-direct-call-artisan"
                  onClick={() => onDirectCall('+91 98765 43210')}
                  className="h-11 bg-white hover:bg-[#F4EBE1] text-[#201A18] font-bold text-xs rounded-xl border border-[#E3D5C5] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <PhoneCall className="w-4 h-4 text-[#9C3D25]" />
                  <span>{t('screens.profile.directCall')}</span>
                </button>

                <button
                  id="btn-artisan-whatsapp-order"
                  onClick={() => onWhatsAppOrder(artisan.name)}
                  className="h-11 bg-[#2D5A43] hover:bg-[#1E3F2F] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.07c-.24.68-1.39 1.31-1.92 1.39-.5.08-1.15.12-3.32-.78-2.61-1.09-4.28-3.76-4.41-3.93-.13-.18-1.06-1.41-1.06-2.69s.67-1.9 1-2.18c.24-.22.53-.28.71-.28.18 0 .36 0 .52.01.17.01.39-.06.61.47.23.55.78 1.9.85 2.04.07.15.12.32.02.52-.09.2-.15.32-.3.49-.15.18-.31.4-.44.54-.15.15-.3.32-.13.62.17.29.76 1.25 1.63 2.02 1.12.99 2.07 1.3 2.36 1.45.29.15.46.13.63-.07.18-.2.76-.88.96-1.18.2-.3.41-.25.68-.15.28.1 1.78.84 2.09 1 .3.15.51.22.58.35.08.13.08.76-.16 1.44z" />
                  </svg>
                  <span>{t('screens.profile.whatsapp')}</span>
                </button>
              </div>

              <div className="pt-2 text-[11px] text-[#5E534D] flex items-start gap-1.5 leading-relaxed">
                <span className="text-[#2D5A43] font-bold">✓</span>
                <span>
                  {t('common.directFairTrade')}
                </span>
              </div>
            </section>

            {/* Account Management & Logout Card */}
            <section aria-label="Account Settings" className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-3xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-xs text-[#201A18]">
                    {t('screens.profile.accountSettings')}
                  </h2>
                  <div className="text-[11px] text-[#5E534D]">
                    {currentUser ? `${currentUser.name} (${currentUser.email || currentUser.phone || 'Active'})` : t('common.appName')}
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-profile-logout"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#FDF1EC] hover:bg-[#fae2da] text-[#9C3D25] border border-[#9C3D25]/30 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('screens.profile.logout')}</span>
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Logout Confirmation Dialog Modal */}
      {showLogoutConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-[#E3D5C5] shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF1EC] text-[#9C3D25] flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-display font-bold text-lg text-[#201A18]">
                {t('screens.profile.confirmLogoutTitle')}
              </h3>
              <p className="text-xs text-[#5E534D]">
                {t('screens.profile.confirmLogoutMsg')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                id="btn-cancel-logout"
                onClick={() => setShowLogoutConfirm(false)}
                className="h-11 rounded-xl bg-[#FAF6F0] hover:bg-[#EBE0D4] text-[#5E534D] font-bold text-xs transition-colors cursor-pointer"
              >
                {t('screens.profile.cancelLogout')}
              </button>

              <button
                type="button"
                id="btn-confirm-logout"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout?.();
                }}
                className="h-11 rounded-xl bg-[#9C3D25] hover:bg-[#802913] text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
              >
                {t('screens.profile.yesLogout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
