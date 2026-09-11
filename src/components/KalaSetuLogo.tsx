import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const KalaSetuLogo: React.FC<LogoProps> = ({
  className = '',
  size = 40,
  showText = false,
}) => {
  const { t } = useLanguage();

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-full bg-[#C2593F] text-white shadow-sm flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-[78%] h-[78%]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular outer rim */}
          <circle cx="50" cy="50" r="46" stroke="#FAF6F0" strokeWidth="3" opacity="0.9" />
          <circle cx="50" cy="50" r="41" stroke="#E5A93C" strokeWidth="1.5" strokeDasharray="3 3" />
          
          {/* Artisan Hand reaching toward sunlight / bridge */}
          <path
            d="M32 74 C30 65, 33 55, 38 48 C40 45, 45 42, 52 46 C56 49, 58 53, 56 58 C53 66, 44 74, 38 78 Z"
            fill="#FAF6F0"
          />
          {/* Traditional sunburst & craft rays */}
          <circle cx="64" cy="42" r="10" fill="#E5A93C" />
          <path d="M64 24 L64 30" stroke="#FAF6F0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M78 30 L73 34" stroke="#FAF6F0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M84 42 L78 42" stroke="#FAF6F0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M78 54 L73 50" stroke="#FAF6F0" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M64 60 L64 54" stroke="#FAF6F0" strokeWidth="2.5" strokeLinecap="round" />
          {/* Terracotta craft bridge arc */}
          <path
            d="M20 78 Q50 62 80 78"
            stroke="#FAF6F0"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showText && (
        <div className="leading-tight">
          <div className="font-display font-bold text-[#9C3D25] text-lg tracking-tight flex items-center gap-1">
            {t('common.appName')}
          </div>
          <div className="text-[11px] text-[#6B605B] font-medium">{t('common.tagline')}</div>
        </div>
      )}
    </div>
  );
};
