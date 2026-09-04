import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakti',
  description: 'Kontaktinformācija Manikalkulatori.lv jautājumiem un ierosinājumiem.',
  alternates: { canonical: '/kontakti' },
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
      <h1 className="font-mono text-2xl font-semibold">Kontakti</h1>
      <p className="text-panel-muted">
        Jautājumus, ierosinājumus un labojumus sūti uz e-pastu: mail@endelis.co
      </p>
      <p className="text-panel-muted">Atbildi parasti saņemsi dažu darba dienu laikā.</p>
    </main>
  );
}
