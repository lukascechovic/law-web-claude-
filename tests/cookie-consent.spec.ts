import { test, expect } from '@playwright/test';

test.describe('Cookie consent banner', () => {
  test('appears on a first visit', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="cookie-banner"]')).toBeVisible();
  });

  test('dismisses on accept and does not reappear after a reload', async ({ page }) => {
    await page.goto('/');
    const banner = page.locator('[data-testid="cookie-banner"]');
    await expect(banner).toBeVisible();

    await page.locator('[data-testid="cookie-accept"]').click();
    await expect(banner).toBeHidden();

    // The recorded consent persists across a fresh page load.
    await page.reload();
    await expect(banner).toBeHidden();
  });

  test('moves focus to the dismiss control and accepts keyboard dismissal', async ({ page }) => {
    await page.goto('/');
    const accept = page.locator('[data-testid="cookie-accept"]');
    await expect(accept).toBeVisible();

    // Focus is placed on the actionable control when the notice appears.
    await expect(accept).toBeFocused();

    // Escape dismisses it without reaching for the mouse.
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid="cookie-banner"]')).toBeHidden();
  });
});
