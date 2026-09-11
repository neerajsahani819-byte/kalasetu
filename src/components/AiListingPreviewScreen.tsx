import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  Play,
  Pause,
  Edit3,
  Minus,
  Plus,
  Mic,
  Share2,
  Bookmark,
  CheckCircle2,
  Clock,
  Leaf,
  Store,
  Sparkles,
  Camera,
} from 'lucide-react';
import { KalaSetuLogo } from './KalaSetuLogo';
import { speakAloud } from '../utils/audioService';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';

interface AiListingPreviewScreenProps {
  productData?: {
    photoUrl: string;
    title: string;
    category: string;
    description: string;
    hours: number;
    materials: string;
    price: number;
  };
  onBack: () => void;
  onPublishToShop: () => void;
  onSaveDraft?: () => void;
  language?: string;
}

export const AiListingPreviewScreen: React.FC<AiListingPreviewScreenProps> = ({
  productData,
  onBack,
  onPublishToShop,
  onSaveDraft,
  language: propLanguage,
}) => {
  const { language: currentLang, t } = useLanguage();
  const activeLang = propLanguage || currentLang;
  const speechLang = getSpeechLangCode(activeLang);

  const [price, setPrice] = useState<number>(productData?.price || 850);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress] = useState(33);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(
    productData?.title || 'Handcrafted Clay Surahi'
  );
  const [isListeningVoiceEdit, setIsListeningVoiceEdit] = useState(false);

  const artisanIncome = Math.round(price * 0.85);
  const packagingCut = price - artisanIncome;

  const handleToggleAudioReadout = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakAloud(
        `${title}. ₹${price}. ${t('screens.preview.artisanCut')}: ₹${artisanIncome}. ${productData?.hours || 12} ${t('screens.preview.hours')}.`,
        {
          lang: speechLang,
          onEnd: () => setIsPlayingAudio(false),
        }
      );
    }
  };

  const handleVoiceEdit = () => {
    setIsListeningVoiceEdit(true);
    speakAloud(t('screens.preview.speakToChange'), {
      lang: speechLang,
      onEnd: () => {
        setTimeout(() => {
          setIsListeningVoiceEdit(false);
          speakAloud(t('common.save'), { lang: speechLang });
        }, 3000);
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#201A18] pb-16">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-[#FAF6F0]/95 backdrop-blur-sm border-b border-[#E3D5C5] px-4 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              id="btn-preview-back"
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-[#F4EBE1] hover:bg-[#ebdccf] active:scale-95 flex items-center justify-center text-[#201A18] border border-[#E3D5C5] transition-transform cursor-pointer"
              aria-label={t('common.back')}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <KalaSetuLogo size={32} showText={false} />
            <span className="font-display font-bold text-lg text-[#201A18]">
              {t('screens.preview.title')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-preview-top-speaker"
              onClick={handleToggleAudioReadout}
              className="w-10 h-10 rounded-full bg-[#F4EBE1] text-[#9C3D25] border border-[#E3D5C5] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
              title={t('common.listen')}
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#9C3D25]">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                alt="Artisan Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-3 space-y-3.5">
        {/* Magic AI Crafted Listing Pill */}
        <div className="inline-flex items-center gap-2 bg-[#bceecf] text-[#1E3F2F] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#2D5A43]/20 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#2D5A43]" />
          <span>{t('screens.preview.aiBadge')}</span>
        </div>

        {/* Audio Player Card */}
        <section
          aria-label="Audio Details"
          className="bg-[#9C3D25] text-white rounded-2xl p-4 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-display font-bold text-base leading-snug">
                  {t('screens.preview.listenStory')}
                </h2>
                <div className="text-xs text-white/80">
                  {t('screens.preview.speakToChange')}
                </div>
              </div>
            </div>

            <button
              id="btn-play-preview-audio"
              type="button"
              onClick={handleToggleAudioReadout}
              className="w-12 h-12 rounded-full bg-white text-[#9C3D25] flex items-center justify-center shadow-md active:scale-95 transition-transform flex-shrink-0 cursor-pointer"
              aria-label={isPlayingAudio ? t('common.close') : t('common.listen')}
            >
              {isPlayingAudio ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>
          </div>

          <div className="space-y-1">
            <div className="w-full h-2 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E5A93C] rounded-full transition-all duration-300"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-white/80 font-mono">
              <span>0:14</span>
              <span>0:42</span>
            </div>
          </div>
        </section>

        {/* Hero Product Image */}
        <section aria-label="Product image" className="relative rounded-2xl overflow-hidden border border-[#E3D5C5] shadow-xs bg-[#F4EBE1]">
          <div className="aspect-[4/3] w-full">
            <img
              src={
                productData?.photoUrl ||
                'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'
              }
              alt="Handcrafted Terracotta Pitcher"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-3 right-3 bg-white/95 text-[#2D5A43] text-xs font-bold px-3 py-1 rounded-full border border-[#2D5A43]/30 shadow-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A43]" />
            <span>{t('screens.preview.giTag')}</span>
          </div>

          <div className="absolute bottom-3 left-3 bg-black/75 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
            <Camera className="w-3.5 h-3.5 text-white/90" />
            <span>{t('common.verified')}</span>
          </div>
        </section>

        {/* Product Details Section */}
        <section aria-label="Product specs" className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-[#9C3D25] tracking-wide">
                {productData?.category || t('screens.marketplace.filterPottery')}
              </div>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  autoFocus
                  className="font-display font-bold text-xl text-[#201A18] leading-snug border-b-2 border-[#9C3D25] focus:outline-none w-full mt-0.5"
                />
              ) : (
                <h1 className="font-display font-bold text-xl text-[#201A18] leading-snug mt-0.5">
                  {title}
                </h1>
              )}
              {productData?.description && (
                <div className="text-xs text-[#5E534D] mt-1 line-clamp-2 leading-relaxed">
                  {productData.description}
                </div>
              )}
            </div>

            <button
              id="btn-edit-product-title"
              type="button"
              onClick={() => setIsEditingTitle(!isEditingTitle)}
              className="w-9 h-9 rounded-full bg-[#F4EBE1] text-[#9C3D25] hover:bg-[#ebdccf] flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
              title={t('common.edit')}
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          {/* Specification Chips */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="bg-[#F8EBE6] border border-[#ddc0ba] rounded-xl p-2.5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white text-[#9C3D25] flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#201A18] truncate">
                  {productData?.hours || 12} {t('screens.preview.hours')}
                </div>
                <div className="text-[10px] text-[#6B605B] truncate">
                  {productData?.category || t('common.artisan')}
                </div>
              </div>
            </div>

            <div className="bg-[#F8EBE6] border border-[#ddc0ba] rounded-xl p-2.5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white text-[#2D5A43] flex items-center justify-center flex-shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#201A18] truncate">
                  {productData?.materials || t('screens.preview.materials')}
                </div>
                <div className="text-[10px] text-[#6B605B] truncate">
                  {t('screens.preview.materials')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Price & Transparent Income Card */}
        <section aria-label="Price details" className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-[#5E534D]">
                {t('screens.preview.suggestedPrice')}
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display font-extrabold text-2xl text-[#9C3D25]">
                  ₹{price}
                </span>
                <span className="text-[11px] text-[#6B605B]">Fair Trade</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#F4EBE1] border border-[#E3D5C5] rounded-xl p-1">
              <button
                id="btn-decrement-price"
                onClick={() => setPrice((prev) => Math.max(100, prev - 50))}
                className="w-8 h-8 rounded-lg bg-white text-[#201A18] hover:bg-[#FAF6F0] flex items-center justify-center font-bold shadow-xs active:scale-95 cursor-pointer"
                aria-label="Decrease price"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="font-bold text-sm text-[#201A18] px-1 font-mono">
                ₹
              </span>

              <button
                id="btn-increment-price"
                onClick={() => setPrice((prev) => prev + 50)}
                className="w-8 h-8 rounded-lg bg-white text-[#201A18] hover:bg-[#FAF6F0] flex items-center justify-center font-bold shadow-xs active:scale-95 cursor-pointer"
                aria-label="Increase price"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E3D5C5] flex items-center justify-between text-xs text-[#5E534D]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2D5A43]" />
              <span>
                {t('screens.preview.artisanCut')}: <strong className="text-[#201A18]">₹{artisanIncome}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D1BFAB]" />
              <span>
                {t('screens.preview.packagingCut')}: <strong className="text-[#201A18]">₹{packagingCut}</strong>
              </span>
            </div>
          </div>
        </section>

        {/* Voice Edit Option Card */}
        <section aria-label="Voice edit" className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
          <button
            id="btn-voice-edit-preview"
            type="button"
            onClick={handleVoiceEdit}
            className="flex items-center gap-3 text-left flex-1 cursor-pointer"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 ${
                isListeningVoiceEdit
                  ? 'bg-[#9C3D25] text-white ring-4 ring-[#E5A93C]'
                  : 'bg-[#C2593F] text-white'
              }`}
            >
              <Mic className="w-5 h-5" />
            </div>

            <div>
              <div className="font-display font-bold text-sm text-[#201A18]">
                {t('screens.preview.voiceEdit')}
              </div>
              <div className="text-xs text-[#5E534D]">
                {isListeningVoiceEdit
                  ? t('voice.listening')
                  : t('screens.preview.speakToChange')}
              </div>
            </div>
          </button>
        </section>

        {/* Primary CTA: Publish to Shop */}
        <div className="pt-2">
          <button
            id="btn-publish-to-shop"
            onClick={() => {
              speakAloud(t('screens.preview.publish'), { lang: speechLang });
              onPublishToShop();
            }}
            className="w-full h-14 bg-[#2D5A43] hover:bg-[#1E3F2F] active:scale-[0.98] text-white rounded-2xl font-display font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Store className="w-5 h-5 text-[#E5A93C]" />
            <span>{t('screens.preview.publish')}</span>
          </button>
        </div>

        {/* Secondary Actions: Save Draft & Share */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            id="btn-save-draft"
            type="button"
            onClick={() => {
              speakAloud(t('screens.preview.saveDraft'), { lang: speechLang });
              onSaveDraft?.();
            }}
            className="h-12 bg-[#F4EBE1] hover:bg-[#ebdccf] text-[#201A18] font-bold text-xs rounded-xl border border-[#E3D5C5] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-[#9C3D25]" />
            <span>{t('screens.preview.saveDraft')}</span>
          </button>

          <button
            id="btn-share-listing"
            type="button"
            onClick={() => {
              speakAloud(t('common.share'), { lang: speechLang });
            }}
            className="h-12 bg-[#F4EBE1] hover:bg-[#ebdccf] text-[#201A18] font-bold text-xs rounded-xl border border-[#E3D5C5] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#9C3D25]" />
            <span>{t('common.share')}</span>
          </button>
        </div>
      </main>
    </div>
  );
};
