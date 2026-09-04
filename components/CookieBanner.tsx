'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCookieConsent, onCookieBannerReopen, setCookieConsent } from '@/lib/cookieConsent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getCookieConsent() === null);
    return onCookieBannerReopen(() => setVisible(true));
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-panel-border bg-panel-surface px-4 py-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-panel-muted">
          Izmantojam Google Analytics apmeklējumu statistikai, kas uzstāda sīkdatnes. Vari tās pieņemt vai
          noraidīt — lapa strādā abos gadījumos. Vairāk lasi{' '}
          <Link
            href="/privatuma-politika"
            className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
          >
            privātuma politikā
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => {
              setCookieConsent('denied');
              setVisible(false);
            }}
            className="rounded-md border border-panel-border-strong px-4 py-2 text-sm font-semibold text-panel-muted hover:border-panel-text hover:text-panel-text"
          >
            Noraidīt
          </button>
          <button
            type="button"
            onClick={() => {
              setCookieConsent('granted');
              setVisible(false);
            }}
            className="rounded-md border border-panel-border-strong px-4 py-2 text-sm font-semibold text-panel-text hover:border-panel-text"
          >
            Piekrītu
          </button>
        </div>
      </div>
    </div>
  );
}
