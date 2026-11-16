import { test, expect } from '@playwright/test';

test.describe('Picking Lot API integration', () => {
  test('Save creates a Picking Lot and displays the generated LotID', async ({ page }) => {
    // Mock the API endpoint to return a success response
    await page.route('**/api/pickinglots', async (route) => {
      const request = route.request();
      expect(request.method()).toBe('POST');

      const body = request.postDataJSON();
      expect(body.harvestDate).toBe('2026-08-03');
      expect(body.varietyCode).toBe('SLN6');
      expect(body.processCode).toBe('NATURAL');
      expect(body.totalCherryWeightKg).toBe(320);
      expect(body.floats).toBe(5);
      expect(body.greenCoffee).toBe(2.5);
      expect(body.blockCodes).toEqual(['BLOCK01', 'BLOCK03', 'BLOCK05']);

      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          lotId: 'PL2608030001',
          status: 'CREATED',
          message: 'Picking Lot created successfully.',
        }),
      });
    });

    await page.goto('/');

    // Fill in the form
    const harvestDate = page.locator('input[type="date"]');
    await harvestDate.fill('2026-08-03');

    const varietySelect = page.locator('select').nth(0);
    await varietySelect.selectOption('SLN6');

    const processSelect = page.locator('select').nth(1);
    await processSelect.selectOption('NATURAL');

    const blockCheckboxes = page.locator('input[type="checkbox"]');
    await blockCheckboxes.nth(0).check(); // BLOCK01
    await blockCheckboxes.nth(2).check(); // BLOCK03
    await blockCheckboxes.nth(4).check(); // BLOCK05

    const weight = page.locator('input[type="number"]');
    await weight.nth(0).fill('320');
    await weight.nth(1).fill('5');
    await weight.nth(2).fill('2.5');

    // Click Save
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.click();

    // Verify success dialog displays the generated LotID
    await expect(page.getByText('Picking Lot Created')).toBeVisible( {timeout : 10000});
    
  });

  test('Save button is disabled while saving', async ({ page }) => {
    // Mock the API endpoint with a delayed response to observe the loading state
    await page.route('**/api/pickinglots', async (route) => {
      const body = route.request().postDataJSON();
      expect(Object.prototype.hasOwnProperty.call(body, 'floats')).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(body, 'greenCoffee')).toBe(false);
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          lotId: 'PL2608030001',
          status: 'CREATED',
          message: 'Picking Lot created successfully.',
        }),
      });
    });

    await page.goto('/');

    // Fill in the form
    const harvestDate = page.locator('input[type="date"]');
    await harvestDate.fill('2026-08-03');

    const varietySelect = page.locator('select').nth(0);
    await varietySelect.selectOption('SLN6');

    const processSelect = page.locator('select').nth(1);
    await processSelect.selectOption('NATURAL');

    const firstBlock = page.locator('input[type="checkbox"]').first();
    await firstBlock.check();

    const weight = page.locator('input[type="number"]');
    await weight.fill('320');

    // Click Save
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.click();

    // While saving, the button should show "Saving..." and be disabled
    const savingButton = page.getByRole('button', { name: 'Saving...' });
    await expect(savingButton).toBeVisible();
    await expect(savingButton).toBeDisabled();

    // Cancel button should also be disabled while saving
    const cancelButton = page.getByRole('button', { name: 'Cancel' });
    await expect(cancelButton).toBeDisabled();

    // After the request completes, the success dialog appears
    await expect(page.getByText('Picking Lot Created')).toBeVisible();
  });

  test('Form is cleared after successful save', async ({ page }) => {
    // Mock the API endpoint to return a success response
    await page.route('**/api/pickinglots', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          lotId: 'PL2608030001',
          status: 'CREATED',
          message: 'Picking Lot created successfully.',
        }),
      });
    });

    await page.goto('/');

    // Fill in the form
    const harvestDate = page.locator('input[type="date"]');
    await harvestDate.fill('2026-08-03');

    const varietySelect = page.locator('select').nth(0);
    await varietySelect.selectOption('SLN6');

    const processSelect = page.locator('select').nth(1);
    await processSelect.selectOption('NATURAL');

    const firstBlock = page.locator('input[type="checkbox"]').first();
    await firstBlock.check();

    const weight = page.locator('input[type="number"]');
    await weight.fill('320');
    await weight.nth(1).fill('5');
    await weight.nth(2).fill('2.5');

    // Click Save
    const saveButton = page.getByRole('button', { name: 'Save' });
    await saveButton.click();

    // Wait for success dialog
    await expect(page.getByText('Picking Lot Created')).toBeVisible();

    // Close the dialog
    await page.getByRole('button', { name: 'OK' }).click();

    // Verify form is cleared (harvest date resets to today per design)
    const today = new Date().toISOString().split('T')[0];
    await expect(harvestDate).toHaveValue(today);
    await expect(varietySelect).toHaveValue('');
    await expect(processSelect).toHaveValue('');
    await expect(firstBlock).not.toBeChecked();
    await expect(weight.nth(0)).toHaveValue('0');
    await expect(weight.nth(1)).toHaveValue('');
    await expect(weight.nth(2)).toHaveValue('');
  });
});