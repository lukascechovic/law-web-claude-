# Provider-agnostic chatbot over an OpenAI-compatible endpoint

The chatbot Route Handler talks to an **OpenAI-compatible chat-completions endpoint configured entirely via environment variables** (`LLM_BASE_URL`, `LLM_MODEL`, `LLM_API_KEY`) rather than hardcoding OpenRouter and `openai/gpt-oss-120b` as the old backend did. It streams responses and sends the last several conversation turns for context.

We default to OpenRouter with `openai/gpt-oss-120b` (the original choice, very cheap), but because OpenRouter free models and local servers (Ollama, LM Studio) are all OpenAI-compatible, switching paid → free → local is a config change with no code change. This was chosen to keep the recurring cost decision open: the brand may want to run a free or self-hosted model later, and we did not want that to require touching code.

## Consequences

- Abuse/cost protection cannot rely on the provider alone; per-IP rate limiting is enforced in our own layer via Upstash Redis (REST, so it stays host-portable per ADR-0001), plus a 500-char message cap.
- A **local** LLM only works when the app is self-hosted next to it — it is incompatible with the Vercel serverless deployment unless the model is exposed at a public URL.
- Product grounding for the bot is read from the same per-product content files the site renders (single source of truth), so it cannot drift from the catalog.
