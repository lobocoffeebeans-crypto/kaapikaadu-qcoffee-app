1. Overview

2. UI Design

3. Data Model

4. Google Sheets Design

5. API Design

6. Validation Rules

7. State Management

8. Navigation

9. Error Handling

10. Future Integration


1. Overview
The Picking Lot feature records harvested coffee cherries before fermentation begins. It creates the first traceable entity in the processing lifecycle and provides the source lot for downstream tank assignment.

2. UI Design
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

SAVE

------------------------------------------------

3.Data Model



| Field               | Required |
| ------------------- | -------- |
| LotID               | ✓        |
| HarvestDate         | ✓        |
| Variety             | ✓        |
| TotalCherryWeightKg | ✓        |
| Status              | ✓        |
| CreatedDateTime     | ✓        |
| CreatedBy           | ✓        |


| Field     | Required |
| --------- | -------- |
| LotID     | ✓        |
| BlockCode | ✓        |


Example:

LotID	Block
PL2608030001	BLOCK1
PL2608030001	BLOCK3
PL2608030001	BLOCK5

interface PickingLot {

    lotId:string;

    harvestDate:Date;

    variety:string;
    
    process :string;

    totalCherryWeightKg:number;

    floats?:number;

    greenCoffee?:number;

    blocks:string[];

    status:string;

}


4. Google Sheet Design
PickingLots

Column	Field	Example	Stored As
A	LotID	PL2608030001	Text
B	HarvestDate	03-Aug-2026	Date
C	Block	BLOCK01, BLOCK03, BLOCK05	Text (comma-separated)
D	Variety	SLN6	Code
E	Process	NAturals	Text
F	CherryWeightKg	320	Number
G	Floats	5	Number (optional)
H	GreenCoffee	2.5	Number (optional)
I	CreatedDateTime	03-Aug-2026 16:10	DateTime
J	CreatedBy	Austin	Text
K	Status	CREATED	Code


2. PickingLotBlocks (normalized detail)
Column	Field
A	LotID
B	BlockCode

