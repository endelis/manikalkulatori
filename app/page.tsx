import Link from 'next/link';
import { categories, getCalculatorsByCategory } from '@/lib/registry';

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="font-mono text-3xl font-semibold">Manikalkulatori.lv</h1>
        <p className="text-panel-muted">
          Bezmaksas kalkulatori auto, finanšu, mājokļa, veselības un sporta jautājumiem latviešu valodā.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((category) => {
          const count = getCalculatorsByCategory(category.slug).length;
          return (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="flex flex-col gap-1 rounded-lg border border-panel-border bg-panel-surface p-5"
              style={{ borderColor: category.accentVar }}
            >
              <h2 className="font-mono text-lg" style={{ color: category.accentVar }}>
                {category.title}
              </h2>
              <p className="text-sm text-panel-muted">{category.description}</p>
              <p className="text-xs text-panel-muted">{count} kalkulatori</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
