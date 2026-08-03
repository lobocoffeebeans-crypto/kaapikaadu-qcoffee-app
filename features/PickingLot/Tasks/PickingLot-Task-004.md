Objective

Implement all UI validation rules.

Read Before Starting
PickingLot.design.md
PickingLot.test.md
Scope

Implement validation for:

Harvest Date required
Harvest Date not in future
Variety required
At least one Block selected
Weight required
Weight numeric
Weight > 0

Display validation messages inline.

Disable Save until the form is valid.

Prevent duplicate submissions while saving.

Out of Scope
Backend validation
API calls
Acceptance Criteria
All validation scenarios from PickingLot.test.md pass.
First invalid field receives focus after Save.
Error messages clear when corrected.