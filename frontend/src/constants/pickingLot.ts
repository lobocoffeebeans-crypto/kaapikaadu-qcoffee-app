/**
 * PickingLot feature constants.
 */

/** Feature name used across the application. */
export const FEATURE_NAME = 'PickingLot';

/** Picking Lot status values. */
export const PICKING_LOT_STATUS = {
  CREATED: 'CREATED',
} as const;

export type PickingLotStatus = (typeof PICKING_LOT_STATUS)[keyof typeof PICKING_LOT_STATUS];

/**
 * Validation message keys.
 * Keys map to UI validation rules defined in PickingLot.screen.md.
 */
export const VALIDATION_MESSAGE_KEYS = {
  HARVEST_DATE_REQUIRED: 'harvestDate.required',
  HARVEST_DATE_FUTURE: 'harvestDate.future',
  VARIETY_REQUIRED: 'variety.required',
  BLOCK_REQUIRED: 'block.required',
  WEIGHT_REQUIRED: 'weight.required',
  WEIGHT_NUMERIC: 'weight.numeric',
  WEIGHT_GREATER_THAN_ZERO: 'weight.greaterThanZero',
  UNSAVED_CHANGES: 'unsavedChanges',
} as const;

export type ValidationMessageKey = (typeof VALIDATION_MESSAGE_KEYS)[keyof typeof VALIDATION_MESSAGE_KEYS];