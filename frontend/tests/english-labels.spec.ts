import { test, expect } from '@playwright/test';

test.describe('English labels in MasterData dropdowns', () => {
  test('Block checkboxes show English labels', async ({ page }) => {
    await page.goto('/');

    // Verify English labels are present in the Block checkbox labels
    const blockLabels = page.locator('label', { has: page.locator('input[type="checkbox"]') });
    await expect(blockLabels).toHaveCount(5);

    const texts = await blockLabels.allTextContents();
    expect(texts.some((t) => t.includes('Block 1'))).toBeTruthy();
    expect(texts.some((t) => t.includes('Block 2'))).toBeTruthy();
    expect(texts.some((t) => t.includes('Block 3'))).toBeTruthy();
    expect(texts.some((t) => t.includes('Block 4'))).toBeTruthy();
    expect(texts.some((t) => t.includes('Block 5'))).toBeTruthy();
  });

  test('Variety dropdown shows English labels', async ({ page }) => {
    await page.goto('/');

    // Open the Variety dropdown
    const varietySelect = page.locator('select').nth(0);
    await varietySelect.click();

    // Verify English labels are present in the Variety dropdown options
    const varietyOptions = varietySelect.locator('option');
    await expect(varietyOptions).toHaveCount(7); // placeholder + 6 varieties

    const varietyLabels = await varietyOptions.allTextContents();
    expect(varietyLabels).toContain('SLN6');
    expect(varietyLabels).toContain('SL28');
    expect(varietyLabels).toContain('Caturra');
    expect(varietyLabels).toContain('Bourbon');
    expect(varietyLabels).toContain('Typica');
    expect(varietyLabels).toContain('Geisha');
  });
});

test.describe('English validation error messages', () => {
  test('Shows English error for empty harvest date', async ({ page }) => {
    await page.goto('/');

    // Clear the harvest date field
    const harvestDate = page.locator('input[type="date"]');
    await harvestDate.fill('');

    // Trigger validation by blurring
    await harvestDate.blur();

    // Verify English error message appears
    await expect(page.getByText('Harvest Date is required.')).toBeVisible();
  });

  test('Shows English error for empty variety', async ({ page }) => {
    await page.goto('/');

    // Focus and blur the variety dropdown without selecting
    const varietySelect = page.locator('select').nth(0);
    await varietySelect.focus();
    await varietySelect.blur();

    // Verify English error message appears
    await expect(page.getByText('Please select a coffee variety.')).toBeVisible();
  });

  test('Shows English error for no blocks selected', async ({ page }) => {
    await page.goto('/');

    // Focus and blur the blocks section without selecting
    const firstBlock = page.locator('input[type="checkbox"]').first();
    await firstBlock.focus();
    await firstBlock.blur();

    // Verify English error message appears
    await expect(page.getByText('Select at least one block.')).toBeVisible();
  });

  test('Shows English error for empty weight', async ({ page }) => {
    await page.goto('/');

    // Clear the weight field
    const weight = page.locator('input[type="number"]');
    await weight.fill('');

    // Trigger validation by blurring
    await weight.blur();

    // Verify English error message appears
    await expect(page.getByText('Enter the total cherry weight.')).toBeVisible();
  });

  test('Shows English error for weight less than zero', async ({ page }) => {
    await page.goto('/');

    // Enter a negative weight
    const weight = page.locator('input[type="number"]');
    await weight.fill('-5');

    // Trigger validation by blurring
    await weight.blur();

    // Verify English error message appears
    await expect(page.getByText('Weight must be greater than zero.')).toBeVisible();
  });
});

test.describe('Save and Cancel buttons', () => {
  test('Save button is disabled when form is invalid', async ({ page }) => {
    await page.goto('/');

    // Save button should be disabled initially (form is empty)
    const saveButton = page.getByRole('button', { name: 'Save' });
    await expect(saveButton).toBeDisabled();
  });

  test('Save button becomes enabled when form is valid', async ({ page }) => {
    await page.goto('/');

    // Fill in the form
    const harvestDate = page.locator('input[type="date"]');
    await harvestDate.fill('2026-08-03');

    const varietySelect = page.locator('select').nth(0);
    await varietySelect.selectOption('SLN6');

    const firstBlock = page.locator('input[type="checkbox"]').first();
    await firstBlock.check();

    const weight = page.locator('input[type="number"]');
    await weight.fill('320');

    // Save button should now be enabled
    const saveButton = page.getByRole('button', { name: 'Save' });
    await expect(saveButton).toBeEnabled();
  });

  test('Cancel button resets the form', async ({ page }) => {
    await page.goto('/');

    // Fill in some data
    const harvestDate = page.locator('input[type="date"]');
    await harvestDate.fill('2026-08-03');

    const varietySelect = page.locator('select').nth(0);
    await varietySelect.selectOption('SLN6');

    const firstBlock = page.locator('input[type="checkbox"]').first();
    await firstBlock.check();

    const weight = page.locator('input[type="number"]');
    await weight.fill('320');

    // Click Cancel
    const cancelButton = page.getByRole('button', { name: 'Cancel' });
    await cancelButton.click();

    // Verify form is reset (harvest date resets to today per design)
    const today = new Date().toISOString().split('T')[0];
    await expect(harvestDate).toHaveValue(today);
    await expect(varietySelect).toHaveValue('');
    await expect(firstBlock).not.toBeChecked();
    await expect(weight).toHaveValue('0');
  });

  test('Cancel button is always enabled', async ({ page }) => {
    await page.goto('/');

    const cancelButton = page.getByRole('button', { name: 'Cancel' });
    await expect(cancelButton).toBeEnabled();
  });
});