const STORAGE_KEY = 'manikalkulatori-cookie-consent';

export function hasCookieConsent(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    // Storage unavailable (private browsing, disabled storage) — treat as
    // already acknowledged rather than blocking the page on a banner that
    // can never be dismissed.
    return true;
  }
}

export function setCookieConsent(): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, 'true');
  } catch {
    // Same fallback as above: if storage is unavailable, the banner will
    // simply reappear on the next visit, which is an acceptable outcome.
  }
}
