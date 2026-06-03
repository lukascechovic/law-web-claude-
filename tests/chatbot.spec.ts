import { test, expect } from '@playwright/test';

test.describe('Chatbot widget', () => {
  test('opens, sends a message, and renders a streamed reply', async ({ page }) => {
    // Mock the LLM-backed route so the test never hits a real provider.
    await page.route('**/api/chat', async route => {
      await route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        body: 'The ARC is a sideback quiver.',
      });
    });

    await page.goto('/');

    await page.locator('[data-testid="chat-launcher"]').click();
    await expect(page.locator('[data-testid="chat-panel"]')).toBeVisible();

    await page.locator('[data-testid="chat-input"]').fill('What is the ARC?');
    await page.locator('[data-testid="chat-send"]').click();

    await expect(page.locator('[data-testid="chat-message-assistant"]')).toContainText(
      'sideback quiver',
    );
  });

  test('shows a clear slow-down state when the API rate-limits the request', async ({ page }) => {
    await page.route('**/api/chat', async route => {
      await route.fulfill({
        status: 429,
        headers: { 'Retry-After': '30', 'Content-Type': 'text/plain; charset=utf-8' },
        body: 'Too many requests.',
      });
    });

    await page.goto('/');
    await page.locator('[data-testid="chat-launcher"]').click();
    await page.locator('[data-testid="chat-input"]').fill('What is the ARC?');
    await page.locator('[data-testid="chat-send"]').click();

    await expect(page.locator('[data-testid="chat-message-assistant"]')).toContainText(
      'too quickly',
    );
  });

  test('closes again after opening', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="chat-launcher"]').click();
    await expect(page.locator('[data-testid="chat-panel"]')).toBeVisible();
    await page.locator('[data-testid="chat-close"]').click();
    await expect(page.locator('[data-testid="chat-panel"]')).toBeHidden();
  });
});
