import React, { useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { useSync } from '../context/SyncContext';

import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import de from './locales/de.json';
import it from './locales/it.json';
import zh from './locales/zh.json';
import ru from './locales/ru.json';

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de', 'it', 'zh', 'ru'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const deviceLocale = getLocales()[0]?.languageCode ?? 'en';
const initialLang = SUPPORTED_LANGUAGES.includes(deviceLocale as SupportedLanguage)
  ? (deviceLocale as SupportedLanguage)
  : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    es: { translation: es },
    de: { translation: de },
    it: { translation: it },
    zh: { translation: zh },
    ru: { translation: ru },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export { i18n };

export function changeAppLanguage(lang: string) {
  if (SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
    i18n.changeLanguage(lang);
  }
}

export const LanguageSync: React.FC = () => {
  const { sync } = useSync();

  useEffect(() => {
    const userLang = sync?.user?.language;
    if (userLang && SUPPORTED_LANGUAGES.includes(userLang as SupportedLanguage)) {
      i18n.changeLanguage(userLang as SupportedLanguage);
    }
  }, [sync?.user?.language]);

  return null;
};