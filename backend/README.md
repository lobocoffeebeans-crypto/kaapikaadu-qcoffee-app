# Picking Lot & MasterData API — Google Apps Script Backend

This directory contains the Google Apps Script backend for the Kaapikaadu Coffee PWA.

## Files

| File | Purpose |
| ---- | ------- |
| `Code.gs` | Google Apps Script Web App implementation (doPost + doGet) |
| `masterData.test.js` | Node test harness that mocks the Apps Script environment |

---

## Endpoints

The Web App is deployed at `{VITE_API_BASE_URL}` (ends in `/exec`).

### POST — Create Picking Lot

```
POST {VITE_API_BASE_URL}
```

Handled by `doPost(e)`. Creates a Picking Lot and its PickingLotBlocks records.

### GET — MasterData

```
GET {VITE_API_BASE_URL}?resource=masterdata
```

Handled by `doGet(e)`. Returns active MasterData records.

---

## MasterData API

### Request

```
GET https://script.google.com/macros/s/DEPLOYMENT_ID/exec?resource=masterdata
```

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "type": "BLOCK",
      "code": "BLOCK_A",
      "en": "Block A",
      "kn": "ಬ್ಲಾಕ್ A",
      "active": true,
      "sortOrder": 1
    }
  ]
}
```

### Rules

- Only **active** records are returned.
- **SortOrder** is preserved as-is (no alphabetical reordering).
- **Stable Code** values are returned; never replaced by display labels.
- English and Kannada labels are both returned.

### Error Responses

| Scenario | errorCode | message |
| -------- | --------- | ------- |
| MasterData sheet missing | `SHEET_NOT_FOUND` | `MasterData sheet not found.` |
| Required column missing | `MISSING_COLUMNS` | `MasterData sheet is missing required columns: ...` |
| Unknown resource | `INVALID_RESOURCE` | `Unknown resource requested.` |
| Unexpected error | `SERVER_ERROR` | `Something went wrong while loading data.` |

---

## Google Sheet Configuration

The spreadsheet must contain a sheet named **`MasterData`** with the following columns (header row 1):

| Column    | Required | Description                                        |
| --------- | -------- | -------------------------------------------------- |
| Type      | Yes      | MasterData category (e.g. `BLOCK`, `VARIETY`, `STATUS`) |
| Code      | Yes      | Stable internal identifier (e.g. `BLOCK_A`)        |
| English   | Yes      | English display label                              |
| Kannada   | Yes      | Kannada display label                              |
| Active    | Yes      | `TRUE`/`FALSE` — whether the record is available   |
| SortOrder | Yes      | Display ordering (numeric)                         |

The `Active` column accepts `TRUE`/`FALSE`, `true`/`false`, `1`/`0`, `YES`/`NO`, `Y`/`N`.

Example rows:

| Type    | Code     | English | Kannada   | Active | SortOrder |
| ------- | -------- | ------- | --------- | ------ | --------: |
| BLOCK   | BLOCK_A  | Block A | ಬ್ಲಾಕ್ A  | TRUE   | 1         |
| BLOCK   | BLOCK_B  | Block B | ಬ್ಲಾಕ್ B  | TRUE   | 2         |
| VARIETY | SLN6     | SLN6    | ಎಸ್ಎಲ್ಎನ್ 6 | TRUE   | 1         |
| STATUS  | CREATED  | Created | ರಚಿಸಲಾಗಿದೆ | TRUE   | 1         |

---

## Deployment Steps

1. Open the Google Apps Script project bound to the spreadsheet.
2. Replace the script contents with `backend/Code.gs`.
3. Save the project.
4. Deploy → New deployment → Web app.
5. Set:
   - **Execute as**: Me
   - **Who has access**: Anyone
6. Copy the Web App URL (ends in `/exec`).
7. Set `VITE_API_BASE_URL` in `frontend/.env` to that URL.
8. Restart the Vite dev server.

---

## Testing

Run the local test harness (mocks the Apps Script environment):

```bash
node backend/masterData.test.js
```

This verifies:

1. HTTP success response.
2. JSON is valid.
3. Active records are returned.
4. Inactive records are excluded.
5. SortOrder is preserved.
6. English and Kannada labels are returned.
7. Stable Code values are returned.
8. Error handling (sheet not found, missing columns, invalid resource, empty data).
9. Regression: existing `doPost` Picking Lot creation still works.

### Manual verification against the deployed Web App

```
GET .../exec?resource=masterdata
```

Verify:

1. HTTP success response.
2. JSON is valid.
3. Active records are returned.
4. Inactive records are excluded.
5. SortOrder is preserved.
6. English and Kannada labels are returned.
7. Stable Code values are returned.

---

## Test Results

```
39 passed, 0 failed
```

All MasterData API scenarios and the Picking Lot `doPost` regression pass.