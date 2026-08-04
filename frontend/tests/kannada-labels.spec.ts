import { test, expect } from '@playwright/test';

test.describe('Kannada labels in MasterData dropdowns', () => {
  test('Block checkboxes show Kannada labels', async ({ page }) => {
    await page.goto('/');

    // Verify Kannada labels are present in the Block checkbox labels
    const blockLabels = page.locator('label', { has: page.locator('input[type="checkbox"]') });
    await expect(blockLabels).toHaveCount(5);

    const texts = await blockLabels.allTextContents();
    expect(texts.some((t) => t.includes('ಬ್ಲಾಕ್ 1'))).toBeTruthy();
    expect(texts.some((t) => t.includes('ಬ್ಲಾಕ್ 2'))).toBeTruthy();
    expect(texts.some((t) => t.includes('ಬ್ಲಾಕ್ 3'))).toBeTruthy();
    expect(texts.some((t) => t.includes('ಬ್ಲಾಕ್ 4'))).toBeTruthy();
    expect(texts.some((t) => t.includes('ಬ್ಲಾಕ್ 5'))).toBeTruthy();
  });

  test('Variety dropdown shows Kannada labels', async ({ page }) => {
    await page.goto('/');

    // Open the Variety dropdown
    const varietySelect = page.locator('select').nth(0);
    await varietySelect.click();

    // Verify Kannada labels are present in the Variety dropdown options
    const varietyOptions = varietySelect.locator('option');
    await expect(varietyOptions).toHaveCount(7); // placeholder + 6 varieties

    const varietyLabels = await varietyOptions.allTextContents();
    expect(varietyLabels).toContain('ಎಸ್ಎಲ್ಎನ್ 6');
    expect(varietyLabels).toContain('ಎಸ್ಎಲ್ 28');
    expect(varietyLabels).toContain('ಕ್ಯಾಟುರಾ');
    expect(varietyLabels).toContain('ಬರ್ಬನ್');
    expect(varietyLabels).toContain('ಟಿಪಿಕಾ');
    expect(varietyLabels).toContain('ಗೀಶಾ');
  });

  test('Dropdown values remain language-independent codes', async ({ page }) => {
    await page.goto('/');

    // Verify Variety dropdown values are codes, not labels
    const varietySelect = page.locator('select').nth(0);
    const varietyValues = await varietySelect.locator('option').evaluateAll(
      (options) => options.map((o) => (o as HTMLOptionElement).value)
    );
    expect(varietyValues).toContain('SLN6');
    expect(varietyValues).toContain('GEISHA');

    // Verify Block checkbox values are codes, not labels
    const blockValues = await page.locator('input[type="checkbox"]').evaluateAll(
      (inputs) => inputs.map((i) => (i as HTMLInputElement).value)
    );
    expect(blockValues).toContain('BLOCK01');
    expect(blockValues).toContain('BLOCK05');
  });
});

test.describe('Kannada validation error messages', () => {
  test('Shows Kannada error for empty harvest date', async ({ page }) => {
    await page.goto('/');

    // Clear the harvest date field
    const harvestDate = page.locator('input[type="date"]');
    await harvestDate.fill('');

    // Trigger validation by blurring
    await harvestDate.blur();

    // Verify Kannada error message appears
    await expect(page.getByText('ಹಾರ್ವೆಸ್ಟ್ ದಿನಾಂಕ ಅಗತ್ಯವಿದೆ.')).toBeVisible();
  });

  test('Shows Kannada error for empty variety', async ({ page }) => {
    await page.goto('/');

    // Focus and blur the variety dropdown without selecting
    const varietySelect = page.locator('select').nth(0);
    await varietySelect.focus();
    await varietySelect.blur();

    // Verify Kannada error message appears
    await expect(page.getByText('ದಯವಿಟ್ಟು ಕಾಫಿ ತಳಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.')).toBeVisible();
  });

  test('Shows Kannada error for no blocks selected', async ({ page }) => {
    await page.goto('/');

    // Focus and blur the blocks section without selecting
    const firstBlock = page.locator('input[type="checkbox"]').first();
    await firstBlock.focus();
    await firstBlock.blur();

    // Verify Kannada error message appears
    await expect(page.getByText('ಕನಿಷ್ಠ ಒಂದು ಬ್ಲಾಕ್ ಆಯ್ಕೆಮಾಡಿ.')).toBeVisible();
  });

  test('Shows Kannada error for empty weight', async ({ page }) => {
    await page.goto('/');

    // Clear the weight field
    const weight = page.locator('input[type="number"]');
    await weight.fill('');

    // Trigger validation by blurring
    await weight.blur();

    // Verify Kannada error message appears
    await expect(page.getByText('ಒಟ್ಟು ಚೆರ್ರಿ ತೂಕವನ್ನು ನಮೂದಿಸಿ.')).toBeVisible();
  });

  test('Shows Kannada error for weight less than zero', async ({ page }) => {
    await page.goto('/');

    // Enter a negative weight
    const weight = page.locator('input[type="number"]');
    await weight.fill('-5');

    // Trigger validation by blurring
    await weight.blur();

    // Verify Kannada error message appears
    await expect(page.getByText('ತೂಕವು ಶೂನ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚಾಗಿರಬೇಕು.')).toBeVisible();
  });
});