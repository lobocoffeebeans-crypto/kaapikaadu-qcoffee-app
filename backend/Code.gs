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
var MASTER_DATA_SHEET = 'MasterData';
var API_LOG_SHEET = 'ApiLog';
var API_LOG_HEADERS = ['Timestamp', 'Method', 'Endpoint', 'RequestBody', 'ResponseBody'];

// PickingLots sheet columns (1-based) — must match the deployed sheet headers:
// LotID | HarvestDate | Block | Variety | Process | CherryWeightKg | CreatedDateTime | CreatedBy | Status
var PL_LOT_ID = 1;
var PL_HARVEST_DATE = 2;
var PL_BLOCK = 3;
var PL_VARIETY = 4;
var PL_PROCESS = 5;
var PL_CHERRY_WEIGHT = 6;
var PL_CREATED_DATETIME = 7;
var PL_CREATED_BY = 8;
var PL_STATUS = 9;

// PickingLotBlocks sheet columns (1-based)
var PLB_LOT_ID = 1;
var PLB_BLOCK_CODE = 2;

// MasterData sheet columns (1-based)
var MD_TYPE = 1;
var MD_CODE = 2;
var MD_ENGLISH = 3;
var MD_KANNADA = 4;
var MD_ACTIVE = 5;
var MD_SORT_ORDER = 6;

/**
 * HTTP POST handler - creates a new Picking Lot.
 *
 * @param {Object} e The event object containing the POST data.
 * @return {TextOutput} JSON response.
 */
function doPost(e) {
  var request;
  var responsePayload;
  try {
    request = JSON.parse(e.postData.contents);

    // Validate required fields
    var validationError = validateRequest(request);
    if (validationError) {
      responsePayload = validationError;
      return buildResponse(responsePayload);
    }

    // Generate LotID (PLYYMMDD0001)
    var lotId = generateLotId(request.harvestDate);

    // Write Picking Lot record
    writePickingLot(lotId, request);

    // Write PickingLotBlocks records
    writePickingLotBlocks(lotId, request.blockCodes);

    // Return success response
    responsePayload = {
      success: true,
      lotId: lotId,
      status: 'CREATED',
      message: 'Picking Lot created successfully.'
    };
    return buildResponse(responsePayload);
  } catch (err) {
    responsePayload = {
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Something went wrong while saving.'
    };
    return buildResponse(responsePayload);
  } finally {
    logApiCall('POST', '/exec', request, responsePayload);
  }
}

/**
 * HTTP GET handler - serves MasterData and other read resources.
 *
 * Supported resources:
 *   resource=masterdata  -> returns active MasterData records.
 *
 * @param {Object} e The event object containing the GET parameters.
 * @return {TextOutput} JSON response.
 */
function doGet(e) {
  var resource = e && e.parameter ? e.parameter.resource : '';
  var responsePayload;
  try {
    if (resource === 'masterdata') {
      responsePayload = handleMasterData();
      return buildResponse(responsePayload);
    }

    responsePayload = {
      success: false,
      errorCode: 'INVALID_RESOURCE',
      message: 'Unknown resource requested.'
    };
    return buildResponse(responsePayload);
  } catch (err) {
    responsePayload = {
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Something went wrong while loading data.'
    };
    return buildResponse(responsePayload);
  } finally {
    logApiCall('GET', '/exec?resource=' + resource, e ? e.parameter : null, responsePayload);
  }
}

/**
 * Read the MasterData sheet and return active records.
 *
 * @return {Object} Response payload object (wrapped by doGet).
 */
function handleMasterData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(MASTER_DATA_SHEET);

  if (!sheet) {
    return {
      success: false,
      errorCode: 'SHEET_NOT_FOUND',
      message: 'MasterData sheet not found.'
    };
  }

  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();

  // Empty sheet (no header) -> return empty data
  if (lastRow < 1 || lastCol < 1) {
    return { success: true, data: [] };
  }

  // Read header row to locate required columns
  var header = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var columnMap = buildColumnMap(header);

  var requiredColumns = ['Type', 'Code', 'English', 'Kannada', 'Active', 'SortOrder'];
  var missing = requiredColumns.filter(function (col) {
    return columnMap[col] === undefined;
  });

  if (missing.length > 0) {
    return {
      success: false,
      errorCode: 'MISSING_COLUMNS',
      message: 'MasterData sheet is missing required columns: ' + missing.join(', ') + '.'
    };
  }

  // No data rows -> return empty data
  if (lastRow < 2) {
    return { success: true, data: [] };
  }

  var values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  var data = [];

  for (var i = 0; i < values.length; i++) {
    var row = values[i];

    var type = String(row[columnMap['Type']] || '').trim();
    var code = String(row[columnMap['Code']] || '').trim();
    var en = String(row[columnMap['English']] || '').trim();
    var kn = String(row[columnMap['Kannada']] || '').trim();
    var active = isActive(row[columnMap['Active']]);
    var sortOrder = toNumber(row[columnMap['SortOrder']]);

    // Skip blank rows
    if (!type && !code) {
      continue;
    }

    // Only return active records
    if (!active) {
      continue;
    }

    data.push({
      type: type,
      code: code,
      en: en,
      kn: kn,
      active: true,
      sortOrder: sortOrder
    });
  }

  return { success: true, data: data };
}

/**
 * Build a map of header name -> column index (0-based).
 *
 * @param {Array} header The header row values.
 * @return {Object} Map of header name to column index.
 */
function buildColumnMap(header) {
  var map = {};
  for (var i = 0; i < header.length; i++) {
    var name = String(header[i] || '').trim();
    if (name) {
      map[name] = i;
    }
  }
  return map;
}

/**
 * Interpret the Active column value as a boolean.
 * Accepts TRUE/FALSE, true/false, 1/0, YES/NO, Y/N.
 *
 * @param {*} value The raw cell value.
 * @return {boolean} Whether the record is active.
 */
function isActive(value) {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  var text = String(value || '').trim().toUpperCase();
  return text === 'TRUE' || text === 'YES' || text === 'Y' || text === '1';
}

/**
 * Convert a SortOrder cell value to a number.
 *
 * @param {*} value The raw cell value.
 * @return {number} The numeric sort order (0 if not a number).
 */
function toNumber(value) {
  var num = Number(value);
  return isNaN(num) ? 0 : num;
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
  if (!request.processCode) {
    return {
      success: false,
      errorCode: 'INVALID_PROCESS',
      message: 'Select a valid coffee processing method.'
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
 * Column layout matches the deployed sheet:
 * LotID | HarvestDate | Block | Variety | Process | CherryWeightKg | CreatedDateTime | CreatedBy | Status
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
    request.blockCodes.join(', '),
    request.varietyCode,
    request.processCode,
    request.totalCherryWeightKg,
    createdDateTime,
    createdBy,
    'CREATED'
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
 * Record an API request and its response in the ApiLog sheet.
 *
 * Runs in a finally block for every doPost/doGet call so the request body and
 * response payload are always registered, including validation and error cases.
 * Never throws — logging must never break the API response.
 *
 * @param {string} method The HTTP method (POST/GET).
 * @param {string} endpoint The endpoint or resource requested.
 * @param {*} requestBody The request body (parsed object) or query parameters.
 * @param {*} responsePayload The response payload object.
 */
function logApiCall(method, endpoint, requestBody, responsePayload) {
  try {
    var sheet = getSheet(API_LOG_SHEET);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(API_LOG_HEADERS);
    }
    sheet.appendRow([
      new Date(),
      method,
      endpoint,
      safeJson(requestBody),
      safeJson(responsePayload)
    ]);
  } catch (e) {
    // Logging must never break the API response.
  }
}

/**
 * Serialize a value to a JSON string for the log.
 *
 * @param {*} value The value to serialize.
 * @return {string} JSON string (empty string when not serializable).
 */
function safeJson(value) {
  try {
    var json = JSON.stringify(value);
    return json === undefined ? '' : json;
  } catch (e) {
    return String(value || '');
  }
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