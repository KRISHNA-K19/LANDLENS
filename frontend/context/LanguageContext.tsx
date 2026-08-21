'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import enDict from '../locales/en/common.json';
import taDict from '../locales/ta/common.json';
import hiDict from '../locales/hi/common.json';

export type Language = 'en' | 'ta' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const dictionaries: Record<Language, any> = {
  en: enDict,
  ta: taDict,
  hi: hiDict,
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('landlens_lang') as Language;
      if (saved === 'en' || saved === 'ta' || saved === 'hi') {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('landlens_lang', lang);
      document.cookie = `landlens_lang=${lang}; path=/; max-age=31536000`;
      document.documentElement.lang = lang;
    }
  };

  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let result = dictionaries[language];

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        result = undefined;
        break;
      }
    }

    if (result && typeof result === 'string') return result;

    // Fallback to English dictionary
    let fallbackResult = dictionaries['en'];
    for (const k of keys) {
      if (fallbackResult && typeof fallbackResult === 'object' && k in fallbackResult) {
        fallbackResult = fallbackResult[k];
      } else {
        fallbackResult = undefined;
        break;
      }
    }

    if (fallbackResult && typeof fallbackResult === 'string') return fallbackResult;

    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
