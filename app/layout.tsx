import type { Metadata } from 'next';
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Footer } from '@/components/Footer';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Manikalkulatori.lv: kalkulatori latviešu valodā',
    template: '%s | Manikalkulatori.lv',
  },
  description:
    'Bezmaksas kalkulatori auto, finanšu, mājokļa, veselības un sporta jautājumiem latviešu valodā.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lv" className={`${jetbrainsMono.variable} ${ibmPlexSans.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
