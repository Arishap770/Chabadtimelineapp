import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Language, TranslationKey } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
  languageName: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        // Map the language names back to codes
        const languageMap: { [key: string]: Language } = {
          'English': 'en',
          'Hebrew': 'he',
          'Spanish': 'es',
          'French': 'fr',
          'Yiddish': 'yi',
        };
        const langCode = languageMap[savedLanguage] || 'en';
        setLanguageState(langCode);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      // Save the language name for compatibility with existing settings
      const languageNames: { [key in Language]: string } = {
        en: 'English',
        he: 'Hebrew',
        es: 'Spanish',
        fr: 'French',
        yi: 'Yiddish',
      };
      await AsyncStorage.setItem('language', languageNames[lang]);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const getLanguageName = (): string => {
    const names: { [key in Language]: string } = {
      en: 'English',
      he: 'Hebrew',
      es: 'Spanish',
      fr: 'French',
      yi: 'Yiddish',
    };
    return names[language];
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languageName: getLanguageName(),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
