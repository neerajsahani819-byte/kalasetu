/**
 * Audio Service for KalaSetu:
 * - Speech synthesis for zero-literacy audio prompts
 * - Authentic warm acoustic feedback chimes (Web Audio API)
 * - Microphone recording with real/simulated waveform
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle earthen chime for audio confirmation
export function playEarthenChime(type: 'welcome' | 'record_start' | 'record_stop' | 'success' | 'alert') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);

    if (type === 'welcome') {
      // Warm pentatonic arpeggio (C4 - E4 - G4 - A4)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(261.63, now);
      osc.frequency.exponentialRampToValueAtTime(329.63, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(392.0, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(440.0, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
    } else if (type === 'record_start') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.exponentialRampToValueAtTime(494, now + 0.15);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'record_stop') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(494, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.15);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.setValueAtTime(240, now + 0.15);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (e) {
    console.warn('Audio feedback not available', e);
  }
}

import { speak, stopSpeaking as ttsStopSpeaking } from '../services/ttsService';

// Speak aloud using TTS Service with earthen chime
export function speakAloud(
  text: string,
  options?: {
    lang?: string;
    onStart?: () => void;
    onEnd?: () => void;
  }
): boolean {
  if (typeof window === 'undefined') return false;

  playEarthenChime('welcome');
  let language = options?.lang;
  if (!language) {
    try {
      language = localStorage.getItem('kalasetu_language') || 'en';
    } catch {
      language = 'en';
    }
  }
  speak(text, language);
  options?.onStart?.();
  return true;
}

export function stopSpeaking() {
  ttsStopSpeaking();
}
