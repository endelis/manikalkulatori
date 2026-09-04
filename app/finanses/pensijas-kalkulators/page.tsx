import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategory, getCalculator } from '@/lib/registry';
import { loadFaq } from '@/lib/faq';
import { SITE_URL } from '@/lib/site';
import { buildBreadcrumbSchema, buildFaqSchema, buildSoftwareApplicationSchema, safeJsonLd } from '@/lib/schema';
import { formatNumber } from '@/lib/format';
import { Faq } from '@/components/Faq';
import { PensijasKalkulators } from '@/components/calculators/PensijasKalkulators';
import {
  CURRENT_YEAR,
  NDC_START_YEAR,
  PILLAR_1_CONTRIBUTION_RATE_PERCENT,
  WAGE_INDEX_SERIES,
  WAGE_INDEX_SOURCE_PAGE_1_YEARS,
  WAGE_INDEX_SOURCE_PAGE_2_YEARS,
  LATEST_PUBLISHED_INDEX_YEAR,
  G_COEFFICIENT_TABLE,
  MIN_RETIREMENT_AGE,
  MAX_RETIREMENT_AGE,
  DEFAULT_RETIREMENT_AGE,
  DEFAULT_BIRTH_YEAR,
  DEFAULT_GROSS_SALARY_MONTHLY,
  DEFAULT_INSURANCE_RECORD_YEARS,
  DEFAULT_WAGE_GROWTH_PERCENT,
  RECENT_ACTUAL_WAGE_GROWTH_PERCENT,
  RECENT_ACTUAL_WAGE_GROWTH_YEAR,
  FORECAST_WAGE_GROWTH_PERCENT,
  FORECAST_WAGE_GROWTH_YEAR,
} from '@/lib/calculators/pensijas-kalkulators-defaults';

const faq = loadFaq('pensijas-kalkulators');
const DEFAULT_G_VALUE = G_COEFFICIENT_TABLE[DEFAULT_RETIREMENT_AGE];
const MAX_G_VALUE = G_COEFFICIENT_TABLE[MAX_RETIREMENT_AGE];

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

  const faqSchema = buildFaqSchema(faq);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
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

        <section aria-labelledby="formula-heading" className="flex flex-col gap-3">
          <h2 id="formula-heading" className="font-sans text-h2">
            Kā aprēķins veikts
          </h2>
          <p className="text-panel-muted">
            Mēneša pensiju aprēķina, uzkrāto kapitālu K dalot ar koeficientu G un pēc tam ar 12. Šī ir Latvijas
            1. līmeņa vecuma pensijas pamatformula, ko izmanto arī VSAA.
          </p>
          <ul className="flex flex-col gap-2 text-panel-muted">
            <li>
              Kapitāla nākotnes daļu veido gaidāmās iemaksas no šā gada līdz izvēlētajam pensionēšanās gadam:
              katra gada bruto alga tiek projicēta pēc algas pieauguma pieņēmuma, un no tās aprēķināti{' '}
              {formatNumber(PILLAR_1_CONTRIBUTION_RATE_PERCENT, 0)} procenti kā 1. līmeņa iemaksa.
            </li>
            <li>
              Kapitāla pagātnes daļu veido jau nostrādātais apdrošināšanas stāžs kopš 1996. gada. Tā kā
              kalkulators neprasa pilnu algu vēsturi par katru gadu, katrs stāža gads tiek aptuveni novērtēts,
              pieņemot, ka tajā pelnīta tāda pati bruto alga kā šodien. Šai summai reālā VSAA gada indeksu
              virkne (sk. avotus) vairs netiek piemērota, jo pašreizējā alga jau ir izteikta šodienas naudas
              vērtībā, un indeksācijas piemērošana tai vēlreiz palielinātu summu dubultā. Tas ir vienkāršojums,
              nevis precīza vēsturiskās algas rekonstrukcija, reālā alga pagātnē visticamāk bijusi zemāka par
              šodienas algu.
            </li>
            <li>
              Koeficients G atspoguļo, cik gadu vidēji tiek izmaksāta pensija izvēlētajā pensionēšanās vecumā, un
              to katru gadu publicē VSAA, balstoties uz CSP paredzamā mūža ilguma datiem.{' '}
              {formatNumber(DEFAULT_RETIREMENT_AGE, 0)} gadu vecumā G ir {formatNumber(DEFAULT_G_VALUE, 2)}, spēkā
              no 2026. gada 1. janvāra. Pārbīdot pensionēšanās vecuma slīdni, kalkulators uzreiz izmanto
              attiecīgā vecuma G vērtību no VSAA pilnās tabulas un pārrēķina mēneša pensiju: lielāks vecums
              nozīmē mazāku G, {formatNumber(MAX_RETIREMENT_AGE, 0)} gadu vecumā tas ir tikai{' '}
              {formatNumber(MAX_G_VALUE, 2)}, un līdz ar to lielāku pensiju par to pašu kapitālu.
            </li>
          </ul>
          <p className="text-panel-muted">
            Reālā apdrošināšanas iemaksu algas indeksu virkne no {WAGE_INDEX_SOURCE_PAGE_1_YEARS.from + 1}. līdz{' '}
            {LATEST_PUBLISHED_INDEX_YEAR}. gadam iegūta no VSAA dokumenta Apdrošināšanas iemaksu algas indeksi.
            Dokumentam nav iekšēju lapu numuru vai sadaļu virsrakstu, tāpēc atsauce dota pēc fiziskā novietojuma:
            1. lapā ir {WAGE_INDEX_SOURCE_PAGE_1_YEARS.from}. līdz {WAGE_INDEX_SOURCE_PAGE_1_YEARS.to}. gada
            iemaksu rindas, 2. lapā ir {WAGE_INDEX_SOURCE_PAGE_2_YEARS.from}. līdz{' '}
            {WAGE_INDEX_SOURCE_PAGE_2_YEARS.to}. gada rindas.
          </p>
        </section>

        <section aria-labelledby="limitations-heading" className="flex flex-col gap-3">
          <h2 id="limitations-heading" className="font-sans text-h2">
            Ko šis kalkulators neņem vērā
          </h2>
          <ul className="flex flex-col gap-2 text-panel-muted">
            <li>
              Stāžu pirms 1996. gada. Kapitāls K šeit summē tikai iemaksas kopš 1996. gada, jo tieši tad sākās
              nosacītā kapitāla sistēma. Reālam aprēķinam par agrāku stāžu VSAA izmanto atsevišķu sākuma kapitāla
              formulu, ko šis kalkulators neveic, tāpēc tavs reālais rezultāts var būt lielāks.
            </li>
            <li>
              Pagātnes gadu vienkāršoto aizpildi. Katrs stāža gads kopš 1996. gada aprēķinā izmanto tavu
              pašreizējo algu, nevis to, ko tu tajā gadā tiešām pelnīji, tāpēc rezultāts ir aptuvens, ne precīzs.
            </li>
            <li>
              Minimālās pensijas garantijas mehānismu. Personām ar 30 un vairāk gadu stāžu, bet zemu vidējo
              algu, VSAA aprēķinā var izmantot valsts vidējo algu, kas garantē minimālu līmeni, šis mehānisms
              šeit nav modelēts.
            </li>
            <li>
              Nākotnes koeficientu G. Kalkulators izmanto 2026. gada G tabulu arī tad, ja pensionēšanās vēl
              tālu nākotnē, jo nākotnes vērtība nav zināma iepriekš. VSAA G pārrēķina katru gadu, un tas var gan
              palielināties, gan samazināties.
            </li>
            <li>Nodokli. Rādītā summa ir pirms iedzīvotāju ienākuma nodokļa ieturēšanas.</li>
            <li>
              Pastāvīgu iemaksu sadalījumu. {formatNumber(PILLAR_1_CONTRIBUTION_RATE_PERCENT, 0)} procentu daļa
              1. līmenim ir pagaidu likme kopš 2025. gada, nevis pieņēmums, ka tā tāda paliks visu tavu darba
              mūžu.
            </li>
            <li>
              2. un 3. līmeni. Šis kalkulators rēķina tikai 1. līmeni. 2. un 3. līmeņa kalkulatori ir plānoti kā
              nākamais solis, to trūkums šeit ir apzināta darbības jomas izvēle, nevis nepamanīts izlaidums.
            </li>
          </ul>
        </section>

        <section aria-labelledby="sources-heading" className="flex flex-col gap-3">
          <h2 id="sources-heading" className="font-sans text-h2">
            Avoti
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-panel-muted">
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
            <li>
              Apdrošināšanas iemaksu algas indeksi,{' '}
              <a
                href="https://www.vsaa.gov.lv/lv/media/7364/download?attachment="
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                VSAA
              </a>
              , izgūts 2026. gada 4. septembrī.
            </li>
            <li>
              Vispārējās vecuma pensijas apmērs un minimālais apdrošināšanas stāžs,{' '}
              <a
                href="https://lvportals.lv/e-konsultacijas/38466-pensijas-vecums-ir-65-gadi-iesniegumu-var-iesniegt-vienu-menesi-pirms-dosanas-pensija-2026"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                LV portāls
              </a>
              , izgūts 2026. gada 4. septembrī.
            </li>
            <li>
              VSAOI kopējā likme,{' '}
              <a
                href="https://gramatvedisriga.lv/lv/blog/vsaoi-rates-2026"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                gramatvedisriga.lv
              </a>{' '}
              un{' '}
              <a
                href="https://www.vsaa.gov.lv/en/contributions-0"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                VSAA
              </a>
              , izgūts 2026. gada 4. septembrī.
            </li>
            <li>
              Iemaksu sadalījuma izmaiņas starp 1. un 2. līmeni,{' '}
              <a
                href="https://www.lsm.lv/raksts/zinas/ekonomika/04.12.2024-1-no-pensiju-otra-limena-iemaksam-parnesis-uz-pirmo-limeni.a578779/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                LSM
              </a>{' '}
              un{' '}
              <a
                href="https://www.lsm.lv/raksts/zinas/ekonomika/18.06.2026-tiesa-pensiju-2-limena-iemaksu-likmes-termineta-samazinasana-par-vienu-procentpunktu-atbilst-satversmei.a651990/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                LSM par Satversmes tiesas lēmumu
              </a>
              , izgūts 2026. gada 4. septembrī.
            </li>
            <li>
              Vidējā bruto alga un tās gada pieaugums,{' '}
              <a
                href="https://www.csp.gov.lv/lv/jaunums/2025-gada-videjais-atalgojums-pirms-nodoklu-nomaksas-1-815-eiro"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                CSP
              </a>
              , izgūts 2026. gada 4. septembrī.
            </li>
            <li>
              Banku prognoze algu pieaugumam 2026. gadam,{' '}
              <a
                href="https://www.apollo.lv/8387615/banku-analitiki-2026-gada-latvija-gaida-darba-samaksas-kapumu-par-videji-apmeram-7"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                apollo.lv
              </a>
              , izgūts 2026. gada 4. septembrī.
            </li>
          </ul>
        </section>

        <Faq items={faq} />
      </main>
    </>
  );
}
