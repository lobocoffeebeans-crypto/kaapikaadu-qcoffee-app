import type { Language } from '../types/masterData';
import { VALIDATION_MESSAGE_KEYS, type ValidationMessageKey } from './pickingLot';

/**
 * UI error messages in English and Kannada.
 * Messages map to validation rules defined in PickingLot.screen.md (UI-001 to UI-007).
 */
export const VALIDATION_MESSAGES: Record<ValidationMessageKey, Record<Language, string>> = {
  [VALIDATION_MESSAGE_KEYS.HARVEST_DATE_REQUIRED]: {
    en: 'Harvest Date is required.',
    kn: 'ಹಾರ್ವೆಸ್ಟ್ ದಿನಾಂಕ ಅಗತ್ಯವಿದೆ.',
  },
  [VALIDATION_MESSAGE_KEYS.HARVEST_DATE_FUTURE]: {
    en: 'Harvest Date cannot be in the future.',
    kn: 'ಹಾರ್ವೆಸ್ಟ್ ದಿನಾಂಕ ಭವಿಷ್ಯದಲ್ಲಿರಲು ಸಾಧ್ಯವಿಲ್ಲ.',
  },
  [VALIDATION_MESSAGE_KEYS.VARIETY_REQUIRED]: {
    en: 'Please select a coffee variety.',
    kn: 'ದಯವಿಟ್ಟು ಕಾಫಿ ತಳಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
  },
  [VALIDATION_MESSAGE_KEYS.BLOCK_REQUIRED]: {
    en: 'Select at least one block.',
    kn: 'ಕನಿಷ್ಠ ಒಂದು ಬ್ಲಾಕ್ ಆಯ್ಕೆಮಾಡಿ.',
  },
  [VALIDATION_MESSAGE_KEYS.WEIGHT_REQUIRED]: {
    en: 'Enter the total cherry weight.',
    kn: 'ಒಟ್ಟು ಚೆರ್ರಿ ತೂಕವನ್ನು ನಮೂದಿಸಿ.',
  },
  [VALIDATION_MESSAGE_KEYS.WEIGHT_NUMERIC]: {
    en: 'Weight must be a valid number.',
    kn: 'ತೂಕವು ಮಾನ್ಯ ಸಂಖ್ಯೆಯಾಗಿರಬೇಕು.',
  },
  [VALIDATION_MESSAGE_KEYS.WEIGHT_GREATER_THAN_ZERO]: {
    en: 'Weight must be greater than zero.',
    kn: 'ತೂಕವು ಶೂನ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚಾಗಿರಬೇಕು.',
  },
  [VALIDATION_MESSAGE_KEYS.UNSAVED_CHANGES]: {
    en: 'You have unsaved changes. Do you want to leave without saving?',
    kn: 'ನೀವು ಉಳಿಸದ ಬದಲಾವಣೆಗಳನ್ನು ಹೊಂದಿದ್ದೀರಿ. ಉಳಿಸದೆ ಹೊರಹೋಗಲು ಬಯಸುವಿರಾ?',
  },
};

/**
 * Resolve a validation message for the given language.
 * Falls back to English if the message key is not found.
 */
export const getValidationMessage = (
  key: ValidationMessageKey,
  language: Language
): string => {
  const messages = VALIDATION_MESSAGES[key];
  return messages?.[language] ?? messages?.en ?? key;
};