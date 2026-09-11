/**
 * Text-to-Speech (TTS) Service for KalaSetu
 * Speaks with native OS voices when available, and automatically falls back to
 * Google Translate Cloud TTS for regional Indian languages (Telugu, Tamil, Odia, Marathi, etc.)
 */

type TTSMethod =
  | { type: 'native'; voice: SpeechSynthesisVoice }
  | { type: 'cloud' };

// Cache successful method per language to avoid re-checking every call
const methodCache: Record<string, TTSMethod> = {};
let hasLoggedVoices = false;
let currentAudioElement: HTMLAudioElement | null = null;

export function mapLanguageToBcp47(language: string): string {
  switch (language) {
    case 'te':
    case 'te-IN':
      return 'te-IN';
    case 'ta':
    case 'ta-IN':
      return 'ta-IN';
    case 'or':
    case 'or-IN':
      return 'or-IN';
    case 'mr':
    case 'mr-IN':
      return 'mr-IN';
    case 'bn':
    case 'bn-IN':
      return 'bn-IN';
    case 'en':
    case 'en-IN':
    case 'en-US':
      return 'en-IN';
    case 'gondi':
    case 'lambadi':
    case 'hi':
    case 'hi-IN':
    default:
      return 'hi-IN';
  }
}

export function checkAndLogVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0 && !hasLoggedVoices) {
    hasLoggedVoices = true;
    const voiceLangs = Array.from(new Set(voices.map((v) => v.lang))).join(', ');
    console.log(`[TTS] Available voices: ${voiceLangs}`);
  }
}

// Initial voice scan & dynamic voice update listener
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  checkAndLogVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    checkAndLogVoices();
    // Invalidate method cache so newly loaded native voices take effect
    for (const key of Object.keys(methodCache)) {
      delete methodCache[key];
    }
  };
}

/**
 * Checks if the user's OS/browser has an installed native voice for this language
 */
export function hasNativeVoice(language: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  const code = mapLanguageToBcp47(language).toLowerCase();
  const voices = window.speechSynthesis.getVoices();
  return voices.some(
    (v) =>
      v.lang.toLowerCase() === code ||
      v.lang.toLowerCase().replace('_', '-') === code
  );
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }

  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudioElement = null;
  }
}

function playCloudTTS(text: string, code: string): void {
  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${code}&client=tw-ob&q=${encodeURIComponent(
      text
    )}`;

    const audio = new Audio();
    // Handle CORS by adding referrerpolicy="no-referrer"
    audio.setAttribute('referrerpolicy', 'no-referrer');
    (audio as HTMLAudioElement & { referrerPolicy?: string }).referrerPolicy = 'no-referrer';
    audio.src = url;
    currentAudioElement = audio;

    // Retry with language prefix if the full BCP-47 tag isn't recognized by translate endpoint
    audio.onerror = () => {
      const shortCode = code.split('-')[0];
      if (shortCode !== code) {
        const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${shortCode}&client=tw-ob&q=${encodeURIComponent(
          text
        )}`;
        const fallbackAudio = new Audio();
        fallbackAudio.setAttribute('referrerpolicy', 'no-referrer');
        (fallbackAudio as HTMLAudioElement & { referrerPolicy?: string }).referrerPolicy = 'no-referrer';
        fallbackAudio.src = fallbackUrl;
        currentAudioElement = fallbackAudio;
        fallbackAudio.play().catch(() => {});
      }
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn(`[TTS] Cloud audio play notice:`, err);
      });
    }
  } catch (err) {
    console.warn(`[TTS] Cloud audio playback error:`, err);
  }
}

/**
 * Speaks text in the specified regional language.
 * 1. Tries native SpeechSynthesis first (if installed voice exists)
 * 2. If no native voice exists, uses Google Translate Cloud TTS fallback
 * 3. Caches successful method per language to avoid re-checking every call
 */
export async function speak(text: string, language: string): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  if (!text || !text.trim()) {
    return;
  }

  stopSpeaking();
  checkAndLogVoices();

  const code = mapLanguageToBcp47(language);

  // 5. Cache check: use cached successful method per language to avoid re-checking
  const cached = methodCache[code];
  if (cached) {
    if (cached.type === 'native' && 'speechSynthesis' in window) {
      console.log(`[TTS] Native voice for ${code}: ${cached.voice.name}`);
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = code;
      utter.rate = 0.9;
      utter.pitch = 1.0;
      utter.voice = cached.voice;
      window.speechSynthesis.speak(utter);
      return;
    }
    if (cached.type === 'cloud') {
      console.log(`[TTS] Cloud TTS fallback for ${code}`);
      playCloudTTS(text, code);
      return;
    }
  }

  // 2. Try native SpeechSynthesis first:
  if ('speechSynthesis' in window) {
    const voices = window.speechSynthesis.getVoices();
    const targetCode = code.toLowerCase();
    const nativeVoice = voices.find(
      (v) =>
        v.lang === code ||
        v.lang.toLowerCase() === targetCode ||
        v.lang.toLowerCase().replace('_', '-') === targetCode
    );

    if (nativeVoice) {
      methodCache[code] = { type: 'native', voice: nativeVoice };
      // 4. Log path taken
      console.log(`[TTS] Native voice for ${code}: ${nativeVoice.name}`);
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = code;
      utter.rate = 0.9;
      utter.pitch = 1.0;
      utter.voice = nativeVoice;
      window.speechSynthesis.speak(utter);
      return;
    }
  }

  // 3. If no native voice exists:
  methodCache[code] = { type: 'cloud' };
  // 4. Log path taken
  console.log(`[TTS] Cloud TTS fallback for ${code}`);
  playCloudTTS(text, code);
}
