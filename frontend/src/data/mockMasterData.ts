import type { MasterDataOption } from '../types/PickingLot';

/**
 * Mock MasterData repository.
 * Stores language-independent codes with translated labels (English and Kannada).
 * In production, this data will come from Google Sheets via Apps Script.
 */

/** Coffee variety options. */
export const mockVarieties: MasterDataOption[] = [
  { code: 'SLN6', label: 'SLN6', labelKannada: 'ಎಸ್ಎಲ್ಎನ್ 6' },
  { code: 'SL28', label: 'SL28', labelKannada: 'ಎಸ್ಎಲ್ 28' },
  { code: 'CATURRA', label: 'Caturra', labelKannada: 'ಕ್ಯಾಟುರಾ' },
  { code: 'BOURBON', label: 'Bourbon', labelKannada: 'ಬರ್ಬನ್' },
  { code: 'TYPICA', label: 'Typica', labelKannada: 'ಟಿಪಿಕಾ' },
  { code: 'GEISHA', label: 'Geisha', labelKannada: 'ಗೀಶಾ' },
];

/** Block options. */
export const mockBlocks: MasterDataOption[] = [
  { code: 'BLOCK01', label: 'Block 1', labelKannada: 'ಬ್ಲಾಕ್ 1' },
  { code: 'BLOCK02', label: 'Block 2', labelKannada: 'ಬ್ಲಾಕ್ 2' },
  { code: 'BLOCK03', label: 'Block 3', labelKannada: 'ಬ್ಲಾಕ್ 3' },
  { code: 'BLOCK04', label: 'Block 4', labelKannada: 'ಬ್ಲಾಕ್ 4' },
  { code: 'BLOCK05', label: 'Block 5', labelKannada: 'ಬ್ಲಾಕ್ 5' },
];

/** Status options. */
export const mockStatuses: MasterDataOption[] = [
  { code: 'CREATED', label: 'Created', labelKannada: 'ರಚಿಸಲಾಗಿದೆ' },
];