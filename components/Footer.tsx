'use client';

import Link from 'next/link';
import { reopenCookieBanner } from '@/lib/cookieConsent';

export function Footer() {
  return (
    <footer className="mx-auto mt-16 flex max-w-2xl flex-col gap-3 border-t border-panel-border px-4 py-8 text-sm text-panel-muted">
      <nav aria-label="Juridiskā informācija" className="flex flex-wrap gap-x-4 gap-y-2">
        <Link href="/par-mums" className="hover:text-panel-text">
          Par mums
        </Link>
        <Link href="/kontakti" className="hover:text-panel-text">
          Kontakti
        </Link>
        <Link href="/privatuma-politika" className="hover:text-panel-text">
          Privātuma politika
        </Link>
        <Link href="/noteikumi" className="hover:text-panel-text">
          Lietošanas noteikumi
        </Link>
        <button type="button" onClick={reopenCookieBanner} className="hover:text-panel-text">
          Sīkdatņu iestatījumi
        </button>
      </nav>
      <p>Manikalkulatori.lv, {new Date().getFullYear()}.</p>
    </footer>
  );
}
