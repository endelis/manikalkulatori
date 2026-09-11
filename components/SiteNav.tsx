import Link from 'next/link';
import { categories } from '@/lib/registry';
import { MobileNavToggle } from './MobileNavToggle';

export function SiteNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-panel-border bg-panel-surface">
      <div className="relative mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="whitespace-nowrap font-sans text-lg font-semibold text-panel-text">
          Manikalkulatori.lv
        </Link>
        <nav aria-label="Kategorijas" className="hidden gap-4 lg:flex">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="whitespace-nowrap text-sm text-panel-muted transition-colors duration-[120ms] hover:text-panel-text"
            >
              {category.title}
            </Link>
          ))}
        </nav>
        <MobileNavToggle categories={categories.map(({ slug, title }) => ({ slug, title }))} />
      </div>
    </header>
  );
}
