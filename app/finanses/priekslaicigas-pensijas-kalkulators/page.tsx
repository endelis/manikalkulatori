import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategory, getCalculator, getRelatedCalculators } from '@/lib/registry';
import { loadFaq } from '@/lib/faq';
import { SITE_URL } from '@/lib/site';
import { buildBreadcrumbSchema, buildFaqSchema, buildSoftwareApplicationSchema, safeJsonLd } from '@/lib/schema';
import { formatNumber } from '@/lib/format';
import { Faq } from '@/components/Faq';
import { RelatedCalculators } from '@/components/RelatedCalculators';
import { PensijasKalkulators } from '@/components/calculators/PensijasKalkulators';
import {
  CURRENT_YEAR,
  NDC_START_YEAR,
  PILLAR_1_CONTRIBUTION_RATE_PERCENT,
  WAGE_INDEX_SERIES,
  G_COEFFICIENT_TABLE,
  MIN_EARLY_RETIREMENT_AGE,
  MAX_EARLY_RETIREMENT_AGE,
  DEFAULT_EARLY_RETIREMENT_AGE,
  MIN_INSURANCE_RECORD_YEARS_FOR_EARLY_RETIREMENT,
  DEFAULT_BIRTH_YEAR,
  DEFAULT_GROSS_SALARY_MONTHLY,
  DEFAULT_INSURANCE_RECORD_YEARS,
  DEFAULT_WAGE_GROWTH_PERCENT,
  RECENT_ACTUAL_WAGE_GROWTH_PERCENT,
  RECENT_ACTUAL_WAGE_GROWTH_YEAR,
  FORECAST_WAGE_GROWTH_PERCENT,
  FORECAST_WAGE_GROWTH_YEAR,
} from '@/lib/calculators/pensijas-kalkulators-defaults';

const faq = loadFaq('priekslaicigas-pensijas-kalkulators');
const MIN_G_VALUE = G_COEFFICIENT_TABLE[MIN_EARLY_RETIREMENT_AGE];
const MAX_G_VALUE = G_COEFFICIENT_TABLE[MAX_EARLY_RETIREMENT_AGE];

const category = getCategory('finanses')!;
const calculator = getCalculator('finanses', 'priekslaicigas-pensijas-kalkulators')!;
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

export default function PriekslaicigasPensijasKalkulatorsPage() {
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

  const faqSchema = buildFaqSchema(faq);
  const related = getRelatedCalculators(calculator);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
      <main
        className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10"
        style={{ '--accent': category.accentVar } as React.CSSProperties}
      >
        <nav aria-label="Breadcrumb" className="text-sm text-panel-faint">
          <Link href="/">Sākums</Link>
          {' / '}
          <Link href={`/${category.slug}`}>{category.title}</Link>
          {' / '}
          <span>{calculator.title}</span>
        </nav>

        <h1 className="font-sans text-h1">{calculator.h1}</h1>
        <p className="text-panel-muted">{calculator.intro}</p>

        <p className="rounded-xl border border-panel-border bg-panel-surface p-4 text-sm text-panel-muted shadow-sm">
          Priekšlaicīga pensionēšanās ir pieejama tikai personām ar vismaz{' '}
          {MIN_INSURANCE_RECORD_YEARS_FOR_EARLY_RETIREMENT} gadu apdrošināšanas stāžu, un ne agrāk kā{' '}
          {formatNumber(MAX_EARLY_RETIREMENT_AGE, 0)} gadu vecumā (2 gadus pirms standarta 65 gadu vecuma).
        </p>

        <PensijasKalkulators
          accentVar={category.accentVar}
          currentYear={CURRENT_YEAR}
          ndcStartYear={NDC_START_YEAR}
          pillar1ContributionRatePercent={PILLAR_1_CONTRIBUTION_RATE_PERCENT}
          wageIndexSeries={WAGE_INDEX_SERIES}
          gTable={G_COEFFICIENT_TABLE}
          minRetirementAge={MIN_EARLY_RETIREMENT_AGE}
          maxRetirementAge={MAX_EARLY_RETIREMENT_AGE}
          defaultBirthYear={DEFAULT_BIRTH_YEAR}
          defaultGrossSalaryMonthly={DEFAULT_GROSS_SALARY_MONTHLY}
          defaultInsuranceRecordYears={DEFAULT_INSURANCE_RECORD_YEARS}
          defaultWageGrowthPercent={DEFAULT_WAGE_GROWTH_PERCENT}
          defaultRetirementAge={DEFAULT_EARLY_RETIREMENT_AGE}
          recentActualWageGrowthPercent={RECENT_ACTUAL_WAGE_GROWTH_PERCENT}
          recentActualWageGrowthYear={RECENT_ACTUAL_WAGE_GROWTH_YEAR}
          forecastWageGrowthPercent={FORECAST_WAGE_GROWTH_PERCENT}
          forecastWageGrowthYear={FORECAST_WAGE_GROWTH_YEAR}
          rangeCaption={
            <>
              {formatNumber(MIN_EARLY_RETIREMENT_AGE, 0)} vai {formatNumber(MAX_EARLY_RETIREMENT_AGE, 0)} gadi, tikai
              personām ar vismaz {MIN_INSURANCE_RECORD_YEARS_FOR_EARLY_RETIREMENT} gadu stāžu. Standarta (nevis
              priekšlaicīgā) pensijas kalkulators ir{' '}
              <Link
                href="/finanses/pensijas-kalkulators"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                pieejams atsevišķi
              </Link>
              .
            </>
          }
        />

        <section aria-labelledby="formula-heading" className="flex flex-col gap-3">
          <h2 id="formula-heading" className="font-sans text-h2">
            Kā aprēķins veikts
          </h2>
          <p className="text-panel-muted">
            Priekšlaicīga pensija tiek aprēķināta pēc tieši tās pašas formulas kā standarta 1. līmeņa pensija, tikai
            jaunākā vecumā: uzkrātais kapitāls K tiek dalīts ar koeficientu G, kas atbilst izvēlētajam
            pensionēšanās vecumam, un pēc tam ar 12.
          </p>
          <p className="text-panel-muted">
            Tā kā jaunākā vecumā paredzamais izmaksas periods ir garāks, koeficients G ir lielāks, tāpēc mēneša
            summa par to pašu kapitālu sanāk mazāka.{' '}
            {formatNumber(MIN_EARLY_RETIREMENT_AGE, 0)} gadu vecumā G ir {formatNumber(MIN_G_VALUE, 2)}, bet{' '}
            {formatNumber(MAX_EARLY_RETIREMENT_AGE, 0)} gadu vecumā tas ir {formatNumber(MAX_G_VALUE, 2)}, abi spēkā
            no 2026. gada 1. janvāra. Papildus tam, pensionējoties agrāk, kapitālā uzkrājas mazāk iemaksu, jo
            darba mūžs ir īsāks.
          </p>
        </section>

        <section aria-labelledby="limitations-heading" className="flex flex-col gap-3">
          <h2 id="limitations-heading" className="font-sans text-h2">
            Ko šis kalkulators neņem vērā
          </h2>
          <ul className="flex flex-col gap-2 text-panel-muted">
            <li>
              Stāžu pirms 1996. gada un pagātnes gadu vienkāršoto aizpildi, tāpat kā standarta pensijas
              kalkulators, jo abi izmanto to pašu aprēķina moduli.
            </li>
            <li>Nodokli. Rādītā summa ir pirms iedzīvotāju ienākuma nodokļa ieturēšanas.</li>
            <li>
              2. un 3. līmeni. Šis kalkulators, tāpat kā standarta pensijas kalkulators, rēķina tikai 1. līmeni.
            </li>
          </ul>
        </section>

        <section aria-labelledby="sources-heading" className="flex flex-col gap-3">
          <h2 id="sources-heading" className="font-sans text-h2">
            Avoti
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-panel-muted">
            <li>
              Priekšlaicīgas pensionēšanās nosacījumi (30 gadu stāžs, 2 gadi agrāk), likums &quot;Par valsts
              pensijām&quot;, 11. panta sestā daļa,{' '}
              <a
                href="https://likumi.lv/ta/id/38048-par-valsts-pensijam"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                likumi.lv
              </a>
              , izgūts 2026. gada 11. septembrī.
            </li>
            <li>
              Koeficienta G tabula,{' '}
              <a
                href="https://www.vsaa.gov.lv/lv/media/5322/download"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                VSAA
              </a>
              , izgūts 2026. gada 4. septembrī.
            </li>
          </ul>
        </section>

        <Faq items={faq} />
        <RelatedCalculators items={related} />
      </main>
    </>
  );
}
