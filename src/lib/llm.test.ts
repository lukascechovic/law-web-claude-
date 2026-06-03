import { describe, it, expect, vi } from 'vitest';
import { streamChat, llmConfigFromEnv, type LlmConfig } from './llm';

const config: LlmConfig = {
  baseUrl: 'https://llm.test/v1',
  model: 'test-model',
  apiKey: 'sk-test',
};

function sseResponse(chunks: string[], status = 200): Response {
  const enc = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const c of chunks) controller.enqueue(enc.encode(c));
      controller.close();
    },
  });
  return new Response(body, { status });
}

function dataLine(content: string): string {
  return `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`;
}

async function drain(gen: AsyncGenerator<string>): Promise<string[]> {
  const out: string[] = [];
  for await (const token of gen) out.push(token);
  return out;
}

describe('streamChat request shaping', () => {
  it('posts an OpenAI-compatible chat-completions request configured from config', async () => {
    const fetchMock = vi.fn().mockResolvedValue(sseResponse(['data: [DONE]\n\n']));

    await drain(
      streamChat([{ role: 'user', content: 'hi' }], config, { fetch: fetchMock }),
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://llm.test/v1/chat/completions');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer sk-test');
    const payload = JSON.parse(init.body as string);
    expect(payload.model).toBe('test-model');
    expect(payload.stream).toBe(true);
    expect(payload.messages).toEqual([{ role: 'user', content: 'hi' }]);
  });
});

describe('streamChat response parsing', () => {
  it('yields the content deltas of a streamed reply in order, stopping at [DONE]', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      sseResponse([dataLine('Hel'), dataLine('lo'), dataLine('!'), 'data: [DONE]\n\n']),
    );

    const tokens = await drain(
      streamChat([{ role: 'user', content: 'hi' }], config, { fetch: fetchMock }),
    );

    expect(tokens).toEqual(['Hel', 'lo', '!']);
    expect(tokens.join('')).toBe('Hello!');
  });

  it('reassembles a data line that is split across two network chunks', async () => {
    const full = dataLine('streamed');
    const split = Math.floor(full.length / 2);
    const fetchMock = vi.fn().mockResolvedValue(
      sseResponse([full.slice(0, split), full.slice(split), 'data: [DONE]\n\n']),
    );

    const tokens = await drain(
      streamChat([{ role: 'user', content: 'hi' }], config, { fetch: fetchMock }),
    );

    expect(tokens.join('')).toBe('streamed');
  });
});

describe('streamChat error handling', () => {
  it('throws a handled error on a non-200 response without leaking the upstream body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('upstream secret detail', { status: 502 }),
    );

    const err = await drain(
      streamChat([{ role: 'user', content: 'hi' }], config, { fetch: fetchMock }),
    ).catch((e: unknown) => e);

    expect(err).toBeInstanceOf(Error);
    expect((err as Error).message).not.toContain('upstream secret detail');
  });
});

describe('llmConfigFromEnv', () => {
  it('defaults to OpenRouter and gpt-oss-120b when env is unset', () => {
    const cfg = llmConfigFromEnv({});
    expect(cfg.baseUrl).toBe('https://openrouter.ai/api/v1');
    expect(cfg.model).toBe('openai/gpt-oss-120b');
    expect(cfg.apiKey).toBe('');
  });

  it('lets env override base URL, model, and key for a paid→free→local swap', () => {
    const cfg = llmConfigFromEnv({
      LLM_BASE_URL: 'http://localhost:11434/v1',
      LLM_MODEL: 'llama3',
      LLM_API_KEY: 'local-key',
    });
    expect(cfg).toEqual({
      baseUrl: 'http://localhost:11434/v1',
      model: 'llama3',
      apiKey: 'local-key',
    });
  });
});
