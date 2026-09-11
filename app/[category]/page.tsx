import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { categories, getCategory, getContentByCategory } from '@/lib/registry';

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

  const isEmpty = getContentByCategory(category.slug).length === 0;

  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/${category.slug}` },
    robots: isEmpty ? { index: false, follow: true } : undefined,
  };
}

function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const category = getCategory(resolvedParams.category);
  if (!category) notFound();

  const categoryCalculators = getContentByCategory(category.slug);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-panel-faint">
        <Link href="/">Sākums</Link>
        {' / '}
        <span>{category.title}</span>
      </nav>

      <header className="flex flex-col gap-2">
        <h1 className="font-sans text-h1" style={{ color: category.accentVar }}>
          {category.title}
        </h1>
        <p className="text-panel-muted">{category.description}</p>
      </header>

      {categoryCalculators.length === 0 ? (
        <p className="rounded-xl border border-panel-border bg-panel-surface p-5 text-panel-muted shadow-sm">
          Šajā kategorijā drīzumā būs pieejami kalkulatori.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categoryCalculators.map((calculator) => (
            <Link
              key={calculator.slug}
              href={`/${category.slug}/${calculator.slug}`}
              className="flex flex-col gap-1 rounded-2xl border border-panel-border bg-panel-surface p-5 shadow-sm transition-shadow duration-[120ms] hover:shadow"
            >
              <span className="font-medium text-panel-text">{calculator.title}</span>
              <span className="text-sm text-panel-faint">{truncateAtWord(calculator.intro, 80)}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
