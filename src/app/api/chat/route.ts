import { getProducts } from '@/lib/products';
import { buildGrounding } from '@/lib/grounding';
import { streamChat, llmConfigFromEnv, type ChatMessage } from '@/lib/llm';

// Node runtime, plain fetch + Web streams only — no Vercel-proprietary APIs,
// so the app stays portable to a VPS/Netlify/Cloudflare (ADR-0001).
export const runtime = 'nodejs';

function badRequest(message: string): Response {
  return new Response(message, { status: 400 });
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
        for await (const token of streamChat([system, ...turns], config)) {
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
