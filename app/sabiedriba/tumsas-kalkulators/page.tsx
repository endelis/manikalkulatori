import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategory, getCalculator } from '@/lib/registry';
import { SITE_URL } from '@/lib/site';
import { buildBreadcrumbSchema, buildSoftwareApplicationSchema, safeJsonLd } from '@/lib/schema';

const category = getCategory('sabiedriba')!;
const calculator = getCalculator('sabiedriba', 'tumsas-kalkulators')!;
const url = `${SITE_URL}/${category.slug}/${calculator.slug}`;

export const metadata: Metadata = {
  title: calculator.title,
  description: calculator.metaDescription,
  alternates: { canonical: `/${category.slug}/${calculator.slug}` },
  openGraph: {
    title: calculator.h1,
    description: calculator.metaDescription,
    url,
    locale: 'lv_LV',
  },
};

export default function TumsasKalkulatorsPage() {
  const softwareSchema = buildSoftwareApplicationSchema({
    name: calculator.title,
    description: calculator.metaDescription,
    url,
    category: 'UtilitiesApplication',
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Sākums', url: SITE_URL },
    { name: category.title, url: `${SITE_URL}/${category.slug}` },
    { name: calculator.title, url },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <main
        className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8"
        style={{ '--accent': category.accentVar } as React.CSSProperties}
      >
        <nav aria-label="Breadcrumb" className="text-sm text-panel-muted">
          <Link href="/">Sākums</Link>
          {' / '}
          <Link href={`/${category.slug}`}>{category.title}</Link>
          {' / '}
          <span>{calculator.title}</span>
        </nav>

        <h1 className="font-sans text-h1">{calculator.h1}</h1>
        <p className="text-panel-muted">{calculator.intro}</p>

        {/* Checkpoint 2: birth date input (day, month, year) and the live result,
            mirroring PensijasKalkulators.tsx's useMemo driven recompute pattern. */}

        {/* Checkpoint 3: methodology (Kā aprēķins veikts), limitations (Ko šis
            kalkulators neņem vērā), sources (Avoti), and FAQ sections, mirroring
            dzimstibas-kalkulators/page.tsx section for section. */}
      </main>
    </>
  );
}
