import Link from 'next/link';
import type { CalculatorMeta, CategoryMeta } from '@/lib/registry';
import type { FaqEntry } from '@/lib/faq';
import { AdSlot } from './AdSlot';
import { Faq } from './Faq';
import { RelatedCalculators } from './RelatedCalculators';

interface CalculatorShellProps {
  category: CategoryMeta;
  calculator: CalculatorMeta;
  faq: FaqEntry[];
  related: CalculatorMeta[];
  children: React.ReactNode;
}

export function CalculatorShell({ category, calculator, faq, related, children }: CalculatorShellProps) {
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

      {children}

      <AdSlot minHeight={250} />

      <Faq items={faq} />

      <RelatedCalculators items={related} />

      <AdSlot minHeight={250} />
    </main>
  );
}
