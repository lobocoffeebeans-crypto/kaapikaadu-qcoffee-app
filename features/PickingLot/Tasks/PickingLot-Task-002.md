Objective

Implement the MasterData layer that supplies dropdown values to the UI.

Read Before Starting
features/PickingLot/PickingLot.feature.md
features/PickingLot/PickingLot.design.md
features/PickingLot/PickingLot.screen.md
features/PickingLot/PickingLot.api.md
Scope

Create:

MasterDataService
Mock MasterData repository
MasterDataOption model if not already created

Support retrieval of:

Variety
Block
Status

Support language selection:

English
Kannada

Return language-independent codes with translated labels.

Out of Scope
Google Sheets
Apps Script
Caching
Offline support
Acceptance Criteria
Mock service returns data correctly.
Dropdown-ready data structure is returned.
UI is not implemented.

Implemented PickingLot-Task-002: MasterData layer that supplies dropdown values to the UI.

## Files Created

### 1. `frontend/src/data/mockMasterData.ts` (New)

Mock MasterData repository storing language-independent codes with translated labels (English and Kannada):

- __`mockVarieties`__ - 6 coffee varieties (SLN6, SL28, Caturra, Bourbon, Typica, Geisha) with Kannada translations
- __`mockBlocks`__ - 5 blocks (BLOCK01-BLOCK05) with Kannada translations
- __`mockStatuses`__ - CREATED status with Kannada translation

### 2. `frontend/src/services/masterDataService.ts` (New)

MasterDataService class that supplies dropdown values to the UI:

- __`getOptions(category, language)`__ - Generic retrieval for any category (variety, block, status)
- __`getVarieties(language)`__ - Retrieves variety options
- __`getBlocks(language)`__ - Retrieves block options
- __`getStatuses(language)`__ - Retrieves status options
- __`DropdownOption`__ interface - Dropdown-ready structure `{ value, label }` matching the existing `Dropdown` component's expected format
- __`masterDataService`__ - Singleton instance for application-wide use
- Language resolution: Returns Kannada labels when `language='kn'` and available, falls back to English otherwise

### 3. `frontend/src/types/masterData.ts` (New)

Type definitions:

- __`Language`__ - `'en' | 'kn'` for English/Kannada support
- __`MasterDataCategory`__ - `'variety' | 'block' | 'status'`

### 4. `frontend/src/types/index.ts` (Modified)

Added exports for `Language` and `MasterDataCategory` types.

## Acceptance Criteria Verification

- ✅ __Mock service returns data correctly__ - Service returns data from mock repository with proper code/label structure
- ✅ __Dropdown-ready data structure is returned__ - Returns `{ value, label }` matching the existing `Dropdown` component's `DropdownOption` interface
- ✅ __UI is not implemented__ - No UI components were modified
- ✅ __MasterDataOption model exists__ - Already created in Task-001, reused without duplication
- ✅ __Build passes__ - `tsc -b && vite build` succeeds with exit code 0
- ✅ __Lint passes__ - `eslint .` succeeds with exit code 0



Added Playwright tests to verify Kannada labels in the MasterData dropdown fields, and wired the UI to use the MasterDataService.

## Changes Made

### 1. `frontend/src/pages/CreatePickingLot.tsx` (Modified)

Updated the page to use `masterDataService.getBlocks()` and `masterDataService.getVarieties()` instead of hardcoded constants. This ensures the dropdown options reflect the language set via the env file (`VITE_APP_LANGUAGE=kn`).

### 2. `frontend/playwright.config.ts` (New)

Playwright configuration:

- Test directory: `./tests`
- Base URL: `http://localhost:5173`
- Chromium project
- Auto-starts the Vite dev server via `webServer` config

### 3. `frontend/tests/kannada-labels.spec.ts` (New)

Three Playwright tests verifying Kannada labels:

1. __Block dropdown shows Kannada labels__ - Verifies all 5 block options display Kannada labels (ಬ್ಲಾಕ್ 1 through ಬ್ಲಾಕ್ 5)
2. __Variety dropdown shows Kannada labels__ - Verifies all 6 variety options display Kannada labels (ಎಸ್ಎಲ್ಎನ್ 6, ಎಸ್ಎಲ್ 28, ಕ್ಯಾಟುರಾ, ಬರ್ಬನ್, ಟಿಪಿಕಾ, ಗೀಶಾ)
3. __Dropdown values remain language-independent codes__ - Verifies the `value` attributes remain codes (BLOCK01, BLOCK05, SLN6, GEISHA) even though labels are translated

### 4. `frontend/package.json` (Modified)

- Added `@playwright/test` dev dependency
- Added `"test": "playwright test"` script

## Test Results

All 3 tests passed:

```javascript
[1/3] [chromium] › tests\kannada-labels.spec.ts:23:3 › Variety dropdown shows Kannada labels
[2/3] [chromium] › tests\kannada-labels.spec.ts:4:3 › Block dropdown shows Kannada labels
[3/3] [chromium] › tests\kannada-labels.spec.ts:43:3 › Dropdown values remain language-independent codes
  3 passed (12.9s)
```

## Verification

- ✅ __Playwright tests pass__ - All 3 tests confirm Kannada labels render correctly
- ✅ __Build passes__ - `tsc -b && vite build` succeeds
- ✅ __Lint passes__ - `eslint .` succeeds
- ✅ __Language-independent codes preserved__ - Test confirms dropdown values remain codes (BLOCK01, SLN6, etc.) while labels are translated to Kannada
