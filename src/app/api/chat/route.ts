import { getProducts } from '@/lib/products';
import { buildGrounding } from '@/lib/grounding';
import { streamChat, llmConfigFromEnv, type ChatMessage } from '@/lib/llm';
import { recentTurns } from '@/lib/memory';
import {
  checkRateLimit,
  upstashStore,
  rateLimitConfigFromEnv,
  upstashCredentialsFromEnv,
} from '@/lib/rateLimit';

// Node runtime, plain fetch + Web streams only — no Vercel-proprietary APIs,
// so the app stays portable to a VPS/Netlify/Cloudflare (ADR-0001).
export const runtime = 'nodejs';

// Server-side message cap: bounds prompt size and LLM cost regardless of client.
const MAX_MESSAGE_CHARS = 500;

// How many recent turns of memory to forward to the LLM. Enough for follow-up
// questions ("what about its price?") without growing the prompt unbounded.
const MAX_MEMORY_TURNS = 8;

function badRequest(message: string): Response {
  return new Response(message, { status: 400 });
}

/** Best-effort client IP from the proxy hop; host-portable (no Vercel helper). */
function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

function parseTurns(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const turns: ChatMessage[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') return null;
    const { role, content } = entry as { role?: unknown; content?: unknown };
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') {
      return null;
    }
    turns.push({ role, content });
  }
  return turns;
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest('Invalid JSON body.');
  }

  const turns = parseTurns((body as { messages?: unknown })?.messages);
  if (!turns) {
    return badRequest('Request must include a non-empty "messages" array.');
  }

  // Abuse/cost protection: per-IP rate limit before any grounding or LLM work.
  // Fails open when Upstash is unconfigured (local dev / pre-secrets).
  const creds = upstashCredentialsFromEnv();
  if (creds) {
    const { allowed, retryAfter } = await checkRateLimit(
      clientIp(req),
      rateLimitConfigFromEnv(),
      upstashStore(creds),
    );
    if (!allowed) {
      return new Response('Too many requests. Please slow down and try again shortly.', {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      });
    }
  }

  // Cap the visitor's newest message (the last turn) server-side.
  const latest = turns[turns.length - 1];
  if (latest.content.length > MAX_MESSAGE_CHARS) {
    return badRequest(`Message must be ${MAX_MESSAGE_CHARS} characters or fewer.`);
  }

  const config = llmConfigFromEnv();
  if (!config.apiKey) {
    return new Response('The chatbot is not configured.', { status: 500 });
  }

  const system: ChatMessage = {
    role: 'system',
    content: buildGrounding(getProducts()),
  };

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const token of streamChat([system, ...recentTurns(turns, MAX_MEMORY_TURNS)], config)) {
          controller.enqueue(encoder.encode(token));
        }
      } catch {
        controller.enqueue(encoder.encode('\n[Sorry, something went wrong. Please try again.]'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
