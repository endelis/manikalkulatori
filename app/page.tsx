import type { Metadata } from 'next';
import Link from 'next/link';
import { categories, getCalculatorsByCategory } from '@/lib/registry';
import { pluralizeKalkulatori } from '@/lib/format';
import { SITE_URL } from '@/lib/site';
import { buildWebSiteSchema, safeJsonLd } from '@/lib/schema';

const HOME_DESCRIPTION =
  'Bezmaksas kalkulatori auto, finanšu, mājokļa, veselības un sporta jautājumiem latviešu valodā.';

export const metadata: Metadata = {
  description: HOME_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Manikalkulatori.lv',
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    locale: 'lv_LV',
  },
};

export default function HomePage() {
  const webSiteSchema = buildWebSiteSchema({
    name: 'Manikalkulatori.lv',
    description: HOME_DESCRIPTION,
    url: SITE_URL,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(webSiteSchema) }} />
      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="font-sans text-h1">Manikalkulatori.lv</h1>
        <p className="text-panel-muted">
          Bezmaksas kalkulatori auto, finanšu, mājokļa, veselības un sporta jautājumiem latviešu valodā.
          Katrs kalkulators parāda rezultātu uzreiz, bez reģistrēšanās.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((category) => {
          const count = getCalculatorsByCategory(category.slug).length;
          const cardClassName =
            'flex flex-col gap-1 rounded-2xl border border-panel-border bg-panel-surface p-6 shadow-sm transition-shadow duration-[120ms]';

          // Categories without calculators are shown but not linked — an empty category
          // page is thin content, so we do not send visitors (or crawlers) there yet.
          if (count === 0) {
            return (
              <div key={category.slug} className={`${cardClassName} opacity-60`}>
                <h2 className="font-mono text-lg" style={{ color: category.accentVar }}>
                  {category.title}
                </h2>
                <p className="text-sm text-panel-muted">{category.description}</p>
                <p className="text-xs text-panel-faint">Drīzumā</p>
              </div>
            );
          }

          return (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className={`${cardClassName} hover:shadow`}
              style={{ borderColor: category.accentVar }}
            >
              <h2 className="font-mono text-lg" style={{ color: category.accentVar }}>
                {category.title}
              </h2>
              <p className="text-sm text-panel-muted">{category.description}</p>
              <p className="text-xs text-panel-faint">{pluralizeKalkulatori(count)}</p>
            </Link>
          );
        })}
      </div>
      </main>
    </>
  );
}
