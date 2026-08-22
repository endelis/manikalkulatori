import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-16 text-center">
      <h1 className="font-mono text-3xl font-semibold">404</h1>
      <p className="text-panel-muted">Šī lapa neeksistē.</p>
      <Link href="/" className="underline decoration-panel-border underline-offset-4 hover:decoration-current">
        Atpakaļ uz sākumu
      </Link>
    </main>
  );
}
