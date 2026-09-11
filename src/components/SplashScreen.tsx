import React from 'react';
import { KalaSetuLogo } from './KalaSetuLogo';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const SplashScreen: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div
      id="splash-screen-root"
      className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-between p-6 select-none relative overflow-hidden"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#E5A93C]/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[#9C3D25]/10 blur-2xl pointer-events-none" />

      <div className="w-full h-8" />

      {/* Main Centered Branding */}
      <div className="flex flex-col items-center text-center max-w-sm mx-auto space-y-6 animate-fadeIn">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#9C3D25] via-[#C2593F] to-[#E5A93C] p-1 shadow-lg shadow-[#9C3D25]/20 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <KalaSetuLogo size={68} showText={false} />
            </div>
          </div>
          <span className="absolute inset-0 rounded-full bg-[#9C3D25]/20 animate-ping pointer-events-none" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-3xl font-extrabold text-[#201A18] tracking-tight">
            {t('common.appName')}
          </h1>

          <p className="text-sm font-semibold text-[#802913] bg-[#FDF1EC] border border-[#9C3D25]/20 px-4 py-1.5 rounded-full inline-block">
            {t('common.tagline')}
          </p>
          <div className="text-xs text-[#6B605B]">
            {t('screens.auth.subtitle')}
          </div>
        </div>

        {/* Gentle Loading Spinner */}
        <div className="pt-4 flex items-center gap-2.5 text-xs font-semibold text-[#8A726C]">
          <Loader2 className="w-4 h-4 text-[#9C3D25] animate-spin" />
          <span>{t('screens.splash.checking')}</span>
        </div>
      </div>

      <footer className="w-full text-center text-[11px] text-[#8A726C] py-2">
        <span>{t('screens.splash.verified')}</span>
      </footer>
    </div>
  );
};
