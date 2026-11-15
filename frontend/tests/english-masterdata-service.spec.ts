import { test, expect, type Page } from '@playwright/test';
import type { MasterDataItem } from '../src/types/masterData';

/**
 * Tests for the MasterDataService.load() API client.
 * Uses page.evaluate with dynamic import to exercise the service in a real browser,
 * with the network mocked via page.route.
 *
 * The import specifier is intentionally a runtime path resolved by the Vite dev
 * server; it is passed through a variable so TypeScript does not statically
 * resolve it.
 */

const MODULE_PATH = '/src/services/masterDataService.ts';
const MASTERDATA_URL = '**/?resource=masterdata*';

const validResponse = {
  success: true,
  data: [
    { type: 'BLOCK', code: 'BLOCK_A', en: 'Block A', kn: 'ಬ್ಲಾಕ್ A', active: true, sortOrder: 1 },
    { type: 'BLOCK', code: 'BLOCK_B', en: 'Block B', kn: 'ಬ್ಲಾಕ್ B', active: true, sortOrder: 2 },
    { type: 'VARIETY', code: 'SLN6', en: 'SLN6', kn: 'ಎಸ್ಎಲ್ಎನ್ 6', active: true, sortOrder: 1 },
  ],
};

type ServiceModule = {
  masterDataService: {
    load: () => Promise<MasterDataItem[]>;
    getBlocks: () => Array<{ value: string; label: string }>;
    getVarieties: () => Array<{ value: string; label: string }>;
  };
};

/** Load MasterData via the service in the browser context. */
const loadMasterData = (page: Page): Promise<MasterDataItem[]> =>
  page.evaluate(async (path: string) => {
    const mod = (await import(path)) as ServiceModule;
    return mod.masterDataService.load();
  }, MODULE_PATH);

/** Attempt to load MasterData and return the error message (or null on success). */
const loadMasterDataError = (page: Page): Promise<string | null> =>
  page.evaluate(async (path: string) => {
    const mod = (await import(path)) as ServiceModule;
    try {
      await mod.masterDataService.load();
      return null;
    } catch (e) {
      return (e as Error).message;
    }
  }, MODULE_PATH);

/** Call load() multiple times in the browser context. */
const loadMasterDataRepeatedly = (page: Page): Promise<unknown> =>
  page.evaluate(async (path: string) => {
    const mod = (await import(path)) as ServiceModule;
    await mod.masterDataService.load();
    await mod.masterDataService.load();
    await mod.masterDataService.load();
  }, MODULE_PATH);

const loadDropdownOptions = (page: Page) =>
  page.evaluate(async (path: string) => {
    const mod = (await import(path)) as ServiceModule;
    await mod.masterDataService.load();
    return {
      blocks: mod.masterDataService.getBlocks(),
      varieties: mod.masterDataService.getVarieties(),
    };
  }, MODULE_PATH);

test.describe('MasterDataService.load()', () => {
  test('1. Successful API response returns parsed MasterData', async ({ page }) => {
    await page.route(MASTERDATA_URL, async (route) => {
      const request = route.request();
      expect(request.method()).toBe('GET');
      expect(request.url()).toContain('resource=masterdata');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(validResponse),
      });
    });

    await page.goto('/');

    const result = await loadMasterData(page);

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      type: 'BLOCK',
      code: 'BLOCK_A',
      en: 'Block A',
      kn: 'ಬ್ಲಾಕ್ A',
      active: true,
      sortOrder: 1,
    });
    expect(result[1].code).toBe('BLOCK_B');
    expect(result[2].code).toBe('SLN6');
  });

  test('2. Response parsing - only valid items are returned', async ({ page }) => {
    await page.route(MASTERDATA_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            { type: 'BLOCK', code: 'BLOCK_A', en: 'Block A', kn: 'ಬ್ಲಾಕ್ A', active: true, sortOrder: 1 },
            { type: 'BLOCK', code: 'INVALID_NO_SORT' }, // missing en/kn/sortOrder -> filtered out
            { type: 'VARIETY', code: 'SLN6', en: 'SLN6', kn: 'ಎಸ್ಎಲ್ಎನ್ 6', active: true, sortOrder: 2 },
          ],
        }),
      });
    });

    await page.goto('/');

    const result = await loadMasterData(page);

    expect(result).toHaveLength(2);
    expect(result.map((r) => r.code)).toEqual(['BLOCK_A', 'SLN6']);
  });

  test('3. Invalid response shape throws an error', async ({ page }) => {
    await page.route(MASTERDATA_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, errorCode: 'SERVER_ERROR' }),
      });
    });

    await page.goto('/');

    const error = await loadMasterDataError(page);

    expect(error).toBe('Invalid response from server.');
  });

  test('4. Network failure throws a connection error', async ({ page }) => {
    await page.route(MASTERDATA_URL, async (route) => {
      await route.abort('failed');
    });

    await page.goto('/');

    const error = await loadMasterDataError(page);

    expect(error).toBe('Unable to connect. Please check your connection and try again.');
  });

  test('5. Empty response returns an empty array', async ({ page }) => {
    await page.route(MASTERDATA_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.goto('/');

    const result = await loadMasterData(page);

    expect(result).toEqual([]);
  });

  test('6. Caching - only one API request is made for multiple load() calls', async ({ page }) => {
    let requestCount = 0;
    await page.route(MASTERDATA_URL, async (route) => {
      requestCount++;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(validResponse),
      });
    });

    await page.goto('/');

    await loadMasterDataRepeatedly(page);

    expect(requestCount).toBe(1);
  });

  test('7. Dropdown getters use fetched active records', async ({ page }) => {
    await page.route(MASTERDATA_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            { type: 'BLOCK', code: 'SHEET_BLOCK', en: 'Sheet Block', kn: 'ಶೀಟ್ ಬ್ಲಾಕ್', active: true, sortOrder: 1 },
            { type: 'VARIETY', code: 'SHEET_VARIETY', en: 'Sheet Variety', kn: 'ಶೀಟ್ ವೆರೈಟಿ', active: true, sortOrder: 1 },
            { type: 'VARIETY', code: 'INACTIVE', en: 'Inactive', kn: 'ನಿಷ್ಕ್ರಿಯ', active: false, sortOrder: 2 },
          ],
        }),
      });
    });

    await page.goto('/');

    const options = await loadDropdownOptions(page);
    expect(options.blocks).toEqual([{ value: 'SHEET_BLOCK', label: 'Sheet Block' }]);
    expect(options.varieties).toEqual([{ value: 'SHEET_VARIETY', label: 'Sheet Variety' }]);
  });
});