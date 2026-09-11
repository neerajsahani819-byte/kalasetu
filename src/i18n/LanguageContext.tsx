import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { translations, SupportedLang, APP_LANGUAGES, AppLanguageMeta, getSpeechLangCode } from './translations';
export { getSpeechLangCode };

export interface LanguageContextType {
  language: SupportedLang;
  setLanguage: (lang: SupportedLang | string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  supportedLanguages: AppLanguageMeta[];
}

const LANGUAGE_STORAGE_KEY = 'kalasetu_language';
const DEFAULT_LANGUAGE: SupportedLang = 'en';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to resolve nested dot-notation paths e.g. "screens.auth.loginTitle"
export function getNestedTranslation(
  obj: any,
  path: string
): string | undefined {
  if (!obj) return undefined;
  const parts = path.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr && typeof curr === 'object' && part in curr) {
      curr = curr[part];
    } else {
      return undefined;
    }
  }
  return typeof curr === 'string' ? curr : undefined;
}

// Global standalone translate function for utilities/TTS
export function translate(
  key: string,
  lang: string = DEFAULT_LANGUAGE,
  params?: Record<string, string | number>
): string {
  const targetLang = (translations as any)[lang] ? (lang as SupportedLang) : DEFAULT_LANGUAGE;
  if (!(translations as any)[lang] && lang !== DEFAULT_LANGUAGE) {
    console.warn(`[i18n] Language '${lang}' not found, using English`);
  }

  // 1. Try target language with direct key
  let text = getNestedTranslation((translations as any)[targetLang], key);

  // 1b. Try target language with alternative alias (screens.* or stripped screens.)
  if (text === undefined) {
    if (key.startsWith('screens.')) {
      text = getNestedTranslation((translations as any)[targetLang], key.replace(/^screens\./, ''));
    } else {
      text = getNestedTranslation((translations as any)[targetLang], `screens.${key}`);
    }
  }

  // 2. Fallback to English if missing in target language
  if (text === undefined) {
    if (targetLang !== 'en') {
      console.warn(`[i18n] Missing key '${key}' in ${targetLang}`);
    }
    text = getNestedTranslation((translations as any)['en'], key);
    if (text === undefined) {
      if (key.startsWith('screens.')) {
        text = getNestedTranslation((translations as any)['en'], key.replace(/^screens\./, ''));
      } else {
        text = getNestedTranslation((translations as any)['en'], `screens.${key}`);
      }
    }
  }

  // 3. Last resort fallback
  if (text === undefined) {
    console.warn(`[i18n] Missing key '${key}' in en`);
    return key.split('.').pop() || key;
  }

  // Parameter interpolation e.g. {name}, {count}, {km}, {amount}
  if (params) {
    Object.entries(params).forEach(([paramKey, paramVal]) => {
      text = text!.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    });
  }

  return text;
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLang>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && saved in translations) {
        return saved as SupportedLang;
      }
    } catch {
      // ignore
    }
    return DEFAULT_LANGUAGE;
  });

  // Set document lang attribute and persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = language;
      }
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = useCallback((newLang: SupportedLang | string) => {
    const validLang = (translations as any)[newLang] ? (newLang as SupportedLang) : DEFAULT_LANGUAGE;
    setLanguageState(validLang);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      return translate(key, language, params);
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        supportedLanguages: APP_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if component is used outside LanguageProvider
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      t: (key: string, params?: Record<string, string | number>) => translate(key, DEFAULT_LANGUAGE, params),
      supportedLanguages: APP_LANGUAGES,
    };
  }
  return context;
};
