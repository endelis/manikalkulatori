import Link from 'next/link';
import type { CalculatorMeta, CategoryMeta } from '@/lib/registry';
import type { FaqEntry } from '@/lib/faq';
import { Faq } from './Faq';
import { RelatedCalculators } from './RelatedCalculators';

interface ArticleShellProps {
  category: CategoryMeta;
  article: CalculatorMeta;
  faq: FaqEntry[];
  related: CalculatorMeta[];
  /** The article's own body copy. */
  body: React.ReactNode;
  /** Optional "Avoti" section for articles that cite external sources — same convention
   * as CalculatorShell's `sources` prop. */
  sources?: React.ReactNode;
}

export function ArticleShell({ category, article, faq, related, body, sources }: ArticleShellProps) {
  return (
    <main
      className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10"
      style={{ '--accent': category.accentVar } as React.CSSProperties}
    >
      <nav aria-label="Breadcrumb" className="text-sm text-panel-faint">
        <Link href="/">Sākums</Link>
        {' / '}
        <Link href={`/${category.slug}`}>{category.title}</Link>
        {' / '}
        <span>{article.title}</span>
      </nav>

      <h1 className="font-sans text-h1">{article.h1}</h1>

      <p className="text-panel-muted">{article.intro}</p>

      <div className="flex flex-col gap-4 text-panel-text">{body}</div>

      {sources ? (
        <section aria-labelledby="sources-heading" className="flex flex-col gap-3">
          <h2 id="sources-heading" className="font-sans text-h2">
            Avoti
          </h2>
          {sources}
        </section>
      ) : null}

      <Faq items={faq} />

      <RelatedCalculators items={related} />
    </main>
  );
}
