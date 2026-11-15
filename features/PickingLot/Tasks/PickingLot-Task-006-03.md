# Task 006-03 — Frontend MasterData API Client

## Objective

Connect the React application to the Google Apps Script MasterData API.

Do NOT change the Picking Lot UI yet.

The goal is only to retrieve and expose MasterData through a frontend service.


MasterData API:

`GET {VITE_API_BASE_URL}?resource=masterdata`

## Read Before Starting

Read:


1. `PickingLot.design.md`
2. `PickingLot.api.md`
4. Existing Google Apps Script code
5. Existing MasterData documentation at master-data.md


Do not create a parallel architecture if an API/service pattern already exists.



The MasterData request must be:

`${VITE_API_BASE_URL}?resource=masterdata`

Do NOT append:

`/api/masterdata`

## MasterDataService

Create or update the existing MasterData service.

It should provide a method equivalent to:

`load()`

The service should make ONE API request and load all MasterData.

Do NOT make separate requests for:

* Blocks
* Varieties
* Processes
* Statuses

## Data model

Reuse existing types where possible.

Conceptually:

MasterDataItem:

* type
* code
* en
* kn
* sortOrder

The service may expose UI-friendly objects if that matches the existing architecture.

## Language

Do NOT change the existing language implementation.

Use the existing:

`DEFAULT_LANGUAGE`

and:

`VITE_APP_LANGUAGE`

implementation.

Do not introduce another language mechanism.

## Caching

For this task, keep the loaded MasterData in application memory so multiple UI components do not trigger multiple API requests.

Do not implement persistent/offline caching.

## Error handling

Handle:

* HTTP errors
* Network errors
* Invalid JSON
* Invalid response shape
* Empty response

Use the project's existing error-handling conventions.

## Scope restrictions

Do NOT:

* change Picking Lot UI
* remove mock data yet
* implement offline support
* modify Picking Lot POST API
* modify Google Sheets transaction logic
* implement authentication

## Testing

Add/update tests for:

1. Successful API response.
2. Response parsing.
3. Invalid response.
4. Network failure.
5. Empty response.

## Manual test

Run the application.

Open Chrome DevTools → Network.

Call the MasterData service.

Verify exactly one request:

`GET .../exec?resource=masterdata`

Verify the response contains real Google Sheet data.

 
## Deliverable

Report:

* Files changed.
* Service/API changes.
* Tests added.
* Commands executed.
* Any remaining issue.

Do not modify unrelated functionality.
