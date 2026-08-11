
Status -DONE
# Task 006-02 — Implement MasterData Google Apps Script API

## Objective

Expose the Google Sheets `MasterData` sheet through the existing Google Apps Script Web App.

The frontend will later retrieve MasterData using:

`GET {VITE_API_BASE_URL}?resource=masterdata`

## Context

The existing backend already supports Picking Lot creation through:

`POST /exec`

with:

`doPost(e)`

Do NOT break or redesign the existing Picking Lot POST endpoint.

## Read Before Starting

Read:

1. `PickingLot.design.md`
2. `PickingLot.api.md`
4. Existing Google Apps Script code
5. Existing MasterData documentation at master-data.md

Inspect the existing `doPost(e)` implementation before making changes.

## Scope

Implement `doGet(e)` support for:

`resource=masterdata`

Conceptually:

doGet(e)
→ read e.parameter.resource
→ if resource == "masterdata"
→ read MasterData sheet
→ convert rows to JSON
→ return JSON response

## MasterData columns

The sheet contains:

* Type
* Code
* English
* Kannada
* Active
* SortOrder

Use the actual column names from the existing sheet if they are already established.

## Response

Return JSON in the project's existing API response format.

Expected logical structure:

{
"success": true,
"data": [
{
"type": "BLOCK",
"code": "BLOCK_A",
"en": "Block A",
"kn": "ಬ್ಲಾಕ್ A",
"sortOrder": 1
}
]
}

Do not invent a different response structure if `PickingLot.api.md` or existing API conventions define one.

## Rules

### Active

Only return active MasterData records.

Inactive records must not be returned to the frontend.

### SortOrder

Preserve SortOrder in the response.

Do not alphabetically sort unless the existing design explicitly requires it.

### Stable codes

Return the stable Code.

Never replace Code with the English or Kannada display label.

## Error handling

Handle:

* MasterData sheet not found
* Missing required columns
* Invalid MasterData data
* Empty MasterData

Use the existing backend error response convention if one exists.

Do not expose unnecessary internal error details.

## Important

Do NOT modify:

`doPost(e)`

unless absolutely necessary.

The existing Picking Lot API must continue to work.

Do NOT implement:

* authentication
* offline support
* caching
* QR codes
* frontend changes

## Testing

Test the deployed Apps Script Web App with:

`GET .../exec?resource=masterdata`

Verify:

1. HTTP success response.
2. JSON is valid.
3. Active records are returned.
4. Inactive records are excluded.
5. SortOrder is preserved.
6. English and Kannada labels are returned.
7. Stable Code values are returned.

## Deliverable

Provide:

* Apps Script changes.
* Any required Google Sheet configuration.
* Example API response.
* Test result.
* Any deployment steps required.

Do not modify unrelated code.


Implemented Task 006-02 — MasterData Google Apps Script API support in the existing backend.

## Changes Made

### 1. `backend/Code.gs` (Modified)
Added `doGet(e)` support for `resource=masterdata` without modifying the existing `doPost(e)` Picking Lot endpoint:
- **`doGet(e)`** — dispatches on `e.parameter.resource`; `masterdata` → `handleMasterData()`, otherwise returns `INVALID_RESOURCE`.
- **`handleMasterData()`** — reads the `MasterData` sheet, validates required columns, converts rows to the project's existing API response format.
- **`buildColumnMap()`** — maps header names to column indexes (column-order independent).
- **`isActive()`** — interprets the Active column (TRUE/FALSE, true/false, 1/0, YES/NO, Y/N).
- **`toNumber()`** — converts SortOrder to a number.
- Added `MASTER_DATA_SHEET` and `MD_*` column constants.

Response format follows the existing API convention:
```json
{ "success": true, "data": [ { "type": "BLOCK", "code": "BLOCK_A", "en": "Block A", "kn": "ಬ್ಲಾಕ್ A", "active": true, "sortOrder": 1 } ] }
```

Rules enforced:
- Only **active** records returned; inactive excluded.
- **SortOrder** preserved as-is (no alphabetical reordering).
- **Stable Code** values returned (never replaced by labels).
- English and Kannada labels both returned.

Error handling covers: sheet not found (`SHEET_NOT_FOUND`), missing required columns (`MISSING_COLUMNS`), unknown resource (`INVALID_RESOURCE`), empty data (returns `data: []`), and unexpected errors (`SERVER_ERROR`) — without exposing internal details. `doPost` remains untouched.

### 2. `backend/masterData.test.js` (New)
Node test harness mocking the Apps Script environment. **39 tests pass, 0 failed**, covering:
- Success response & valid JSON
- Active records returned / inactive excluded
- SortOrder preserved
- English & Kannada labels returned
- Stable codes returned
- Error handling (sheet not found, missing columns, invalid resource, empty data, blank rows)
- **Regression**: existing `doPost` Picking Lot creation still works (generates `PL2608030001`, status `CREATED`)

### 3. `backend/README.md` (New)
Deliverable documentation: Apps Script changes, Google Sheet configuration (MasterData columns + example rows), example API response, deployment steps, and manual verification checklist.

## Verification
- `node --check` on the Apps Script syntax: passes.
- `node backend/masterData.test.js`: **39 passed, 0 failed**.
- Frontend build (`tsc -b && vite build`): passes (confirms no regression to the existing PWA).

## Deployment (required to go live)
1. Open the Google Apps Script project bound to the spreadsheet.
2. Paste `backend/Code.gs` contents.
3. Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
4. Verify with: `GET .../exec?resource=masterdata`
5. The `VITE_API_BASE_URL` in `frontend/.env` already points to the deployment.

No frontend changes were made, as explicitly out of scope for this task.