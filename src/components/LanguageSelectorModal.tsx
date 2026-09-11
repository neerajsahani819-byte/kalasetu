import React, { useEffect, useState, useRef } from 'react';
import { X, Check, Globe, Volume2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { speak, hasNativeVoice } from '../services/ttsService';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage?: string;
  onSelectLanguage?: (langId: string) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectLanguage,
}) => {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const [modalToast, setModalToast] = useState<string | null>(null);
  const [, setVoicesVersion] = useState(0);
  const hasShownToastRef = useRef(false);

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

  useEffect(() => {
    if (isOpen) {
      const welcomeMsg = t('common.welcome');
      speak(welcomeMsg, language);
    }
  }, [isOpen, language, t]);

  if (!isOpen) return null;

  const handleSelect = (langId: string, _nativeName?: string) => {
    setLanguage(langId);
    onSelectLanguage?.(langId);

    // Speak welcome in newly chosen language
    setTimeout(() => {
      const welcomeMsg = t('common.welcome');
      speak(welcomeMsg, langId);
    }, 100);

    const hasLocal = hasNativeVoice(langId);
    if (!hasLocal && !hasShownToastRef.current) {
      hasShownToastRef.current = true;
      const targetLang = supportedLanguages.find((l) => l.id === langId);
      const languageName = targetLang ? targetLang.name : langId;
      setModalToast(`Cloud voice (${languageName})`);
      setTimeout(() => {
        setModalToast(null);
        onClose();
      }, 1500);
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-[#FAF6F0] rounded-3xl border border-[#E3D5C5] shadow-2xl p-5 space-y-4 relative">
        {modalToast && (
          <div
            id="lang-modal-cloud-toast"
            role="alert"
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-50 bg-[#201A18] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-[#E3D5C5]/20 animate-fade-in whitespace-nowrap"
          >
            <span>☁️</span>
            <span>{modalToast}</span>
          </div>
        )}

        <div className="flex items-center justify-between pb-2 border-b border-[#E3D5C5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#9C3D25]/10 text-[#9C3D25] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[#201A18]">
                {t('common.changeLanguage')}
              </h2>
              <p className="text-[11px] text-[#5E534D]">
                {t('screens.onboarding.subtitle')}
              </p>
            </div>
          </div>

          <button
            id="btn-close-lang-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E3D5C5] text-[#5E534D] hover:text-[#201A18] flex items-center justify-center active:scale-95 transition-transform"
            aria-label={t('common.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cloud voice informational pill */}
        <div className="flex items-center justify-between text-[11px] px-1">
          <span className="text-[#5E534D]">{t('common.language')}</span>
          <span
            className="inline-flex items-center gap-1 bg-[#F4EBE1] text-[#7C3A1D] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#E3D5C5]"
            title={t('screens.onboarding.cloudVoice')}
          >
            <span>☁️</span>
            <span>{t('screens.onboarding.cloudVoice')}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {supportedLanguages.map((lang) => {
            const isSelected = language === lang.id;
            return (
              <button
                key={lang.id}
                id={`lang-select-opt-${lang.id}`}
                onClick={() => handleSelect(lang.id, lang.nativeName)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-[#FDF1EC] border-[#9C3D25] ring-2 ring-[#9C3D25]/20 shadow-xs'
                    : 'bg-[#FFFFFF] border-[#E3D5C5] hover:border-[#8A726C]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isSelected
                        ? 'bg-[#9C3D25] text-white'
                        : 'bg-[#F4EBE1] text-[#5E534D]'
                    }`}
                  >
                    {lang.scriptGlyph}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-[#201A18] truncate">
                        {lang.nativeName}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#9C3D25] flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-[#5E534D] truncate">
                      {lang.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(lang.nativeName, lang.id);
                    }}
                    className="w-6 h-6 rounded-full bg-[#FAF6F0] hover:bg-[#E3D5C5] flex items-center justify-center text-[#9C3D25] transition-colors flex-shrink-0"
                    title={t('common.listen')}
                  >
                    <Volume2 className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
