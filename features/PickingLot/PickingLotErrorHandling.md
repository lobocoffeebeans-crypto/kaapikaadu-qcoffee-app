
1. UI Errors Talking to Backend

This belongs in PickingLot.design.md under Error Handling.

Validation Errors (400)

Example:

User enters future date

↓

API

↓

400

↓

Display

Harvest Date cannot be in the future.

The form remains editable.

Network Error

Example:

No Internet

↓

Save

↓

Cannot reach server.

Show:

❌ Unable to connect.

Please check your internet connection.

[Retry]

Do not clear the form.

Server Error

Example:

Google Apps Script throws exception.

Show:

Something went wrong while saving.

Please try again.

[Retry]
Timeout

Example

Saving...

10 seconds

↓

Timeout

Show

Server is taking longer than expected.

Retry?
Duplicate Submit

User presses Save twice.

Should result in

Saving...

Save button disabled

Only one API request.

What happens if

network fails
API unavailable
Google Sheet locked