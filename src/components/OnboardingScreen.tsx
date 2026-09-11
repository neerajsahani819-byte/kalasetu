import React, { useState, useEffect } from 'react';
import { Volume2, Check, ShieldCheck, ArrowRight, LogIn } from 'lucide-react';
import { UserRole, AuthUser } from '../types';
import { KalaSetuLogo } from './KalaSetuLogo';
import { VoicePulseButton } from './VoicePulseButton';
import { speakAloud } from '../utils/audioService';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';
import { speak, hasNativeVoice } from '../services/ttsService';

interface OnboardingScreenProps {
  selectedLanguage?: string;
  onSelectLanguage?: (langId: string) => void;
  selectedRole?: UserRole;
  onSelectRole?: (role: UserRole) => void;
  onContinue?: () => void;
  onComplete?: (role: UserRole, language: string) => void;
  isOffline?: boolean;
  currentUser?: AuthUser | null;
  onOpenAuthModal?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  selectedLanguage: propLanguage,
  onSelectLanguage,
  selectedRole = 'artisan',
  onSelectRole,
  onContinue,
  onComplete,
  isOffline = false,
  currentUser = null,
  onOpenAuthModal,
}) => {
  const { language: currentLang, setLanguage, t, supportedLanguages } = useLanguage();
  const activeLanguage = propLanguage || currentLang;
  const [internalRole, setInternalRole] = useState<UserRole>(selectedRole);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [isSpeakingGuide, setIsSpeakingGuide] = useState(false);
  const [cloudVoiceToast, setCloudVoiceToast] = useState<string | null>(null);
  const [, setVoicesVersion] = useState(0);
  const hasShownToastRef = React.useRef(false);

  const activeRole = selectedRole || internalRole;
  const speechLang = getSpeechLangCode(activeLanguage);

  // Listen for voices loading in browser
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const update = () => setVoicesVersion((v) => v + 1);
      window.speechSynthesis.addEventListener('voiceschanged', update);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', update);
      };
    }
  }, []);

  // Welcome announcement
  useEffect(() => {
    const welcomeMsg = t('common.welcome');
    speak(welcomeMsg, activeLanguage);
  }, [activeLanguage]);

  const handleLanguageClick = (langId: string) => {
    setLanguage(langId);
    onSelectLanguage?.(langId);

    const hasLocal = hasNativeVoice(langId);
    if (!hasLocal && !hasShownToastRef.current) {
      hasShownToastRef.current = true;
      const targetLang = supportedLanguages.find((l) => l.id === langId);
      const languageName = targetLang ? targetLang.name : langId;
      setCloudVoiceToast(`${t('screens.onboarding.cloudVoice')} (${languageName})`);
      setTimeout(() => {
        setCloudVoiceToast(null);
      }, 4000);
    }

    const welcomeMsg = t('common.welcome');
    speak(welcomeMsg, langId);
  };

  const handleRoleClick = (role: UserRole) => {
    setInternalRole(role);
    onSelectRole?.(role);
    speakAloud(
      role === 'artisan'
        ? t('screens.onboarding.artisanTitle')
        : t('screens.onboarding.buyerTitle'),
      { lang: speechLang }
    );
  };

  const handleContinueClick = () => {
    onContinue?.();
    onComplete?.(activeRole, activeLanguage);
  };

  const handleListenMainGuide = () => {
    setIsSpeakingGuide(true);
    speakAloud(
      `${t('common.welcome')}. ${t('screens.onboarding.title')}. ${t('screens.onboarding.subtitle')}.`,
      {
        lang: speechLang,
        onEnd: () => setIsSpeakingGuide(false),
      }
    );
  };

  const handleToggleVoiceMic = () => {
    if (!isListeningMic) {
      setIsListeningMic(true);
      speakAloud(t('screens.onboarding.voicePromptSub'), {
        lang: speechLang,
        onEnd: () => {
          setTimeout(() => {
            setIsListeningMic(false);
          }, 3500);
        },
      });
    } else {
      setIsListeningMic(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#201A18] pb-12 relative">
      {/* Cloud Voice Toast */}
      {cloudVoiceToast && (
        <div
          id="cloud-voice-toast"
          role="alert"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#201A18] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-[#E3D5C5]/20 animate-fade-in transition-all"
        >
          <Volume2 className="w-4 h-4 text-[#8A726C] flex-shrink-0" />
          <span>{cloudVoiceToast}</span>
        </div>
      )}

      {/* Top Status & Help Header */}
      <div className="max-w-md mx-auto px-4 pt-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 bg-[#E2ECE6] text-[#2D5A43] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#2D5A43]/20">
          <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-600' : 'bg-[#2D5A43] animate-pulse'}`} />
          <span>{isOffline ? t('common.offline') : t('common.online')}</span>
        </div>

        <button
          id="btn-onboarding-help"
          onClick={handleListenMainGuide}
          className="inline-flex items-center gap-1.5 bg-[#F4EBE1] text-[#9C3D25] text-xs font-bold px-3 py-1.5 rounded-full border border-[#E3D5C5] hover:bg-[#ebdccf] transition-colors cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{t('common.listen')}</span>
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 mt-3 space-y-4">
        {/* Header Branding & Welcome Card */}
        <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#E3D5C5] shadow-sm flex items-start justify-between gap-3">
          <div className="space-y-1">
            <KalaSetuLogo size={36} showText={true} />

            <div className="pt-2">
              <h1 className="text-xl font-bold font-display text-[#201A18] leading-tight">
                {t('screens.onboarding.title')}
              </h1>
              <p className="text-xs text-[#5E534D] pt-1 leading-relaxed">
                {t('screens.onboarding.subtitle')}
              </p>
            </div>
          </div>

          {/* Large Listen Button */}
          <button
            id="btn-listen-intro"
            onClick={handleListenMainGuide}
            className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 transition-all p-2 flex-shrink-0 active:scale-95 shadow-sm cursor-pointer ${
              isSpeakingGuide
                ? 'bg-[#E5A93C] border-[#9C3D25] ring-4 ring-[#E5A93C]/30 text-[#201A18]'
                : 'bg-[#E5A93C] hover:bg-[#d99d30] border-[#D97706] text-[#201A18]'
            }`}
          >
            <Volume2 className={`w-6 h-6 text-[#201A18] ${isSpeakingGuide ? 'animate-bounce' : ''}`} />
            <span className="text-sm font-bold mt-1">{t('common.listen')}</span>
          </button>
        </div>

        {/* Tactile Tip Pill */}
        <div className="bg-[#F8EBE6] border border-[#ddc0ba] rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs text-[#56423D]">
          <span className="w-2 h-2 rounded-full bg-[#9C3D25] flex-shrink-0" />
          <div className="leading-snug">
            <span className="font-semibold text-[#201A18]">{t('screens.onboarding.voicePromptSub')}</span>
          </div>
        </div>

        {/* Language Selection Header */}
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-[#5E534D] font-medium">{t('screens.onboarding.chooseLanguage')}</span>
          <span
            id="cloud-voice-badge-info"
            className="inline-flex items-center gap-1.5 bg-[#F4EBE1] text-[#7C3A1D] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#E3D5C5]"
          >
            <span>☁️</span>
            <span>{t('screens.onboarding.cloudVoice')}</span>
          </span>
        </div>

        {/* 2-Column Language Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {supportedLanguages.map((lang) => {
            const isSelected = activeLanguage === lang.id;
            const hasLocalVoice = hasNativeVoice(lang.id);
            return (
              <button
                key={lang.id}
                id={`lang-card-${lang.id}`}
                onClick={() => handleLanguageClick(lang.id)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                  isSelected
                    ? 'bg-[#FDF1EC] border-[#9C3D25] ring-2 ring-[#9C3D25]/20 shadow-sm'
                    : 'bg-[#FFFFFF] border-[#E3D5C5] hover:border-[#8A726C] shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      isSelected
                        ? 'bg-[#9C3D25] text-white'
                        : 'bg-[#F4EBE1] text-[#5E534D]'
                    }`}
                  >
                    {lang.scriptGlyph}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-[#201A18] truncate">
                        {lang.nativeName}
                      </span>
                      {hasLocalVoice ? (
                        <span title="Native voice" className="inline-flex items-center text-xs flex-shrink-0">
                          🔊
                        </span>
                      ) : (
                        <span title="Cloud voice" className="inline-flex items-center text-xs flex-shrink-0">
                          ☁️
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#6B605B] truncate">
                      {lang.name}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors flex-shrink-0 ml-1 ${
                    isSelected
                      ? 'bg-[#9C3D25] border-[#9C3D25] text-white'
                      : 'border-[#8A726C]/40 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Master Voice Mic Trigger */}
        <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#E3D5C5] shadow-xs text-center space-y-2">
          <VoicePulseButton
            id="btn-onboarding-voice-entry"
            isRecording={isListeningMic}
            onToggleRecord={handleToggleVoiceMic}
            onClick={handleToggleVoiceMic}
            size="lg"
            pulseColor="primary"
          />

          <div className="pt-1">
            <div className="font-display font-bold text-base text-[#201A18]">
              {t('screens.onboarding.voicePrompt')}
            </div>
            <div className="text-xs text-[#5E534D] mt-0.5">
              {t('screens.onboarding.voicePromptSub')}
            </div>
          </div>
        </div>

        {/* Role Selection Container */}
        <div className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#E3D5C5] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-[#201A18]">
              {t('screens.onboarding.chooseRole')}
            </h2>
            <span className="text-[10px] font-bold bg-[#FEF3C7] text-[#7B5500] px-2 py-0.5 rounded-full border border-[#E5A93C]/40">
              {t('screens.onboarding.chooseRole')}
            </span>
          </div>

          {/* Option 1: Artisan */}
          <button
            id="role-select-artisan"
            onClick={() => handleRoleClick('artisan')}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
              activeRole === 'artisan'
                ? 'bg-[#FDF1EC] border-[#9C3D25] ring-2 ring-[#9C3D25]/20 shadow-sm'
                : 'bg-[#FFFFFF] border-[#E3D5C5] hover:border-[#8A726C]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  activeRole === 'artisan'
                    ? 'bg-[#9C3D25] text-white'
                    : 'bg-[#F4EBE1] text-[#9C3D25]'
                }`}
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2a2 2 0 0 0-2 2v1H8a3 3 0 0 0-3 3v2a6 6 0 0 0 4.1 5.7L8 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l-1.1-4.3A6 6 0 0 0 19 10V8a3 3 0 0 0-3-3h-2V4a2 2 0 0 0-2-2zm0 3a1 1 0 0 1 1 1v1h-2V6a1 1 0 0 1 1-1z" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-sm text-[#201A18]">{t('screens.onboarding.artisanTitle')}</span>
                </div>
                <div className="text-xs text-[#5E534D] mt-0.5">
                  {t('screens.onboarding.artisanDesc')}
                </div>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors flex-shrink-0 ${
                activeRole === 'artisan'
                  ? 'bg-[#9C3D25] border-[#9C3D25] text-white'
                  : 'border-[#8A726C]/40 bg-white'
              }`}
            >
              {activeRole === 'artisan' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>

          {/* Option 2: Buyer */}
          <button
            id="role-select-buyer"
            onClick={() => handleRoleClick('buyer')}
            className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
              activeRole === 'buyer'
                ? 'bg-[#FDF1EC] border-[#9C3D25] ring-2 ring-[#9C3D25]/20 shadow-sm'
                : 'bg-[#FFFFFF] border-[#E3D5C5] hover:border-[#8A726C]'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  activeRole === 'buyer'
                    ? 'bg-[#9C3D25] text-white'
                    : 'bg-[#F4EBE1] text-[#9C3D25]'
                }`}
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M19 6h-2c0-2.8-2.2-5-5-5S7 3.2 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.7 0 3 1.3 3 3H9c0-1.7 1.3-3 3-3zm7 17H5V8h2v2c0 .6.4 1 1 1s1-.4 1-1V8h6v2c0 .6.4 1 1 1s1-.4 1-1V8h2v12z" />
                </svg>
              </div>

              <div>
                <div className="font-bold text-sm text-[#201A18]">{t('screens.onboarding.buyerTitle')}</div>
                <div className="text-xs text-[#5E534D] mt-0.5">
                  {t('screens.onboarding.buyerDesc')}
                </div>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors flex-shrink-0 ${
                activeRole === 'buyer'
                  ? 'bg-[#9C3D25] border-[#9C3D25] text-white'
                  : 'border-[#8A726C]/40 bg-white'
              }`}
            >
              {activeRole === 'buyer' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>
        </div>

        {/* Account Login Option Card */}
        {onOpenAuthModal && (
          <div className="bg-white border border-[#E3D5C5] rounded-2xl p-3 shadow-xs">
            {currentUser ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#2D5A43]"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#201A18] truncate flex items-center gap-1">
                      <span>{currentUser.name}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43]" />
                    </div>
                    <div className="text-[10px] text-[#5E534D] truncate">
                      {currentUser.email || currentUser.phone} ({currentUser.authProvider})
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="px-2.5 py-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#EBE0D4] text-[#9C3D25] text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  {t('common.change')}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#FDF1EC] text-[#9C3D25] flex items-center justify-center">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#201A18]">
                      {t('common.login')}
                    </div>
                    <div className="text-[10px] text-[#5E534D]">
                      {t('screens.auth.subtitle')}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-onboarding-login"
                  onClick={onOpenAuthModal}
                  className="px-3 py-2 rounded-xl bg-[#9C3D25] hover:bg-[#802913] text-white text-xs font-bold shadow-xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('common.login')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Primary Continue Button */}
        <div className="pt-2">
          <button
            id="btn-onboarding-continue"
            onClick={handleContinueClick}
            className="w-full h-14 bg-[#9C3D25] hover:bg-[#802913] active:scale-[0.98] text-white rounded-2xl font-display font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{t('screens.onboarding.continue')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Trust Guarantee Footer */}
        <div className="text-center pt-2 flex items-center justify-center gap-1.5 text-xs text-[#5E534D]">
          <ShieldCheck className="w-4 h-4 text-[#2D5A43]" />
          <span>{t('common.directFairTrade')}</span>
        </div>
      </div>
    </div>
  );
};
