import type { FaqEntry } from '@/lib/faq';

interface FaqProps {
  items: FaqEntry[];
}

export function Faq({ items }: FaqProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="flex flex-col gap-4">
      <h2 id="faq-heading" className="font-mono text-xl">
        Biežāk uzdotie jautājumi
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <details key={item.question} className="rounded-md border border-panel-border bg-panel-surface p-4">
            <summary className="cursor-pointer font-medium">{item.question}</summary>
            <p className="mt-2 text-sm text-panel-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
