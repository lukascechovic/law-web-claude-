import { describe, it, expect, vi } from 'vitest';
import {
  checkRateLimit,
  upstashStore,
  rateLimitConfigFromEnv,
  upstashCredentialsFromEnv,
  type RateLimitStore,
  type RateLimitConfig,
} from './rateLimit';

const config: RateLimitConfig = { limit: 5, windowSeconds: 60 };

/**
 * In-memory stand-in for the Upstash store, faithful to Redis INCR+EXPIRE:
 * the first hit in a window sets the TTL, later hits increment the same
 * counter until the window expires. A mutable clock lets tests advance time.
 */
function fakeStore(startMs = 0): RateLimitStore & { advance(ms: number): void } {
  let now = startMs;
  const entries = new Map<string, { count: number; expiresAt: number }>();
  return {
    advance(ms) {
      now += ms;
    },
    async hit(key, windowSeconds) {
      const existing = entries.get(key);
      if (!existing || now >= existing.expiresAt) {
        const fresh = { count: 1, expiresAt: now + windowSeconds * 1000 };
        entries.set(key, fresh);
        return { count: 1, ttlSeconds: windowSeconds };
      }
      existing.count += 1;
      return { count: existing.count, ttlSeconds: Math.ceil((existing.expiresAt - now) / 1000) };
    },
  };
}

describe('checkRateLimit', () => {
  it('allows a request within the window', async () => {
    const result = await checkRateLimit('1.2.3.4', config, fakeStore());
    expect(result).toEqual({ allowed: true, retryAfter: 0 });
  });

  it('denies once the limit is exceeded, with retryAfter set to the remaining window', async () => {
    const store = fakeStore();
    // Exhaust the allowance: limit requests are allowed...
    for (let i = 0; i < config.limit; i++) {
      expect((await checkRateLimit('1.2.3.4', config, store)).allowed).toBe(true);
    }
    // ...and the next one is denied with the full window still to wait.
    const denied = await checkRateLimit('1.2.3.4', config, store);
    expect(denied).toEqual({ allowed: false, retryAfter: 60 });
  });

  it('reports a shrinking retryAfter as the window elapses', async () => {
    const store = fakeStore();
    for (let i = 0; i < config.limit; i++) {
      await checkRateLimit('1.2.3.4', config, store);
    }
    store.advance(45_000); // 45s into the 60s window
    const denied = await checkRateLimit('1.2.3.4', config, store);
    expect(denied).toEqual({ allowed: false, retryAfter: 15 });
  });

  it('tracks each IP independently', async () => {
    const store = fakeStore();
    for (let i = 0; i < config.limit; i++) {
      await checkRateLimit('1.2.3.4', config, store);
    }
    expect((await checkRateLimit('1.2.3.4', config, store)).allowed).toBe(false);
    // A different IP starts with a fresh allowance.
    expect((await checkRateLimit('9.9.9.9', config, store)).allowed).toBe(true);
  });
});

function pipelineResponse(results: unknown[], status = 200): Response {
  return new Response(JSON.stringify(results.map((result) => ({ result }))), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('upstashStore', () => {
  const creds = { url: 'https://us1.upstash.io', token: 'tok-123' };

  it('issues an atomic INCR + EXPIRE(NX) + PTTL pipeline authenticated with the token', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(pipelineResponse([1, 1, 60_000]));

    await upstashStore(creds, { fetch: fetchMock }).hit('ratelimit:1.2.3.4', 60);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://us1.upstash.io/pipeline');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer tok-123');
    expect(JSON.parse(init.body as string)).toEqual([
      ['INCR', 'ratelimit:1.2.3.4'],
      ['EXPIRE', 'ratelimit:1.2.3.4', 60, 'NX'],
      ['PTTL', 'ratelimit:1.2.3.4'],
    ]);
  });

  it('parses the count and converts the PTTL milliseconds to whole seconds', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(pipelineResponse([3, 0, 14_200]));

    const result = await upstashStore(creds, { fetch: fetchMock }).hit('ratelimit:1.2.3.4', 60);

    expect(result).toEqual({ count: 3, ttlSeconds: 15 });
  });

  it('throws on a non-200 response without leaking the upstream body', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('upstash secret detail', { status: 500 }));

    const err = await upstashStore(creds, { fetch: fetchMock })
      .hit('ratelimit:1.2.3.4', 60)
      .catch((e: unknown) => e);

    expect(err).toBeInstanceOf(Error);
    expect((err as Error).message).not.toContain('upstash secret detail');
  });
});

describe('rateLimitConfigFromEnv', () => {
  it('defaults to 20 requests per 60s when env is unset', () => {
    expect(rateLimitConfigFromEnv({})).toEqual({ limit: 20, windowSeconds: 60 });
  });

  it('lets env override the limit and window', () => {
    const cfg = rateLimitConfigFromEnv({
      RATE_LIMIT_MAX: '5',
      RATE_LIMIT_WINDOW_SECONDS: '30',
    });
    expect(cfg).toEqual({ limit: 5, windowSeconds: 30 });
  });
});

describe('upstashCredentialsFromEnv', () => {
  it('returns null when Upstash is not configured, so the route can fail open', () => {
    expect(upstashCredentialsFromEnv({})).toBeNull();
  });

  it('returns trimmed credentials when both URL and token are present', () => {
    expect(
      upstashCredentialsFromEnv({
        UPSTASH_REDIS_REST_URL: ' https://us1.upstash.io ',
        UPSTASH_REDIS_REST_TOKEN: ' tok-123 ',
      }),
    ).toEqual({ url: 'https://us1.upstash.io', token: 'tok-123' });
  });

  it('returns null when only one of the pair is present', () => {
    expect(upstashCredentialsFromEnv({ UPSTASH_REDIS_REST_URL: 'https://us1.upstash.io' })).toBeNull();
  });
});
