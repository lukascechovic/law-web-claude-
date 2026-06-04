import { test, expect } from '@playwright/test';

test.describe('Open Graph / Twitter metadata', () => {
  test('og:title is set', async ({ page }) => {
    await page.goto('/');
    const content = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(content).toBeTruthy();
    expect(content).toMatch(/lukas archery works/i);
  });

  test('og:description is set', async ({ page }) => {
    await page.goto('/');
    const content = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(20);
  });

  test('og:image is set to an absolute URL', async ({ page }) => {
    await page.goto('/');
    const content = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(content).toBeTruthy();
    expect(content).toMatch(/^https?:\/\//);
  });

  test('twitter:card is set', async ({ page }) => {
    await page.goto('/');
    const card = await page
      .locator('meta[name="twitter:card"]')
      .getAttribute('content');
    expect(card).toBeTruthy();
  });
});

test.describe('Favicon', () => {
  test('page head contains a favicon link', async ({ page }) => {
    await page.goto('/');
    const icon = page.locator('link[rel~="icon"]');
    await expect(icon).toHaveCount(1);
  });
});

test.describe('JSON-LD structured data', () => {
  test('homepage has at least one Product JSON-LD script', async ({ page }) => {
    await page.goto('/');
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    expect(count).toBeGreaterThan(0);

    let foundProduct = false;
    for (let i = 0; i < count; i++) {
      const text = await scripts.nth(i).textContent();
      try {
        const data = JSON.parse(text ?? '{}');
        const items = Array.isArray(data) ? data : [data];
        if (items.some((item: { '@type'?: string }) => item['@type'] === 'Product')) {
          foundProduct = true;
          break;
        }
      } catch {
        // ignore parse errors
      }
    }
    expect(foundProduct).toBe(true);
  });

  test('Product JSON-LD contains name and offers', async ({ page }) => {
    await page.goto('/');
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();

    const products: Array<{ name?: string; offers?: unknown }> = [];
    for (let i = 0; i < count; i++) {
      const text = await scripts.nth(i).textContent();
      try {
        const data = JSON.parse(text ?? '{}');
        const items = Array.isArray(data) ? data : [data];
        items
          .filter((item: { '@type'?: string }) => item['@type'] === 'Product')
          .forEach(item => products.push(item));
      } catch {
        // ignore
      }
    }

    expect(products.length).toBeGreaterThan(0);
    expect(products[0].name).toBeTruthy();
    expect(products[0].offers).toBeTruthy();
  });
});

test.describe('Sitemap and robots', () => {
  test('robots.txt returns 200 and contains a Sitemap directive', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toMatch(/sitemap/i);
  });

  test('sitemap.xml returns 200 and contains the homepage URL', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toMatch(/<loc>/);
  });
});
