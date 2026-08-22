import Link from 'next/link';
import type { CalculatorMeta } from '@/lib/registry';

interface RelatedCalculatorsProps {
  items: CalculatorMeta[];
}

export function RelatedCalculators({ items }: RelatedCalculatorsProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="flex flex-col gap-3">
      <h2 id="related-heading" className="font-mono text-xl">
        Saistītie kalkulatori
      </h2>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/${item.category}/${item.slug}`}
              className="text-panel-text underline decoration-panel-border underline-offset-4 hover:decoration-current"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
