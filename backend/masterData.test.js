/**
 * Test harness for the MasterData doGet implementation.
 * Mocks the Google Apps Script environment and verifies the API logic.
 *
 * Run with: node backend/masterData.test.js
 */

// --- Local API log file (logs/api.log) ---
const fs = require('fs');
const path = require('path');
const API_LOG_FILE = path.join(__dirname, '..', 'logs', 'api.log');

/** Append one JSON entry to logs/api.log. Never throws. */
const writeApiLog = (entry) => {
  try {
    fs.mkdirSync(path.dirname(API_LOG_FILE), { recursive: true });
    fs.appendFileSync(API_LOG_FILE, JSON.stringify(entry) + '\n');
  } catch (e) {
    // Logging must never break the tests.
  }
};

/** (Re)create logs/api.log with a header line before each run. */
const initApiLog = () => {
  try {
    fs.mkdirSync(path.dirname(API_LOG_FILE), { recursive: true });
    fs.writeFileSync(API_LOG_FILE, '# Kaapikaadu API request/response log — written by backend/masterData.test.js\n');
  } catch (e) {
    // Logging must never break the tests.
  }
};

// --- Mock Google Apps Script environment ---
const MockSheet = (name, rows) => ({
  name,
  rows,
  getLastRow: () => rows.length,
  getLastColumn: () => (rows.length > 0 ? rows[0].length : 0),
  getRange: (row, col, numRows, numCols) => ({
    getValues: () => {
      const result = [];
      for (let r = row - 1; r < row - 1 + numRows; r++) {
        result.push(rows[r] ? rows[r].slice(col - 1, col - 1 + numCols) : []);
      }
      return result;
    },
    setValues: (values) => {
      // Record the write so tests can assert the actual values written.
      for (let r = 0; r < values.length; r++) {
        const targetRow = row - 1 + r;
        if (!rows[targetRow]) {
          rows[targetRow] = [];
        }
        for (let c = 0; c < values[r].length; c++) {
          rows[targetRow][col - 1 + c] = values[r][c];
        }
      }
    },
  }),
  appendRow: (values) => {
    // Record the write so tests can assert the actual values written.
    rows.push(values);
  },
});

const sheets = {};

const mockSpreadsheetApp = {
  getActiveSpreadsheet: () => ({
    getSheetByName: (name) => sheets[name] || null,
    insertSheet: (name) => {
      sheets[name] = MockSheet(name, []);
      return sheets[name];
    },
  }),
};

const mockContentService = {
  createTextOutput: (content) => ({
    content,
    setMimeType: () => ({ mimeType: 'application/json', content }),
  }),
  MimeType: { JSON: 'application/json' },
};

global.SpreadsheetApp = mockSpreadsheetApp;
global.ContentService = mockContentService;
global.Session = { getActiveUser: () => ({ getEmail: () => 'test@example.com' }) };

// --- Load the Code.gs implementation ---
const code = fs.readFileSync(__dirname + '/Code.gs', 'utf8');
eval(code);

initApiLog();

// Wrap doPost/doGet so every API request body and response is also written to logs/api.log.
const rawDoPost = doPost;
const rawDoGet = doGet;

doPost = (e) => {
  const result = rawDoPost(e);
  writeApiLog({
    ts: new Date().toISOString(),
    method: 'POST',
    endpoint: '/exec',
    requestBody: e && e.postData ? e.postData.contents : '',
    responseBody: result && result.content ? result.content : '',
  });
  return result;
};

doGet = (e) => {
  const result = rawDoGet(e);
  const resource = (e && e.parameter && e.parameter.resource) || '';
  writeApiLog({
    ts: new Date().toISOString(),
    method: 'GET',
    endpoint: '/exec?resource=' + resource,
    requestBody: e && e.parameter ? JSON.stringify(e.parameter) : '',
    responseBody: result && result.content ? result.content : '',
  });
  return result;
};

// --- Test helpers ---
let passed = 0;
let failed = 0;

const assert = (condition, message) => {
  if (condition) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    console.error(`  ❌ ${message}`);
  }
};

const parseResponse = (response) => JSON.parse(response.content);

// --- Test 1: Happy path - active records returned with stable codes and SortOrder ---
console.log('\nTest 1: Happy path - active MasterData records');
sheets['MasterData'] = MockSheet('MasterData', [
  ['Type', 'Code', 'English', 'Kannada', 'Active', 'SortOrder'],
  ['BLOCK', 'BLOCK_A', 'Block A', 'ಬ್ಲಾಕ್ A', 'TRUE', '1'],
  ['BLOCK', 'BLOCK_B', 'Block B', 'ಬ್ಲಾಕ್ B', 'true', '2'],
  ['VARIETY', 'SLN6', 'SLN6', 'ಎಸ್ಎಲ್ಎನ್ 6', true, '3'],
]);

const response1 = parseResponse(doGet({ parameter: { resource: 'masterdata' } }));
assert(response1.success === true, 'success is true');
assert(Array.isArray(response1.data), 'data is an array');
assert(response1.data.length === 3, `returns all 3 active records (got ${response1.data.length})`);
assert(response1.data[0].type === 'BLOCK', 'record 0 type is BLOCK');
assert(response1.data[0].code === 'BLOCK_A', 'record 0 code is BLOCK_A (stable code)');
assert(response1.data[0].en === 'Block A', 'record 0 English label is Block A');
assert(response1.data[0].kn === 'ಬ್ಲಾಕ್ A', 'record 0 Kannada label is ಬ್ಲಾಕ್ A');
assert(response1.data[0].active === true, 'record 0 active is true');
assert(response1.data[0].sortOrder === 1, 'record 0 sortOrder is 1');
assert(response1.data[1].code === 'BLOCK_B', 'record 1 code is BLOCK_B');
assert(response1.data[2].code === 'SLN6', 'record 2 code is SLN6');

// --- Test 2: Inactive records excluded ---
console.log('\nTest 2: Inactive records excluded');
sheets['MasterData'] = MockSheet('MasterData', [
  ['Type', 'Code', 'English', 'Kannada', 'Active', 'SortOrder'],
  ['BLOCK', 'BLOCK_A', 'Block A', 'ಬ್ಲಾಕ್ A', 'TRUE', '1'],
  ['BLOCK', 'BLOCK_B', 'Block B', 'ಬ್ಲಾಕ್ B', 'FALSE', '2'],
  ['BLOCK', 'BLOCK_C', 'Block C', 'ಬ್ಲಾಕ್ C', 'false', '3'],
  ['BLOCK', 'BLOCK_D', 'Block D', 'ಬ್ಲಾಕ್ D', '0', '4'],
]);

const response2 = parseResponse(doGet({ parameter: { resource: 'masterdata' } }));
assert(response2.success === true, 'success is true');
assert(response2.data.length === 1, `only 1 active record returned (got ${response2.data.length})`);
assert(response2.data[0].code === 'BLOCK_A', 'only BLOCK_A returned');

// --- Test 3: SortOrder preserved ---
console.log('\nTest 3: SortOrder preserved');
sheets['MasterData'] = MockSheet('MasterData', [
  ['Type', 'Code', 'English', 'Kannada', 'Active', 'SortOrder'],
  ['BLOCK', 'BLOCK_Z', 'Block Z', 'ಬ್ಲಾಕ್ Z', 'TRUE', '10'],
  ['BLOCK', 'BLOCK_A', 'Block A', 'ಬ್ಲಾಕ್ A', 'TRUE', '1'],
  ['BLOCK', 'BLOCK_M', 'Block M', 'ಬ್ಲಾಕ್ M', 'TRUE', '5'],
]);

const response3 = parseResponse(doGet({ parameter: { resource: 'masterdata' } }));
assert(response3.success === true, 'success is true');
assert(response3.data[0].sortOrder === 10, 'first record keeps sortOrder 10');
assert(response3.data[1].sortOrder === 1, 'second record keeps sortOrder 1');
assert(response3.data[2].sortOrder === 5, 'third record keeps sortOrder 5');
assert(
  JSON.stringify(response3.data.map((r) => r.sortOrder)) === JSON.stringify([10, 1, 5]),
  'SortOrder preserved as-is (no alphabetical reordering)'
);

// --- Test 4: Empty MasterData (header only) ---
console.log('\nTest 4: Empty MasterData (header only)');
sheets['MasterData'] = MockSheet('MasterData', [
  ['Type', 'Code', 'English', 'Kannada', 'Active', 'SortOrder'],
]);

const response4 = parseResponse(doGet({ parameter: { resource: 'masterdata' } }));
assert(response4.success === true, 'success is true');
assert(Array.isArray(response4.data) && response4.data.length === 0, 'returns empty data array');

// --- Test 5: Completely empty sheet ---
console.log('\nTest 5: Completely empty sheet');
sheets['MasterData'] = MockSheet('MasterData', []);

const response5 = parseResponse(doGet({ parameter: { resource: 'masterdata' } }));
assert(response5.success === true, 'success is true');
assert(Array.isArray(response5.data) && response5.data.length === 0, 'returns empty data array');

// --- Test 6: Sheet not found ---
console.log('\nTest 6: MasterData sheet not found');
delete sheets['MasterData'];

const response6 = parseResponse(doGet({ parameter: { resource: 'masterdata' } }));
assert(response6.success === false, 'success is false');
assert(response6.errorCode === 'SHEET_NOT_FOUND', 'errorCode is SHEET_NOT_FOUND');
assert(response6.message === 'MasterData sheet not found.', 'message is clear');

// --- Test 7: Missing required columns ---
console.log('\nTest 7: Missing required columns');
sheets['MasterData'] = MockSheet('MasterData', [
  ['Type', 'Code', 'English', 'Active', 'SortOrder'],
  ['BLOCK', 'BLOCK_A', 'Block A', 'TRUE', '1'],
]);

const response7 = parseResponse(doGet({ parameter: { resource: 'masterdata' } }));
assert(response7.success === false, 'success is false');
assert(response7.errorCode === 'MISSING_COLUMNS', 'errorCode is MISSING_COLUMNS');
assert(response7.message.includes('Kannada'), 'message mentions missing Kannada column');

// --- Test 8: Invalid resource ---
console.log('\nTest 8: Invalid resource');
sheets['MasterData'] = MockSheet('MasterData', [
  ['Type', 'Code', 'English', 'Kannada', 'Active', 'SortOrder'],
]);

const response8 = parseResponse(doGet({ parameter: { resource: 'unknown' } }));
assert(response8.success === false, 'success is false');
assert(response8.errorCode === 'INVALID_RESOURCE', 'errorCode is INVALID_RESOURCE');

// --- Test 9: Blank rows skipped ---
console.log('\nTest 9: Blank rows skipped');
sheets['MasterData'] = MockSheet('MasterData', [
  ['Type', 'Code', 'English', 'Kannada', 'Active', 'SortOrder'],
  ['BLOCK', 'BLOCK_A', 'Block A', 'ಬ್ಲಾಕ್ A', 'TRUE', '1'],
  ['', '', '', '', '', ''],
  ['BLOCK', 'BLOCK_B', 'Block B', 'ಬ್ಲಾಕ್ B', 'TRUE', '2'],
]);

const response9 = parseResponse(doGet({ parameter: { resource: 'masterdata' } }));
assert(response9.success === true, 'success is true');
assert(response9.data.length === 2, `blank rows skipped, 2 records returned (got ${response9.data.length})`);
assert(response9.data[0].code === 'BLOCK_A', 'first record is BLOCK_A');
assert(response9.data[1].code === 'BLOCK_B', 'second record is BLOCK_B');

// --- Test 10: Process is required in a Picking Lot request ---
console.log('\nTest 10: Process is required in a Picking Lot request');
const missingProcessError = validateRequest({
  harvestDate: '2026-08-03',
  varietyCode: 'SLN6',
  totalCherryWeightKg: 320,
  blockCodes: ['BLOCK01'],
});
assert(missingProcessError.errorCode === 'INVALID_PROCESS', 'missing processCode is rejected');

// --- Test 11: Regression - doPost still creates a Picking Lot ---
console.log('\nTest 11: Regression - doPost still creates a Picking Lot');
sheets['PickingLots'] = MockSheet('PickingLots', [
  ['LotID', 'HarvestDate', 'Block', 'Variety', 'Process', 'CherryWeightKg', 'CreatedDateTime', 'CreatedBy', 'Status'],
]);
sheets['PickingLotBlocks'] = MockSheet('PickingLotBlocks', [
  ['LotID', 'BlockCode'],
]);

const postResponse = parseResponse(
  doPost({
    postData: {
      contents: JSON.stringify({
        harvestDate: '2026-08-03',
        varietyCode: 'SLN6',
        processCode: 'NATURAL',
        totalCherryWeightKg: 320,
        blockCodes: ['BLOCK01', 'BLOCK03', 'BLOCK05'],
      }),
    },
  })
);
assert(postResponse.success === true, 'doPost success is true');
assert(postResponse.lotId === 'PL2608030001', `doPost generates LotID PL2608030001 (got ${postResponse.lotId})`);
assert(postResponse.status === 'CREATED', 'doPost status is CREATED');
assert(postResponse.message === 'Picking Lot created successfully.', 'doPost message is correct');

// --- Verify the data is ACTUALLY written to the sheets (guards against silent write bugs) ---
// PickingLots sheet: header + 1 data row. Row must use the deployed column layout:
// LotID | HarvestDate | Block | Variety | Process | CherryWeightKg | CreatedDateTime | CreatedBy | Status
const plRows = sheets['PickingLots'].rows;
assert(plRows.length === 2, `PickingLots has header + 1 data row (got ${plRows.length})`);
const plRow = plRows[1];
assert(plRow[0] === 'PL2608030001', `PickingLots LotID written (got ${plRow[0]})`);
assert(
  plRow[1] instanceof Date &&
    plRow[1].getUTCFullYear() === 2026 &&
    plRow[1].getUTCMonth() === 7 &&
    plRow[1].getUTCDate() === 3,
  'PickingLots HarvestDate written as 2026-08-03'
);
assert(plRow[2] === 'BLOCK01, BLOCK03, BLOCK05', `PickingLots Block written (got ${plRow[2]})`);
assert(plRow[3] === 'SLN6', `PickingLots Variety written (got ${plRow[3]})`);
assert(plRow[4] === 'NATURAL', `PickingLots Process written (got ${JSON.stringify(plRow[4])})`);
assert(plRow[5] === 320, `PickingLots CherryWeightKg written (got ${plRow[5]})`);
assert(plRow[6] instanceof Date, 'PickingLots CreatedDateTime written');
assert(plRow[7] === 'test@example.com', `PickingLots CreatedBy written (got ${plRow[7]})`);
assert(plRow[8] === 'CREATED', `PickingLots Status written (got ${plRow[8]})`);

// PickingLotBlocks sheet: header + one row per selected Block.
const plbRows = sheets['PickingLotBlocks'].rows;
assert(plbRows.length === 4, `PickingLotBlocks has header + 3 data rows (got ${plbRows.length})`);
assert(
  plbRows[1][0] === 'PL2608030001' && plbRows[1][1] === 'BLOCK01',
  `Block BLOCK01 written (got ${JSON.stringify(plbRows[1])})`
);
assert(
  plbRows[2][0] === 'PL2608030001' && plbRows[2][1] === 'BLOCK03',
  `Block BLOCK03 written (got ${JSON.stringify(plbRows[2])})`
);
assert(
  plbRows[3][0] === 'PL2608030001' && plbRows[3][1] === 'BLOCK05',
  `Block BLOCK05 written (got ${JSON.stringify(plbRows[3])})`
);

// --- Test 12: ApiLog sheet records every request body and response ---
console.log('\nTest 12: ApiLog sheet records every request body and response');
const apiLogRows = sheets['ApiLog'].rows;
assert(apiLogRows.length >= 3, `ApiLog has header + at least 2 logged calls (got ${apiLogRows.length})`);
assert(
  apiLogRows[0].join('|') === 'Timestamp|Method|Endpoint|RequestBody|ResponseBody',
  'ApiLog header row is written'
);

const postLog = apiLogRows.find((r) => r[1] === 'POST');
assert(!!postLog, 'POST call is logged to ApiLog');
assert(
  postLog[3] === JSON.stringify({
    harvestDate: '2026-08-03',
    varietyCode: 'SLN6',
    processCode: 'NATURAL',
    totalCherryWeightKg: 320,
    blockCodes: ['BLOCK01', 'BLOCK03', 'BLOCK05'],
  }),
  'POST request body is logged to ApiLog'
);
assert(
  postLog[4].includes('PL2608030001') && postLog[4].includes('Picking Lot created successfully.'),
  'POST response is logged to ApiLog'
);

const getLogs = apiLogRows.filter((r) => r[1] === 'GET');
assert(getLogs.length > 0, 'GET calls are logged to ApiLog');
assert(getLogs[0][3] === JSON.stringify({ resource: 'masterdata' }), 'GET request is logged to ApiLog');
assert(getLogs[0][4].includes('BLOCK_A'), 'GET MasterData response is logged to ApiLog');

// --- Summary ---
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
