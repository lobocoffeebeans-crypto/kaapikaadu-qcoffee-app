------------------------------------------------

New Picking Lot

Harvest Date

[03 Aug 2026]

-------------------------------------

Variety

[ SLN6 ▼ ]

-------------------------------------

Blocks

☑ Block 1

☑ Block 3

☑ Block 5

-------------------------------------

Total Cherry Weight

[320]

-------------------------------------

[SAVE]  [ CANCEL ] 

------------------------------------------------

Picking Lot - UI Validation Rules


| ID     | Field               | Validation                          | Error Message                         |
| ------ | ------------------- | ----------------------------------- | ------------------------------------- |
| UI-001 | Harvest Date        | Required                            | Harvest Date is required.             |
| UI-002 | Harvest Date        | Cannot be in the future             | Harvest Date cannot be in the future. |
| UI-003 | Variety             | Required                            | Please select a coffee variety.       |
| UI-004 | Blocks              | At least one block must be selected | Select at least one block.            |
| UI-005 | Total Cherry Weight | Required                            | Enter the total cherry weight.        |
| UI-006 | Total Cherry Weight | Must be numeric                     | Weight must be a valid number.        |
| UI-007 | Total Cherry Weight | Must be greater than zero           | Weight must be greater than zero.     |


Input Validation
Harvest Date

Allowed

Today
Yesterday
Any past date

Not Allowed

Tomorrow
Future dates

The date picker should prevent future dates if possible, with validation as a backup.

Variety

Must exist in MasterData.

The user should only be able to choose from the dropdown.

No free text.

Blocks

The user can select:

One block
Multiple blocks

The same block cannot be selected twice.


Save Button Rules
Save button is the primary button
The Save button should only be enabled when:

Harvest Date is valid
Variety selected
At least one Block selected
Weight > 0
Not currently saving

During save:

Disable all inputs
Disable Save button
Show loading indicator
Success Behaviour

After a successful save:

Display:

✅ Picking Lot Created

Lot ID: PL2608030001

Then:

Clear the form
Set Harvest Date back to today
Clear selected blocks
Clear weight
Leave focus on the first editable field (typically Variety)
Error Behaviour

If validation fails:

Do not call the API.
Highlight the invalid field.
Display the validation message below the field.
Focus the first invalid field when Save is pressed.
Accessibility
Every field should have a visible label.
Required fields should be marked with *.
Error messages should be associated with their field for screen readers.
All controls should be usable from the keyboard.
Validation Responsibility
Validation	UI	Backend
Harvest Date required	✅	✅
Future date	✅	✅
Variety selected	✅	✅
Block selected	✅	✅
Weight numeric	✅	✅
Weight > 0	✅	✅
Lot ID generation	❌	✅
Created DateTime	❌	✅
Created By	❌	✅
Status = CREATED	❌	✅

The duplication is intentional. The UI provides immediate feedback, while the backend enforces the rules regardless of how the request is made.

One validation I'd add for your estate workflow

I recommend adding a confirmation when the user has entered data but tries to leave the page without saving.

Rule UI-008 – Unsaved Changes /Cancel Button

If the user has modified any field and attempts to navigate away or refresh the page:
Show: "You have unsaved changes. Do you want to leave without saving?"
Options:
Leave
Stay


