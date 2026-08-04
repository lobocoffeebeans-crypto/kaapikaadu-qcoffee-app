/**
 * PickingLot - The first traceable entity in the coffee processing lifecycle.
 * Represents harvested cherries before any processing decisions are made.
 */
export interface PickingLot {
  lotId: string;
  harvestDate: Date;
  variety: string;
  totalCherryWeightKg: number;
  blocks: string[];
  status: string;
}

/**
 * CreatePickingLotRequest - Payload sent to the backend to create a Picking Lot.
 * The backend generates LotID, Status, CreatedDateTime, and CreatedBy.
 */
export interface CreatePickingLotRequest {
  harvestDate: string;
  varietyCode: string;
  totalCherryWeightKg: number;
  blockCodes: string[];
}

/**
 * CreatePickingLotResponse - Success response from the backend after creating a Picking Lot.
 */
export interface CreatePickingLotResponse {
  success: boolean;
  lotId: string;
  status: string;
  message: string;
}

/**
 * ApiError - Error response from the backend.
 */
export interface ApiError {
  success: boolean;
  errorCode: string;
  message: string;
}

/**
 * MasterDataOption - Language-independent code with translated labels.
 * Master Data stores only codes; labels are resolved per language.
 */
export interface MasterDataOption {
  code: string;
  label: string;
  labelKannada?: string;
}

/**
 * PickingLotFormData - Form-specific data structure used by the UI form.
 * Supports multi-select blocks and excludes process (BR-005).
 */
export interface PickingLotFormData {
  harvestDate: string;
  variety: string;
  blocks: string[];
  totalCherryWeightKg: number;
}
