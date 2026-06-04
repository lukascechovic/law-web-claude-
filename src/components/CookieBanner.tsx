'use client';

import { useEffect, useRef, useState } from 'react';
import { Cookie } from 'lucide-react';
import {
  readConsent,
  recordConsent,
  localStorageConsentStore,
  type ConsentStore,
} from '@/lib/consent';

/**
 * A lightweight, informational cookie notice (per the cookieless-analytics
 * decision — no granular opt-in machinery). Visibility is driven entirely by
 * the consent module; this component only wires it to the browser's
 * localStorage and renders the notice when consent is unknown.
 */
export default function CookieBanner() {
  // `null` until mounted: the server can't read localStorage, so we render
  // nothing on the server and decide on the client to avoid a hydration flash.
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const storeRef = useRef<ConsentStore | null>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    storeRef.current = localStorageConsentStore(window.localStorage);
    setVisible(readConsent(storeRef.current, Date.now()).status === 'unknown');
    setMounted(true);
  }, []);

  // Move focus to the dismiss control when the notice appears, so keyboard and
  // screen-reader users land on the actionable element.
  useEffect(() => {
    if (mounted && visible) acceptRef.current?.focus();
  }, [mounted, visible]);

  function accept() {
    if (storeRef.current) recordConsent(storeRef.current, Date.now());
    setVisible(false);
  }

  if (!mounted || !visible) return null;

  return (
    <div
      data-testid="cookie-banner"
      role="region"
      aria-label="Cookie notice"
      onKeyDown={e => {
        if (e.key === 'Escape') accept();
      }}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl border border-forest-800 bg-forest-950 px-5 py-4 text-cream-50 shadow-2xl sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="flex items-start gap-3 text-sm text-cream-100">
        <Cookie size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-bark-500" />
        <span>
          We use privacy-friendly, cookieless analytics to understand how the site is used — no
          tracking cookies, ever.
        </span>
      </p>
      <button
        ref={acceptRef}
        data-testid="cookie-accept"
        onClick={accept}
        className="shrink-0 self-end rounded-lg bg-forest-700 px-4 py-2 text-sm font-medium text-cream-50 transition-colors hover:bg-forest-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-cream-100 sm:self-auto"
      >
        Got it
      </button>
    </div>
  );
}
