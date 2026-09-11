/**
 * Re-export localization from src/i18n/translations for backward compatibility
 */
export * from '../i18n/translations';
export { translate, useLanguage, LanguageProvider } from '../i18n/LanguageContext';
import { translations, SupportedLang } from '../i18n/translations';

export type SupportedLanguage = SupportedLang;

export function getTranslations(lang: string = 'en'): any {
  const targetLang = (translations as any)[lang] ? lang : 'en';
  return (translations as any)[targetLang]?.screens || (translations as any)[targetLang] || (translations as any)['en'];
}
