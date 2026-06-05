---
name: testing-conventions
description: Testing patterns for this Next.js portfolio — Playwright e2e and Vitest unit conventions, data-testid usage, ARIA roles, and SVG aria-hidden rules. Use when writing new tests, debugging failing tests, or adding data-testid attributes to components.
---

# Testing Conventions

## Test locations

- Playwright e2e: `tests/homepage.spec.ts`
- Vitest unit: `src/lib/products.test.ts` (and sibling `*.test.ts` files)

## Playwright assertions

All assertions use:
- `data-testid` for section/card targeting: `[data-testid="hero-section"]`, `[data-testid="product-card-{id}"]`
- ARIA roles for interactive elements: `getByRole('navigation')`, `getByRole('img')`
- Scope navbar checks to `getByRole('navigation')` to avoid conflicts with identical footer elements

## SVG / icon rule

All decorative lucide-react SVG icons must have `aria-hidden="true"`. Chromium assigns SVGs an implicit `role="img"` in its accessibility tree, which breaks `getByRole('img')` assertions if icons lack this attribute.

## Running tests

```bash
npm test                          # Full Playwright suite (starts dev server automatically)
npx playwright test --grep "hero" # Filter by section name
npx playwright show-report        # Open HTML report

npm run test:unit                 # Vitest unit suite
npm run test:unit:watch           # Watch mode
```
