import Link from 'next/link';
import type { CalculatorMeta, CategoryMeta } from '@/lib/registry';
import type { FaqEntry } from '@/lib/faq';
import { Faq } from './Faq';
import { RelatedCalculators } from './RelatedCalculators';

interface CalculatorShellProps {
  category: CategoryMeta;
  calculator: CalculatorMeta;
  faq: FaqEntry[];
  related: CalculatorMeta[];
  /** Plain-language formula explanation plus a worked example, required on every calculator page. */
  explanation: React.ReactNode;
  children: React.ReactNode;
}

export function CalculatorShell({
  category,
  calculator,
  faq,
  related,
  explanation,
  children,
}: CalculatorShellProps) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-panel-muted">
        <Link href="/">Sākums</Link>
        {' / '}
        <Link href={`/${category.slug}`}>{category.title}</Link>
        {' / '}
        <span>{calculator.title}</span>
      </nav>

      <h1 className="font-mono text-2xl font-semibold">{calculator.h1}</h1>

      <p className="text-panel-muted">{calculator.intro}</p>

      {children}

      {/* Reserved for a future ad or affiliate placement (DESIGN-GUIDANCE.md sections 5 and 8).
          Kept empty and height-stable now so inserting real content later causes zero CLS. */}
      <div style={{ height: 250 }} aria-hidden="true" />

      <section aria-labelledby="explanation-heading" className="flex flex-col gap-3">
        <h2 id="explanation-heading" className="font-mono text-xl">
          Kā tiek aprēķināts
        </h2>
        {explanation}
      </section>

      <Faq items={faq} />

      <RelatedCalculators items={related} />

      {/* Reserved for a future footer ad or affiliate placement (DESIGN-GUIDANCE.md sections 5 and 8). */}
      <div style={{ height: 250 }} aria-hidden="true" />
    </main>
  );
}
