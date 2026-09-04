import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategory } from '@/lib/registry';
import { SITE_URL } from '@/lib/site';
import { buildBreadcrumbSchema, safeJsonLd } from '@/lib/schema';
import { formatNumber } from '@/lib/format';
import { BirthsDeathsChart } from '@/components/BirthsDeathsChart';
import { BirthsDeathsTable } from '@/components/BirthsDeathsTable';
import {
  computeDzimstibas,
  naturalIncreaseRatePer1000,
  yearsToLoseFraction,
} from '@/lib/calculators/dzimstibas-kalkulators';
import { DEFAULT_TFR } from '@/lib/calculators/dzimstibas-kalkulators-defaults';
import { NOVADS_PILOT_AREAS, getNovadsPilotArea, isSmallArea, average } from '@/lib/novads-pilot-data';

export const dynamicParams = false;

const category = getCategory('sabiedriba')!;

export function generateStaticParams() {
  return NOVADS_PILOT_AREAS.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getNovadsPilotArea(slug);
  if (!area) return {};

  const title = `Cik iedzīvotāju ir ${area.locative}`;
  const description = `${area.name} iedzīvotāju skaits, dzimušie, mirušie un dabiskais pieaugums pēc CSP datiem, ${area.referenceYear}. gads.`;
  const path = `/sabiedriba/iedzivotaju-skaits/${area.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      locale: 'lv_LV',
    },
  };
}

export default async function NovadsIedzivotajuSkaitsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getNovadsPilotArea(slug);
  if (!area) notFound();

  const path = `/sabiedriba/iedzivotaju-skaits/${area.slug}`;
  const url = `${SITE_URL}${path}`;
  const title = `Cik iedzīvotāju ir ${area.locative}`;

  // Drop trailing years CSP has not yet published a births/deaths breakdown for (see
  // lib/novads-pilot-data.ts): the chart and table would otherwise render a false zero
  // for a year that just has no data yet.
  const completeSeries = area.series.filter((row) => row.liveBirths !== null && row.deaths !== null);

  const smallArea = isSmallArea(area);

  // Below SMALL_AREA_POPULATION_THRESHOLD, a single year's births/deaths count is
  // small enough that ordinary sampling noise rivals the real signal (see the
  // threshold's reasoning in lib/novads-pilot-data.ts). Use the multi-year average
  // across the years CSP has published a full breakdown for, instead of one noisy
  // year, as the basis for the headline computation.
  const headlineBirths = smallArea ? average(completeSeries.map((row) => row.liveBirths!)) : area.births;
  const headlineDeaths = smallArea ? average(completeSeries.map((row) => row.deaths!)) : area.deaths;

  // Same compute module the interactive calculator uses, so this page answers its own
  // version of the same question instead of just restating the raw numbers.
  const result = computeDzimstibas({
    mode: 'nulles-kopejas',
    deaths: headlineDeaths,
    netMigration: area.netMigration,
    population: area.population,
    birthsCurrent: headlineBirths,
    tfrCurrent: DEFAULT_TFR, // not displayed: CSP does not publish TFR at this granularity
  });

  const areaRate = naturalIncreaseRatePer1000(area.naturalIncrease, area.population);
  const nationalRate = naturalIncreaseRatePer1000(area.nationalNaturalIncrease, area.nationalPopulation);
  const rateIsWorseThanNational = areaRate < nationalRate;

  const yearsToLoseTenth = yearsToLoseFraction(area.population, area.naturalIncrease, 0.1);

  const migrationIsPositive = area.netMigration > 0;
  const naturalIncreaseIsNegative = area.naturalIncrease < 0;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Sākums', url: SITE_URL },
    { name: category.title, url: `${SITE_URL}/${category.slug}` },
    { name: 'Iedzīvotāju skaits Latvijā', url: `${SITE_URL}/sabiedriba/iedzivotaju-skaits-latvija` },
    { name: title, url },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-panel-muted">
          <Link href="/">Sākums</Link>
          {' / '}
          <Link href={`/${category.slug}`}>{category.title}</Link>
          {' / '}
          <Link href="/sabiedriba/iedzivotaju-skaits-latvija">Iedzīvotāju skaits Latvijā</Link>
          {' / '}
          <span>{area.name}</span>
        </nav>

        <h1 className="font-sans text-h1">{title}</h1>

        <p className="font-mono text-sm text-panel-muted">Jaunākie CSP dati: {area.referenceYear}. gads</p>

        <p className="text-panel-muted">
          {area.populationReferenceDate} {area.locative} dzīvoja {formatNumber(area.population, 0)} iedzīvotāji pēc
          Centrālās statistikas pārvaldes datiem,{' '}
          <a
            href="https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS031/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
          >
            tabula IRS031
          </a>
          . {area.referenceYear}. gadā {area.locative} dzīvi dzimuši {formatNumber(area.births, 0)} bērni un miruši{' '}
          {formatNumber(area.deaths, 0)} cilvēki,{' '}
          {naturalIncreaseIsNegative
            ? `mirušo bija par ${formatNumber(Math.abs(area.naturalIncrease), 0)} vairāk nekā dzimušo`
            : `dzimušo bija par ${formatNumber(Math.abs(area.naturalIncrease), 0)} vairāk nekā mirušo`}
          .
        </p>

        <section
          aria-labelledby="result-heading"
          className="reveal rounded-lg border bg-panel-surface p-6"
          style={{ borderColor: category.accentVar }}
        >
          <h2 id="result-heading" className="sr-only">
            Cik bērniem vajadzētu piedzimt
          </h2>
          <p className="text-sm text-panel-muted">
            Bērni dienā, lai {area.locative} iedzīvotāju skaits kopumā vairs nesarūktu
          </p>
          <p className="font-mono text-hero" style={{ color: category.accentVar }}>
            {formatNumber(result.perDay, 2)}
          </p>
          <p className="mt-2 text-sm text-panel-muted">
            {formatNumber(result.perMonth, 1)} bērni mēnesī, {formatNumber(result.birthsNeeded, 0)} bērni gadā,
            rēķinot mirušo skaitu, no kura atņemts migrācijas saldo, pēc tās pašas formulas, ko izmanto dzimstības
            kalkulators.{' '}
            {smallArea
              ? `Tā kā ${area.genitive} iedzīvotāju skaits ir neliels, dzimušo un mirušo skaits šeit ir vairāku gadu (${completeSeries[0].year} līdz ${completeSeries[completeSeries.length - 1].year}) vidējais, nevis viena gada dati, lai gadu no gada svārstības neizskatītos pēc tendences.`
              : ''}
          </p>
          <p className="mt-1 text-sm text-panel-muted">
            {smallArea
              ? `Vidēji ${area.locative} dzīvi dzimst`
              : `Pašlaik ${area.locative} dzīvi dzimst`}{' '}
            {formatNumber(headlineBirths / 365.25, 2)} bērni dienā.
          </p>
        </section>

        <section aria-labelledby="chart-heading" className="flex flex-col gap-4">
          <h2 id="chart-heading" className="font-sans text-h2">
            Dzīvi dzimušie un mirušie, {completeSeries[0].year} līdz {completeSeries[completeSeries.length - 1].year}
          </h2>
          <BirthsDeathsChart
            rows={completeSeries}
            accentVar={category.accentVar}
            tableCode="IRS031, IDS031 un IMV021"
            placeName={area.locative}
          />
          <BirthsDeathsTable rows={completeSeries} accentVar={category.accentVar} placeName={area.locative} />
        </section>

        <section aria-labelledby="comparison-heading" className="flex flex-col gap-3">
          <h2 id="comparison-heading" className="font-sans text-h2">
            Salīdzinājums ar valsti kopumā
          </h2>
          {smallArea ? (
            <p className="text-panel-muted">
              {area.genitive} iedzīvotāju skaits ir tikai apmēram {formatNumber(area.population, 0)}, tāpēc katru gadu
              piedzimst vien ap {formatNumber(Math.round(headlineBirths), 0)} bērnu. Tik nelielā skaitā gadu no gada
              svārstības ir parasta statistiska trokšņa daļa, nevis tendence: dzīvi dzimušo skaits pēdējos gados bija{' '}
              {completeSeries.map((row) => formatNumber(row.liveBirths!, 0)).join(', ')}. Tāpēc šajā lapā nav rādīts
              precīzs salīdzinājums ar Latvijas vidējo tempu vai aprēķins, cik gadu laikā iedzīvotāju skaits
              samazinātos par desmito daļu: ar tik mazu notikumu skaitu šādi skaitļi izskatītos precīzāki, nekā
              patiesībā ir.
            </p>
          ) : (
            <>
              <p className="text-panel-muted">
                {area.name} dabiskā samazinājuma temps {area.referenceYear}. gadā bija{' '}
                {formatNumber(Math.abs(areaRate), 2)} uz 1000 iedzīvotājiem, kas ir{' '}
                {rateIsWorseThanNational ? 'straujāks' : 'lēnāks'} nekā Latvijas vidējais rādītājs tajā pašā gadā,{' '}
                {formatNumber(Math.abs(nationalRate), 2)} uz 1000 iedzīvotājiem.
              </p>
              {yearsToLoseTenth !== null ? (
                <p className="text-panel-muted">
                  Ja pašreizējais dabiskā samazinājuma temps saglabātos nemainīgs un migrāciju neskaitot,{' '}
                  {area.genitive} iedzīvotāju skaits par desmito daļu samazinātos apmēram{' '}
                  {formatNumber(yearsToLoseTenth, 1)} gadu laikā. Šis ir vienkāršs aritmētisks aprēķins pašreizējā
                  tempā, nevis prognoze, jo tas neņem vērā vecuma struktūru vai migrācijas svārstības.
                </p>
              ) : null}
            </>
          )}
          <p className="text-panel-muted">
            {area.referenceYear}. gadā {area.locative} par {formatNumber(Math.abs(area.netMigration), 0)} cilvēkiem{' '}
            {migrationIsPositive ? 'vairāk ieradās, nekā aizbrauca' : 'vairāk aizbrauca, nekā ieradās'}, tātad
            migrācija{' '}
            {migrationIsPositive
              ? 'daļēji atsvēra dabisko samazinājumu.'
              : 'pastiprināja dabisko samazinājumu, nevis to kompensēja.'}
          </p>
        </section>

        <section aria-labelledby="sources-heading" className="flex flex-col gap-3">
          <h2 id="sources-heading" className="font-sans text-h2">
            Avoti
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-panel-muted">
            <li>
              Iedzīvotāju skaits un dabiskais pieaugums,{' '}
              <a
                href="https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS031/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                CSP tabula IRS031
              </a>
              , izgūts 2026. gada 4. septembrī.
            </li>
            <li>
              Dzīvi dzimušo skaits,{' '}
              <a
                href="https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__ID__IDS/IDS031/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                CSP tabula IDS031
              </a>
              , izgūts 2026. gada 4. septembrī.
            </li>
            <li>
              Mirušo skaits,{' '}
              <a
                href="https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IM__IMSV/IMV021/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                CSP tabula IMV021
              </a>
              , izgūts 2026. gada 4. septembrī.
            </li>
          </ul>
          <p className="text-panel-muted">
            Vairāk par Latvijas kopējo iedzīvotāju skaitu lasi{' '}
            <Link
              href="/sabiedriba/iedzivotaju-skaits-latvija"
              className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
            >
              nacionālajā lapā
            </Link>
            . Aprēķini savu scenāriju ar{' '}
            <Link
              href="/sabiedriba/dzimstibas-kalkulators"
              className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
            >
              dzimstības kalkulatoru
            </Link>
            .
          </p>
        </section>
      </main>
    </>
  );
}
