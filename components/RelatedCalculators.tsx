import Link from 'next/link';
import type { CalculatorMeta } from '@/lib/registry';

interface RelatedCalculatorsProps {
  items: CalculatorMeta[];
}

export function RelatedCalculators({ items }: RelatedCalculatorsProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="flex flex-col gap-3">
      <h2 id="related-heading" className="font-sans text-h2">
        Saistītie kalkulatori
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/${item.category}/${item.slug}`}
            className="flex flex-col gap-1 rounded-xl border border-panel-border bg-panel-surface p-4 shadow-sm transition-shadow duration-[120ms] hover:shadow"
          >
            <span className="font-medium text-panel-text">{item.title}</span>
            <span className="text-sm text-panel-faint">{item.intro}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
