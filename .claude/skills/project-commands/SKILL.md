---
name: project-commands
description: CLI commands for running, building, and testing this Next.js portfolio site. Use when the user wants to start the dev server, run a production build, lint, run Playwright e2e tests, or run Vitest unit tests.
---

# Project Commands

## Dev & build

```bash
npm run dev          # Start dev server (also runs copy-assets first)
npm run build        # Production build (also runs copy-assets first)
npm run lint         # ESLint via Next.js
node scripts/copy-assets.mjs  # Manually sync content/ -> public/
```

## Tests

```bash
npm test                          # Run full Playwright e2e suite
npx playwright test --grep "hero" # Run tests matching a section name
npx playwright show-report        # Open HTML report after a run

npm run test:unit                 # Run Vitest unit suite (lib modules)
npm run test:unit:watch           # Vitest in watch mode
```

Dev server must be running (or Playwright starts it automatically via `webServer` config) before e2e tests execute.
