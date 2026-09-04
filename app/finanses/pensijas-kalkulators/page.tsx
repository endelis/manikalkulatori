import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategory, getCalculator } from '@/lib/registry';
import { SITE_URL } from '@/lib/site';
import { buildBreadcrumbSchema, buildSoftwareApplicationSchema, safeJsonLd } from '@/lib/schema';
import { PensijasKalkulators } from '@/components/calculators/PensijasKalkulators';
import {
  CURRENT_YEAR,
  NDC_START_YEAR,
  PILLAR_1_CONTRIBUTION_RATE_PERCENT,
  WAGE_INDEX_SERIES,
  G_COEFFICIENT_TABLE,
  MIN_RETIREMENT_AGE,
  MAX_RETIREMENT_AGE,
  DEFAULT_BIRTH_YEAR,
  DEFAULT_GROSS_SALARY_MONTHLY,
  DEFAULT_INSURANCE_RECORD_YEARS,
  DEFAULT_WAGE_GROWTH_PERCENT,
  DEFAULT_RETIREMENT_AGE,
  RECENT_ACTUAL_WAGE_GROWTH_PERCENT,
  RECENT_ACTUAL_WAGE_GROWTH_YEAR,
  FORECAST_WAGE_GROWTH_PERCENT,
  FORECAST_WAGE_GROWTH_YEAR,
} from '@/lib/calculators/pensijas-kalkulators-defaults';

const category = getCategory('finanses')!;
const calculator = getCalculator('finanses', 'pensijas-kalkulators')!;
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

export default function PensijasKalkulatorsPage() {
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

        <PensijasKalkulators
          accentVar={category.accentVar}
          currentYear={CURRENT_YEAR}
          ndcStartYear={NDC_START_YEAR}
          pillar1ContributionRatePercent={PILLAR_1_CONTRIBUTION_RATE_PERCENT}
          wageIndexSeries={WAGE_INDEX_SERIES}
          gTable={G_COEFFICIENT_TABLE}
          minRetirementAge={MIN_RETIREMENT_AGE}
          maxRetirementAge={MAX_RETIREMENT_AGE}
          defaultBirthYear={DEFAULT_BIRTH_YEAR}
          defaultGrossSalaryMonthly={DEFAULT_GROSS_SALARY_MONTHLY}
          defaultInsuranceRecordYears={DEFAULT_INSURANCE_RECORD_YEARS}
          defaultWageGrowthPercent={DEFAULT_WAGE_GROWTH_PERCENT}
          defaultRetirementAge={DEFAULT_RETIREMENT_AGE}
          recentActualWageGrowthPercent={RECENT_ACTUAL_WAGE_GROWTH_PERCENT}
          recentActualWageGrowthYear={RECENT_ACTUAL_WAGE_GROWTH_YEAR}
          forecastWageGrowthPercent={FORECAST_WAGE_GROWTH_PERCENT}
          forecastWageGrowthYear={FORECAST_WAGE_GROWTH_YEAR}
        />

        {/* Checkpoint 3: methodology (Kā aprēķins veikts), limitations (Ko šis
            kalkulators neņem vērā), sources (Avoti), and FAQ sections, mirroring
            dzimstibas-kalkulators/page.tsx section for section. */}
      </main>
    </>
  );
}
