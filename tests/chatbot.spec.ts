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

  test('renders a chunked stream progressively, partial text before the full reply', async ({
    page,
  }) => {
    // Stub fetch with a real ReadableStream that emits two chunks with a gap,
    // so the widget's incremental reading (not just a one-shot body) is exercised.
    await page.addInitScript(() => {
      const original = window.fetch;
      window.fetch = (input, init) => {
        const url = typeof input === 'string' ? input : (input as Request).url;
        if (url.includes('/api/chat')) {
          const stream = new ReadableStream<Uint8Array>({
            async start(controller) {
              const enc = new TextEncoder();
              controller.enqueue(enc.encode('The ARC is '));
              await new Promise(r => setTimeout(r, 600));
              controller.enqueue(enc.encode('a sideback quiver.'));
              controller.close();
            },
          });
          return Promise.resolve(
            new Response(stream, {
              status: 200,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            }),
          );
        }
        return original(input, init);
      };
    });

    await page.goto('/');
    await page.locator('[data-testid="chat-launcher"]').click();
    await page.locator('[data-testid="chat-input"]').fill('What is the ARC?');
    await page.locator('[data-testid="chat-send"]').click();

    const reply = page.locator('[data-testid="chat-message-assistant"]');
    // First chunk is visible before the second arrives...
    await expect(reply).toHaveText('The ARC is');
    // ...then the assembled reply completes.
    await expect(reply).toHaveText('The ARC is a sideback quiver.');
  });

  test('shows a typing indicator while awaiting the reply, then hides it', async ({ page }) => {
    // Delay the reply so the "thinking" window is observable before tokens land.
    await page.route('**/api/chat', async route => {
      await new Promise(resolve => setTimeout(resolve, 800));
      await route.fulfill({
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        body: 'The ARC is a sideback quiver.',
      });
    });

    await page.goto('/');
    await page.locator('[data-testid="chat-launcher"]').click();
    await page.locator('[data-testid="chat-input"]').fill('What is the ARC?');
    await page.locator('[data-testid="chat-send"]').click();

    // Indicator appears during generation...
    await expect(page.locator('[data-testid="chat-typing"]')).toBeVisible();
    // ...and is gone once the reply has rendered.
    await expect(page.locator('[data-testid="chat-message-assistant"]')).toContainText(
      'sideback quiver',
    );
    await expect(page.locator('[data-testid="chat-typing"]')).toBeHidden();
  });

  test('closes again after opening', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="chat-launcher"]').click();
    await expect(page.locator('[data-testid="chat-panel"]')).toBeVisible();
    await page.locator('[data-testid="chat-close"]').click();
    await expect(page.locator('[data-testid="chat-panel"]')).toBeHidden();
  });

  test('animates the panel by default but suppresses it under reduced motion', async ({ page }) => {
    const panel = page.locator('[data-testid="chat-panel"]');
    const transitionDuration = () =>
      panel.evaluate(el => getComputedStyle(el).transitionDuration);

    // Default: motion is allowed, so the open/close transition has a duration.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.locator('[data-testid="chat-launcher"]').click();
    await expect(panel).toBeVisible();
    expect(await transitionDuration()).not.toBe('0s');

    // prefers-reduced-motion: the transition is suppressed (instant).
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.locator('[data-testid="chat-launcher"]').click();
    await expect(panel).toBeVisible();
    expect(await transitionDuration()).toBe('0s');
  });
});
