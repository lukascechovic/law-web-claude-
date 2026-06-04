export type ConsentStatus = 'unknown' | 'accepted';

export interface ConsentState {
  status: ConsentStatus;
}

/**
 * A single persistent string slot, backed by `localStorage` in the browser and
 * by an in-memory fake in tests. The consent module owns the encoding; the
 * store only reads and writes the raw string, so the persistence mechanism can
 * change without touching the banner UI.
 */
export interface ConsentStore {
  read(): string | null;
  write(value: string): void;
}

interface ConsentRecord {
  /** Epoch millis at which the visitor acknowledged the notice. */
  acceptedAt: number;
}

/**
 * How long a recorded consent stays valid before the banner re-appears.
 * ~6 months — a common EU re-consent cadence that respects the visitor without
 * nagging on every return visit.
 */
export const CONSENT_TTL_MS = 1000 * 60 * 60 * 24 * 180;

/**
 * Reports whether the visitor has already acknowledged the cookie notice.
 * `unknown` means show the banner; `accepted` means stay out of the way.
 * Acknowledgements older than {@link CONSENT_TTL_MS} lapse back to `unknown`.
 */
export function readConsent(store: ConsentStore, now: number): ConsentState {
  const raw = store.read();
  if (raw === null) {
    return { status: 'unknown' };
  }
  const record = parseRecord(raw);
  if (record === null || now - record.acceptedAt >= CONSENT_TTL_MS) {
    return { status: 'unknown' };
  }
  return { status: 'accepted' };
}

/** Decodes a stored record, returning null for anything malformed. */
function parseRecord(raw: string): ConsentRecord | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as ConsentRecord).acceptedAt === 'number'
    ) {
      return parsed as ConsentRecord;
    }
  } catch {
    // Fall through to null — a corrupted slot re-prompts rather than crashes.
  }
  return null;
}

/**
 * Persists the visitor's acknowledgement, stamped with `now` so a future read
 * can expire it. Records via the store's raw string slot; the encoding stays
 * private to this module.
 */
export function recordConsent(store: ConsentStore, now: number): void {
  const record: ConsentRecord = { acceptedAt: now };
  store.write(JSON.stringify(record));
}

/** The single `localStorage` key the consent record lives under. */
export const CONSENT_STORAGE_KEY = 'law-cookie-consent';

/**
 * Backs the consent store with a Web Storage slot (`window.localStorage` in the
 * browser). The banner passes the live `localStorage`; tests pass a fake. Note
 * the analytics are cookieless, so this stores no tracking identifier — only
 * the visitor's acknowledgement of the notice.
 */
export function localStorageConsentStore(
  storage: Pick<Storage, 'getItem' | 'setItem'>,
): ConsentStore {
  return {
    read: () => storage.getItem(CONSENT_STORAGE_KEY),
    write: (value) => storage.setItem(CONSENT_STORAGE_KEY, value),
  };
}
