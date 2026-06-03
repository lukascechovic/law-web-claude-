import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// ── Reviews / testimonials ──────────────────────────────────────────────────────

test('reviews section is present', async ({ page }) => {
  const section = page.locator('[data-testid="reviews-section"]');
  await expect(section).toBeVisible();
});

test('reviews section heading renders (h2, not h1)', async ({ page }) => {
  const section = page.locator('[data-testid="reviews-section"]');
  await expect(section.getByRole('heading', { level: 2 }).first()).toBeVisible();
});

test('reviews section shows at least two testimonials', async ({ page }) => {
  const items = page.locator('[data-testid^="review-"]');
  expect(await items.count()).toBeGreaterThanOrEqual(2);
});

test('reviews show a quote and author', async ({ page }) => {
  const section = page.locator('[data-testid="reviews-section"]');
  await expect(section.getByRole('blockquote').first()).toBeVisible();
  await expect(section).toContainText(/quiver|WINGS|HORIZON|ARC/i);
});

test('video testimonials embed an accessible iframe', async ({ page }) => {
  const iframes = page.locator('[data-testid="reviews-section"] iframe');
  const count = await iframes.count();
  for (let i = 0; i < count; i++) {
    const title = await iframes.nth(i).getAttribute('title');
    expect(title).toBeTruthy();
  }
});
