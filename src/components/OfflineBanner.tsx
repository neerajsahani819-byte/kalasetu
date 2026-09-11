import React, { useState } from 'react';
import { WifiOff, Volume2, X, RefreshCw, Database, CloudCheck } from 'lucide-react';
import { speakAloud } from '../utils/audioService';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';

interface OfflineBannerProps {
  isOffline: boolean;
  onToggleOffline?: () => void;
  language?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  onToggleOffline,
  language: propLanguage,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const { language: currentLang, t } = useLanguage();
  const activeLang = propLanguage || currentLang;
  const speechLang = getSpeechLangCode(activeLang);

  if (dismissed) {
    return null;
  }

  const handleListen = () => {
    const textToSpeak = isOffline
      ? t('common.offlineNotice')
      : `${t('common.onlineNotice')}`;
    speakAloud(textToSpeak, {
      lang: speechLang,
    });
  };

  // State 1: OFFLINE MODE
  if (isOffline) {
    return (
      <aside
        id="offline-banner"
        aria-label={t('common.offline')}
        className="sticky top-0 z-40 bg-[#FEF3C7] border-b border-[#E5A93C]/40 px-3.5 py-2 shadow-xs text-[#201A18] transition-all"
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#E5A93C]/25 text-[#9C3D25] flex items-center justify-center flex-shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#9C3D25] leading-tight flex items-center gap-1.5 flex-wrap">
                <span>{t('common.offline')}</span>
              </div>
              <div className="text-[11px] text-[#6B605B] truncate flex items-center gap-1.5 mt-0.5">
                <Database className="w-3 h-3 text-[#9C3D25]" />
                <span>{t('common.offlineNotice')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              id="btn-offline-audio"
              onClick={handleListen}
              aria-label={t('common.listen')}
              className="w-7 h-7 rounded-full bg-[#FFFFFF] border border-[#E5A93C]/50 text-[#7B5500] flex items-center justify-center hover:bg-[#FAF6F0] active:scale-95 transition-transform"
              title={t('common.listen')}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            {onToggleOffline && (
              <button
                id="btn-toggle-offline-status"
                onClick={onToggleOffline}
                aria-label={t('common.retry')}
                className="text-[10px] font-semibold text-[#2D5A43] bg-[#E2ECE6] px-2 py-1 rounded-full hover:bg-[#c9e1d2] transition-colors flex items-center gap-1"
                title={t('common.retry')}
              >
                <RefreshCw className="w-3 h-3" />
                <span>{t('common.retry')}</span>
              </button>
            )}

            <button
              id="btn-dismiss-offline-banner"
              onClick={() => setDismissed(true)}
              aria-label={t('common.close')}
              className="w-6 h-6 rounded-full text-[#8A726C] hover:text-[#201A18] hover:bg-[#E5A93C]/20 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // State 2: ONLINE MODE
  return (
    <aside
      id="firestore-sync-banner"
      aria-label={t('common.online')}
      className="sticky top-0 z-40 bg-[#E8F5E9] border-b border-[#2D5A43]/20 px-3.5 py-1.5 shadow-xs text-[#201A18] transition-all"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-full bg-[#2D5A43]/15 text-[#2D5A43] flex items-center justify-center flex-shrink-0 relative">
            <CloudCheck className="w-3.5 h-3.5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#2D5A43] animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-[#1E3F2F] leading-tight flex items-center gap-1.5 truncate">
              <span>{t('common.online')}</span>
            </div>
            <div className="text-[10px] text-[#3e6851] truncate flex items-center gap-1">
              <Database className="w-2.5 h-2.5 text-[#2D5A43]" />
              <span>{t('common.onlineNotice')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            id="btn-firestore-sync-audio"
            onClick={handleListen}
            aria-label={t('common.listen')}
            className="w-6 h-6 rounded-full bg-white border border-[#2D5A43]/20 text-[#2D5A43] flex items-center justify-center hover:bg-[#FAF6F0] active:scale-95 transition-transform"
            title={t('common.listen')}
          >
            <Volume2 className="w-3 h-3" />
          </button>

          <button
            id="btn-dismiss-firestore-banner"
            onClick={() => setDismissed(true)}
            aria-label={t('common.close')}
            className="w-6 h-6 rounded-full text-[#5E534D] hover:text-[#201A18] hover:bg-[#2D5A43]/10 flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
