import type { Language } from '../types/masterData';

/**
 * Application configuration loaded from environment variables.
 * Vite exposes variables prefixed with VITE_ via import.meta.env.
 */

/** Default UI language. Falls back to English if not set or invalid. */
export const DEFAULT_LANGUAGE: Language =
  import.meta.env.VITE_APP_LANGUAGE === 'kn' ? 'kn' : 'en';

/**
 * Base URL for the Picking Lot API (Google Apps Script Web App deployment).
 * Configure via VITE_API_BASE_URL. Falls back to empty string (same origin).
 */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '';
