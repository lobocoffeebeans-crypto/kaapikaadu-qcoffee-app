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
