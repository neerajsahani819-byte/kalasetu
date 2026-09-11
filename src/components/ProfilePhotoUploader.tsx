import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  X,
  Check,
} from 'lucide-react';
import { PRESET_AVATARS } from '../utils/authService';
import { UserRole } from '../types';
import { speakAloud } from '../utils/audioService';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';

interface ProfilePhotoUploaderProps {
  currentAvatar: string;
  onAvatarChange: (newAvatarUrl: string) => void;
  role?: UserRole;
  language?: string;
  size?: 'sm' | 'md' | 'lg';
  idPrefix?: string;
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  currentAvatar,
  onAvatarChange,
  role = 'artisan',
  size = 'md',
  idPrefix = 'profile-photo',
}) => {
  const { language, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPresets, setShowPresets] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const speechLang = getSpeechLangCode(language);

  // Filter preset avatars by role
  const relevantPresets = PRESET_AVATARS.filter(
    (p) => p.role === role || p.role === 'both'
  );

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }[size];

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError(t('errors.genericError'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(t('errors.networkError'));
      return;
    }

    setIsUploading(true);
    setUploadError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Compress/resize image in canvas to keep localStorage light and fast
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            onAvatarChange(optimizedDataUrl);
            setIsUploading(false);
            speakAloud(t('screens.profile.uploadPhoto'), { lang: speechLang });
          } else {
            onAvatarChange(result);
            setIsUploading(false);
          }
        };
        img.onerror = () => {
          onAvatarChange(result);
          setIsUploading(false);
        };
        img.src = result;
      }
    };
    reader.onerror = () => {
      setUploadError(t('errors.genericError'));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Avatar Display & Action Overlay */}
      <div className="flex items-center gap-4">
        <div
          id={`${idPrefix}-avatar-container`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative rounded-3xl overflow-hidden border-2 ${
            isDragging ? 'border-[#9C3D25] ring-4 ring-[#9C3D25]/20' : 'border-[#E3D5C5]'
          } bg-[#F4EBE1] flex-shrink-0 shadow-sm transition-all group`}
        >
          <img
            src={currentAvatar}
            alt="Profile Preview"
            className={`${sizeClasses} object-cover group-hover:scale-105 transition-transform duration-300`}
          />

          {/* Quick Camera Upload Trigger Overlay */}
          <button
            type="button"
            id={`${idPrefix}-btn-camera-trigger`}
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer p-1 text-center"
            title={t('screens.profile.changePhoto')}
          >
            <Camera className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold leading-tight">
              {t('screens.profile.uploadPhoto')}
            </span>
          </button>

          {/* Corner Upload Indicator Badge */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#9C3D25] text-white border-2 border-white shadow-xs flex items-center justify-center active:scale-95 transition-transform"
            title={t('screens.profile.uploadPhoto')}
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Buttons & Guidance */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              id={`${idPrefix}-btn-choose-file`}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 rounded-xl bg-[#9C3D25] hover:bg-[#802913] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>
                {isUploading
                  ? t('common.loading')
                  : t('screens.profile.uploadPhoto')}
              </span>
            </button>

            <button
              type="button"
              id={`${idPrefix}-btn-toggle-presets`}
              onClick={() => setShowPresets(!showPresets)}
              className="px-3 py-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#F4EBE1] text-[#7B5500] border border-[#E5A93C]/40 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>{showPresets ? t('common.close') : t('screens.profile.curatedAvatars')}</span>
            </button>
          </div>

          <p className="text-[11px] text-[#5E534D] leading-tight">
            {t('screens.profile.changePhoto')}
          </p>

          {uploadError && (
            <div className="text-[11px] text-red-600 font-semibold">{uploadError}</div>
          )}
        </div>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        id={`${idPrefix}-native-file-input`}
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Curated Preset Avatars Grid */}
      {showPresets && (
        <div
          id={`${idPrefix}-presets-drawer`}
          className="bg-[#FAF6F0] border border-[#E3D5C5] rounded-2xl p-3 space-y-2.5 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#201A18] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#9C3D25]" />
              <span>{t('screens.profile.curatedAvatars')}</span>
            </span>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="w-6 h-6 rounded-full bg-white text-[#6B5E57] flex items-center justify-center text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {relevantPresets.map((preset) => {
              const isSelected = currentAvatar === preset.url;
              return (
                <button
                  type="button"
                  key={preset.id}
                  id={`${idPrefix}-preset-${preset.id}`}
                  onClick={() => {
                    onAvatarChange(preset.url);
                    setShowPresets(false);
                    speakAloud(`${preset.label}`, { lang: speechLang });
                  }}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${
                    isSelected
                      ? 'border-[#9C3D25] ring-2 ring-[#9C3D25]/30 scale-102'
                      : 'border-[#E3D5C5] hover:border-[#9C3D25]/60'
                  }`}
                  title={preset.label}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#9C3D25]/30 flex items-center justify-center text-white">
                      <div className="w-5 h-5 rounded-full bg-[#9C3D25] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] truncate px-1 py-0.5 text-center">
                    {preset.label.split('•')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
