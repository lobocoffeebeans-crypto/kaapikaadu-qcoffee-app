# MasterData Documentation

## 1. Purpose

The MasterData system provides centrally managed reference data used by the Kaapikaadu Coffee application.

MasterData is maintained in Google Sheets and exposed to the React PWA through the Google Apps Script backend.

The frontend must not hard-code MasterData values.

### Architecture

```text
Google Sheets
     │
     │ MasterData
     ▼
Google Apps Script
     │
     │ GET ?resource=masterdata
     ▼
MasterData API
     │
     ▼
React MasterDataService
     │
     ▼
React UI
```

---

# 2. Design Principles

## 2.1 Google Sheets is the source of truth

MasterData values are maintained in the Google Sheets `MasterData` sheet.

The React application must not maintain a second production copy of MasterData.

Mock data may be used during development/testing but must not be used by the production UI after MasterData API integration is complete.

---

## 2.2 Stable codes are used internally

Every MasterData option has a stable `Code`.

Example:

```text
Code: BLOCK_A
English: Block A
Kannada: ಬ್ಲಾಕ್ A
```

The application stores and sends:

```text
BLOCK_A
```

It must never store or send the translated display label.

---

## 2.3 Display labels are language-dependent

The UI displays either:

* English
* Kannada

depending on the application language setting.

The application language is configured using:

```env
VITE_APP_LANGUAGE=en
```

or:

```env
VITE_APP_LANGUAGE=kn
```

The existing application `DEFAULT_LANGUAGE` implementation is the single mechanism for selecting the language.

---

# 3. Google Sheet Structure

## Sheet Name

```text
MasterData
```

## Columns

| Column    | Required | Description                                        |
| --------- | -------- | -------------------------------------------------- |
| Type      | Yes      | MasterData category                                |
| Code      | Yes      | Stable internal identifier                         |
| English   | Yes      | English display label                              |
| Kannada   | Yes      | Kannada display label                              |
| Active    | Yes      | Whether the record is available to the application |
| SortOrder | Yes      | Display ordering                                   |

---

# 4. MasterData Record

A MasterData record has the following logical structure:

```json
{
  "type": "BLOCK",
  "code": "BLOCK_A",
  "en": "Block A",
  "kn": "ಬ್ಲಾಕ್ A",
  "active": true,
  "sortOrder": 1
}
```

The exact property names used internally may differ if existing TypeScript types already define them, but the semantic meaning must remain the same.

---

# 5. MasterData Types

## 5.1 BLOCK

Used for estate blocks.

Example:

```text
Type: BLOCK
Code: BLOCK_A
English: Block A
Kannada: ಬ್ಲಾಕ್ A
Active: TRUE
SortOrder: 1
```

Current block options should be maintained in Google Sheets rather than hard-coded in React.

---

## 5.2 VARIETY

Used for coffee plant varieties.

Examples may include:

```text
Caturra
Bourbon
Typica
Geisha
SL28
SLN6
Old Robusta
```

The actual production list is maintained in Google Sheets.

Do not assume the example list is exhaustive.

---

## 5.3 PROCESS

Process is associated with the coffee processing method.

Examples:

```text
Washed
Natural
Honey
Anaerobic
```

The production list is maintained in Google Sheets.

---

## 5.4 STATUS

Used for application/entity status values.

Example:

```text
CREATED
```

Additional statuses should be added to Google Sheets when formally defined by the application design.

Status codes must be stable and must not depend on the display language.

---

# 6. Active Flag

The `Active` column controls whether a MasterData record is available to the application.

### Active

```text
TRUE
```

The record is returned by the MasterData API and may appear in the UI.

### Inactive

```text
FALSE
```

The record remains in Google Sheets for historical/reference purposes but is not returned to the UI.

Records should be deactivated rather than deleted when they have historical significance.

---

# 7. SortOrder

`SortOrder` controls the order in which MasterData options appear in the UI.

Example:

| Code    | English | SortOrder |
| ------- | ------- | --------: |
| BLOCK_A | Block A |         1 |
| BLOCK_B | Block B |         2 |
| BLOCK_C | Block C |         3 |
| BLOCK_D | Block D |         4 |

The frontend should respect this ordering.

Alphabetical ordering must not override `SortOrder`.

---

# 8. Language Support

The application supports:

```text
en = English
kn = Kannada
```

The language is selected through:

```env
VITE_APP_LANGUAGE
```

## English

```env
VITE_APP_LANGUAGE=en
```

Example:

```text
Code: BLOCK_A
Display: Block A
Value: BLOCK_A
```

## Kannada

```env
VITE_APP_LANGUAGE=kn
```

Example:

```text
Code: BLOCK_A
Display: ಬ್ಲಾಕ್ A
Value: BLOCK_A
```

### Important

Language affects only the display label.

It does not change:

* Code
* database value
* API value
* Google Sheet transaction value

---

# 9. Data Flow for Language

```text
Google Sheet

BLOCK_A
Block A
ಬ್ಲಾಕ್ A

        ↓

MasterData API

{
  "code": "BLOCK_A",
  "en": "Block A",
  "kn": "ಬ್ಲಾಕ್ A"
}

        ↓

MasterDataService

language = kn

        ↓

UI

Display: ಬ್ಲಾಕ್ A
Value: BLOCK_A
```

---

# 10. MasterData API

## Base URL

The application uses:

```env
VITE_API_BASE_URL
```

Example:

```env
VITE_API_BASE_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

The Google Apps Script Web App URL must end at:

```text
/exec
```

The frontend must not append REST-style paths such as:

```text
/api/masterdata
```

---

# 11. Get MasterData

## Request

```http
GET {VITE_API_BASE_URL}?resource=masterdata
```

Example:

```text
https://script.google.com/macros/s/DEPLOYMENT_ID/exec?resource=masterdata
```

---

# 12. API Response

Successful response:

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

The exact response property names must remain consistent with the API implementation and TypeScript contracts.

---

# 13. API Rules

The MasterData API must:

1. Read from the `MasterData` sheet.
2. Return active records.
3. Preserve stable codes.
4. Return English labels.
5. Return Kannada labels.
6. Preserve SortOrder.
7. Return valid JSON.
8. Not expose spreadsheet implementation details unnecessarily.

Inactive records should not be returned to the frontend.

---

# 14. Frontend MasterDataService

The React application accesses MasterData through:

```text
MasterDataService
```

The UI must not directly call:

```text
fetch(...)
```

for MasterData.

The service is responsible for:

* API communication
* response parsing
* validation
* language selection
* filtering
* exposing MasterData to UI components

---

# 15. MasterData Loading

MasterData should be loaded once for the application/session rather than making separate requests for each dropdown.

Preferred flow:

```text
masterDataService.load()
        ↓
all MasterData loaded
        ↓
UI components consume relevant subsets
```

Do not make separate API calls for:

```text
Blocks
Varieties
Processes
Statuses
```

unless a future requirement specifically requires it.

---

# 16. UI Usage

The UI should work with:

```text
Code
+
Display Label
```

Example:

```typescript
{
  value: "BLOCK_A",
  label: "Block A"
}
```

For Kannada:

```typescript
{
  value: "BLOCK_A",
  label: "ಬ್ಲಾಕ್ A"
}
```

The UI submits:

```text
BLOCK_A
```

not:

```text
Block A
```

and not:

```text
ಬ್ಲಾಕ್ A
```

---

# 17. Mock Data

Mock MasterData may be used during initial development.

Once the MasterData API integration is complete and verified:

* remove production usage of mock data
* remove obsolete mock files
* remove unused imports
* remove duplicate MasterData definitions

There should be one production source of MasterData:

```text
Google Sheets
```

---

# 18. Error Handling

The application must handle:

### Network Error

Example:

```text
Unable to load MasterData.
Please check your connection and try again.
```

### API Error

The application should use the existing API error-handling conventions.

### Invalid Response

If the API returns malformed or unexpected data, the application must not crash.

### Empty MasterData

If no active records are returned, the UI should handle the empty state gracefully.

---

# 19. Caching

For the current POC:

* MasterData may be held in application memory.
* Do not implement persistent caching.
* Do not implement offline synchronization.

Offline MasterData support is a future enhancement.

---

# 20. Backend Separation

The MasterData API must not interfere with the existing Picking Lot API.

Existing:

```text
POST /exec
    ↓
doPost(e)
    ↓
createPickingLot()
```

MasterData:

```text
GET /exec?resource=masterdata
    ↓
doGet(e)
    ↓
read MasterData sheet
```

Both are served by the same Google Apps Script Web App.

---

# 21. Picking Lot Integration

The Picking Lot UI uses MasterData for dropdown/reference values.

For example:

```text
Block
Variety
Process
Status
```

The selected values submitted when creating a Picking Lot must always be stable codes.

Example:

```json
{
  "blockCode": "BLOCK_A",
  "varietyCode": "SLN6"
}
```

The API must not receive:

```json
{
  "blockCode": "ಬ್ಲಾಕ್ A",
  "varietyCode": "ಎಸ್‌ಎಲ್‌ಎನ್6"
}
```

---

# 22. Future MasterData Categories

The system is designed to support additional categories without changing the core architecture.

Potential future categories include:

```text
YEAST
TANK
FERMENTATION_METHOD
DRYING_METHOD
BED
PROCESSING_METHOD
PACKAGING_TYPE
```

These should be added to the MasterData sheet rather than hard-coded into the React application.

However, domain-specific validation may be required for some categories.

---

# 23. Out of Scope

The MasterData implementation does not currently include:

* Authentication
* Offline synchronization
* QR codes
* User management
* Audit history
* MasterData editing from the PWA
* Role-based access control

MasterData is currently maintained directly in Google Sheets.

---

# 24. Testing Requirements

The implementation should verify:

### API

* MasterData endpoint returns successfully.
* JSON response is valid.
* Active records are returned.
* Inactive records are excluded.
* SortOrder is preserved.

### Language

English:

```text
BLOCK_A → Block A
```

Kannada:

```text
BLOCK_A → ಬ್ಲಾಕ್ A
```

### Stable values

Both languages must produce:

```text
BLOCK_A
```

as the stored/submitted value.

### Error handling

Verify:

* network failure
* API failure
* invalid response
* empty response

### Regression

Verify existing Picking Lot creation continues to work.

---

# 25. Environment Configuration

Development:

```env
VITE_APP_LANGUAGE=en
VITE_API_BASE_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

Kannada testing:

```env
VITE_APP_LANGUAGE=kn
VITE_API_BASE_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

After changing `.env`, restart the Vite development server.

---

# 26. Change Management

Changes to MasterData values should generally be made in Google Sheets.

Changes to the MasterData structure or API contract require corresponding updates to:

1. Google Apps Script
2. API documentation
3. TypeScript models
4. MasterDataService
5. Tests

Do not silently change the meaning of an existing Code.

For example, once:

```text
BLOCK_A
```

has been used in transaction records, its meaning should remain stable.

---

# 27. Summary

MasterData follows a simple separation of responsibilities:

```text
Google Sheets
    = Source of truth

Google Apps Script
    = API / data access

MasterDataService
    = Frontend data abstraction

Language configuration
    = Display language

Code
    = Stable application/database value

React UI
    = Display and user selection
```

The most important rule is:

> **Display labels may change by language, but the underlying Code must remain stable.**
