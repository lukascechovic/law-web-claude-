export interface RateLimitConfig {
  /** Max requests allowed per IP within the window. */
  limit: number;
  /** Length of the fixed window, in seconds. */
  windowSeconds: number;
}

/**
 * A counter store with Redis INCR+EXPIRE semantics: the first hit in a window
 * sets the TTL, later hits increment the same counter until it expires.
 * Backed by Upstash in production, by an in-memory fake in tests.
 */
export interface RateLimitStore {
  hit(key: string, windowSeconds: number): Promise<{ count: number; ttlSeconds: number }>;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller may retry; 0 when allowed. */
  retryAfter: number;
}

export async function checkRateLimit(
  ip: string,
  config: RateLimitConfig,
  store: RateLimitStore,
): Promise<RateLimitResult> {
  const { count, ttlSeconds } = await store.hit(`ratelimit:${ip}`, config.windowSeconds);
  if (count > config.limit) {
    return { allowed: false, retryAfter: ttlSeconds };
  }
  return { allowed: true, retryAfter: 0 };
}

export interface UpstashCredentials {
  url: string;
  token: string;
}

export interface StoreDeps {
  fetch?: typeof fetch;
}

/**
 * Upstash Redis store over the REST API (host-portable per ADR-0001 — no SDK,
 * no Vercel-proprietary primitives). One atomic pipeline per hit: INCR the
 * per-IP counter, EXPIRE it only on creation (NX) so the window is fixed from
 * the first request, and read PTTL to report the remaining wait.
 */
export function upstashStore(
  creds: UpstashCredentials,
  deps: StoreDeps = {},
): RateLimitStore {
  const doFetch = deps.fetch ?? fetch;
  return {
    async hit(key, windowSeconds) {
      const response = await doFetch(`${creds.url}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${creds.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['EXPIRE', key, windowSeconds, 'NX'],
          ['PTTL', key],
        ]),
      });

      if (!response.ok) {
        // Never leak the upstream body to callers.
        throw new Error(`Rate-limit store request failed with status ${response.status}`);
      }

      const [incr, , pttl] = (await response.json()) as { result: number }[];
      return { count: incr.result, ttlSeconds: Math.ceil(pttl.result / 1000) };
    },
  };
}

export function upstashCredentialsFromEnv(
  env: Record<string, string | undefined> = process.env,
): UpstashCredentials | null {
  const url = env.UPSTASH_REDIS_REST_URL?.trim();
  const token = env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

const DEFAULT_LIMIT = 20;
const DEFAULT_WINDOW_SECONDS = 60;

export function rateLimitConfigFromEnv(
  env: Record<string, string | undefined> = process.env,
): RateLimitConfig {
  const limit = Number(env.RATE_LIMIT_MAX);
  const windowSeconds = Number(env.RATE_LIMIT_WINDOW_SECONDS);
  return {
    limit: Number.isFinite(limit) && limit > 0 ? limit : DEFAULT_LIMIT,
    windowSeconds:
      Number.isFinite(windowSeconds) && windowSeconds > 0
        ? windowSeconds
        : DEFAULT_WINDOW_SECONDS,
  };
}
