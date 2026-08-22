import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Manikalkulatori.lv — kalkulatori latviešu valodā',
    template: '%s | Manikalkulatori.lv',
  },
  description:
    'Bezmaksas kalkulatori auto, finanšu, mājokļa, veselības un sporta jautājumiem latviešu valodā.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lv">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
