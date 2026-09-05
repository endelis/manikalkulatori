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
  'jumta-seguma-daudzums': (
    <>
      <p className="text-panel-muted">
        Kalkulators vispirms pārrēķina jumta pamatnes platību uz reālo, slīpo platību: pamatnes platību dala
        ar slīpuma leņķa kosinusu. Tad šai platībai pieskaita rezerves procentu, un atkarībā no izvēlētā
        materiāla dala vai reizina rezultātu ar attiecīgo seguma vienas vienības segumu, noapaļojot uz augšu
        līdz veselam skaitam.
      </p>
      <p className="text-panel-muted">
        <strong>Piemērs ar noklusējuma vērtībām</strong> (100&nbsp;m² pamatne, 30 grādu slīpums, 12&nbsp;%
        rezerve, dakstiņi 10,5&nbsp;gab/m²):
      </p>
      <ul className="list-disc pl-5 text-panel-muted">
        <li>Slīpā platība: 100 ÷ cos(30°) ≈ <strong>115,47&nbsp;m²</strong></li>
        <li>Ar rezervi: 115,47 × 1,12 ≈ <strong>129,33&nbsp;m²</strong></li>
        <li>Dakstiņi: 129,33 × 10,5 ≈ <strong>1&nbsp;358 dakstiņi</strong></li>
      </ul>
    </>
  ),
  'tapetes-daudzums': (
    <>
      <p className="text-panel-muted">
        Kalkulators reizina ruļļa platumu ar garumu, lai iegūtu viena ruļļa platību, tad sienu platībai
        pieskaita rezerves procentu un dala ar viena ruļļa platību, noapaļojot uz augšu līdz veselam ruļļu
        skaitam.
      </p>
      <p className="text-panel-muted">
        <strong>Piemērs ar noklusējuma vērtībām</strong> (30&nbsp;m² sienu platība, ruļļa izmērs 0,53 reiz
        10&nbsp;m, 12&nbsp;% rezerve):
      </p>
      <ul className="list-disc pl-5 text-panel-muted">
        <li>Viena ruļļa platība: 0,53 × 10 = <strong>5,3&nbsp;m²</strong></li>
        <li>Ar rezervi: 30 × 1,12 = <strong>33,6&nbsp;m²</strong></li>
        <li>Ruļļi: 33,6 ÷ 5,3 ≈ <strong>7 ruļļi</strong></li>
      </ul>
    </>
  ),
  'kiegelu-bloku-daudzums': (
    <>
      <p className="text-panel-muted">
        Kalkulators pieskaita šuves biezumu vienības garumam un augstumam, lai iegūtu vienas vienības
        efektīvo platību sienas sejā, tad sienu platībai pieskaita rezerves procentu un dala ar efektīvo
        platību, noapaļojot uz augšu līdz veselam vienību skaitam.
      </p>
      <p className="text-panel-muted">
        <strong>Piemērs ar noklusējuma vērtībām</strong> (10&nbsp;m² sienu platība, ķieģelis 250 reiz
        65&nbsp;mm, 10&nbsp;mm šuve, 5&nbsp;% rezerve):
      </p>
      <ul className="list-disc pl-5 text-panel-muted">
        <li>Efektīvā platība: (250+10) × (65+10) ÷ 1&nbsp;000&nbsp;000 = <strong>0,0195&nbsp;m²</strong></li>
        <li>Ar rezervi: 10 × 1,05 = <strong>10,5&nbsp;m²</strong></li>
        <li>Ķieģeļi: 10,5 ÷ 0,0195 ≈ <strong>539 ķieģeļi</strong></li>
      </ul>
    </>
  ),
  'javas-apmetuma-daudzums': (
    <>
      <p className="text-panel-muted">
        Apmetuma režīmā kalkulators reizina platību, biezumu un izvēlētā produkta patēriņa likmi, lai
        iegūtu nepieciešamo sausā maisījuma daudzumu kilogramos, tad dala ar maisa svaru un noapaļo uz
        augšu. Mūrjavas režīmā kalkulators no kopējā sienas apjoma atņem ķieģeļu vai bloku apjomu, lai
        iegūtu javas apjomu, tad pārvērš to litros par kilogramiem un maisiem, izmantojot konkrēta produkta
        iznākumu.
      </p>
      <p className="text-panel-muted">
        <strong>Piemērs apmetuma režīmā</strong> (20&nbsp;m² siena, 10&nbsp;mm biezums, Baumit MPI 25,
        1,4&nbsp;kg/m²/mm, 5&nbsp;% rezerve):
      </p>
      <ul className="list-disc pl-5 text-panel-muted">
        <li>Platība ar rezervi: 20 × 1,05 = <strong>21&nbsp;m²</strong></li>
        <li>Daudzums: 21 × 10 × 1,4 = <strong>294&nbsp;kg</strong></li>
        <li>Maisi: 294 ÷ 25 ≈ <strong>12 maisi</strong></li>
      </ul>
      <p className="text-panel-muted">
        <strong>Piemērs mūrjavas režīmā</strong> (10&nbsp;m² siena, ķieģelis 250 reiz 120 reiz 65&nbsp;mm,
        10&nbsp;mm šuve, 0&nbsp;% rezerve):
      </p>
      <ul className="list-disc pl-5 text-panel-muted">
        <li>Vienības: 513 ķieģeļi</li>
        <li>Sienas apjoms: 10 × 0,12 = <strong>1,2&nbsp;m³</strong></li>
        <li>Ķieģeļu apjoms: 513 × 0,25 × 0,12 × 0,065 ≈ <strong>1,00035&nbsp;m³</strong></li>
        <li>Javas apjoms: 1,2 − 1,00035 ≈ <strong>199,65&nbsp;L</strong></li>
      </ul>
    </>
  ),
  'gipskartona-loksnu-daudzums': (
    <>
      <p className="text-panel-muted">
        Kalkulators reizina loksnes platumu ar garumu, lai iegūtu vienas loksnes platību, tad klājamajai
        platībai pieskaita rezerves procentu un dala ar loksnes platību, noapaļojot uz augšu līdz veselam
        lokšņu skaitam.
      </p>
      <p className="text-panel-muted">
        <strong>Piemērs ar noklusējuma vērtībām</strong> (20&nbsp;m² platība, loksne 1200 reiz
        2600&nbsp;mm, 10&nbsp;% rezerve):
      </p>
      <ul className="list-disc pl-5 text-panel-muted">
        <li>Vienas loksnes platība: 1,2 × 2,6 = <strong>3,12&nbsp;m²</strong></li>
        <li>Ar rezervi: 20 × 1,1 = <strong>22&nbsp;m²</strong></li>
        <li>Loksnes: 22 ÷ 3,12 ≈ <strong>8 loksnes</strong></li>
      </ul>
    </>
  ),
  'grants-smilts-skembu-apjoms': (
    <>
      <p className="text-panel-muted">
        Kalkulators reizina platību ar kārtas biezumu, lai iegūtu irdena materiāla apjomu kubikmetros, tam
        pieskaita sablīvēšanās rezervi, tad reizina ar izvēlētā materiāla blīvumu, lai iegūtu pasūtāmo masu
        tonnās.
      </p>
      <p className="text-panel-muted">
        <strong>Piemērs ar noklusējuma vērtībām</strong> (10&nbsp;m² platība, 100&nbsp;mm biezums, smilts,
        1,53&nbsp;t/m³, 15&nbsp;% sablīvēšanās rezerve):
      </p>
      <ul className="list-disc pl-5 text-panel-muted">
        <li>Apjoms bez rezerves: 10 × 0,1 = <strong>1&nbsp;m³</strong></li>
        <li>Apjoms ar rezervi: 1 × 1,15 = <strong>1,15&nbsp;m³</strong></li>
        <li>Masa: 1,15 × 1,53 ≈ <strong>1,76&nbsp;t</strong></li>
      </ul>
    </>
  ),
  'terases-delu-daudzums': (
    <>
      <p className="text-panel-muted">
        Kalkulators pieskaita šuves platumu dēļa platumam, lai iegūtu vienas rindas segumu, tad reizina ar
        dēļa garumu, lai iegūtu viena dēļa kopējo segumu. Terases platībai pieskaita rezerves procentu un
        dala ar viena dēļa segumu, noapaļojot uz augšu līdz veselam dēļu skaitam.
      </p>
      <p className="text-panel-muted">
        <strong>Piemērs ar noklusējuma vērtībām</strong> (15&nbsp;m² terase, kompozīta dēlis 150 reiz
        2900&nbsp;mm, 5&nbsp;mm šuve, 10&nbsp;% rezerve):
      </p>
      <ul className="list-disc pl-5 text-panel-muted">
        <li>Viena dēļa segums: 2,9 × 0,155 ≈ <strong>0,4495&nbsp;m²</strong></li>
        <li>Ar rezervi: 15 × 1,1 = <strong>16,5&nbsp;m²</strong></li>
        <li>Dēļi: 16,5 ÷ 0,4495 ≈ <strong>37 dēļi</strong></li>
      </ul>
    </>
  ),
  'laminata-vinila-daudzums': (
    <>
      <p className="text-panel-muted">
        Kalkulators grīdas platībai pieskaita rezerves procentu, tad dala ar viena iepakojuma segumu,
        noapaļojot uz augšu līdz veselam iepakojumu skaitam.
      </p>
      <p className="text-panel-muted">
        <strong>Piemērs ar noklusējuma vērtībām</strong> (20&nbsp;m² grīda, laminātā segums, 1,99&nbsp;m²
        iepakojumā, 10&nbsp;% rezerve):
      </p>
      <ul className="list-disc pl-5 text-panel-muted">
        <li>Platība ar rezervi: 20 × 1,1 = <strong>22&nbsp;m²</strong></li>
        <li>Iepakojumi: 22 ÷ 1,99 ≈ <strong>12 iepakojumi</strong></li>
      </ul>
    </>
  ),
  'pasizlidzinosas-javas-daudzums': (
    <>
      <p className="text-panel-muted">
        Kalkulators grīdas platībai pieskaita rezerves procentu, tad reizina ar kārtas biezumu un izvēlētās
        javas patēriņa likmi, lai iegūtu nepieciešamo sausā maisījuma daudzumu kilogramos, tad dala ar maisa
        svaru un noapaļo uz augšu.
      </p>
      <p className="text-panel-muted">
        <strong>Piemērs ar noklusējuma vērtībām</strong> (15&nbsp;m² grīda, 5&nbsp;mm kārta, Ceresit CN 69,
        1,5&nbsp;kg/m²/mm, 5&nbsp;% rezerve):
      </p>
      <ul className="list-disc pl-5 text-panel-muted">
        <li>Platība ar rezervi: 15 × 1,05 = <strong>15,75&nbsp;m²</strong></li>
        <li>Daudzums: 15,75 × 5 × 1,5 ≈ <strong>118,13&nbsp;kg</strong></li>
        <li>Maisi: 118,13 ÷ 25 ≈ <strong>5 maisi</strong></li>
      </ul>
    </>
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

/**
 * Optional "Ko šis kalkulators neņem vērā" content, only for calculators that cite real
 * external sources and need to disclose an approximation, an unsourced adjustable
 * field, or a scope decision. Most calculators in this file predate this map and have
 * no entry, which is correct: CalculatorShell renders nothing when a slug is absent.
 */
const limitationsContent: Record<string, React.ReactNode> = {
  'jumta-seguma-daudzums': (
    <ul className="flex flex-col gap-2 text-panel-muted">
      <li>
        Dakstiņu segumu uz kvadrātmetru. Precīzais skaits ir avotā dotais diapazons, ne pa slīpuma
        pakāpēm sadalīta tabula, jo ražotāja instrukcijas attēls nebija izgūstams teksta veidā šī
        pētījuma gājienā. Pārbaudi precīzu vērtību savam dakstiņu modelim.
      </li>
      <li>
        Rezerves procentu. Nav atrasts stingrs avots konkrētam procentam materiālu apgriešanai un
        pārklāšanai, tikai nozares konvencija, tāpēc tas ir pielāgojams lauks, nevis citēts fakts.
      </li>
      <li>
        Metāla lokšņu izkārtojumu. Aprēķins izmanto vienkāršu platības dalījumu ar vienas loksnes
        segumu, tas neietver konkrētu lokšņu izkārtojumu pa jumta platumu vai pielāgošanu jumta
        formai, tāpēc reālais nepieciešamais skaits var atšķirties.
      </li>
      <li>Kores un citu piederumu daudzumu. Šis kalkulators tos nerēķina, sk. Biežāk uzdotos jautājumus.</li>
    </ul>
  ),
  'tapetes-daudzums': (
    <ul className="flex flex-col gap-2 text-panel-muted">
      <li>
        Logus un durvis. Kalkulators rēķina no ievadītās kopējās sienu platības, tas pats par sevi
        neatņem logu vai durvju platību, sk. Biežāk uzdotos jautājumus.
      </li>
      <li>
        Raksta saskaņošanas precizitāti. Rezerves procenti pēc raksta veida ir vispārīgas nozares
        vadlīnijas, konkrētam tapetes modelim un raksta atkārtojuma izmēram var būt nepieciešams vairāk
        vai mazāk.
      </li>
      <li>
        Ruļļa garuma atšķirību. Latvijas mazumtirdzniecībā ierastais 10 metru garums un Eiropas tehniskajā
        specifikācijā minētais 10,05 metru garums nav identiski, atšķirība ir neliela, bet precīzu skaitli
        vienmēr vari pārbaudīt uz iepakojuma.
      </li>
    </ul>
  ),
  'kiegelu-bloku-daudzums': (
    <ul className="flex flex-col gap-2 text-panel-muted">
      <li>
        Šuves biezumu. Avots ar konkrētu ieteikumu Latvijas mūrniekiem (FIBO vadlīnijas) bija bloķēts
        automātiskai piekļuvei, tāpēc izmantots vairāku citu avotu konverģējošs diapazons no 10 līdz
        14&nbsp;milimetriem, noklusējuma vērtība ir šī diapazona apakšējā robeža.
      </li>
      <li>
        Rezerves procentu. Nav atrasts stingrs avots konkrētam procentam mūrniecībai, tas ir pielāgojams
        lauks, nevis citēts fakts.
      </li>
      <li>
        Plānšuves (līmes) sistēmas. Kalkulators modelē tikai parasto mūrēšanu ar javas šuvi, atsevišķu
        gāzbetona bloku līmēšanu ar 1 līdz 3&nbsp;mm šuvi šis kalkulators nerēķina, sk. Biežāk uzdotos
        jautājumus.
      </li>
    </ul>
  ),
  'javas-apmetuma-daudzums': (
    <ul className="flex flex-col gap-2 text-panel-muted">
      <li>
        Mūrjavas iznākumu. Aprēķinātais javas apjoms tiek pārvērsts kilogramos un maisos, izmantojot viena
        konkrēta produkta (Sakret ZM) ražotāja norādīto iznākumu, citiem mūrjavas produktiem šis skaitlis
        var atšķirties.
      </li>
      <li>
        Vienības tukšumus. Javas apjoma ģeometriskais aprēķins pieņem pilnas, necaurumotas vienības,
        perforētiem vai tukšumainiem ķieģeļiem un blokiem reālais javas patēriņš var atšķirties.
      </li>
      <li>
        Rezerves procentu abos režīmos. Nav atrasts stingrs avots konkrētam skaitlim, tas ir pielāgojams
        lauks, nevis citēts fakts.
      </li>
    </ul>
  ),
  'gipskartona-loksnu-daudzums': (
    <ul className="flex flex-col gap-2 text-panel-muted">
      <li>
        Loksnu orientāciju un izkārtojumu. Kalkulators rēķina tikai kopējo platību, nevis to, kā loksnes
        tiek liktas pret rāmi vai spārēm, sk. Biežāk uzdotos jautājumus.
      </li>
      <li>
        Logu un durvju izgriezumus. Tie iekļaujas rezerves procentā, nevis tiek atņemti atsevišķi no
        kopējās platības.
      </li>
      <li>
        Rezerves procentu. Nav atrasts Latvijai specifisks avots, izmantota vispārpieņemta konvencija,
        tas ir pielāgojams lauks, nevis citēts fakts.
      </li>
    </ul>
  ),
  'grants-smilts-skembu-apjoms': (
    <ul className="flex flex-col gap-2 text-panel-muted">
      <li>
        Grants un šķembu blīvumu. Atšķirībā no smilts, kuras blīvumu tieši norāda Latvijas karjera
        materiālu tirgotāja lapa, neviens pārbaudītais Latvijas grants vai šķembu piegādātājs nepublicē
        precīzu blīvuma skaitli, dotās vērtības tiem ir vispārīgas aplēses, ne citēts fakts, sk. Biežāk
        uzdotos jautājumus.
      </li>
      <li>
        Sablīvēšanās rezervi. Nav atrasts Latvijai specifisks vai oficiāls avots šim procentam, tikai
        starptautiska aplēse, tas ir pielāgojams lauks.
      </li>
      <li>
        Frakcijas izvēli. Kalkulators nešķiro materiāla frakcijas (piemēram, šķembu 8/16 pret 16/32), tikai
        vienu blīvuma vērtību katram materiāla veidam, konkrētai frakcijai blīvums var atšķirties.
      </li>
    </ul>
  ),
  'terases-delu-daudzums': (
    <ul className="flex flex-col gap-2 text-panel-muted">
      <li>
        Dēļa izmēru. Iepriekš aizpildītais platums un garums ir viens reāls piemērs katram materiāla
        veidam, ne universāls standarts, konkrētam produktam izmērs var atšķirties, sk. Biežāk uzdotos
        jautājumus.
      </li>
      <li>
        Koka dēļa garumu. Sourced ir tikai platums, garums ir aplēse tipiskajā 2400 līdz 4800 mm diapazonā,
        jo konkrētā produkta lapa nebija pilnībā izgūstama.
      </li>
      <li>
        Atstarpi no mājas sienas vai citiem fiksētiem objektiem. Tā parasti ir platāka par šuvi starp
        dēļiem, bet neietekmē kopējo dēļu skaitu, tāpēc kalkulators to nerēķina.
      </li>
      <li>
        Rezerves procentu. Nav atrasts Latvijai specifisks avots, tas ir pielāgojams lauks.
      </li>
    </ul>
  ),
  'laminata-vinila-daudzums': (
    <ul className="flex flex-col gap-2 text-panel-muted">
      <li>
        Iepakojuma segumu. Iepriekš aizpildītā vērtība ir viens reāls piemērs katram seguma veidam, ne
        universāls standarts, konkrētam produktam segums var atšķirties gandrīz divkārt, sk. Biežāk uzdotos
        jautājumus.
      </li>
      <li>
        Pamatni zem grīdas seguma. Tā tiek pirkta atsevišķi pēc platības, kalkulators to nerēķina.
      </li>
      <li>
        Sarežģītu izkārtojumu. Rezerves procents ir ražotāja vadlīnija vienkāršam izkārtojumam, diagonālam
        vai rakstainam izkārtojumam (piemēram, zvaigžņu rakstam) reālā rezerve var būt ievērojami lielāka.
      </li>
    </ul>
  ),
  'pasizlidzinosas-javas-daudzums': (
    <ul className="flex flex-col gap-2 text-panel-muted">
      <li>
        Biezuma diapazonu. Ražotāja patēriņa skaitlis attiecas tikai uz datu lapā norādīto biezuma
        diapazonu katrai javai, ārpus tā reālais patēriņš var atšķirties, sk. Biežāk uzdotos jautājumus.
      </li>
      <li>
        Rezerves procentu. Nevienā pārbaudītajā ražotāja datu lapā tas nav minēts šim materiālam, tas ir
        vispārīga būvniecības konvencija, ne citēts fakts.
      </li>
      <li>
        Pamatnes sagatavošanu. Kalkulators nerēķina gruntējuma patēriņu vai pamatnes sagatavošanas
        materiālus, tikai pašu izlīdzinošo javu.
      </li>
    </ul>
  ),
};

/**
 * Optional "Avoti" content, only for calculators with real cited sources for their
 * default values (most calculators in this file have none, defaults are just
 * reasonable placeholders the user is expected to override).
 */
const sourcesContent: Record<string, React.ReactNode> = {
  'jumta-seguma-daudzums': (
    <ul className="flex flex-col gap-2 text-sm text-panel-muted">
      <li>
        Pamatnes platības uz slīpo platību formula,{' '}
        <a
          href="https://www.omnicalculator.com/construction/roofing"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          omnicalculator.com
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Betona dakstiņu segums uz m²,{' '}
        <a
          href="https://orberg.lv/wp-content/uploads/2025/07/Benders-betona-dakstini-montazas-instrukcija-2025-ORBERG.pdf"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          Benders montāžas instrukcija
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Metāla T20 profila loksnes izmēri,{' '}
        <a
          href="https://www.ruukki.com/lva/jumti/jumta-materiali/jumta-loksnes/jumta-loksnes-produkti/trapetsprofiil-t20-24w-1100"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          Ruukki
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Bitumena šindeļu iepakojuma segums,{' '}
        <a
          href="https://www.kursi.lv/lv/buvmateriali/jumta-segumi-un-jumta-piederumi/bitumena-sindeli"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          kursi.lv
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Rezerves procenta konvencija,{' '}
        <a
          href="https://roofr.com/blog/how-to-calculate-roof-waste-factor"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          roofr.com
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
    </ul>
  ),
  'tapetes-daudzums': (
    <ul className="flex flex-col gap-2 text-sm text-panel-muted">
      <li>
        Latvijas mazumtirdzniecības ruļļa izmērs 0,53 reiz 10 metri,{' '}
        <a
          href="https://www.tapetenshop.lv/en/collections/0-53-x-10m-wallpaper"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          tapetenshop.lv
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Rezerves procents bez raksta,{' '}
        <a
          href="https://deborainteriors.com/tools/wallpaper-calculator/"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          deborainteriors.com
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Rezerves procenti pēc raksta atkārtojuma veida,{' '}
        <a
          href="https://renocalchub.com/blog/interior/wallpaper-pattern-repeat.html"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          renocalchub.com
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
    </ul>
  ),
  'kiegelu-bloku-daudzums': (
    <ul className="flex flex-col gap-2 text-sm text-panel-muted">
      <li>
        Keramiskā ķieģeļa izmērs 250 reiz 120 reiz 65&nbsp;mm,{' '}
        <a
          href="https://lode.lv/produkts/pilnais-apdares-kiegelis-sahara-250x120x65/"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          Lode
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Gāzbetona bloka izmērs 600 reiz 300 reiz 200&nbsp;mm,{' '}
        <a
          href="https://bauroc.lv/eku-projektesana/tehniskie-dati/"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          Bauroc
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Šuves biezuma diapazons parastai mūrēšanai,{' '}
        <a
          href="https://www.wienerberger.ee/lv/produkcija/keramiskie-un-klinkera-kiegeli-terca/padomi-un-instrukcijas/pamatnoteikumi-un-rekomendacijas-murdarbiem.html"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          Wienerberger
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
    </ul>
  ),
  'javas-apmetuma-daudzums': (
    <ul className="flex flex-col gap-2 text-sm text-panel-muted">
      <li>
        Baumit MPI 25 patēriņš, 1,4&nbsp;kg/m²/mm,{' '}
        <a
          href="https://bau24.lv/sausie-maisijumi/razotajs-lv/baumit/baumit-mpi-25.html"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          bau24.lv
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Stimelit ST 5.03 patēriņš, 1,6&nbsp;kg/m²/mm,{' '}
        <a
          href="http://www.bmvide.lv/?l=1&c=761&p=184"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          bmvide.lv
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Baumit RatioGlatt patēriņš, 1,1&nbsp;kg/m²/mm,{' '}
        <a
          href="https://bau24.lv/sausie-maisijumi/razotajs-lv/baumit/baumit-ratioglatt-gipsa-apmetums.html"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          bau24.lv
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Sakret ZM mūrjavas iznākums, 25&nbsp;kg maiss dod aptuveni 15&nbsp;litrus,{' '}
        <a
          href="https://bau24.lv/sausie-maisijumi/razotajs-lv/sakret/sakret-zm-murjava.html"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          bau24.lv
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Javas apjoma ģeometriskā aprēķina metode (sienas apjoms mīnus vienību apjoms),{' '}
        <a
          href="https://www.engineeringcivil.com/mortar-calculation-in-brickwork.html"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          engineeringcivil.com
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
    </ul>
  ),
  'gipskartona-loksnu-daudzums': (
    <ul className="flex flex-col gap-2 text-sm text-panel-muted">
      <li>
        Ģipškartona loksnes izmērs 1200 reiz 2600&nbsp;mm,{' '}
        <a
          href="https://www.ksenukai.lv/p/gipskartona-plaksne-knauf-2600-mm-x-1200-mm-x-12-5-mm/esux"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          ksenukai.lv
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Rezerves procenta konvencija,{' '}
        <a
          href="https://www.homeadvisor.com/r/drywall-calculator"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          homeadvisor.com
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
    </ul>
  ),
  'grants-smilts-skembu-apjoms': (
    <ul className="flex flex-col gap-2 text-sm text-panel-muted">
      <li>
        Dabīgas smilts blīvums, 1,5 līdz 1,56&nbsp;t/m³, tieši norādīts{' '}
        <a
          href="https://dgr.lv/karjera-materialu-tirdznieciba/"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          dgr.lv
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Šķembu blīvums pēc frakcijas, šķirotai frakcijai apmēram 1,35 līdz 1,45&nbsp;t/m³, jauktai
        granulometrijai apmēram 1,65 līdz 1,75&nbsp;t/m³, praktiķu diskusija{' '}
        <a
          href="https://www.building.lv"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          building.lv
        </a>
        , izgūts 2026. gada 5. septembrī. Šis ir foruma avots, ne ražotāja datu lapa.
      </li>
    </ul>
  ),
  'terases-delu-daudzums': (
    <ul className="flex flex-col gap-2 text-sm text-panel-muted">
      <li>
        Kompozīta (WPC) dēļa izmērs 150 reiz 2900&nbsp;mm, apstiprināts vairākos neatkarīgos produktos,{' '}
        <a
          href="https://buvniecibas-abc.lv/en/shop/lumber/composite-materials-wpc/wpc-terrace-board-25x150x2900mm-gray-composite-material"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          buvniecibas-abc.lv
        </a>
        ,{' '}
        <a
          href="https://terasei.lv/en/product/wpc-decking-board-art-2-149mm-x-24mm/"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          terasei.lv
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Koka dēļa platums 145&nbsp;mm,{' '}
        <a
          href="https://patatimber.lv/p/86-terases-delis-lapegle-28-x-145-kd18-c-dt50"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          patatimber.lv
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Šuves platuma vadlīnijas pēc materiāla,{' '}
        <a
          href="https://gridasguru.lv/ka-ieklat-terases-delus-biezakas-kludas-un-ka-no-tam-izvairities"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          gridasguru.lv
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
    </ul>
  ),
  'laminata-vinila-daudzums': (
    <ul className="flex flex-col gap-2 text-sm text-panel-muted">
      <li>
        Laminātā iepakojuma segums, 1,39 līdz 2,54&nbsp;m², visbiežākais 1,99&nbsp;m² (8 dēlīši),{' '}
        <a
          href="https://www.egger.com/en/blog/how-much-laminate-flooring-do-i-need"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          egger.com
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Vinila (SPC) iepakojuma segums 2,208&nbsp;m², apstiprināts trīs produkta variantiem,{' '}
        <a
          href="https://www.kursi.lv/lv/vinila-grida-eterna-spc-6x181x1220-mm-33-klase-sebastian-oak-05325-m2"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          kursi.lv
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Rezerves procenta vadlīnijas, 10 līdz 15&nbsp;procenti,{' '}
        <a
          href="https://www.egger.com/en/blog/how-much-laminate-flooring-do-i-need"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          egger.com
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
    </ul>
  ),
  'pasizlidzinosas-javas-daudzums': (
    <ul className="flex flex-col gap-2 text-sm text-panel-muted">
      <li>
        Ceresit CN 69 Nivel Extra, patēriņš 1,5&nbsp;kg/m²/mm, kārta 1 līdz 15&nbsp;mm, ražotāja tehnisko
        datu lapa,{' '}
        <a
          href="https://dm.henkel-dam.com/is/content/henkel/lt-ceresit-cn69-savaime-issilyginantis-misinys-1-15mm-25kg-tds-lt"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          henkel-dam.com
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
      <li>
        Ceresit CN 76 Extrahart, patēriņš 2,0&nbsp;kg/m²/mm, kārta 4 līdz 50&nbsp;mm, ražotāja tehnisko datu
        lapa,{' '}
        <a
          href="https://dm.henkel-dam.com/is/content/henkel/tds-lv-ceresit-cn76-pasizlidzinosa-java-25kg"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          henkel-dam.com
        </a>
        , izgūts 2026. gada 5. septembrī.
      </li>
    </ul>
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
        limitations={limitationsContent[calculator.slug]}
        sources={sourcesContent[calculator.slug]}
      >
        <CalculatorComponent accentVar={category.accentVar} />
      </CalculatorShell>
    </>
  );
}
