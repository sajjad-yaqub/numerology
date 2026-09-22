/**
 * ASTRANUMERICS - LIGHTWEIGHT i18n ENGINE
 * Supporting English (EN), Hindi (HI), and Tamil (TA).
 */

import en from '../locales/en.json';
import hi from '../locales/hi.json';
import ta from '../locales/ta.json';

const LOCALES = { en, hi, ta };
const STORAGE_KEY = 'astranumerics_lang';

let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';
const listeners = [];

/**
 * Get current active language code ('en', 'hi', 'ta')
 */
export function getLanguage() {
  return currentLang;
}

/**
 * Set current active language code ('en', 'hi', 'ta')
 */
export function setLanguage(langCode) {
  if (LOCALES[langCode]) {
    currentLang = langCode;
    localStorage.setItem(STORAGE_KEY, langCode);
    listeners.forEach(fn => fn(currentLang));
  }
}

/**
 * Subscribe to language change events
 */
export function onLanguageChange(fn) {
  listeners.push(fn);
}

/**
 * Lookup translation key with dot notation (e.g. 'form.fullName')
 */
export function t(keyPath, fallback = '') {
  const keys = keyPath.split('.');
  let current = LOCALES[currentLang] || LOCALES.en;

  for (const k of keys) {
    if (current && current[k] !== undefined) {
      current = current[k];
    } else {
      // Fallback to English dictionary
      let fallbackCurrent = LOCALES.en;
      for (const fk of keys) {
        if (fallbackCurrent && fallbackCurrent[fk] !== undefined) {
          fallbackCurrent = fallbackCurrent[fk];
        } else {
          return fallback || keyPath;
        }
      }
      return fallbackCurrent;
    }
  }

  return current;
}
