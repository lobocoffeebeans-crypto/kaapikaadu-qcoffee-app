Objective

Implement the MasterData layer that supplies dropdown values to the UI.

Read Before Starting
PickingLot.design.md
docs/master-data.md
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