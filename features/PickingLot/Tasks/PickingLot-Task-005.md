Task 05A – Create Picking Lot API (Happy Path) -DONE 
Objective

Connect the Create Picking Lot screen to the backend and successfully create a Picking Lot.

Read Before Starting
features/PickingLot/PickingLot.feature.md
features/PickingLot/PickingLot.design.md
features/PickingLot/PickingLot.screen.md
features/PickingLot/PickingLot.api.md


Scope
Frontend

Implement:

PickingLotService
API client
Request DTO
Response DTO
Submit button integration
Loading indicator while saving
Disable Save button during request
Handle successful response
Display generated LotID
Navigate to Success screen (or success dialog)
Backend (Google Apps Script)

Implement:

HTTP POST endpoint
Request validation (required fields only)
Generate LotID
Write Picking Lot record
Write PickingLotBlocks records
Set Status = CREATED
Return success response
Out of Scope
Validation error handling
Network failures
Retry
Offline support
Authentication
QR codes
Acceptance Criteria
Save creates Picking Lot in Google Sheets.
PickingLotBlocks are created correctly.
LotID is generated correctly (PLYYMMDD0001).
Success response contains LotID.
UI displays generated LotID.
Save button cannot be pressed twice while saving.