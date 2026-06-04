import { test, expect } from '@playwright/test';

// ── Legal pages ───────────────────────────────────────────────────────────────

test('imprint page is reachable from footer', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  await footer.getByRole('link', { name: /imprint/i }).click();
  await expect(page).toHaveURL(/\/imprint/);
  await expect(page.locator('[data-testid="imprint-page"]')).toBeVisible();
});

test('privacy page is reachable from footer', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  await footer.getByRole('link', { name: /privacy policy/i }).click();
  await expect(page).toHaveURL(/\/privacy/);
  await expect(page.locator('[data-testid="privacy-page"]')).toBeVisible();
});

test('imprint page has clearly-marked placeholder content', async ({ page }) => {
  await page.goto('/imprint');
  await expect(page.locator('[data-testid="imprint-page"]')).toContainText(/\[PLACEHOLDER/i);
});

test('privacy page has LLM processing stub section', async ({ page }) => {
  await page.goto('/privacy');
  const section = page.locator('[data-testid="privacy-section-llm"]');
  await expect(section).toBeVisible();
  await expect(section).toContainText(/llm|language model/i);
  await expect(section).toContainText(/\[PLACEHOLDER/i);
});

test('privacy page has contact form stub section', async ({ page }) => {
  await page.goto('/privacy');
  const section = page.locator('[data-testid="privacy-section-contact-form"]');
  await expect(section).toBeVisible();
  await expect(section).toContainText(/contact/i);
  await expect(section).toContainText(/\[PLACEHOLDER/i);
});

test('privacy page has cookieless analytics stub section', async ({ page }) => {
  await page.goto('/privacy');
  const section = page.locator('[data-testid="privacy-section-analytics"]');
  await expect(section).toBeVisible();
  await expect(section).toContainText(/cookieless|cookie/i);
  await expect(section).toContainText(/\[PLACEHOLDER/i);
});

test('privacy page has hosting and IP logs stub section', async ({ page }) => {
  await page.goto('/privacy');
  const section = page.locator('[data-testid="privacy-section-hosting"]');
  await expect(section).toBeVisible();
  await expect(section).toContainText(/ip address|server log/i);
  await expect(section).toContainText(/\[PLACEHOLDER/i);
});
