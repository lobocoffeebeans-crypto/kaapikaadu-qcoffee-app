# Task 007 — Add Floats and Green Coffee Fields

## Status

Done

## Objective

Add two optional numeric fields to the Create Picking Lot form and persist
their values in the PickingLots Google Sheet and the API request log.

## Read Before Starting

Read:

1. `features/PickingLot/PickingLot.feature.md`
2. `features/PickingLot/PickingLot.screen.md`
3. `features/PickingLot/PickingLot.api.md`
4. `backend/README.md`
5. The existing frontend request types and Apps Script write/logging code

## Scope

### Frontend

Add these optional number fields to the Create Picking Lot form:

| Label | Input type | Required |
|---|---|---|
| Floats | Number | No |
| Green Coffee | Number | No |

Include both fields in the form model and create-request type. Leaving either
field blank must not prevent a Picking Lot from being submitted. Preserve
entered numeric values; do not convert a blank value to zero.

### API contract

Add the optional numeric request properties:

| Property | Type | Required |
|---|---|---|
| `floats` | Number | No |
| `greenCoffee` | Number | No |

Update the Picking Lot API documentation and request example to show both
properties.

### Google Sheets backend

Add `Floats` and `GreenCoffee` numeric columns to the `PickingLots` sheet.
Append them after  the existing column CherryWeightKg and move the existing columns CreatedDate ,CreatedBy and Status. Update the Apps Script write logic to store supplied values in
their corresponding columns; leave a cell blank when its optional value is
not supplied.

### API logging

Ensure the `ApiLog` request body records the supplied `floats` and
`greenCoffee` values. Do not add a separate logging path if the existing
request-body logging already captures them.

## Acceptance Criteria

1. The Create Picking Lot form displays **Floats** and **Green Coffee** as
   optional number inputs.
2. A Picking Lot can be saved with either or both fields left blank.
3. Supplied values are sent as numbers in the request and written to the
   matching `PickingLots` columns.
4. Blank values are stored as blank cells, not coerced to zero.
5. The `ApiLog` request body includes supplied values for both fields.
6. API documentation, frontend types, and backend sheet documentation agree
   on the optional field names and types.
7. Verify the created sheet row and its corresponding `ApiLog` entry.

## Out of Scope

- Changing the meaning, unit, or business rules for Floats or Green Coffee.
- Adding required-field or positive-value validation for either field.
