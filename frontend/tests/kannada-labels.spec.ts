import { test, expect } from '@playwright/test';

test.describe('Kannada labels in MasterData dropdowns', () => {
  test('Block dropdown shows Kannada labels', async ({ page }) => {
    await page.goto('/');

    // Open the Block dropdown
    const blockSelect = page.locator('select').nth(0);
    await blockSelect.click();

    // Verify Kannada labels are present in the Block dropdown options
    const blockOptions = blockSelect.locator('option');
    await expect(blockOptions).toHaveCount(6); // placeholder + 5 blocks

    const blockLabels = await blockOptions.allTextContents();
    expect(blockLabels).toContain('ಬ್ಲಾಕ್ 1');
    expect(blockLabels).toContain('ಬ್ಲಾಕ್ 2');
    expect(blockLabels).toContain('ಬ್ಲಾಕ್ 3');
    expect(blockLabels).toContain('ಬ್ಲಾಕ್ 4');
    expect(blockLabels).toContain('ಬ್ಲಾಕ್ 5');
  });

  test('Variety dropdown shows Kannada labels', async ({ page }) => {
    await page.goto('/');

    // Open the Variety dropdown
    const varietySelect = page.locator('select').nth(1);
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

    // Verify Block dropdown values are codes, not labels
    const blockSelect = page.locator('select').nth(0);
    const blockValues = await blockSelect.locator('option').evaluateAll(
      (options) => options.map((o) => (o as HTMLOptionElement).value)
    );
    expect(blockValues).toContain('BLOCK01');
    expect(blockValues).toContain('BLOCK05');

    // Verify Variety dropdown values are codes, not labels
    const varietySelect = page.locator('select').nth(1);
    const varietyValues = await varietySelect.locator('option').evaluateAll(
      (options) => options.map((o) => (o as HTMLOptionElement).value)
    );
    expect(varietyValues).toContain('SLN6');
    expect(varietyValues).toContain('GEISHA');
  });
});