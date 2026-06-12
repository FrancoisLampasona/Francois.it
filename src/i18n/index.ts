import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import it from './it.json'
import en from './en.json'

function initialLanguage(): string {
  try {
    const saved = localStorage?.getItem('lang')
    if (saved === 'it' || saved === 'en') return saved
  } catch {
    // localStorage not available
  }
  return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('it') ? 'it' : 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    it: { translation: it },
    en: { translation: en },
  },
  lng: initialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  try {
    localStorage?.setItem('lang', lng)
  } catch {
    // localStorage not available
  }
})

export default i18n
