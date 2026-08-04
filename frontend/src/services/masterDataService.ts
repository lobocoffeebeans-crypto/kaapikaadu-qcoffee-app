import type { MasterDataOption } from '../types/PickingLot';
import type { Language, MasterDataCategory } from '../types/masterData';
import { mockVarieties, mockBlocks, mockStatuses } from '../data/mockMasterData';
import { DEFAULT_LANGUAGE } from '../config/appConfig';

/**
 * Dropdown-ready option structure expected by UI components.
 */
export interface DropdownOption {
  value: string;
  label: string;
}

/**
 * MasterDataService - Supplies dropdown values to the UI.
 * Returns language-independent codes with translated labels.
 */
class MasterDataService {
  private readonly data: Record<MasterDataCategory, MasterDataOption[]>;

  constructor() {
    this.data = {
      variety: mockVarieties,
      block: mockBlocks,
      status: mockStatuses,
    };
  }

  /**
   * Resolve the label for an option based on the selected language.
   * Falls back to English label if Kannada label is not available.
   */
  private resolveLabel(option: MasterDataOption, language: Language): string {
    if (language === 'kn' && option.labelKannada) {
      return option.labelKannada;
    }
    return option.label;
  }

  /**
   * Get dropdown-ready options for a category in the specified language.
   */
  getOptions(category: MasterDataCategory, language: Language = DEFAULT_LANGUAGE): DropdownOption[] {
    const options = this.data[category];
    return options.map((option) => ({
      value: option.code,
      label: this.resolveLabel(option, language),
    }));
  }

  /**
   * Get all varieties as dropdown options.
   */
  getVarieties(language: Language = DEFAULT_LANGUAGE): DropdownOption[] {
    return this.getOptions('variety', language);
  }

  /**
   * Get all blocks as dropdown options.
   */
  getBlocks(language: Language = DEFAULT_LANGUAGE): DropdownOption[] {
    return this.getOptions('block', language);
  }

  /**
   * Get all statuses as dropdown options.
   */
  getStatuses(language: Language = DEFAULT_LANGUAGE): DropdownOption[] {
    return this.getOptions('status', language);
  }
}

/** Singleton instance for application-wide use. */
export const masterDataService = new MasterDataService();