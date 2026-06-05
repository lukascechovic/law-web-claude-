#!/usr/bin/env node
/**
 * Audits the content/ directory and reports what is complete vs. needs attention.
 * Run: npm run check-content
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkContent } from '../src/lib/content-check.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, '..', 'content');
const report = checkContent(contentDir);

const GREEN = '\x1b[32m';
const RED   = '\x1b[31m';
const BOLD  = '\x1b[1m';
const DIM   = '\x1b[2m';
const RESET = '\x1b[0m';

if (report.ok) {
  console.log(`\n${GREEN}${BOLD}✓ All content looks good!${RESET}\n`);
  process.exit(0);
}

console.log(`\n${BOLD}Content audit — ${report.issues.length} file(s) need attention:${RESET}\n`);

for (const issue of report.issues) {
  console.log(`${RED}✗ ${issue.file}${RESET}`);
  for (const err of issue.errors) {
    console.log(`  ${DIM}→${RESET} ${err}`);
  }
  console.log();
}

process.exit(1);
