import type { Product } from './products';

/**
 * Builds the chatbot system prompt grounded in the live product catalog.
 * Pure and deterministic: the same products always yield the same text, and
 * only the products passed in are described — the single source of truth the
 * bot may speak from (ADR-0002).
 */
function describeProduct(p: Product): string {
  const lines = [`${p.title} — ${p.tagline} (${p.price})`];
  for (const spec of p.specs) {
    lines.push(`  ${spec.label}: ${spec.value}`);
  }
  if (p.techniques.length > 0) {
    lines.push(`  Supported techniques: ${p.techniques.join(', ')}`);
  }
  for (const feature of p.features) {
    lines.push(`  - ${feature}`);
  }
  return lines.join('\n');
}

const GUARDRAILS = [
  'You are the product expert for Lukas Archery Works (LAW), a Slovak maker of handcrafted horseback-archery (HBA) equipment.',
  'Answer only from the catalog below. Never invent products, prices, specs, or claims; if something is not in the catalog, say you do not know and suggest contacting the maker.',
  '"ARC" is always the LAW sideback quiver — never a curve or a bow. "WINGS" is the arrow nocking aid; "HORIZON" is the modular quiver. Each product supports only the nocking techniques (Slavic / Thumb) it explicitly lists; do not infer techniques across products.',
  'Reply in the same language the visitor wrote in. Be concise and helpful.',
].join('\n');

export function buildGrounding(products: Product[]): string {
  const catalog = products.map(describeProduct).join('\n\n');
  return `${GUARDRAILS}\n\nCatalog:\n\n${catalog}`;
}
