import React from 'react';
import { Volume2, Globe, ArrowLeftRight, ShoppingBag, LogIn } from 'lucide-react';
import { KalaSetuLogo } from './KalaSetuLogo';
import { UserRole, AuthUser } from '../types';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';
import { speakAloud } from '../utils/audioService';

interface AppHeaderProps {
  currentRole: UserRole;
  onToggleRole: (newRole: UserRole) => void;
  selectedLanguage?: string;
  onOpenLanguageSelector: () => void;
  onListenGuide?: () => void;
  currentUser?: AuthUser | null;
  onOpenAuthModal?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentRole,
  onToggleRole,
  selectedLanguage,
  onOpenLanguageSelector,
  onListenGuide,
  currentUser = null,
  onOpenAuthModal,
}) => {
  const { language: currentLang, t, supportedLanguages } = useLanguage();
  const activeLang = selectedLanguage || currentLang;
  const currentLangObj = supportedLanguages.find((l) => l.id === activeLang) || supportedLanguages[0];

  const handleToggleRoleClick = () => {
    const nextRole: UserRole = currentRole === 'artisan' ? 'buyer' : 'artisan';
    onToggleRole(nextRole);
    const speechCode = getSpeechLangCode(activeLang);
    if (nextRole === 'artisan') {
      speakAloud(t('common.roleArtisan'), { lang: speechCode });
    } else {
      speakAloud(t('common.roleBuyer'), { lang: speechCode });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E3D5C5] px-3 py-2 shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Logo & Platform Name */}
        <div className="flex items-center gap-2 min-w-0">
          <KalaSetuLogo size={32} showText={false} />
          <div className="min-w-0">
            <div className="font-display font-bold text-sm text-[#201A18] leading-tight truncate">
              {t('common.appName')}
            </div>
            <div className="text-[10px] text-[#9C3D25] font-semibold truncate">
              {currentRole === 'artisan' ? t('common.artisan') : t('common.buyer')}
            </div>
          </div>
        </div>

        {/* Center/Right Action Controls: Role Switcher & Language Picker */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Role Switcher Pill */}
          <button
            id="btn-header-switch-role"
            onClick={handleToggleRoleClick}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all active:scale-95 shadow-xs ${
              currentRole === 'artisan'
                ? 'bg-[#FDF1EC] border-[#9C3D25] text-[#9C3D25]'
                : 'bg-[#E2ECE6] border-[#2D5A43] text-[#2D5A43]'
            }`}
            title={t('common.switch')}
            aria-label={t('common.switch')}
          >
            {currentRole === 'artisan' ? (
              <>
                <span className="text-xs">🎨</span>
                <span className="text-[11px] whitespace-nowrap">{t('common.artisan')}</span>
                <ArrowLeftRight className="w-3 h-3 opacity-70" />
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="text-[11px] whitespace-nowrap">{t('common.buyer')}</span>
                <ArrowLeftRight className="w-3 h-3 opacity-70" />
              </>
            )}
          </button>

          {/* Language Selector Button */}
          <button
            id="btn-header-select-language"
            onClick={onOpenLanguageSelector}
            className="flex items-center gap-1 bg-[#FFFFFF] border border-[#E3D5C5] hover:border-[#8A726C] text-[#201A18] px-2.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-xs"
            title={t('common.changeLanguage')}
            aria-label={t('common.changeLanguage')}
          >
            <Globe className="w-3.5 h-3.5 text-[#9C3D25]" />
            <span className="text-[11px] whitespace-nowrap">{currentLangObj.nativeName}</span>
          </button>

          {/* Screen Audio Guide Listen Button */}
          {onListenGuide && (
            <button
              id="btn-header-listen-guide"
              onClick={onListenGuide}
              className="w-8 h-8 rounded-full bg-[#E5A93C] hover:bg-[#d99d30] active:scale-95 text-[#201A18] flex items-center justify-center border border-[#D97706] shadow-xs transition-transform"
              title={t('common.listen')}
              aria-label={t('common.listen')}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}

          {/* User Account / Login Button */}
          {onOpenAuthModal && (
            <button
              id="btn-header-auth"
              onClick={onOpenAuthModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all active:scale-95 shadow-xs ${
                currentUser
                  ? 'bg-white border-[#2D5A43] text-[#2D5A43]'
                  : 'bg-[#9C3D25] text-white border-[#802913] hover:bg-[#802913]'
              }`}
              title={currentUser ? currentUser.name : t('common.login')}
              aria-label={currentUser ? currentUser.name : t('common.login')}
            >
              {currentUser ? (
                <>
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-4 h-4 rounded-full object-cover border border-[#2D5A43]"
                  />
                  <span className="text-[11px] max-w-[70px] truncate hidden xs:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43]" />
                </>
              ) : (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="text-[11px] whitespace-nowrap">{t('common.login')}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
