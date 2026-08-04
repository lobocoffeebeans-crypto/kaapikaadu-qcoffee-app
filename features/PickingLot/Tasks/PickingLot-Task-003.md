Objective

Build the Create Picking Lot page.

Read Before Starting
features/PickingLot/PickingLot.feature.md
features/PickingLot/PickingLot.design.md
features/PickingLot/PickingLot.screen.md
features/PickingLot/PickingLot.api.md
Scope

Create the page with:

Harvest Date
Variety dropdown
Multi-select Blocks
Total Cherry Weight
Save button
Cancel button (if in design)

Use MasterDataService for dropdowns.

Implement responsive layout for mobile.

Out of Scope
Validation
API calls
Save logic
Acceptance Criteria
Screen matches the design.
Dropdowns load from MasterDataService.
Layout works on mobile.
No console errors.

Added Playwright tests for English error messages and Save/Cancel button behavior.

## Changes Made

### 1. `frontend/tests/english-labels.spec.ts` (New)
11 Playwright tests covering English language and button behavior:

**English labels in MasterData dropdowns (2 tests):**
- Block checkboxes show English labels (Block 1-5)
- Variety dropdown shows English labels (SLN6, SL28, Caturra, Bourbon, Typica, Geisha)

**English validation error messages (5 tests):**
- Empty harvest date → `Harvest Date is required.`
- Empty variety → `Please select a coffee variety.`
- No blocks selected → `Select at least one block.`
- Empty weight → `Enter the total cherry weight.`
- Negative weight → `Weight must be greater than zero.`

**Save and Cancel buttons (4 tests):**
- Save button is disabled when form is invalid
- Save button becomes enabled when form is valid (after filling all fields)
- Cancel button resets the form (harvest date resets to today per design, other fields cleared)
- Cancel button is always enabled

### 2. `frontend/.env.test` (New)
Test environment file with `VITE_APP_LANGUAGE=en` for running English tests.

### 3. `frontend/playwright.english.config.ts` (New)
Separate Playwright config for English tests:
- Runs on port 5174 with `--mode test` to load `.env.test`
- Only matches `english.*.spec.ts` test files

### 4. `frontend/playwright.config.ts` (Modified)
Updated to only match `kannada.*.spec.ts` test files, keeping the default config for Kannada tests.

### 5. `frontend/src/hooks/usePickingLot.ts` (Modified)
Changed form validation mode from `onBlur` to `onTouched` so that:
- Error messages appear on blur (as before)
- Save button enables/disables reactively as fields are filled (needed for the Save button test)

## Test Results
- ✅ **11 English tests pass** (18.2s)
- ✅ **8 Kannada tests pass** (6.6s)
- ✅ **Build passes** - `tsc -b && vite build` succeeds
- ✅ **Lint passes** - `eslint .` succeeds