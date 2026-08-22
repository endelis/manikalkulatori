'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { hasCookieConsent, setCookieConsent } from '@/lib/cookieConsent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasCookieConsent());
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-panel-border bg-panel-surface px-4 py-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-panel-muted">
          Šī vietne pašlaik neizmanto izsekošanas sīkdatnes. Analītikai izmantojam Vercel Web Analytics,
          kas nesaglabā sīkdatnes tavā ierīcē. Vairāk lasi{' '}
          <Link
            href="/privatuma-politika"
            className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
          >
            privātuma politikā
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setCookieConsent();
            setVisible(false);
          }}
          className="shrink-0 rounded-md border border-panel-border-strong px-4 py-2 text-sm font-semibold text-panel-text hover:border-panel-text"
        >
          Sapratu
        </button>
      </div>
    </div>
  );
}
