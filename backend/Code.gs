/**
 * Picking Lot API - Google Apps Script backend.
 *
 * Deploy as a Web App with "Anyone" access.
 * The deployment URL is the endpoint for POST requests.
 *
 * Creates a new Picking Lot and its associated PickingLotBlocks records.
 * The backend generates LotID, Status, CreatedDateTime, and CreatedBy.
 */

// Sheet names
var PICKING_LOTS_SHEET = 'PickingLots';
var PICKING_LOT_BLOCKS_SHEET = 'PickingLotBlocks';

// PickingLots sheet columns (1-based)
var PL_LOT_ID = 1;
var PL_HARVEST_DATE = 2;
var PL_VARIETY_CODE = 3;
var PL_TOTAL_WEIGHT = 4;
var PL_STATUS_CODE = 5;
var PL_CREATED_DATETIME = 6;
var PL_CREATED_BY = 7;

// PickingLotBlocks sheet columns (1-based)
var PLB_LOT_ID = 1;
var PLB_BLOCK_CODE = 2;

/**
 * HTTP POST handler - creates a new Picking Lot.
 *
 * @param {Object} e The event object containing the POST data.
 * @return {TextOutput} JSON response.
 */
function doPost(e) {
  try {
    var request = JSON.parse(e.postData.contents);

    // Validate required fields
    var validationError = validateRequest(request);
    if (validationError) {
      return buildResponse(validationError);
    }

    // Generate LotID (PLYYMMDD0001)
    var lotId = generateLotId(request.harvestDate);

    // Write Picking Lot record
    writePickingLot(lotId, request);

    // Write PickingLotBlocks records
    writePickingLotBlocks(lotId, request.blockCodes);

    // Return success response
    return buildResponse({
      success: true,
      lotId: lotId,
      status: 'CREATED',
      message: 'Picking Lot created successfully.'
    });
  } catch (err) {
    return buildResponse({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Something went wrong while saving.'
    });
  }
}

/**
 * Validate required fields in the request.
 * Returns null if valid, otherwise an error object.
 *
 * @param {Object} request The parsed request body.
 * @return {Object|null} Error object or null when valid.
 */
function validateRequest(request) {
  if (!request.harvestDate) {
    return {
      success: false,
      errorCode: 'INVALID_HARVEST_DATE',
      message: 'Harvest Date cannot be in the future.'
    };
  }
  if (!request.varietyCode) {
    return {
      success: false,
      errorCode: 'INVALID_VARIETY',
      message: 'Select a valid coffee variety.'
    };
  }
  if (
    !request.blockCodes ||
    !Array.isArray(request.blockCodes) ||
    request.blockCodes.length === 0
  ) {
    return {
      success: false,
      errorCode: 'BLOCK_REQUIRED',
      message: 'At least one block must be selected.'
    };
  }
  if (
    typeof request.totalCherryWeightKg !== 'number' ||
    request.totalCherryWeightKg <= 0
  ) {
    return {
      success: false,
      errorCode: 'INVALID_WEIGHT',
      message: 'Weight must be greater than zero.'
    };
  }
  return null;
}

/**
 * Generate a LotID in the format PLYYMMDD0001.
 * The 4-digit sequence increments per harvest date.
 *
 * @param {string} harvestDate ISO date string (YYYY-MM-DD).
 * @return {string} Generated LotID.
 */
function generateLotId(harvestDate) {
  var date = new Date(harvestDate);
  var yy = String(date.getFullYear()).slice(-2);
  var mm = String(date.getMonth() + 1).padStart(2, '0');
  var dd = String(date.getDate()).padStart(2, '0');
  var datePrefix = 'PL' + yy + mm + dd;

  var sheet = getSheet(PICKING_LOTS_SHEET);
  var lastRow = sheet.getLastRow();
  var sequence = 1;

  if (lastRow >= 1) {
    var lotIds = sheet.getRange(1, PL_LOT_ID, lastRow, 1).getValues();
    for (var i = 0; i < lotIds.length; i++) {
      var existingId = String(lotIds[i][0] || '');
      if (existingId.indexOf(datePrefix) === 0) {
        var num = parseInt(existingId.substring(datePrefix.length), 10);
        if (!isNaN(num) && num >= sequence) {
          sequence = num + 1;
        }
      }
    }
  }

  return datePrefix + String(sequence).padStart(4, '0');
}

/**
 * Write a Picking Lot record to the PickingLots sheet.
 *
 * @param {string} lotId The generated LotID.
 * @param {Object} request The validated request body.
 */
function writePickingLot(lotId, request) {
  var sheet = getSheet(PICKING_LOTS_SHEET);
  var createdDateTime = new Date();
  var createdBy = Session.getActiveUser().getEmail() || 'Unknown';

  sheet.appendRow([
    lotId,
    new Date(request.harvestDate),
    request.varietyCode,
    request.totalCherryWeightKg,
    'CREATED',
    createdDateTime,
    createdBy
  ]);
}

/**
 * Write PickingLotBlocks records to the PickingLotBlocks sheet.
 *
 * @param {string} lotId The generated LotID.
 * @param {string[]} blockCodes The selected block codes.
 */
function writePickingLotBlocks(lotId, blockCodes) {
  var sheet = getSheet(PICKING_LOT_BLOCKS_SHEET);
  var rows = blockCodes.map(function (blockCode) {
    return [lotId, blockCode];
  });
  sheet
    .getRange(sheet.getLastRow() + 1, PLB_LOT_ID, rows.length, 2)
    .setValues(rows);
}

/**
 * Get a sheet by name, creating it if it does not exist.
 *
 * @param {string} name The sheet name.
 * @return {Sheet} The spreadsheet sheet.
 */
function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

/**
 * Build a JSON response.
 *
 * @param {Object} payload The response payload.
 * @return {TextOutput} JSON text output.
 */
function buildResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}