import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CUSTOM_ROUTED_SLUGS, calculators, getCalculator, getCategory, getRelatedCalculators } from '@/lib/registry';
import { loadFaq } from '@/lib/faq';
import { SITE_URL } from '@/lib/site';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildSoftwareApplicationSchema,
  safeJsonLd,
} from '@/lib/schema';
import { CalculatorShell } from '@/components/CalculatorShell';
import { getCalculatorComponent } from '@/components/calculators/registry';

export const dynamicParams = false;

interface PageParams {
  category: string;
  calculator: string;
}

export function generateStaticParams() {
  // Calculators with their own bespoke page (see CUSTOM_ROUTED_SLUGS) are served by a
  // literal app/<category>/<slug>/page.tsx route instead, so they are excluded here.
  return calculators
    .filter((calculator) => !CUSTOM_ROUTED_SLUGS.has(calculator.slug))
    .map((calculator) => ({
      category: calculator.category,
      calculator: calculator.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const calculator = getCalculator(resolvedParams.category, resolvedParams.calculator);
  if (!calculator) return {};
  return {
    title: calculator.title,
    description: calculator.metaDescription,
    keywords: calculator.keywords,
    alternates: { canonical: `/${calculator.category}/${calculator.slug}` },
  };
}

/**
 * Plain-language formula explanation + worked example per calculator, rendered by
 * `CalculatorShell` under its "Kā tiek aprēķināts" heading. Every calculator added to
 * `lib/registry.ts` must also get an entry here.
 */
const explanations: Record<string, React.ReactNode> = {
  'elektroauto-vs-benzina': (
    <>
      <p className="text-panel-muted">
        Kalkulators reizina tavu gada nobraukumu ar katra auto tipa patēriņu uz 100&nbsp;km un ar
        attiecīgo enerģijas cenu: elektroauto gadījumā kWh reizina ar €/kWh, benzīna auto gadījumā L
        reizina ar €/L. Starpība starp abām gada summām ir tavs ietaupījums (vai papildu izmaksas),
        izvēloties elektroauto.
      </p>
      <p className="text-panel-muted">
        <strong>Piemērs ar noklusējuma vērtībām</strong> (16,5&nbsp;kWh/100km un 0,18&nbsp;€/kWh
        elektroauto pusē; 7,0&nbsp;L/100km un 1,85&nbsp;€/L benzīna auto pusē; 15&nbsp;000&nbsp;km gadā):
      </p>
      <ul className="list-disc pl-5 text-panel-muted">
        <li>Elektroauto: 15&nbsp;000 / 100 × 16,5 × 0,18 = <strong>445,50&nbsp;€</strong> gadā</li>
        <li>Benzīna auto: 15&nbsp;000 / 100 × 7,0 × 1,85 = <strong>1&nbsp;942,50&nbsp;€</strong> gadā</li>
        <li>Ietaupījums: 1&nbsp;942,50&nbsp;€ − 445,50&nbsp;€ = <strong>1&nbsp;497,00&nbsp;€</strong> gadā</li>
      </ul>
    </>
  ),
  'ekii-atbalsts': (
    <>
      <p className="text-panel-muted">
        EKII atbalsta apmērs ir atkarīgs no trim faktoriem: vai auto ir jauns vai lietots, vai tev ir Goda
        ģimenes apliecība, un cik sēdvietu ir automašīnai. Standarta atbalsts pastāvīgam Latvijas
        iedzīvotājam ir 4&nbsp;000 eiro par jaunu elektroauto, spraudņa hibrīdu vai ūdeņraža auto, un
        3&nbsp;000 eiro par lietotu elektroauto vai ūdeņraža auto.
      </p>
      <p className="text-panel-muted">
        Goda ģimenes apliecības turētājiem atbalsts ir lielāks, ja auto ir vismaz 5 sēdvietas. Ar 5 vai 6
        sēdvietām atbalsts ir 6&nbsp;750 eiro jaunam auto un 5&nbsp;000 eiro lietotam. Ar 7 vai vairāk
        sēdvietām atbalsts pieaug līdz 9&nbsp;000 eiro jaunam auto un 6&nbsp;750 eiro lietotam. Ģimenēm ar
        4 un vairāk bērniem pienākas papildu 1&nbsp;000 eiro par katru bērnu sākot ar ceturto, ja auto ir
        vismaz 5 sēdvietas.
      </p>
      <p className="text-panel-muted">
        Kalkulators arī pārbauda cenas griestus. Jauna auto bāzes cena bez PVN nedrīkst pārsniegt
        45&nbsp;000 eiro, vai 60&nbsp;000 eiro, ja auto ir vismaz 6 sēdvietas. Lietotam auto papildus
        jāmaksā vismaz 8&nbsp;750 eiro bez PVN. Lietoti spraudņa hibrīdi atbalstu nesaņem.
      </p>
    </>
  ),
  'kasko-kalkulators': (
    <p className="text-panel-muted">
      KASKO apdrošināšanas cena atšķiras katram apdrošinātājam un ir atkarīga no auto vērtības, vadītāja
      vecuma un pieredzes, un citiem faktoriem, tāpēc kalkulators neaprēķina cenu, bet palīdz izvērtēt
      tavu jau saņemto piedāvājumu. Ievadi auto vērtību un gada prēmiju, kalkulators parāda mēneša
      maksājumu un prēmiju kā daļu no auto vērtības.
    </p>
  ),
  'octa-kalkulators': (
    <p className="text-panel-muted">
      OCTA ir obligātā civiltiesiskās atbildības apdrošināšana, un tās cena atšķiras starp apdrošinātājiem
      atkarībā no auto datiem un vadītāja vēstures. Ievadi līdz trim saņemtajiem piedāvājumiem, kalkulators
      parāda lētāko un starpību pret dārgāko.
    </p>
  ),
  'lizings-vs-kredits': (
    <>
      <p className="text-panel-muted">
        Kalkulators salīdzina kredīta un līzinga mēneša maksājumu. Kredīta maksājumu aprēķina pēc
        standarta aizdevuma amortizācijas formulas no atlikušās pamatsummas, procentu likmes un termiņa.
        Līzinga maksājumu veido divas daļas: vērtības samazinājums no pirkuma cenas līdz atlikušajai
        vērtībai, un finansēšanas daļa no vidējās finansētās summas un līzinga likmes.
      </p>
      <p className="text-panel-muted">
        Pēc kredīta termiņa beigām auto pieder tev. Pēc līzinga termiņa beigām auto jāatdod, jāizpērk par
        atlikušo vērtību, vai jāatjauno līgums, tāpēc zemāks mēneša maksājums nenozīmē automātiski
        izdevīgāku izvēli.
      </p>
    </>
  ),
  'degvielas-izmaksas': (
    <p className="text-panel-muted">
      Kalkulators reizina tavu gada nobraukumu ar auto patēriņu uz 100 kilometriem un degvielas cenu.
      Rezultāts parāda, cik degviela izmaksā gadā un uz 100 kilometriem pie tavis norādītajiem datiem.
    </p>
  ),
  'uzlades-izmaksas': (
    <p className="text-panel-muted">
      Kalkulators aprēķina kopējo gadā patērēto enerģiju no tava nobraukuma un patēriņa, tad sadala to
      starp mājas un publisko lādēšanu pēc tavis norādītās proporcijas. Katrai daļai piemēro atbilstošo
      cenu un summē kopējās gada izmaksas.
    </p>
  ),
  'nolietojums': (
    <p className="text-panel-muted">
      Kalkulators piemēro vienādu gada nolietojuma likmi katram auto vecuma gadam, izmantojot saliktā
      procenta formulu: pašreizējā vērtība ir pirkuma cena, reizināta ar (1 mīnus likme) vecuma pakāpē.
      Tas atspoguļo to, ka auto zaudē procentuāli līdzīgu daļu no atlikušās vērtības katru gadu, nevis
      vienādu summu.
    </p>
  ),
  'riepu-izmers': (
    <p className="text-panel-muted">
      Kalkulators aprēķina riepas kopējo diametru no diska izmēra un riepas platuma un profila, gan
      vecajai, gan jaunajai riepai. Diametru attiecība parāda, par cik procentiem mainās reālais ātrums
      salīdzinājumā ar spidometra rādījumu.
    </p>
  ),
  'cela-izmaksas': (
    <p className="text-panel-muted">
      Kalkulators aprēķina degvielas izmaksas no brauciena attāluma, patēriņa un degvielas cenas, tad
      izmaksas dala ar līdzbraucēju skaitu, lai parādītu izmaksas uz vienu cilvēku.
    </p>
  ),
  'solaru-atmaksa': (
    <p className="text-panel-muted">
      Kalkulators aprēķina gada izstrādi no sistēmas jaudas un vidējās izstrādes uz kWp, tad sadala to
      starp pašpatēriņu un tīklā nosūtīto pārpalikumu pēc tavis norādītās proporcijas. Katrai daļai
      piemēro atbilstošo cenu, summē gada ietaupījumu, un dala sistēmas izmaksas ar gada ietaupījumu, lai
      iegūtu atmaksāšanās laiku gados.
    </p>
  ),
  'siltumsukna-atmaksa': (
    <p className="text-panel-muted">
      Kalkulators aprēķina, cik elektrības patērē siltumsūknis, dalot gada siltumenerģijas patēriņu ar
      COP. Šo elektrības patēriņu reizina ar elektrības cenu, lai iegūtu siltumsūkņa gada izmaksas, un
      salīdzina ar vecās apkures sistēmas gada izmaksām. Starpība ir gada ietaupījums, ko dala ar
      siltumsūkņa izmaksām, lai iegūtu atmaksāšanās laiku.
    </p>
  ),
  'elektribas-rekins': (
    <p className="text-panel-muted">
      Kalkulators reizina mēneša patēriņu ar elektrības cenu, lai iegūtu mainīgo daļu, tad pieskaita
      fiksēto mēneša maksu. Gada izmaksas iegūst, reizinot mēneša rēķinu ar divpadsmit.
    </p>
  ),
  'apkures-izmaksas': (
    <p className="text-panel-muted">
      Kalkulators reizina mājas gada siltumenerģijas patēriņu ar katra apkures veida cenu par kWh
      siltumenerģijas, tad salīdzina rezultātus un parāda lētāko variantu.
    </p>
  ),
  'malkas-apjoms': (
    <p className="text-panel-muted">
      Kalkulators reizina grēdas garumu, platumu un augstumu, lai iegūtu sakrauto apjomu, tad reizina to
      ar cietās koksnes koeficientu, lai atspoguļotu gaisa spraugas starp pagalēm.
    </p>
  ),
  'krasas-daudzums': (
    <p className="text-panel-muted">
      Kalkulators reizina krāsojamo platību ar kārtu skaitu, tad rezultātu dala ar krāsas patēriņu uz
      litru, lai iegūtu nepieciešamo krāsas daudzumu litros.
    </p>
  ),
  'flizu-daudzums': (
    <p className="text-panel-muted">
      Kalkulators dala klājamo platību ar vienas flīzes platību, lai iegūtu nepieciešamo flīžu skaitu bez
      rezerves, tad pieskaita rezerves procentu un noapaļo uz augšu līdz veselam flīžu skaitam.
    </p>
  ),
  'betona-apjoms': (
    <p className="text-panel-muted">
      Kalkulators reizina garumu, platumu un biezumu, lai iegūtu nepieciešamo betona apjomu kubikmetros,
      tad dala to ar viena maisa iznākumu un noapaļo uz augšu, lai iegūtu nepieciešamo maisu skaitu.
    </p>
  ),
  'skriesanas-temps': (
    <p className="text-panel-muted">
      Kalkulators saskaita kopējo laiku minūtēs un dala to ar distanci, lai iegūtu tempu uz kilometru.
      Vidējo ātrumu aprēķina, dalot distanci ar laiku stundās.
    </p>
  ),
  'triatlona-planotajs': (
    <p className="text-panel-muted">
      Kalkulators aprēķina katra posma laiku no distances un tempa, tad summē peldēšanas, abu pāreju,
      riteņbraukšanas un skriešanas laikus, lai iegūtu paredzamo kopējo triatlona laiku.
    </p>
  ),
  'ftp-zonas': (
    <p className="text-panel-muted">
      Kalkulators reizina tavu FTP ar katras zonas procentuālo robežu, lai iegūtu jaudas diapazonu vatos
      katrai no septiņām standarta treniņu zonām.
    </p>
  ),
  'sirdsdarbibas-zonas': (
    <p className="text-panel-muted">
      Kalkulators aprēķina pulsa rezervi, atņemot miera pulsu no maksimālā pulsa, tad katrai zonai pieskaita
      miera pulsam attiecīgo procentuālo daļu no pulsa rezerves, iegūstot piecas treniņu zonas pēc
      Karvonena metodes.
    </p>
  ),
};

export default async function CalculatorPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const resolvedParams = await params;
  const category = getCategory(resolvedParams.category);
  const calculator = getCalculator(resolvedParams.category, resolvedParams.calculator);
  if (!category || !calculator) notFound();

  const faq = loadFaq(calculator.slug);
  const related = getRelatedCalculators(calculator);
  const CalculatorComponent = getCalculatorComponent(calculator.slug);
  if (!CalculatorComponent) notFound();

  const url = `${SITE_URL}/${category.slug}/${calculator.slug}`;

  const softwareSchema = buildSoftwareApplicationSchema({
    name: calculator.title,
    description: calculator.metaDescription,
    url,
    category: 'FinanceApplication',
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
      <CalculatorShell
        category={category}
        calculator={calculator}
        faq={faq}
        related={related}
        explanation={explanations[calculator.slug]}
      >
        <CalculatorComponent accentVar={category.accentVar} />
      </CalculatorShell>
    </>
  );
}
