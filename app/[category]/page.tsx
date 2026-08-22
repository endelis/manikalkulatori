import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { categories, getCalculatorsByCategory, getCategory } from '@/lib/registry';

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const category = getCategory(resolvedParams.category);
  if (!category) return {};
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const category = getCategory(resolvedParams.category);
  if (!category) notFound();

  const categoryCalculators = getCalculatorsByCategory(category.slug);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-panel-muted">
        <Link href="/">Sākums</Link>
        {' / '}
        <span>{category.title}</span>
      </nav>

      <h1 className="font-mono text-2xl font-semibold" style={{ color: category.accentVar }}>
        {category.title}
      </h1>
      <p className="text-panel-muted">{category.description}</p>

      {categoryCalculators.length === 0 ? (
        <p className="rounded-md border border-panel-border bg-panel-surface p-4 text-panel-muted">
          Šajā kategorijā drīzumā būs pieejami kalkulatori.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {categoryCalculators.map((calculator) => (
            <li key={calculator.slug}>
              <Link
                href={`/${category.slug}/${calculator.slug}`}
                className="text-panel-text underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                {calculator.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
