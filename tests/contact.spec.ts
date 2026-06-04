import { test, expect } from '@playwright/test';

test.describe('Contact section', () => {
  test('renders with email, location, and social links', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('[data-testid="contact-section"]');
    await expect(section).toBeVisible();
    await expect(section.locator('[data-testid="contact-email"]')).toBeVisible();
    await expect(section.locator('[data-testid="contact-location"]')).toContainText(/slovakia/i);
    await expect(section.getByRole('link', { name: /instagram/i })).toBeVisible();
    await expect(section.getByRole('link', { name: /youtube/i })).toBeVisible();
  });

  test('form has name field, message field, and submit button', async ({ page }) => {
    await page.goto('/');
    const form = page.locator('[data-testid="contact-form"]');
    await expect(form.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(form.getByRole('textbox', { name: /message/i })).toBeVisible();
    await expect(form.locator('[data-testid="contact-submit"]')).toBeVisible();
  });

  test('honeypot field is hidden from the user', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('input[name="website"]')).toBeHidden();
  });

  test('privacy note is present near the form', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="contact-privacy"]')).toBeVisible();
  });

  test('successful submission shows success state and hides form', async ({ page }) => {
    await page.route('**/api/contact', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      }),
    );
    await page.goto('/');
    const form = page.locator('[data-testid="contact-form"]');
    await form.getByRole('textbox', { name: /name/i }).fill('Ada');
    await form.getByRole('textbox', { name: /message/i }).fill('Hello!');
    await form.locator('[data-testid="contact-submit"]').click();
    await expect(page.locator('[data-testid="contact-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-form"]')).toBeHidden();
  });

  test('API error shows failure message and keeps form visible', async ({ page }) => {
    await page.route('**/api/contact', route =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Could not send message. Please try again.' }),
      }),
    );
    await page.goto('/');
    const form = page.locator('[data-testid="contact-form"]');
    await form.getByRole('textbox', { name: /name/i }).fill('Ada');
    await form.getByRole('textbox', { name: /message/i }).fill('Hello!');
    await form.locator('[data-testid="contact-submit"]').click();
    await expect(page.locator('[data-testid="contact-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-error"]')).toContainText(/could not send/i);
    await expect(page.locator('[data-testid="contact-form"]')).toBeVisible();
  });
});
