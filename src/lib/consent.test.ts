import { describe, it, expect } from 'vitest';
import {
  readConsent,
  recordConsent,
  localStorageConsentStore,
  CONSENT_STORAGE_KEY,
  CONSENT_TTL_MS,
  type ConsentStore,
} from './consent';

/**
 * In-memory stand-in for the browser's localStorage slot the banner uses.
 * A single mutable string cell is all the consent module needs.
 */
function fakeStore(initial: string | null = null): ConsentStore {
  let value = initial;
  return {
    read: () => value,
    write: (v: string) => {
      value = v;
    },
  };
}

describe('readConsent', () => {
  it('reports unknown on a first visit, when nothing has been stored yet', () => {
    expect(readConsent(fakeStore(), Date.now())).toEqual({ status: 'unknown' });
  });

  it('reports accepted once consent has been recorded, so the banner stays gone on return visits', () => {
    const store = fakeStore();
    const now = Date.now();

    recordConsent(store, now);

    expect(readConsent(store, now)).toEqual({ status: 'accepted' });
  });

  it('lapses back to unknown once the recorded consent is older than the TTL, prompting re-consent', () => {
    const store = fakeStore();
    const recordedAt = Date.now();
    recordConsent(store, recordedAt);

    // Still valid one tick before the TTL elapses...
    expect(readConsent(store, recordedAt + CONSENT_TTL_MS - 1)).toEqual({ status: 'accepted' });
    // ...and expired once the TTL is reached.
    expect(readConsent(store, recordedAt + CONSENT_TTL_MS)).toEqual({ status: 'unknown' });
  });

  it('treats a corrupted stored value as unknown rather than throwing', () => {
    expect(readConsent(fakeStore('not json {'), Date.now())).toEqual({ status: 'unknown' });
  });
});

/** Minimal `Storage`-shaped fake: a Map behind getItem/setItem. */
function fakeWebStorage(): Pick<Storage, 'getItem' | 'setItem'> {
  const cells = new Map<string, string>();
  return {
    getItem: (k) => cells.get(k) ?? null,
    setItem: (k, v) => void cells.set(k, v),
  };
}

describe('localStorageConsentStore', () => {
  it('round-trips consent through the backing storage under the shared key', () => {
    const web = fakeWebStorage();
    const store = localStorageConsentStore(web);

    expect(readConsent(store, Date.now())).toEqual({ status: 'unknown' });
    recordConsent(store, Date.now());

    // Persisted under the agreed key, where a fresh adapter sees it too.
    expect(web.getItem(CONSENT_STORAGE_KEY)).not.toBeNull();
    expect(readConsent(localStorageConsentStore(web), Date.now())).toEqual({ status: 'accepted' });
  });
});
