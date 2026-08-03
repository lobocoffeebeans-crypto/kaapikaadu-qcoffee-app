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

    totalCherryWeightKg:number;

    blocks:string[];

    status:string;

}


4. Google Sheet Design
PickingLots

Column	Field	Example	Stored As
A	LotID	PL2608030001	Text
B	HarvestDate	03-Aug-2026	Date
C	VarietyCode	SLN6	Code
D	TotalCherryWeightKg	320	Number
E	StatusCode	CREATED	Code
F	CreatedDateTime	03-Aug-2026 16:10	DateTime
G	CreatedBy	Austin	Text


2. PickingLotBlocks
Column	Field
A	LotID
B	BlockCode

