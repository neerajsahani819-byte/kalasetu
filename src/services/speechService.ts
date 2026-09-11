/**
 * Speech Recognition Service for KalaSetu
 * Handles Web Speech API voice input across Indian regional languages.
 */

export interface SpeechResult {
  text: string;
  confidence: number;
}

export function mapLanguageToSpeechCode(language: string): string {
  switch (language) {
    case 'te':
      return 'te-IN';
    case 'ta':
      return 'ta-IN';
    case 'or':
      return 'or-IN';
    case 'mr':
      return 'mr-IN';
    case 'bn':
      return 'bn-IN';
    case 'en':
      return 'en-IN';
    case 'gondi':
    case 'lambadi':
    case 'hi':
    default:
      return 'hi-IN';
  }
}

export function startListening(
  language: string,
  onInterim: (text: string) => void,
  onFinal: (result: SpeechResult) => void,
  onError: (error: string) => void
): () => void {
  if (typeof window === 'undefined') {
    onError('Voice input is only available in browser environments.');
    return () => {};
  }

  const SpeechRecognitionClass =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    const errorMsg =
      'Voice input requires Chrome or Edge. Please use the text input field below.';
    console.log(`[Speech] Error: ${errorMsg}`);
    onError(errorMsg);
    return () => {};
  }

  const langCode = mapLanguageToSpeechCode(language);
  let isStopped = false;

  try {
    const recognition = new SpeechRecognitionClass();
    recognition.lang = langCode;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';
      let confidence = 0.95;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i];
        const transcript = item[0]?.transcript || '';
        if (item.isFinal) {
          finalText += transcript + ' ';
          if (item[0]?.confidence) {
            confidence = Math.round(item[0].confidence * 100) / 100;
          }
        } else {
          interimText += transcript + ' ';
        }
      }

      if (interimText.trim()) {
        console.log(`[Speech] Interim: ${interimText.trim()}`);
        onInterim(interimText.trim());
      }

      if (finalText.trim()) {
        console.log(`[Speech] Final: ${finalText.trim()}, confidence: ${confidence}`);
        onFinal({
          text: finalText.trim(),
          confidence,
        });
      }
    };

    recognition.onerror = (event: any) => {
      if (isStopped) return;
      const errorMsg = event.error || 'Speech recognition encountered an issue';
      console.log(`[Speech] Error: ${errorMsg}`);
      onError(errorMsg);
    };

    recognition.onend = () => {
      // If continuous listening ended unexpectedly while not explicitly stopped, do not throw
    };

    recognition.start();
    console.log(`[Speech] Started, lang: ${langCode}`);

    return () => {
      isStopped = true;
      try {
        recognition.stop();
      } catch {
        // ignore if already stopped
      }
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'Failed to initialize speech recognition';
    console.log(`[Speech] Error: ${errorMsg}`);
    onError(errorMsg);
    return () => {};
  }
}
