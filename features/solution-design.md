What the current code does
Variety, Blocks, and Weight: The form collects these, maps them into the POST payload, and the backend writes them. The frontend test checks the payload; the backend test checks the sheet writes.
Process: The form requires a processing method and submits its stable `processCode` (for example, `NATURAL`). The backend validates and stores that code in the PickingLots Process column.
Master data read: The form loads active rows from the Apps Script MasterData endpoint. The service uses the fetched records for variety and block options, resolving labels by language and retaining mock options only before data has been loaded.
Relevant implementation: CreatePickingLot.tsx, masterDataService.ts, and Code.gs.