import type { MasterDataOption } from '../types/PickingLot';
import type { Language, MasterDataCategory, MasterDataItem, MasterDataResponse } from '../types/masterData';
import { mockVarieties, mockBlocks, mockStatuses } from '../data/mockMasterData';
import { DEFAULT_LANGUAGE, API_BASE_URL } from '../config/appConfig';

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
 *
 * MasterData can be loaded from the Google Apps Script API via `load()`.
 * Until `load()` is called, the service falls back to mock data.
 */
class MasterDataService {
  private readonly data: Record<MasterDataCategory, MasterDataOption[]>;
  private loadedItems: MasterDataItem[] | null = null;
  private loadPromise: Promise<MasterDataItem[]> | null = null;

  constructor() {
    this.data = {
      variety: mockVarieties,
      block: mockBlocks,
      status: mockStatuses,
    };
  }

  /**
   * Load all MasterData from the API in a single request.
   * Results are cached in memory so subsequent calls do not re-fetch.
   *
   * @returns A promise resolving to the loaded MasterData items.
   */
  async load(): Promise<MasterDataItem[]> {
    if (this.loadedItems) {
      return this.loadedItems;
    }

    if (!this.loadPromise) {
      this.loadPromise = this.fetchMasterData().then((items) => {
        this.loadedItems = items;
        return items;
      });
    }

    return this.loadPromise;
  }

  /**
   * Fetch MasterData from the Google Apps Script API.
   *
   * @returns The parsed MasterData items.
   */
  private async fetchMasterData(): Promise<MasterDataItem[]> {
    const url = `${API_BASE_URL}?resource=masterdata`;

    let response: Response;
    try {
      response = await fetch(url);
    } catch {
      throw new Error('Unable to connect. Please check your connection and try again.');
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    let json: unknown;
    try {
      json = await response.json();
    } catch {
      throw new Error('Invalid response from server.');
    }

    const parsed = this.parseResponse(json);
    return parsed;
  }

  /**
   * Validate and parse the API response shape.
   *
   * @param json The parsed JSON body.
   * @returns The validated MasterData items.
   */
  private parseResponse(json: unknown): MasterDataItem[] {
    if (!json || typeof json !== 'object') {
      throw new Error('Invalid response from server.');
    }

    const body = json as Partial<MasterDataResponse>;

    if (body.success !== true) {
      throw new Error('Invalid response from server.');
    }

    if (!Array.isArray(body.data)) {
      throw new Error('Invalid response from server.');
    }

    return body.data.filter(
      (item): item is MasterDataItem =>
        !!item &&
        typeof item === 'object' &&
        typeof item.type === 'string' &&
        typeof item.code === 'string' &&
        typeof item.en === 'string' &&
        typeof item.kn === 'string' &&
        typeof item.active === 'boolean' &&
        typeof item.sortOrder === 'number'
    );
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
    if (this.loadedItems !== null) {
      return this.loadedItems
        .filter((item) => item.active && item.type.toLowerCase() === category)
        .map((item) => ({
          value: item.code,
          label: language === 'kn' ? item.kn : item.en,
        }));
    }

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