# Single portable Next.js app instead of the Python/FastAPI backend

The old variant (`_old_variants/LAW_SITE`) split the site into a Python/FastAPI backend (chatbot proxy, content API) serving a statically-exported Next.js frontend. We are deliberately **not** reusing that backend. The production site is a single Next.js 15 App Router application; all server logic (chatbot, contact form) lives in Next.js Route Handlers using the Node runtime and plain `fetch`, with no Vercel-proprietary primitives.

We deploy on **Vercel** for now (native Next.js host, zero-config, free/Pro tier covers the traffic, offloads `next/image` processing). But the portability constraint is the point: keeping everything in one Node-runtime app means migrating to a VPS/Docker, Netlify, or Cloudflare later is a config change, not a rewrite. The Python backend was the only thing that would have forced a permanent second host, so dropping it is what preserves that exit.

## Consequences

- In-memory state (e.g. the old rate limiter) does not survive serverless invocations; durable concerns use an external store (see ADR-0002 / Upstash).
- A future reader will find a complete, working FastAPI chatbot in `_old_variants` — it is intentionally abandoned, not a TODO.
