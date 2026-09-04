'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';
import { getCookieConsent, onCookieConsentChange } from '@/lib/cookieConsent';

export function GoogleAnalytics() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    setGranted(getCookieConsent() === 'granted');
    return onCookieConsentChange((value) => setGranted(value === 'granted'));
  }, []);

  if (!granted) {
    return null;
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
