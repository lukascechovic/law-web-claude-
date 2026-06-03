import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// ── FAQ ─────────────────────────────────────────────────────────────────────

test('faq section is present', async ({ page }) => {
  const section = page.locator('[data-testid="faq-section"]');
  await expect(section).toBeVisible();
});

test('faq section heading renders', async ({ page }) => {
  const section = page.locator('[data-testid="faq-section"]');
  await expect(section.getByRole('heading').first()).toContainText(/question/i);
});

test('faq renders at least two question/answer items', async ({ page }) => {
  const items = page.locator('[data-testid^="faq-item-"]');
  expect(await items.count()).toBeGreaterThanOrEqual(2);
});

test('faq answers use correct domain vocabulary', async ({ page }) => {
  const section = page.locator('[data-testid="faq-section"]');
  // Nocking techniques are fixed domain terms (CONTEXT.md).
  await expect(section).toContainText(/slavic/i);
  // WINGS is the nocking aid; ARC is the sideback quiver.
  await expect(section).toContainText(/nocking aid/i);
  await expect(section).toContainText(/sideback quiver/i);
});
