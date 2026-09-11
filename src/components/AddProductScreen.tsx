import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Volume2,
  Camera,
  RotateCw,
  Trash2,
  Play,
  Pause,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Upload,
  CheckCircle2,
  Clock,
  Palette,
  Leaf,
} from 'lucide-react';
import { KalaSetuLogo } from './KalaSetuLogo';
import { VoicePulseButton } from './VoicePulseButton';
import { compressAndResizeImage, formatBytes, CompressionResult } from '../utils/imageCompressor';
import { speakAloud } from '../utils/audioService';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';
import { analyzeProduct } from '../services/geminiService';
import { startListening } from '../services/speechService';

interface AddProductScreenProps {
  onBack: () => void;
  onProceedToPreview: (productData: {
    photoUrl: string;
    title: string;
    category: string;
    description: string;
    hours: number;
    materials: string;
    price: number;
    voiceTranscript?: string;
    shippingMode?: 'ship' | 'pickup' | 'both';
  }) => void;
  language?: string;
}

export const AddProductScreen: React.FC<AddProductScreenProps> = ({
  onBack,
  onProceedToPreview,
  language: propLanguage,
}) => {
  const { language: currentLang, t } = useLanguage();
  const activeLang = propLanguage || currentLang;
  const speechLang = getSpeechLangCode(activeLang);

  const defaultPhoto1 =
    'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80';
  const [photo1, setPhoto1] = useState<string>(defaultPhoto1);
  const [photo2, setPhoto2] = useState<string | null>(null);

  const [shippingMode, setShippingMode] = useState<'ship' | 'pickup' | 'both'>('both');

  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionStatus, setCompressionStatus] = useState('');
  const [compressionStats, setCompressionStats] = useState<CompressionResult | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [hasRecordedVoice, setHasRecordedVoice] = useState(true);
  const [recordSeconds, setRecordSeconds] = useState(24);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>(
    'Handcrafted floral clay surahi created with natural clay on traditional potter wheel. 14 craft hours.'
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);

  const [speechStatus, setSpeechStatus] = useState<string>('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const stopListeningRef = useRef<(() => void) | null>(null);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (stopListeningRef.current) {
        stopListeningRef.current();
      }
    };
  }, []);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const handleListenGuide = () => {
    speakAloud(`${t('screens.addProduct.title')}. ${t('screens.addProduct.photosHeading')}. ${t('screens.addProduct.voiceGuideTitle')}`, {
      lang: speechLang,
    });
  };

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetSlot: 1 | 2
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setCompressionProgress(15);
      setCompressionStatus(t('screens.addProduct.compressing'));

      const result = await compressAndResizeImage(file, (progress, status) => {
        setCompressionProgress(progress);
        setCompressionStatus(status);
      });

      setCompressionStats(result);

      if (targetSlot === 1) {
        setPhoto1(result.dataUrl);
      } else {
        setPhoto2(result.dataUrl);
      }

      speakAloud(t('screens.addProduct.photoOptimized'), { lang: speechLang });
    } catch (err) {
      console.error('Image compression error:', err);
    } finally {
      setTimeout(() => {
        setIsCompressing(false);
      }, 700);
    }
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setSpeechError(null);
      setSpeechStatus(`🎤 ${t('voice.listening')}`);
      setAiErrorMessage(null);

      const stopFn = startListening(
        activeLang,
        (interimText) => {
          setVoiceTranscript(interimText);
        },
        (result) => {
          setVoiceTranscript(result.text);
          setSpeechStatus(`✅ ${t('voice.heard')}: ${result.text.slice(0, 40)}`);
          setHasRecordedVoice(true);
        },
        (errorMsg) => {
          setSpeechError(errorMsg);
          setSpeechStatus(`⚠️ ${errorMsg}`);
          setIsRecording(false);
        }
      );
      stopListeningRef.current = stopFn;
      speakAloud(t('screens.addProduct.voiceGuideTitle'), { lang: speechLang });
    } else {
      setIsRecording(false);
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      if (voiceTranscript.trim()) {
        setSpeechStatus(`✅ ${t('voice.heard')}: ${voiceTranscript.trim().slice(0, 40)}`);
        setHasRecordedVoice(true);
      } else {
        setSpeechStatus('');
      }
      setRecordSeconds(24);
      speakAloud(t('voice.heard'), { lang: speechLang });
    }
  };

  const handlePlayVoice = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakAloud(voiceTranscript, {
        lang: speechLang,
        onEnd: () => setIsPlayingAudio(false),
      });
    }
  };

  const handleDeleteVoice = () => {
    setHasRecordedVoice(false);
    setVoiceTranscript('');
    setSpeechStatus('');
    speakAloud(t('screens.addProduct.voiceGuideTitle'), { lang: speechLang });
  };

  const getImageBase64 = async (url: string): Promise<string> => {
    if (url.startsWith('data:')) {
      return url.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    }
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = (reader.result as string) || '';
        resolve(res.replace(/^data:image\/[a-zA-Z]+;base64,/, ''));
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleProceed = async () => {
    setAiErrorMessage(null);
    setIsGeneratingAi(true);

    try {
      const imageBase64 = await getImageBase64(photo1);
      console.log('[Gemini] Requesting AI product analysis with voice transcript...');
      const result = await analyzeProduct(imageBase64, voiceTranscript, activeLang);

      onProceedToPreview({
        photoUrl: photo1,
        title: result.title,
        category: result.category,
        description: result.description,
        hours: Number(result.laborHours) || 14,
        materials: Array.isArray(result.materials)
          ? result.materials.join(', ')
          : result.materials || 'Natural materials',
        price: Number(result.suggestedPrice) || 850,
        voiceTranscript: voiceTranscript.trim(),
        shippingMode,
      });
    } catch (error: any) {
      console.error('[Gemini] Error:', error);
      const message = error?.message || String(error) || t('errors.genericError');
      setAiErrorMessage(message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#201A18] pb-16">
      <input
        ref={fileInputRef1}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handlePhotoUpload(e, 1)}
      />
      <input
        ref={fileInputRef2}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handlePhotoUpload(e, 2)}
      />

      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-[#FAF6F0]/95 backdrop-blur-sm border-b border-[#E3D5C5] px-4 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              id="btn-add-product-back"
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-[#F4EBE1] hover:bg-[#ebdccf] active:scale-95 flex items-center justify-center text-[#201A18] border border-[#E3D5C5] transition-transform cursor-pointer"
              aria-label={t('common.back')}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <KalaSetuLogo size={32} showText={false} />
            <span className="font-display font-bold text-lg text-[#201A18]">
              {t('screens.addProduct.title')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-add-product-audio-guide"
              onClick={handleListenGuide}
              className="w-10 h-10 rounded-full bg-[#F4EBE1] hover:bg-[#ebdccf] text-[#9C3D25] border border-[#E3D5C5] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
              title={t('common.listen')}
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#9C3D25] ring-1 ring-white">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                alt="Artisan Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* Step Indicator Banner */}
        <section
          aria-label="Step Info"
          className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-3.5 flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#9C3D25] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              1
            </div>
            <div>
              <div className="font-display font-bold text-sm text-[#201A18]">
                {t('screens.addProduct.photosHeading')}
              </div>
              <div className="text-xs text-[#5E534D]">
                {t('screens.addProduct.voiceGuideTitle')}
              </div>
            </div>
          </div>

          <button
            id="btn-step-guide-audio"
            onClick={handleListenGuide}
            className="flex items-center gap-1 bg-[#F4EBE1] hover:bg-[#ebdccf] text-[#9C3D25] px-3 py-1.5 rounded-full border border-[#E3D5C5] text-xs font-bold transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t('common.listen')}</span>
          </button>
        </section>

        {/* Photos Section */}
        <section aria-label="Craft Photos" className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#9C3D25]" />
              <h2 className="font-display font-bold text-base text-[#201A18]">
                {t('screens.addProduct.photosHeading')}
              </h2>
            </div>
            <span className="text-xs font-bold text-[#2D5A43] bg-[#E2ECE6] px-2.5 py-0.5 rounded-full">
              {photo2 ? '2 / 2' : '1 / 2'}
            </span>
          </div>

          {/* Compression Progress Bar */}
          {isCompressing && (
            <div className="bg-[#FFFFFF] border border-[#E5A93C] rounded-xl p-3 space-y-2 animate-pulse">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#9C3D25] flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5 animate-bounce" />
                  {compressionStatus}
                </span>
                <span className="font-bold text-[#2D5A43]">{compressionProgress}%</span>
              </div>
              <div className="w-full h-2 bg-[#F4EBE1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2D5A43] transition-all duration-300 rounded-full"
                  style={{ width: `${compressionProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Compression Stats Badge */}
          {compressionStats && !isCompressing && (
            <div className="bg-[#E2ECE6] border border-[#2D5A43]/30 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] text-[#1E3F2F]">
              <span className="font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A43]" />
                {t('screens.addProduct.photoOptimized')}: {formatBytes(compressionStats.compressedSizeBytes)}
              </span>
              <span className="font-bold">
                {compressionStats.compressionRatioPercent}% saved
              </span>
            </div>
          )}

          {/* 2 Photo Slots */}
          <div className="grid grid-cols-2 gap-3">
            {/* Slot 1: Primary Photo */}
            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#9C3D25] shadow-xs group bg-[#F4EBE1]">
              <img
                src={photo1}
                alt="Main Craft View"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#2D5A43] text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <CheckCircle2 className="w-3 h-3" />
                <span>{t('screens.addProduct.mainPhoto')}</span>
              </div>

              <button
                id="btn-replace-photo-1"
                type="button"
                onClick={() => fileInputRef1.current?.click()}
                className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-[#FFFFFF]/90 hover:bg-white text-[#201A18] shadow-md flex items-center justify-center transition-transform active:scale-95 border border-[#E3D5C5] cursor-pointer"
                title={t('common.edit')}
                aria-label={t('common.edit')}
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Slot 2: Secondary Photo */}
            {photo2 ? (
              <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-[#2D5A43] shadow-xs group bg-[#F4EBE1]">
                <img
                  src={photo2}
                  alt="Secondary Craft View"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 bg-[#2D5A43] text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{t('screens.addProduct.secondPhoto')}</span>
                </div>
                <button
                  id="btn-replace-photo-2"
                  type="button"
                  onClick={() => fileInputRef2.current?.click()}
                  className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-[#FFFFFF]/90 hover:bg-white text-[#201A18] shadow-md flex items-center justify-center transition-transform active:scale-95 border border-[#E3D5C5] cursor-pointer"
                  title={t('common.edit')}
                  aria-label={t('common.edit')}
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-add-photo-2"
                type="button"
                onClick={() => fileInputRef2.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-[#ddc0ba] bg-[#FDF1EC]/60 hover:bg-[#FDF1EC] flex flex-col items-center justify-center p-3 text-center transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#E3D5C5] text-[#9C3D25] flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-xs">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="font-bold text-xs text-[#201A18]">{t('screens.addProduct.secondPhoto')}</div>
                <div className="mt-2 text-xs font-bold text-[#9C3D25] border border-[#9C3D25]/30 bg-white px-2.5 py-0.5 rounded-lg">
                  + {t('screens.addProduct.camera')}
                </div>
              </button>
            )}
          </div>
        </section>

        {/* Voice Guide Section */}
        <section aria-label="Voice Guide" className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#F4EBE1] text-[#9C3D25] flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <h2 className="font-display font-bold text-sm text-[#201A18]">
                {t('screens.addProduct.voiceGuideTitle')}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#FAF6F0] border border-[#E3D5C5] rounded-xl p-2 text-center space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#F5DDD6] text-[#9C3D25] mx-auto flex items-center justify-center">
                <Palette className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-[#201A18]">{t('screens.addProduct.q1')}</div>
            </div>

            <div className="bg-[#FAF6F0] border border-[#E3D5C5] rounded-xl p-2 text-center space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#FEF3C7] text-[#7B5500] mx-auto flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-[#201A18]">{t('screens.addProduct.q2')}</div>
            </div>

            <div className="bg-[#FAF6F0] border border-[#E3D5C5] rounded-xl p-2 text-center space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#E2ECE6] text-[#2D5A43] mx-auto flex items-center justify-center">
                <Leaf className="w-3.5 h-3.5" />
              </div>
              <div className="text-xs font-bold text-[#201A18]">{t('screens.addProduct.q3')}</div>
            </div>
          </div>
        </section>

        {/* Voice Input Section with Master Mic & Waveform */}
        <section
          aria-label="Voice details input"
          className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-5 shadow-xs text-center space-y-3"
        >
          <div>
            <h2 className="font-display font-bold text-base text-[#201A18]">
              {t('screens.addProduct.voiceGuideTitle')}
            </h2>
            <p className="text-xs text-[#5E534D] mt-0.5">
              {t('voice.speakNow')}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <VoicePulseButton
              id="btn-record-product-voice"
              isRecording={isRecording}
              onToggleRecord={handleToggleRecord}
              onClick={handleToggleRecord}
              size="lg"
            />

            {speechStatus && (
              <div
                id="voice-speech-status-indicator"
                className={`text-xs font-semibold px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 transition-all shadow-xs ${
                  isRecording
                    ? 'bg-[#FDF1EC] text-[#9C3D25] border border-[#9C3D25]/40 animate-pulse'
                    : speechStatus.startsWith('⚠️')
                    ? 'bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/40'
                    : 'bg-[#E2ECE6] text-[#2D5A43] border border-[#2D5A43]/40'
                }`}
              >
                <span>{speechStatus}</span>
              </div>
            )}
          </div>

          {speechError && (
            <div
              id="speech-unsupported-fallback-alert"
              className="bg-[#FEF3C7] border border-[#F59E0B]/50 rounded-xl p-3 text-left flex items-start gap-2.5 text-xs text-[#92400E]"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#D97706]" />
              <div>
                <div className="font-bold">{t('errors.genericError')}</div>
                <div className="mt-0.5">{speechError}</div>
              </div>
            </div>
          )}

          {/* Always Visible Text Description Fallback (Section 8) */}
          <div className="w-full text-left space-y-1.5">
            <label
              htmlFor="textarea-voice-transcript"
              className="block text-xs font-bold text-[#201A18] flex items-center justify-between"
            >
              <span>{voiceTranscript ? t('screens.addProduct.heard') : 'Or type your description:'}</span>
              {voiceTranscript && (
                <span className="text-[10px] text-[#2D5A43] font-semibold bg-[#E2ECE6] px-2 py-0.5 rounded-full">
                  Editable text
                </span>
              )}
            </label>
            <textarea
              id="textarea-voice-transcript"
              value={voiceTranscript}
              placeholder="Or type your description: mention craft type, materials used, making time in hours..."
              onChange={(e) => {
                setVoiceTranscript(e.target.value);
                if (e.target.value.trim()) {
                  setHasRecordedVoice(true);
                }
              }}
              rows={3}
              className="w-full text-xs p-3 rounded-xl bg-white border-2 border-[#E3D5C5] focus:outline-none focus:border-[#2D5A43] text-[#201A18] leading-relaxed resize-y placeholder:text-[#8A726C]"
            />
          </div>

          <div className="bg-[#F8EBE6] border border-[#ddc0ba] rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-center gap-1.5 h-8">
              {[8, 18, 28, 14, 24, 30, 20, 16, 26, 12, 22, 10].map((height, i) => (
                <span
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isRecording
                      ? 'bg-[#9C3D25] animate-pulse'
                      : i % 2 === 0
                      ? 'bg-[#9C3D25]'
                      : 'bg-[#2D5A43]'
                  }`}
                  style={{
                    height: isRecording ? `${Math.max(6, (height + (i % 3) * 5) % 32)}px` : `${height}px`,
                  }}
                />
              ))}
            </div>

            {hasRecordedVoice && (
              <div className="bg-[#FFFFFF] rounded-xl p-2.5 border border-[#E3D5C5] flex items-center justify-between gap-3 shadow-xs">
                <button
                  id="btn-play-voice-preview"
                  type="button"
                  onClick={handlePlayVoice}
                  className="flex items-center gap-2 text-left flex-1 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2D5A43] text-white flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform">
                    {isPlayingAudio ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#201A18] flex items-center gap-1">
                      <span>0:{recordSeconds} {t('voice.heard')}</span>
                    </div>
                  </div>
                </button>

                <button
                  id="btn-delete-voice-record"
                  type="button"
                  onClick={handleDeleteVoice}
                  className="w-8 h-8 rounded-lg text-[#8A726C] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center justify-center transition-colors cursor-pointer"
                  title={t('screens.addProduct.rerecord')}
                  aria-label={t('screens.addProduct.rerecord')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Shipping Eligibility Options (Part 1) */}
        <section className="bg-white rounded-2xl p-4 border border-[#E3D5C5] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#201A18] flex items-center gap-1.5">
              <span>📦</span>
              <span>{t('screens.addProduct.shippingOptions') || 'Shipping Options'}</span>
            </label>
            <span className="text-[10px] text-[#2D5A43] font-bold bg-[#E2ECE6] px-2 py-0.5 rounded-md">
              {shippingMode === 'both' ? '📦 Ships or 📍 Pickup' : shippingMode === 'ship' ? '📦 Ships to you' : '📍 Pickup only'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'ship', label: t('checkout.canShip') || 'Can ship', icon: '📦' },
              { id: 'pickup', label: t('checkout.pickupOnly') || 'Pickup only', icon: '📍' },
              { id: 'both', label: t('checkout.bothOptions') || 'Both', icon: '✨' },
            ].map((opt) => (
              <button
                key={opt.id}
                id={`btn-shipping-${opt.id}`}
                type="button"
                onClick={() => setShippingMode(opt.id as 'ship' | 'pickup' | 'both')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                  shippingMode === opt.id
                    ? 'bg-[#2D5A43] text-white border-[#2D5A43] shadow-xs'
                    : 'bg-[#FAF6F0] text-[#201A18] border-[#E3D5C5] hover:border-[#2D5A43]'
                }`}
              >
                <span className="text-base">{opt.icon}</span>
                <span className="whitespace-nowrap text-[11px]">{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Gemini Error Alert */}
        {aiErrorMessage && (
          <div
            id="gemini-error-alert"
            className="bg-[#FFF1F0] border-2 border-[#ba1a1a] rounded-2xl p-4 space-y-3 shadow-md"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-[#ba1a1a]">
                  {t('errors.genericError')}
                </h3>
                <p className="text-xs text-[#201A18] font-mono break-words bg-white/80 p-2.5 rounded-lg mt-1 border border-[#ba1a1a]/20">
                  {aiErrorMessage}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                id="btn-retry-gemini"
                type="button"
                onClick={handleProceed}
                className="flex-1 h-11 bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{t('common.retry')}</span>
              </button>

              <button
                type="button"
                onClick={() => setAiErrorMessage(null)}
                className="px-4 h-11 bg-white border border-[#ba1a1a]/30 text-[#ba1a1a] rounded-xl text-xs font-bold hover:bg-[#FAF6F0] cursor-pointer"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="pt-2">
          <button
            id="btn-generate-ai-listing"
            onClick={handleProceed}
            disabled={isGeneratingAi}
            className={`w-full h-14 bg-[#2D5A43] hover:bg-[#1E3F2F] active:scale-[0.98] text-white rounded-2xl font-display font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isGeneratingAi ? 'opacity-80 cursor-wait' : ''
            }`}
          >
            <Sparkles className="w-5 h-5 text-[#E5A93C]" />
            <div className="text-center leading-tight">
              <span>{t('screens.addProduct.generate')}</span>
            </div>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>
        </div>

        {/* Loading Spinner */}
        {isGeneratingAi && (
          <div
            id="ai-generating-overlay"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="bg-[#FAF6F0] rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-[#E3D5C5] space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#E2ECE6] border-2 border-[#2D5A43] text-[#2D5A43] flex items-center justify-center mx-auto">
                <RotateCw className="w-8 h-8 animate-spin text-[#2D5A43]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#201A18]">
                  {t('screens.addProduct.generateSub')}
                </h3>
                <p className="text-xs text-[#5E534D] mt-1">
                  {t('common.loading')}
                </p>
              </div>
              <div className="w-full bg-[#E3D5C5] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#2D5A43] h-full rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
