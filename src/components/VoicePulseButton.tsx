import React, { useEffect, useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { playEarthenChime } from '../utils/audioService';
import { useLanguage } from '../i18n/LanguageContext';

interface VoicePulseButtonProps {
  id?: string;
  isRecording: boolean;
  onToggleRecord?: () => void;
  onClick?: () => void;
  size?: 'normal' | 'large' | 'lg' | 'sm' | 'md';
  label?: string;
  sublabel?: string;
  showTimer?: boolean;
  pulseColor?: string;
}

export const VoicePulseButton: React.FC<VoicePulseButtonProps> = ({
  id = 'btn-master-voice-mic',
  isRecording,
  onToggleRecord,
  onClick,
  size = 'large',
  showTimer = true,
}) => {
  const { t } = useLanguage();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      setElapsedSeconds(0);
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleClick = () => {
    if (!isRecording) {
      playEarthenChime('record_start');
    } else {
      playEarthenChime('record_stop');
    }
    if (typeof onToggleRecord === 'function') {
      onToggleRecord();
    } else if (typeof onClick === 'function') {
      onClick();
    }
  };

  const diameter =
    size === 'large' || size === 'lg' ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-16 h-16';

  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center">
      <div className="relative flex items-center justify-center p-3">
        {/* Radiating concentric pulse rings when active */}
        {isRecording && (
          <>
            <span className="absolute inset-0 rounded-full bg-[#C2593F]/25 animate-ping duration-1000" />
            <span className="absolute -inset-2 rounded-full border-2 border-[#E5A93C] animate-pulse opacity-75" />
            <span className="absolute -inset-4 rounded-full bg-[#C2593F]/10 animate-pulse duration-700" />
          </>
        )}

        <button
          id={id}
          type="button"
          onClick={handleClick}
          aria-label={isRecording ? t('common.close') : t('common.listen')}
          className={`${diameter} rounded-full flex flex-col items-center justify-center transition-all duration-300 relative z-10 active:scale-95 shadow-lg ${
            isRecording
              ? 'bg-[#9C3D25] text-white ring-4 ring-[#E5A93C] shadow-[#9C3D25]/40'
              : 'bg-[#C2593F] text-white hover:bg-[#9C3D25] ring-4 ring-[#F4EBE1] hover:ring-[#E3D5C5] shadow-[#C2593F]/35'
          }`}
        >
          {isRecording ? (
            <Square className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white animate-pulse" />
          ) : (
            <Mic className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
          )}

          <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5 text-white/95">
            {isRecording ? t('common.cancel') : t('common.listen')}
          </span>
        </button>
      </div>

      {isRecording && showTimer && (
        <div className="flex items-center gap-2 bg-[#F5DDD6] border border-[#C2593F]/30 text-[#9C3D25] px-3 py-1 rounded-full text-xs font-bold tracking-wide animate-pulse">
          <span className="w-2 h-2 rounded-full bg-[#9C3D25] animate-ping" />
          <span>
            {Math.floor(elapsedSeconds / 60)}:
            {elapsedSeconds % 60 < 10 ? `0${elapsedSeconds % 60}` : elapsedSeconds % 60} {t('voice.listening')}
          </span>
        </div>
      )}
    </div>
  );
};
