10. Future Integration
Purpose

The Picking Lot is the first traceable entity in the coffee processing lifecycle. It acts as the parent record for all downstream processing. Future features will reference the Picking Lot using the LotID.

10.1 Tank Assignment
Purpose

Split a Picking Lot into one or more fermentation tanks.

Relationship
One Picking Lot
        │
        ├── Tank Assignment 1
        ├── Tank Assignment 2
        └── Tank Assignment 3
Data Passed
Field	Purpose
LotID	Parent reference
VarietyCode	Read-only
HarvestDate	Read-only
TotalCherryWeightKg	Available weight calculation
Selected Blocks	Reference only
Business Rules
One Picking Lot may be assigned to multiple tanks.
Each tank records its own assigned cherry weight.
Total assigned weight must not exceed the Picking Lot's total weight.
Tank Assignment changes the Picking Lot status to READY_FOR_FERMENTATION or PARTIALLY_ASSIGNED, depending on your future workflow.
10.2 Fermentation
Purpose

Track fermentation activities for each tank.

Relationship
Picking Lot

↓

Tank

↓

Fermentation Records
Data Passed
Field	Purpose
LotID	Traceability
TankID	Parent
VarietyCode	Read-only
Business Rules
Picking Lot data is read-only.
Fermentation records are linked through the Tank Assignment.
Process type (Natural, Washed, Honey, etc.) is first captured here.
Yeast selection is first captured here.
10.3 Drying
Purpose

Track movement from fermentation tanks to drying beds.

Relationship
Picking Lot

↓

Tank

↓

Drying Bed
Data Passed
LotID
TankID
Fermentation Summary
Start Dry Date
Business Rules
A single tank may be spread across multiple drying beds.
Each bed receives its own Bed ID and QR code (future).
10.4 Moisture Monitoring

Future feature.

Track:

Moisture %
Drying Date
Inspector
Weather notes
Bed turning records

This feature references:

Bed ID
Tank ID
Lot ID
10.5 Bagging
Purpose

Record the final dried coffee bags.

Relationship
Picking Lot

↓

Tank

↓

Bed

↓

Bag
Business Rules
One drying bed may produce multiple bags.
Each bag receives a unique Bag ID and QR code.
Each bag retains full traceability back to the Picking Lot.
10.6 Inventory

The inventory module will manage:

Bag locations
Available stock
Reserved stock
Sold stock

Every inventory record references:

Bag ID
Lot ID
10.7 QR Code Integration

Future enhancement.

QR codes will be generated for:

Picking Lot (optional)
Tank
Drying Bed
Bag

Scanning a QR code should open the corresponding record in the mobile application.

10.8 Reporting

The Picking Lot contributes to reports such as:

Harvest by Variety
Harvest by Block
Harvest by Date
Total Cherry Weight
Fermentation Yield
Drying Yield
Inventory
10.9 Authentication

Future versions will record:

Created By
Modified By
User Role

Examples:

Estate Manager
Supervisor
Administrator
10.10 Offline Synchronization

Future enhancement.

When offline:

Picking Lots are stored locally.
Records receive a temporary local identifier.
Synchronization occurs automatically when connectivity is restored.
The backend assigns the official Lot ID during synchronization.
10.11 Multilingual Support

All user-facing labels (Variety, Block, Status, etc.) are resolved from MasterData using the selected language (English or Kannada).

Business records store only language-independent codes.

10.12 External Integrations

Potential future integrations include:

Bluetooth moisture meters
Bluetooth weighing scales
Temperature and pH sensors
QR code printers
ERP or accounting software
Buyer-facing traceability portal



Integration Principles

Finish the section with a few guiding principles that every future feature should follow.

Picking Lot is immutable after downstream processing begins. If corrections are needed later, they should be handled through a controlled edit process or audit trail rather than silently changing historical data.
LotID is the primary traceability key used across all downstream features.
MasterData codes (not translated labels) are stored in all transactional data.
Every child feature (Tank, Bed, Bag, etc.) must reference its parent to maintain end-to-end traceability.
Business rules are enforced in the backend, while the UI provides immediate validation and guidance.