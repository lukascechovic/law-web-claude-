import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// ── Process / craftsmanship ─────────────────────────────────────────────────

test('process section is present', async ({ page }) => {
  const section = page.locator('[data-testid="process-section"]');
  await expect(section).toBeVisible();
});

test('process section heading renders as an h2', async ({ page }) => {
  const section = page.locator('[data-testid="process-section"]');
  const heading = section.getByRole('heading', { level: 2 });
  await expect(heading.first()).toBeVisible();
});

test('process section shows at least two steps', async ({ page }) => {
  const steps = page.locator('[data-testid^="process-step-"]');
  expect(await steps.count()).toBeGreaterThanOrEqual(2);
});

test('process steps render imagery with alt text', async ({ page }) => {
  const section = page.locator('[data-testid="process-section"]');
  const firstImage = section.getByRole('img').first();
  await expect(firstImage).toBeVisible();
  const alt = await firstImage.getAttribute('alt');
  expect(alt).toBeTruthy();
});

test('process section reinforces the handcrafted / sustainable angle', async ({ page }) => {
  const section = page.locator('[data-testid="process-section"]');
  await expect(section).toContainText(/bioplastic|leather|on demand|handcrafted|by hand/i);
});
