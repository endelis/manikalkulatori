import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://manikalkulatori.lv'),
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
