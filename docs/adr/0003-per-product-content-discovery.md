# Per-product content files with dynamic discovery

Product data moves from a single `content/texts/products.md` + a hardcoded `PRODUCT_IDS` allowlist (`['wings','arc','horizon']` in `src/lib/markdown.ts`) to **one Markdown+frontmatter file per product** under `content/products/`, carrying `title`, `tagline`, `price`, `specs`, and a features list. The Product catalog module **discovers products dynamically** from whatever files exist; the id comes from the filename, not a fixed list. Adding a product is a content edit (one file + a `public/images/{id}/` folder), never a code change, and the same files ground the chatbot (see ADR-0002) so the site and bot cannot drift.

## Considered Options

- **Keep the hardcoded allowlist** — gives a compile-time id union and silently drops unknown headings, but every new product requires a code change and redeploy, directly contradicting the "easy to update for new items" goal.
- **Per-product files + dynamic discovery (chosen)** — content-only product additions, single source of truth for site + chatbot, at the cost of the compile-time id guarantee.

## Consequences

- `id` becomes an open `string` rather than a fixed union; the Product catalog module must handle malformed or missing files gracefully (covered by its unit tests) instead of relying on compile-time validation.
- **Do not reintroduce a hardcoded id allowlist.** The old `PRODUCT_IDS` list looks like deliberate type-safety and is tempting to "tidy up" back into place — doing so re-breaks the "add a product without touching code" goal that is the entire point of this decision.
