const STORAGE_KEY = 'manikalkulatori-cookie-consent';
const CONSENT_CHANGE_EVENT = 'cookie-consent-change';
const CONSENT_REOPEN_EVENT = 'cookie-consent-reopen';

export type CookieConsent = 'granted' | 'denied';

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    // Storage unavailable (private browsing, disabled storage) — treat as no
    // decision yet rather than throwing.
    return null;
  }
}

export function setCookieConsent(value: CookieConsent): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Same fallback as above: if storage is unavailable, the banner will
    // simply reappear on the next visit, which is an acceptable outcome.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: value }));
}

export function onCookieConsentChange(listener: (value: CookieConsent) => void): () => void {
  const handler = (event: Event) => listener((event as CustomEvent<CookieConsent>).detail);
  window.addEventListener(CONSENT_CHANGE_EVENT, handler);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handler);
}

export function reopenCookieBanner(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT));
}

export function onCookieBannerReopen(listener: () => void): () => void {
  window.addEventListener(CONSENT_REOPEN_EVENT, listener);
  return () => window.removeEventListener(CONSENT_REOPEN_EVENT, listener);
}
