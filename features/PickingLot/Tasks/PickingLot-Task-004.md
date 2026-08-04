Objective

Implement all UI validation rules.

Read Before Starting
features/PickingLot/PickingLot.feature.md
features/PickingLot/PickingLot.design.md
features/PickingLot/PickingLot.screen.md
features/PickingLot/PickingLot.api.md
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

Display Message when Save is successful

Prevent duplicate submissions while saving.

Out of Scope
Backend validation
API calls
Acceptance Criteria
All validation scenarios from PickingLot.test.md pass.
First invalid field receives focus after Save.
Error messages clear when corrected.

