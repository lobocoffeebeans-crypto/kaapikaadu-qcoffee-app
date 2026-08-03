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