import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// ── Navbar ────────────────────────────────────────────────────────────────────

test('navbar renders logo image', async ({ page }) => {
  const nav = page.getByRole('navigation');
  await expect(nav.getByRole('img', { name: /lukas archery works logo/i })).toBeVisible();
});

test('navbar contains navigation links', async ({ page }) => {
  const nav = page.getByRole('navigation');
  await expect(nav.getByRole('link', { name: /^about$/i })).toBeVisible();
  await expect(nav.getByRole('link', { name: /^products$/i })).toBeVisible();
  await expect(nav.getByRole('link', { name: /^contact$/i })).toBeVisible();
});

test('navbar is sticky on scroll', async ({ page }) => {
  await page.evaluate(() => window.scrollTo(0, 800));
  const navbar = page.getByRole('navigation');
  await expect(navbar).toBeVisible();
  const position = await navbar.evaluate(
    el => window.getComputedStyle(el).position,
  );
  expect(['sticky', 'fixed']).toContain(position);
});

// ── Hero ──────────────────────────────────────────────────────────────────────

test('hero section renders', async ({ page }) => {
  const hero = page.locator('[data-testid="hero-section"]');
  await expect(hero).toBeVisible();
});

test('hero displays main headline', async ({ page }) => {
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toContainText(/archery/i);
});

test('hero has a call-to-action link', async ({ page }) => {
  const cta = page.getByRole('link', { name: /view products|explore|shop/i });
  await expect(cta).toBeVisible();
});

test('hero background video autoplays muted', async ({ page }) => {
  const video = page.locator('[data-testid="hero-section"] video');
  const count = await video.count();
  if (count > 0) {
    const muted = await video.evaluate((el: HTMLVideoElement) => el.muted);
    const autoplay = await video.evaluate((el: HTMLVideoElement) => el.autoplay);
    expect(muted).toBe(true);
    expect(autoplay).toBe(true);
  }
});

// ── About ─────────────────────────────────────────────────────────────────────

test('about section is present', async ({ page }) => {
  const section = page.locator('[data-testid="about-section"]');
  await expect(section).toBeVisible();
});

test('about section heading renders', async ({ page }) => {
  const section = page.locator('[data-testid="about-section"]');
  await expect(section.getByRole('heading').first()).toContainText(/background/i);
});

test('about section contains markdown content', async ({ page }) => {
  const section = page.locator('[data-testid="about-section"]');
  await expect(section).toContainText(/horseback archery/i);
  await expect(section).toContainText(/slovakia/i);
});

test('about section has at least one image', async ({ page }) => {
  const section = page.locator('[data-testid="about-section"]');
  await expect(section.getByRole('img').first()).toBeVisible();
});

// ── Products ──────────────────────────────────────────────────────────────────

test('products section is present', async ({ page }) => {
  const section = page.locator('[data-testid="products-section"]');
  await expect(section).toBeVisible();
});

test('products section shows all three product names', async ({ page }) => {
  await expect(page.locator('[data-testid="product-card-wings"]')).toBeVisible();
  await expect(page.locator('[data-testid="product-card-arc"]')).toBeVisible();
  await expect(page.locator('[data-testid="product-card-horizon"]')).toBeVisible();
});

test('three product cards exist', async ({ page }) => {
  const cards = page.locator('[data-testid^="product-card-"]');
  await expect(cards).toHaveCount(3);
});

test('each product card has a visible image', async ({ page }) => {
  const cards = page.locator('[data-testid^="product-card-"]');
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    await expect(cards.nth(i).getByRole('img').first()).toBeVisible();
  }
});

test('each product card has a feature list', async ({ page }) => {
  const cards = page.locator('[data-testid^="product-card-"]');
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    await expect(cards.nth(i).locator('ul')).toBeVisible();
  }
});

test('product cards render price and specs from the content model', async ({ page }) => {
  await expect(page.locator('[data-testid="product-price-wings"]')).toBeVisible();
  await expect(page.locator('[data-testid="product-specs-wings"]')).toBeVisible();
});

test('supported nocking techniques are accurate per product', async ({ page }) => {
  // ARC supports both Slavic and Thumb.
  const arc = page.locator('[data-testid="product-techniques-arc"]');
  await expect(arc).toContainText('Slavic');
  await expect(arc).toContainText('Thumb');

  // HORIZON supports only Slavic — must not claim Thumb (CONTEXT.md).
  const horizon = page.locator('[data-testid="product-techniques-horizon"]');
  await expect(horizon).toContainText('Slavic');
  await expect(horizon).not.toContainText('Thumb');
});

// ── Motion system ─────────────────────────────────────────────────────────────

test('hero has parallax layer', async ({ page }) => {
  await expect(page.locator('[data-testid="hero-parallax"]')).toBeVisible();
});


// ── Footer ────────────────────────────────────────────────────────────────────

test('footer is present', async ({ page }) => {
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test('footer contains brand name', async ({ page }) => {
  await expect(page.getByRole('contentinfo')).toContainText(/lukas archery works/i);
});

test('footer has at least one link', async ({ page }) => {
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('link').first()).toBeVisible();
});

// ── Accessibility ─────────────────────────────────────────────────────────────

test('page has a single h1', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
});

test('all images have alt text', async ({ page }) => {
  const images = page.getByRole('img');
  const count = await images.count();
  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    expect(alt).toBeTruthy();
  }
});

test('page title contains brand name', async ({ page }) => {
  await expect(page).toHaveTitle(/lukas archery works/i);
});
