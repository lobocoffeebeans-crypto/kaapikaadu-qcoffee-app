import type { Language } from '../types/masterData';

/**
 * Application configuration loaded from environment variables.
 * Vite exposes variables prefixed with VITE_ via import.meta.env.
 */

/** Default UI language. Falls back to English if not set or invalid. */
export const DEFAULT_LANGUAGE: Language =
  import.meta.env.VITE_APP_LANGUAGE === 'kn' ? 'kn' : 'en';

  console.log("Current language:", DEFAULT_LANGUAGE);