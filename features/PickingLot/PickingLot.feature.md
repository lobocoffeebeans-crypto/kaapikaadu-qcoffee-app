PickingLot Feature - Version 1 Business Definition
Purpose

A Picking Lot is the first traceable entity in the coffee processing lifecycle.

It records harvested cherries before any processing decisions are made.

Business Definition

A Picking Lot:

represents one coffee variety
for one harvest date
may contain cherries from one or more blocks
records the combined cherry weight
is the parent entity for all downstream processing (tank assignment, fermentation, drying, bagging).
Business Rules
ID	Rule
BR-001	A Picking Lot contains exactly one coffee variety.
BR-002	A Picking Lot may contain one or more blocks.
BR-003	Harvest Date may be today or a past date. Future dates are not allowed. Default Date is Today
BR-004	Total Cherry Weight is measured after combining cherries from all selected blocks.Default zero. Must be greater or equal to zero
BR-005	Process is not selected at this stage.
BR-006	Yeast is not selected at this stage.
BR-007	Tank assignment is not selected at this stage.
BR-008	Lot ID is generated automatically.
BR-009	Status is automatically set to CREATED.
BR-010	One variety harvested on one day results in one Picking Lot, even if harvesting occurs in multiple sessions throughout the day.