import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// ── Gallery / in-action section ─────────────────────────────────────────────────

test('gallery section is present', async ({ page }) => {
  const section = page.locator('[data-testid="gallery-section"]');
  await expect(section).toBeVisible();
});

test('gallery section heading renders (h2, not h1)', async ({ page }) => {
  const section = page.locator('[data-testid="gallery-section"]');
  const heading = section.getByRole('heading', { level: 2 });
  await expect(heading).toBeVisible();
});

test('gallery shows at least three items', async ({ page }) => {
  const items = page.locator('[data-testid^="gallery-item-"]');
  expect(await items.count()).toBeGreaterThanOrEqual(3);
});

test('each gallery item is visible', async ({ page }) => {
  const items = page.locator('[data-testid^="gallery-item-"]');
  const count = await items.count();
  for (let i = 0; i < count; i++) {
    await expect(items.nth(i)).toBeVisible();
  }
});

test('every gallery image has alt text', async ({ page }) => {
  const images = page.locator('[data-testid="gallery-section"] img');
  const count = await images.count();
  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    expect(alt).toBeTruthy();
  }
});
