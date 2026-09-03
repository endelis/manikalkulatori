import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategory, getCalculator } from '@/lib/registry';
import { loadFaq } from '@/lib/faq';
import { SITE_URL } from '@/lib/site';
import { buildBreadcrumbSchema, buildFaqSchema, buildSoftwareApplicationSchema, safeJsonLd } from '@/lib/schema';
import { formatNumber } from '@/lib/format';
import { Faq } from '@/components/Faq';
import { DzimstibasKalkulators } from '@/components/calculators/DzimstibasKalkulators';
import { computeDzimstibas } from '@/lib/calculators/dzimstibas-kalkulators';
import {
  COMPARISON_TOWN,
  CURRENT_YEAR,
  DEFAULT_INPUT,
  POPULATION_SERIES,
} from '@/lib/calculators/dzimstibas-kalkulators-defaults';

const category = getCategory('sabiedriba')!;
const calculator = getCalculator('sabiedriba', 'dzimstibas-kalkulators')!;
const url = `${SITE_URL}/${category.slug}/${calculator.slug}`;

export const metadata: Metadata = {
  title: calculator.title,
  description: calculator.metaDescription,
  keywords: calculator.keywords,
  alternates: { canonical: `/${category.slug}/${calculator.slug}` },
  openGraph: {
    title: calculator.h1,
    description: calculator.metaDescription,
    url,
    locale: 'lv_LV',
  },
};

const faq = loadFaq(calculator.slug);

export default function DzimstibasKalkulatorsPage() {
  const defaultResult = computeDzimstibas(DEFAULT_INPUT);

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

        <DzimstibasKalkulators
          accentVar={category.accentVar}
          currentYear={CURRENT_YEAR}
          defaultDeaths={DEFAULT_INPUT.deaths}
          defaultNetMigration={DEFAULT_INPUT.netMigration}
          defaultPopulation={DEFAULT_INPUT.population}
          defaultBirthsCurrent={DEFAULT_INPUT.birthsCurrent}
          defaultTfrCurrent={DEFAULT_INPUT.tfrCurrent}
          populationSeries={POPULATION_SERIES}
        />

        {/* Reserved for a future ad or affiliate placement (DESIGN-GUIDANCE.md sections 5 and 8).
            Kept empty and height stable now so inserting real content later causes zero CLS. */}
        <div style={{ height: 0 }} aria-hidden="true" />

        <section aria-labelledby="merogs-heading" className="flex flex-col gap-3 rounded-lg border border-panel-border bg-panel-surface p-4">
          <h2 id="merogs-heading" className="font-sans text-h2">
            Mērogs
          </h2>
          <p className="text-panel-muted">
            2025. gadā Latvijā mirušo bija par {formatNumber(Math.abs(DEFAULT_INPUT.deaths - DEFAULT_INPUT.birthsCurrent), 0)}{' '}
            vairāk nekā dzimušo. Tas ir apmēram tikpat daudz cilvēku, cik {COMPARISON_TOWN.locative} dzīvoja{' '}
            {COMPARISON_TOWN.referenceDate}: {formatNumber(COMPARISON_TOWN.population, 0)} iedzīvotāju (CSP
            tabula {COMPARISON_TOWN.tableCode}).
          </p>
        </section>

        <section aria-labelledby="intervali-heading" className="flex flex-col gap-3 rounded-lg border border-panel-border bg-panel-surface p-4">
          <h2 id="intervali-heading" className="font-sans text-h2">
            Vidējie intervāli
          </h2>
          <p className="text-panel-muted">
            2025. gadā Latvijā vidēji piedzima viens bērns ik pēc{' '}
            {formatNumber((365.25 * 24 * 60) / DEFAULT_INPUT.birthsCurrent, 0)} minūtēm. Lai sasniegtu nulles
            dabisko pieaugumu, bērnam vajadzētu piedzimt ik pēc{' '}
            {formatNumber((365.25 * 24 * 60) / defaultResult.birthsNeeded, 0)} minūtēm, gandrīz divreiz biežāk.
            Mirstības puse ir stabilāka: 2025. gadā cilvēks Latvijā mira vidēji ik pēc{' '}
            {formatNumber((365.25 * 24 * 60) / DEFAULT_INPUT.deaths, 0)} minūtēm, un šis intervāls tuvāko
            gadu laikā būtiski nemainīsies neatkarīgi no dzimstības, jo mirstību nosaka jau esošā vecuma
            struktūra, nevis šā gada dzimušo skaits.
          </p>
        </section>

        <section aria-labelledby="scenario-heading" className="flex flex-col gap-3">
          <h2 id="scenario-heading" className="font-sans text-h2">
            Kāpēc šis skaitlis nav scenārijs
          </h2>
          <p className="text-panel-muted">
            Šis kalkulators rēķina vienkāršu aritmētisku slieksni, nevis prognozē nākotni. Divi iemesli, kāpēc
            reāla situācija ir daudz stūrgalvīgāka par jebkuru vienā gadā sasniedzamu skaitli.
          </p>
          <p className="text-panel-muted">
            Pirmkārt, mirstību nosaka iedzīvotāju vecuma struktūra, kas mainās lēni. Latvijā 1950. līdz
            1988. gadā ik gadu piedzima 30 000 līdz 42 000 bērnu. Šīs paaudzes tagad ir vidējā un vecākā
            vecumā, un tieši tāpēc mirušo skaits gadā ir divas reizes lielāks par dzimušo skaitu, 26 109 pret
            11 931 2025. gadā. Pat ja dzimstība dubultotos rīt, mirušo skaits nesamazinātos vismaz vairākas
            desmitgades, jo lielās paaudzes vienalga novecos un mirs pašreizējā tempā.
          </p>
          <p className="text-panel-muted">
            Otrkārt, tā sauktā reproduktīvā paaudze, sievietes, kurām šobrīd visbiežāk piedzimst bērni, ir tā
            paaudze, kas pati piedzima deviņdesmitajos gados, kad dzimstība sabruka. 1993. gadā piedzima
            26 759 bērni, bet jau 1998. gadā tikai 18 410, gandrīz par trešdaļu mazāk. CSP dati rāda, ka
            2024. gadā visvairāk bērnu piedzima sievietēm 25 līdz 34 gadu vecumā, tātad tieši tām, kas
            piedzima šajā mazajā deviņdesmito gadu paaudzē. Pat ja katra šīs paaudzes sieviete dzemdētu
            vairāk bērnu, kopējais dzimušo skaits ir ierobežots, jo pašu māšu ir mazāk. Tāpēc pat ar
            aizstājējdzimstības līmeni (summārais koeficients 2,1 līdz 2,2) iedzīvotāju skaits Latvijā vēl
            ilgi turpinātu samazināties, iekams uz reproduktīvo vecumu nenonāktu lielākas paaudzes.
          </p>
        </section>

        <section aria-labelledby="formula-heading" className="flex flex-col gap-3">
          <h2 id="formula-heading" className="font-sans text-h2">
            Kā aprēķins veikts
          </h2>
          <p className="text-panel-muted">
            Trīs režīmi, katram sava formula. Mirušie, migrācijas saldo un iedzīvotāju skaits nāk no taviem
            ievadītajiem datiem.
          </p>
          <ul className="flex flex-col gap-2 text-panel-muted">
            <li>Nulles dabiskais pieaugums: nepieciešamie dzimušie ir vienādi ar mirušajiem.</li>
            <li>
              Nulles kopējās izmaiņas: nepieciešamie dzimušie ir vienādi ar mirušajiem, atņemot migrācijas
              saldo (ja saldo ir negatīvs, atņemšana to faktiski pieskaita).
            </li>
            <li>
              Mērķa izaugsme ar likmi: nepieciešamie dzimušie ir mirušie, atņemot migrācijas saldo, plus
              izaugsmes likme procentos, reizināta ar iedzīvotāju skaitu.
            </li>
            <li>
              Mērķa izaugsme ar mērķa skaitu: gada izmaiņa ir starpība starp mērķa iedzīvotāju skaitu un
              pašreizējo skaitu, dalīta ar gadu skaitu līdz mērķim. Nepieciešamie dzimušie ir mirušie, atņemot
              migrācijas saldo, plus šī gada izmaiņa.
            </li>
          </ul>
          <p className="text-panel-muted">
            No nepieciešamā dzimušo skaita gadā aprēķina arī skaitu mēnesī (dala ar 12), skaitu dienā (dala
            ar 365,25) un reizinātāju pret pašreizējo dzimušo skaitu. Summāro dzimstības koeficientu, kas
            atbilstu jaunajam skaitam, aprēķina, reizinot pašreizējo koeficientu ar šo pašu reizinātāju,
            lineārs tuvinājums, nevis precīzs demogrāfisks pārrēķins.
          </p>
        </section>

        <section aria-labelledby="limitations-heading" className="flex flex-col gap-3">
          <h2 id="limitations-heading" className="font-sans text-h2">
            Ko šis kalkulators neņem vērā
          </h2>
          <ul className="flex flex-col gap-2 text-panel-muted">
            <li>
              Iedzīvotāju vecuma struktūru. Kalkulators rēķina tikai kopējo skaitu, nevis to, cik sieviešu ir
              reproduktīvajā vecumā, tāpēc reāli sasniedzams dzimstības pieaugums var būt lēnāks, nekā
              rezultāts liek domāt.
            </li>
            <li>
              Migrācijas svārstīgumu. Migrācijas saldo gadu no gada mainās krasi, tostarp 2022. gadā tas bija
              stipri pozitīvs Ukrainas kara bēgļu dēļ, tāpēc viena gada vērtība nav uzticams ilgtermiņa
              pieņēmums.
            </li>
            <li>
              2025. gada migrācijas datu īpatnību. Daļai Ukrainas kara bēgļu pagaidu uzturēšanās atļaujas
              beidzās 2025. gada martā, kas ietekmēja šī gada migrācijas un iedzīvotāju skaita rādītājus
              tādā veidā, kas var neatkārtoties nākamajos gados.
            </li>
            <li>
              CSP metodoloģijas maiņu. No 2025. gada CSP iedzīvotāju skaita novērtējumam izmanto jaunu SoL
              logit modeli iepriekšējā loģistiskās regresijas modeļa vietā, un 2023. un 2024. gada dati tika
              pārrēķināti, tāpēc salīdzinājumi ar vecākiem publicētajiem skaitļiem jāveic uzmanīgi.
            </li>
            <li>Datu galīgumu. Nākamo gadu dati var tikt vēlāk precizēti, kā tas jau noticis ar 2023. un 2024. gada rādītājiem.</li>
          </ul>
        </section>

        <section aria-labelledby="sources-heading" className="flex flex-col gap-3">
          <h2 id="sources-heading" className="font-sans text-h2">
            Avoti
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-panel-muted">
            <li>
              Iedzīvotāju skaits, dzimušie, mirušie, dabiskais pieaugums, migrācijas saldo,{' '}
              <a
                href="https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS010/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                CSP tabula IRS010
              </a>
              , izgūts 2026. gada 3. septembrī.
            </li>
            <li>
              Summārais dzimstības koeficients un vispārīgais dzimstības koeficients,{' '}
              <a
                href="https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__ID__IDK/IDK010/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                CSP tabula IDK010
              </a>
              , izgūts 2026. gada 3. septembrī.
            </li>
            <li>
              {COMPARISON_TOWN.genitive} iedzīvotāju skaits,{' '}
              <a
                href={COMPARISON_TOWN.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                CSP tabula {COMPARISON_TOWN.tableCode}
              </a>
              , izgūts 2026. gada 3. septembrī.
            </li>
            <li>
              Metodoloģija un mātes vidējais vecums,{' '}
              <a
                href="https://stat.gov.lv/system/files/publication/2025-10/Nr_04_Demografija_2025_(25_00)_LV_6.pdf"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
              >
                CSP informatīvais apskats Demogrāfija 2025
              </a>
              .
            </li>
          </ul>
          <p className="text-panel-muted">
            Vairāk par kopējo iedzīvotāju skaitu un tā izmaiņām lasi{' '}
            <Link
              href="/sabiedriba/iedzivotaju-skaits-latvija"
              className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
            >
              lapā par Latvijas iedzīvotāju skaitu
            </Link>
            .
          </p>
        </section>

        <Faq items={faq} />

        <div style={{ height: 0 }} aria-hidden="true" />
      </main>
    </>
  );
}
