import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategory } from '@/lib/registry';
import { loadFaq } from '@/lib/faq';
import { SITE_URL } from '@/lib/site';
import { buildBreadcrumbSchema, buildFaqSchema, safeJsonLd } from '@/lib/schema';
import { formatNumber } from '@/lib/format';
import { Faq } from '@/components/Faq';
import { BirthsDeathsTable } from '@/components/BirthsDeathsTable';
import { DEFAULT_POPULATION, POPULATION_SERIES } from '@/lib/calculators/dzimstibas-kalkulators-defaults';

const category = getCategory('sabiedriba')!;
const PAGE_PATH = '/sabiedriba/iedzivotaju-skaits-latvija';
const url = `${SITE_URL}${PAGE_PATH}`;

const TITLE = 'Cik iedzīvotāju ir Latvijā 2026. gadā';
const DESCRIPTION =
  'Latvijas iedzīvotāju skaits pēc oficiāliem CSP datiem, ar dzimušo un mirušo skaita grafiku no 2015. līdz 2025. gadam.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url,
    locale: 'lv_LV',
  },
};

const faq = loadFaq('iedzivotaju-skaits-latvija');
const recentSeries = POPULATION_SERIES.filter((row) => row.year >= 2015 && row.year <= 2025);

export default function IedzivotajuSkaitsPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Sākums', url: SITE_URL },
    { name: category.title, url: `${SITE_URL}/${category.slug}` },
    { name: TITLE, url },
  ]);
  const faqSchema = buildFaqSchema(faq);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-panel-muted">
          <Link href="/">Sākums</Link>
          {' / '}
          <Link href={`/${category.slug}`}>{category.title}</Link>
          {' / '}
          <span>{TITLE}</span>
        </nav>

        <h1 className="font-sans text-h1">{TITLE}</h1>

        <p className="text-panel-muted">
          2026. gada 1. janvārī Latvijā dzīvoja {formatNumber(DEFAULT_POPULATION, 0)} iedzīvotāji pēc Centrālās
          statistikas pārvaldes datiem,{' '}
          <a
            href="https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS010/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
          >
            tabula IRS010
          </a>
          .
        </p>

        <section aria-labelledby="chart-heading" className="flex flex-col gap-3">
          <h2 id="chart-heading" className="font-sans text-h2">
            Dzīvi dzimušie un mirušie, 2015 līdz 2025
          </h2>
          <BirthsDeathsTable rows={recentSeries} accentVar={category.accentVar} />
        </section>

        <section aria-labelledby="methodology-heading" className="flex flex-col gap-3">
          <h2 id="methodology-heading" className="font-sans text-h2">
            Metodoloģijas piezīme
          </h2>
          <p className="text-panel-muted">
            No 2025. gada Centrālā statistikas pārvalde iedzīvotāju skaita novērtēšanai izmanto jaunu SoL
            logit modeli iepriekšējā loģistiskās regresijas modeļa vietā, un pārrēķināja 2023. un 2024. gada
            datus atbilstoši jaunajai metodei. 2025. gada 2. oktobrī CSP papildus precizēja 2025. gada 2. jūnija
            novērtējumu, iekļaujot pastāvīgo iedzīvotāju skaitā ārvalstu studentus. Tāpēc šajā lapā redzamie
            skaitļi par 2023. un 2024. gadu var atšķirties no agrāk publicētiem.
          </p>
        </section>

        <p className="text-panel-muted">
          Iedzīvotāju skaita samazināšanos galvenokārt nosaka negatīvs dabiskais pieaugums, tas ir, mirst
          vairāk cilvēku, nekā piedzimst. Aprēķini, cik bērniem vajadzētu piedzimt, lai tas mainītos, ar{' '}
          <Link
            href="/sabiedriba/dzimstibas-kalkulators"
            className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
          >
            dzimstības kalkulatoru
          </Link>
          .
        </p>

        <Faq items={faq} />
      </main>
    </>
  );
}
