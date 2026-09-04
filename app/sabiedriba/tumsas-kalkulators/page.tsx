import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategory, getCalculator } from '@/lib/registry';
import { loadFaq } from '@/lib/faq';
import { SITE_URL } from '@/lib/site';
import { buildBreadcrumbSchema, buildFaqSchema, buildSoftwareApplicationSchema, safeJsonLd } from '@/lib/schema';
import { formatNumber } from '@/lib/format';
import { Faq } from '@/components/Faq';
import { TumsasKalkulators } from '@/components/calculators/TumsasKalkulators';
import {
  AVERAGE_DAYLIGHT_HOURS,
  AMPLITUDE_HOURS,
  SUMMER_SOLSTICE_DAY_OF_YEAR,
  TODAY_ISO,
  MIN_BIRTH_YEAR,
  DEFAULT_BIRTH_DAY,
  DEFAULT_BIRTH_MONTH,
  DEFAULT_BIRTH_YEAR,
  LONGEST_DAY_HOURS,
  SHORTEST_DAY_HOURS,
  LONGEST_DAY_DATE,
  SHORTEST_DAY_DATE,
  LATITUDE_DEGREES_NORTH,
  ANNUAL_TOTAL_DAYLIGHT_HOURS,
  DAYS_IN_2026,
} from '@/lib/calculators/tumsas-kalkulators-defaults';

const category = getCategory('sabiedriba')!;
const calculator = getCalculator('sabiedriba', 'tumsas-kalkulators')!;
const url = `${SITE_URL}/${category.slug}/${calculator.slug}`;
const faq = loadFaq(calculator.slug);

function formatHoursMinutes(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours} stundas un ${minutes} minūtes`;
}

const MONTH_LOCATIVE = [
  'janvārī',
  'februārī',
  'martā',
  'aprīlī',
  'maijā',
  'jūnijā',
  'jūlijā',
  'augustā',
  'septembrī',
  'oktobrī',
  'novembrī',
  'decembrī',
];

// ISO dates from the data file (e.g. "2026-06-21") contain the hyphen-minus character,
// which is fine in an ISO string but must never reach visible prose under the site's
// dash ban. Written out in Latvian date form instead, matching the "4. septembrī" style
// already used elsewhere on the site.
function formatLatvianDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${year}. gada ${day}. ${MONTH_LOCATIVE[month - 1]}`;
}

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

        <TumsasKalkulators
          accentVar={category.accentVar}
          averageDaylightHours={AVERAGE_DAYLIGHT_HOURS}
          amplitudeHours={AMPLITUDE_HOURS}
          summerSolsticeDayOfYear={SUMMER_SOLSTICE_DAY_OF_YEAR}
          today={TODAY_ISO}
          minBirthYear={MIN_BIRTH_YEAR}
          defaultBirthDay={DEFAULT_BIRTH_DAY}
          defaultBirthMonth={DEFAULT_BIRTH_MONTH}
          defaultBirthYear={DEFAULT_BIRTH_YEAR}
        />

        <section aria-labelledby="formula-heading" className="flex flex-col gap-3">
          <h2 id="formula-heading" className="font-sans text-h2">
            Kā aprēķins veikts
          </h2>
          <p className="text-panel-muted">
            Rīgas gaismas garums gada laikā ļoti tuvu seko sinusoīdai, tāpēc katrai gada dienai n to var modelēt
            ar vienkāršu formulu, nevis skaitīt katru saullēktu un saulrietu atsevišķi.
          </p>
          <p className="font-mono text-sm text-panel-text">
            gaismas_stundas(n) = D_vid + A × cos(2π × (n − n_vasaras_saulgrieži) ÷ 365,25)
          </p>
          <p className="font-mono text-sm text-panel-text">tumsas_stundas(n) = 24 − gaismas_stundas(n)</p>
          <p className="font-mono text-sm text-panel-text">
            kopā_tumsas_dienas = (Σ tumsas_stundas par katru nodzīvoto dienu) ÷ 24
          </p>
          <ul className="flex flex-col gap-2 text-panel-muted">
            <li>
              D_vid, vidējais gaismas garums, ir {formatHoursMinutes(AVERAGE_DAYLIGHT_HOURS)} diennaktī. Tas
              atvasināts no Rīgas kopējā gaismas daudzuma {formatNumber(ANNUAL_TOTAL_DAYLIGHT_HOURS, 0)} stundu
              {formatNumber(DAYS_IN_2026, 0)} dienu garā gadā, dalot vienu ar otru, nevis ievadīts kā atsevišķs
              noapaļots skaitlis.
            </li>
            <li>
              A, amplitūda, ir {formatHoursMinutes(AMPLITUDE_HOURS)}. Tā atvasināta kā puse no starpības starp
              garāko un īsāko dienu: garākā diena, {formatLatvianDate(LONGEST_DAY_DATE)}, ir {formatHoursMinutes(LONGEST_DAY_HOURS)}
              gaismas, īsākā diena, {formatLatvianDate(SHORTEST_DAY_DATE)}, ir tikai {formatHoursMinutes(SHORTEST_DAY_HOURS)}.
            </li>
            <li>
              n_vasaras_saulgrieži ir vasaras saulgriežu diena gadā, tā skaitīta no gada sākuma. 2026. gadā tā ir
              gada {SUMMER_SOLSTICE_DAY_OF_YEAR}. diena, jeb {formatLatvianDate(LONGEST_DAY_DATE)}.
            </li>
          </ul>
          <p className="text-panel-muted">
            Kalkulators iet cauri katrai dienai, ko esi nodzīvojis, no dzimšanas datuma līdz šodienai, aprēķina
            tumsas stundu skaitu tajā dienā un summē visu kopā. Rezultāts ir redzams tieši tāpat, kā tas tika
            saskaitīts, nevis kāda slēgta formula, kuru nevar izsekot dienu pa dienai.
          </p>
          <p className="text-panel-muted">
            Sinusoīda ir tuvinājums, ne precīzs saullēkta un saulrieta aprēķins. Tuvu saulgriežiem starpība pret
            reālajiem laikiem ir dažas minūtes dienā, tālāk no tiem tā ir vēl mazāka. Latvijas ģeogrāfiskais
            platums šajā aprēķinā ir {formatNumber(LATITUDE_DEGREES_NORTH, 2)} grādi ziemeļu platuma, Rīgas
            platums, un ir pieņemts par nemainīgu visam nodzīvotajam laikam.
          </p>
        </section>

        <section aria-labelledby="limitations-heading" className="flex flex-col gap-3">
          <h2 id="limitations-heading" className="font-sans text-h2">
            Ko šis kalkulators neņem vērā
          </h2>
          <ul className="flex flex-col gap-2 text-panel-muted">
            <li>
              Krēslu. Tumsa šeit nozīmē tikai to, ka saule ir zem horizonta, tā neatšķir krēslu no pilnīgas
              tumsas. Vasarā ap saulgriežiem Rīgā naktis reti ir īsti tumšas, debesis paliek gaišas arī tad, kad
              saule formāli jau ir norietējusi, tāpēc daļa no rezultāta faktiski ir bijusi krēsla, ne melna nakts.
            </li>
            <li>
              Sinusoidālo tuvinājumu. Formula neaprēķina reālus saullēkta un saulrieta laikus katrai dienai, tā
              modelē gada gaitu ar gludu līkni. Precizitātes zaudējums ir neliels, bet nav nulle, sk. sadaļu "Kā
              aprēķins veikts".
            </li>
            <li>
              Vietas maiņu. Aprēķins pieņem, ka esi dzīvojis Rīgā visu laiku kopš dzimšanas. Ja daļu dzīves esi
              pavadījis citur, tavs reālais tumsas daudzums var atšķirties, jo gaismas garuma svārstības ir
              atkarīgas no ģeogrāfiskā platuma.
            </li>
            <li>
              Nākotni. Kalkulators rāda tikai to tumsu, kas jau nodzīvota, nevis prognozi par atlikušo dzīvi. Tas
              ir iespējams nākamais solis, nevis šīs versijas daļa.
            </li>
            <li>
              Fiksētu šodienas datumu. Rezultāts aprēķināts, pieņemot, ka šodiena ir 2026. gada 4. septembris, jo
              šī lapa ir statiski ģenerēta, nevis pārrēķina sevi katru dienu.
            </li>
          </ul>
        </section>

        <section aria-labelledby="sources-heading" className="flex flex-col gap-3">
          <h2 id="sources-heading" className="font-sans text-h2">
            Avoti
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-panel-muted">
            <li>
              Garākā un īsākā diena, saullēkta un saulrieta laiki, ģeogrāfiskais platums,{' '}
              <a
                href="https://sunrisesunset.io/lv/riga/riga/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                sunrisesunset.io
              </a>
              , izgūts 2026. gada 4. septembrī.
            </li>
            <li>
              Gada kopējais gaismas daudzums un mēneša sadalījums, šķērspārbaude garākajai un īsākajai dienai,{' '}
              <a
                href="https://en.tutiempo.net/daylight-hours/riga.html"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                tutiempo.net
              </a>
              , izgūts 2026. gada 4. septembrī.
            </li>
          </ul>
          <p className="text-panel-muted">
            timeanddate.com un gaisma.com bloķēja automātisko piekļuvi šajā izpētes gājienā, tāpēc tie šeit nav
            citēti, lai gan varētu būt noderīgi turpmākai pārbaudei.
          </p>
        </section>

        <Faq items={faq} />
      </main>
    </>
  );
}
