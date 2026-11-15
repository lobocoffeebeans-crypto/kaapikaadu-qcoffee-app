/**
 * Supported UI languages.
 * Master Data is language independent; labels are resolved per language.
 */
export type Language = 'en' | 'kn';

/**
 * Master Data categories supported by the service.
 */
export type MasterDataCategory = 'variety' | 'block' | 'status';

/**
 * MasterDataItem - A single MasterData record returned by the API.
 * Contains the stable code and both language display labels.
 */
export interface MasterDataItem {
  type: string;
  code: string;
  en: string;
  kn: string;
  active: boolean;
  sortOrder: number;
}

/**
 * MasterDataResponse - The API response envelope for MasterData.
 */
export interface MasterDataResponse {
  success: boolean;
  data: MasterDataItem[];
}
