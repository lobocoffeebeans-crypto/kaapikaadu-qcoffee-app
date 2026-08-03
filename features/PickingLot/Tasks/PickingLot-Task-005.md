Objective

Connect the feature to the backend.

Read Before Starting
PickingLot.api.md
PickingLot.design.md
Scope

Implement:

PickingLotService
API client integration
Create Picking Lot request
Handle success response
Handle validation errors
Handle server errors
Handle network errors

Backend implementation:

Google Apps Script endpoint
Write to PickingLots
Write to PickingLotBlocks
Generate LotID
Set Status = CREATED
Out of Scope
Offline support
Authentication
QR codes
Acceptance Criteria
Successful save creates records in Google Sheets.
UI displays returned LotID.
Backend validation errors display correctly.
Network failures do not lose entered data.