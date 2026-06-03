export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmConfig {
  baseUrl: string;
  model: string;
  apiKey: string;
}

export interface StreamDeps {
  fetch?: typeof fetch;
}

/**
 * Streams a reply from an OpenAI-compatible chat-completions endpoint,
 * yielding content deltas as they arrive. Provider-agnostic by design
 * (ADR-0002): paid OpenRouter, a free model, or a local server all speak
 * this protocol, so switching is config-only.
 */
export async function* streamChat(
  messages: ChatMessage[],
  config: LlmConfig,
  deps: StreamDeps = {},
): AsyncGenerator<string> {
  const doFetch = deps.fetch ?? fetch;

  const response = await doFetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: config.model, messages, stream: true }),
  });

  if (!response.ok) {
    // Surface a generic failure; never leak the upstream provider's body.
    throw new Error(`LLM request failed with status ${response.status}`);
  }

  const body = response.body;
  if (!body) return;

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (!line.startsWith('data:')) continue;
      const data = line.slice('data:'.length).trim();
      if (data === '[DONE]') return;
      const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
      if (typeof delta === 'string' && delta.length > 0) yield delta;
    }
  }
}

const DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = 'openai/gpt-oss-120b';

export function llmConfigFromEnv(
  env: Record<string, string | undefined> = process.env,
): LlmConfig {
  return {
    baseUrl: env.LLM_BASE_URL?.trim() || DEFAULT_BASE_URL,
    model: env.LLM_MODEL?.trim() || DEFAULT_MODEL,
    apiKey: env.LLM_API_KEY?.trim() || '',
  };
}
