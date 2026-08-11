Task 04B – API Error Handling & Resilience
Objective

Handle all API failure scenarios gracefully without losing user-entered data.

Read Before Starting
PickingLot.api.md
PickingLot.design.md
Scope
Frontend

Implement handling for:

Validation Errors (400)

Display field-specific validation messages.

Example:

Harvest Date is required.
Business Rule Errors (422)

Example:

Harvest Date cannot be in the future.
Server Errors (500)

Show generic message:

Something went wrong.
Please try again.
Network Errors

Examples:

No internet
Request timeout
Google Apps Script unavailable

Display:

Unable to connect.

Your data has not been lost.

Please try again.

Keep all entered values on the screen.

Unexpected Response

Handle:

Invalid JSON
Missing LotID
Unknown status
Backend

Return consistent error responses.

Example:

{
  "success": false,
  "errorCode": "VALIDATION_ERROR",
  "message": "...",
  "fieldErrors": [
    {
      "field": "harvestDate",
      "messageKey": "validation.harvestDate.future"
    }
  ]
}
Out of Scope
Offline queue
Automatic retry
Conflict resolution
Acceptance Criteria
Validation errors display against the correct fields.
Server errors display a generic error message.
Network errors retain all entered form data.
Unknown errors do not crash the app.
User can retry after fixing the issue.