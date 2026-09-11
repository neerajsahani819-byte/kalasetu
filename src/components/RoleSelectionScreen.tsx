import React, { useState } from 'react';
import { Sparkles, ArrowRight, Volume2, ShieldCheck, Check } from 'lucide-react';
import { UserRole } from '../types';
import { KalaSetuLogo } from './KalaSetuLogo';
import { speakAloud } from '../utils/audioService';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';

interface RoleSelectionScreenProps {
  displayName?: string;
  onSelectRole: (role: UserRole) => Promise<void> | void;
  language?: string;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  displayName,
  onSelectRole,
  language: propLanguage,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('artisan');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { language: currentLang, t } = useLanguage();
  const activeLang = propLanguage || currentLang;
  const speechLang = getSpeechLangCode(activeLang);

  const handleRoleClick = (role: UserRole) => {
    setSelectedRole(role);
    speakAloud(
      role === 'artisan'
        ? t('screens.roleSelection.artisanTitle')
        : t('screens.roleSelection.buyerTitle'),
      { lang: speechLang }
    );
  };

  const handleListenGuide = () => {
    const text = displayName
      ? `${t('screens.roleSelection.greeting', { name: displayName })} ${t('screens.roleSelection.subtitle')}`
      : `${t('common.welcome')}. ${t('screens.roleSelection.subtitle')}`;
    speakAloud(text, { lang: speechLang });
  };

  const handleConfirmRole = async () => {
    setIsSubmitting(true);
    try {
      await onSelectRole(selectedRole);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#201A18] flex flex-col justify-between py-8 px-4 relative selection:bg-[#9C3D25]/20 selection:text-[#9C3D25]">
      {/* Background Ambience */}
      <div className="fixed top-0 right-0 w-80 h-80 rounded-full bg-[#E5A93C]/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full bg-[#9C3D25]/10 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between z-10 pb-4">
        <KalaSetuLogo size={34} showText={true} />
        <button
          type="button"
          onClick={handleListenGuide}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C]/50 text-xs font-bold text-[#7B5500] hover:bg-[#E5A93C]/30 transition-all cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#9C3D25]" />
          <span>{t('common.listen')}</span>
        </button>
      </div>

      {/* Center Role Card */}
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#E3D5C5] shadow-xl shadow-[#9C3D25]/5 z-10 space-y-6">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF1EC] border border-[#9C3D25]/20 text-[11px] font-bold text-[#9C3D25] uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 text-[#E5A93C]" />
            <span>{t('screens.roleSelection.title')}</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#201A18]">
            {displayName
              ? t('screens.roleSelection.greeting', { name: displayName })
              : t('common.welcome')}
          </h1>
          <p className="text-xs sm:text-sm text-[#5E534D]">
            {t('screens.roleSelection.subtitle')}
          </p>
        </div>

        {/* 2 BIG Buttons: Artisan vs Buyer */}
        <div className="space-y-3 pt-2">
          {/* Option 1: Artisan */}
          <button
            type="button"
            id="role-btn-artisan"
            onClick={() => handleRoleClick('artisan')}
            className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
              selectedRole === 'artisan'
                ? 'bg-[#FDF1EC] border-[#9C3D25] ring-4 ring-[#9C3D25]/15 shadow-md scale-[1.01]'
                : 'bg-white border-[#E3D5C5] hover:border-[#8A726C] opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  selectedRole === 'artisan'
                    ? 'bg-[#9C3D25] text-white shadow-sm'
                    : 'bg-[#F4EBE1] text-[#9C3D25]'
                }`}
              >
                🎨
              </div>
              <div>
                <div className="font-display font-bold text-sm sm:text-base text-[#201A18]">
                  {t('screens.roleSelection.artisanTitle')}
                </div>
                <div className="text-[11px] text-[#5E534D] mt-1">
                  {t('screens.roleSelection.artisanSub')}
                </div>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                selectedRole === 'artisan'
                  ? 'bg-[#9C3D25] border-[#9C3D25] text-white'
                  : 'border-[#8A726C]/40 bg-white'
              }`}
            >
              {selectedRole === 'artisan' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>

          {/* Option 2: Buyer */}
          <button
            type="button"
            id="role-btn-buyer"
            onClick={() => handleRoleClick('buyer')}
            className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
              selectedRole === 'buyer'
                ? 'bg-[#FDF1EC] border-[#9C3D25] ring-4 ring-[#9C3D25]/15 shadow-md scale-[1.01]'
                : 'bg-white border-[#E3D5C5] hover:border-[#8A726C] opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  selectedRole === 'buyer'
                    ? 'bg-[#9C3D25] text-white shadow-sm'
                    : 'bg-[#F4EBE1] text-[#9C3D25]'
                }`}
              >
                🛍️
              </div>
              <div>
                <div className="font-display font-bold text-sm sm:text-base text-[#201A18]">
                  {t('screens.roleSelection.buyerTitle')}
                </div>
                <div className="text-[11px] text-[#5E534D] mt-1">
                  {t('screens.roleSelection.buyerSub')}
                </div>
              </div>
            </div>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                selectedRole === 'buyer'
                  ? 'bg-[#9C3D25] border-[#9C3D25] text-white'
                  : 'border-[#8A726C]/40 bg-white'
              }`}
            >
              {selectedRole === 'buyer' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          id="btn-confirm-role"
          onClick={handleConfirmRole}
          disabled={isSubmitting}
          className="w-full h-14 bg-[#9C3D25] hover:bg-[#802913] active:scale-[0.98] text-white rounded-2xl font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>{t('screens.roleSelection.continueBtn')}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Guarantee footer */}
        <div className="text-center flex items-center justify-center gap-1.5 text-xs text-[#5E534D]">
          <ShieldCheck className="w-4 h-4 text-[#2D5A43]" />
          <span>{t('screens.roleSelection.changeLaterNote')}</span>
        </div>
      </div>

      <footer className="w-full text-center text-xs text-[#8A726C] pt-6 z-10">
        {t('common.appName')} • {t('common.directFairTrade')}
      </footer>
    </div>
  );
};
