import { createContext, useContext, useState, useEffect } from 'react';
import en from '../i18n/en.json';
import es from '../i18n/es.json';
import { getItem, setItem } from '../utils/storage';

const LanguageContext = createContext();

const languages = { en, es };

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => getItem('language', 'es'));

  useEffect(() => {
    setItem('language', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const translate = (key) => {
    return key.split('.').reduce((obj, i) => obj?.[i], languages[lang]) || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);