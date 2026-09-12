export type CategorySlug = 'auto' | 'finanses' | 'majoklis' | 'veseliba' | 'sports' | 'sabiedriba';

export interface CategoryMeta {
  slug: CategorySlug;
  title: string;
  description: string;
  accentVar: string;
}

export interface CalculatorMeta {
  slug: string;
  category: CategorySlug;
  title: string;
  h1: string;
  intro: string;
  metaDescription: string;
  keywords: string[];
  /**
   * Full ISO 8601 timestamp with timezone offset (e.g. "2026-09-03T20:33:00+03:00") of
   * the last change to this calculator's rendered numbers or copy. Bump by hand to the
   * actual commit time, never auto-generate. A bare date is not precise enough: if
   * content changes a second time on the same day, a date-only value would already
   * read as "correct" without ever actually being touched by that second change, which
   * defeats lib/calculatorContentDrift.test.ts. Use `git log -1 --format=%cI -- <file>`
   * to find the real value when bumping.
   */
  contentUpdatedAt: string;
}

/**
 * Articles share the exact same fields as a calculator (slug, category, title, h1,
 * intro, metaDescription, keywords, contentUpdatedAt) since they render through the
 * same shell pattern (breadcrumb, H1, intro, body, FAQ, related content), just with
 * `ArticleShell` instead of `CalculatorShell` and no compute module. Kept as a
 * separate exported array (not merged into `calculators`) so
 * `lib/calculatorContentDrift.test.ts` — which requires every entry in `calculators` to
 * have a mapped UI/compute file — never needs to know articles exist.
 */
export type ArticleMeta = CalculatorMeta;

export const categories: CategoryMeta[] = [
  {
    slug: 'auto',
    title: 'Auto un transports',
    description: 'Kalkulatori auto izmaksām, KASKO un OCTA apdrošināšanai, degvielas cenām un riepu izmēram.',
    accentVar: 'var(--color-accent-auto)',
  },
  {
    slug: 'finanses',
    title: 'Finanses un nodokļi',
    description: 'Algas, kredītu un nodokļu kalkulatori.',
    accentVar: 'var(--color-accent-finanses)',
  },
  {
    slug: 'majoklis',
    title: 'Mājoklis un enerģija',
    description: 'Solāro paneļu, apkures un elektrības kalkulatori.',
    accentVar: 'var(--color-accent-majoklis)',
  },
  {
    slug: 'veseliba',
    title: 'Veselība un ķermenis',
    description: 'ĶMI, kaloriju un veselības kalkulatori.',
    accentVar: 'var(--color-accent-veseliba)',
  },
  {
    slug: 'sports',
    title: 'Izturība un sports',
    description: 'Skriešanas, riteņbraukšanas un peldēšanas kalkulatori.',
    accentVar: 'var(--color-accent-sports)',
  },
  {
    slug: 'sabiedriba',
    title: 'Sabiedrība',
    description: 'Sabiedrības un demogrāfijas kalkulatori.',
    accentVar: 'var(--color-accent-sabiedriba)',
  },
];

export const calculators: CalculatorMeta[] = [
  {
    slug: 'elektroauto-vs-benzina',
    category: 'auto',
    title: 'Elektroauto vs benzīna auto izmaksas',
    h1: 'Elektroauto vai benzīna auto: kas izmaksā lētāk?',
    intro: 'Ievadi savus skaitļus un uzzini, cik gadā maksā elektroauto salīdzinājumā ar benzīna auto.',
    metaDescription:
      'Salīdzini elektroauto un benzīna auto gada ekspluatācijas izmaksas pēc nobraukuma, patēriņa un enerģijas cenas.',
    keywords: ['elektroauto vs benzīns', 'elektroauto izmaksas', 'ev vs ice kalkulators'],
    contentUpdatedAt: '2026-08-22T19:55:03+03:00',
  },
  {
    slug: 'ekii-atbalsts',
    category: 'auto',
    title: 'EKII atbalsta kalkulators',
    h1: 'Cik liels ir EKII atbalsts elektroauto iegādei?',
    intro: 'Ievadi auto cenu un savus datus, uzzini pieejamā EKII atbalsta apmēru un auto cenu pēc atbalsta.',
    metaDescription:
      'Aprēķini EKII valsts atbalsta apmēru elektroauto vai spraudņa hibrīda iegādei 2026. gadā pēc auto cenas, statusa un Goda ģimenes apliecības.',
    keywords: ['EKII atbalsts', 'elektroauto valsts atbalsts', 'EKII kalkulators 2026'],
    contentUpdatedAt: '2026-08-22T20:08:28+03:00',
  },
  {
    slug: 'kasko-kalkulators',
    category: 'auto',
    title: 'KASKO kalkulators',
    h1: 'Cik izmaksā KASKO apdrošināšana mēnesī?',
    intro: 'Ievadi auto vērtību un savu KASKO piedāvājumu, uzzini mēneša maksājumu un izmaksas trīs gados.',
    metaDescription:
      'Aprēķini KASKO apdrošināšanas mēneša maksājumu un izmaksas kā daļu no auto vērtības pēc tavis saņemtā piedāvājuma.',
    keywords: ['KASKO kalkulators', 'KASKO cena', 'auto apdrošināšana', 'KASKO apdrošināšanas kalkulators'],
    contentUpdatedAt: '2026-09-11T13:59:02+03:00',
  },
  {
    slug: 'octa-kalkulators',
    category: 'auto',
    title: 'OCTA cenu salīdzinājums',
    h1: 'Kurš OCTA piedāvājums ir lētākais?',
    intro: 'Ievadi līdz trim saņemtajiem OCTA piedāvājumiem, uzzini lētāko un starpību pret dārgāko.',
    metaDescription: 'Salīdzini vairākus OCTA apdrošināšanas piedāvājumus un atrodi lētāko variantu.',
    keywords: ['OCTA kalkulators', 'OCTA cenas salīdzinājums', 'obligātā apdrošināšana', 'OCTA cenu salīdzinājums'],
    contentUpdatedAt: '2026-09-11T13:59:02+03:00',
  },
  {
    slug: 'lizings-vs-kredits',
    category: 'auto',
    title: 'Līzings vs kredīts auto',
    h1: 'Līzings vai kredīts, kas izmaksā lētāk mēnesī?',
    intro: 'Ievadi auto cenu un savu piedāvājumu, salīdzini kredīta un līzinga mēneša maksājumu.',
    metaDescription:
      'Salīdzini auto kredīta un līzinga mēneša maksājumu pēc auto cenas, pirmās iemaksas, termiņa un likmēm.',
    keywords: [
      'līzings vs kredīts',
      'auto līzings kalkulators',
      'auto kredīts kalkulators',
      'auto līzings vai kredīts',
      'mēneša maksājums auto līzingam',
    ],
    contentUpdatedAt: '2026-09-11T17:03:37+03:00',
  },
  {
    slug: 'degvielas-izmaksas',
    category: 'auto',
    title: 'Degvielas izmaksas gadā',
    h1: 'Cik gadā izmaksā degviela tavam auto?',
    intro: 'Ievadi gada nobraukumu, patēriņu un degvielas cenu, uzzini gada un mēneša degvielas izmaksas.',
    metaDescription:
      'Aprēķini auto degvielas izmaksas gadā un uz 100 kilometriem pēc nobraukuma, patēriņa un degvielas cenas.',
    keywords: ['degvielas izmaksas kalkulators', 'degvielas patēriņš gadā', 'auto uzturēšanas izmaksas'],
    contentUpdatedAt: '2026-08-22T20:18:36+03:00',
  },
  {
    slug: 'uzlades-izmaksas',
    category: 'auto',
    title: 'Elektroauto uzlādes izmaksas',
    h1: 'Cik izmaksā elektroauto uzlāde mājās un publiski?',
    intro: 'Ievadi, cik daļu no uzlādes veic mājās un cik publiski, uzzini gada uzlādes izmaksas.',
    metaDescription:
      'Aprēķini elektroauto gada uzlādes izmaksas, sadalot uzlādi starp mājas un publisko lādēšanu.',
    keywords: [
      'elektroauto uzlādes izmaksas',
      'uzlādes cena mājās',
      'publiskā lādēšana cena',
      'elektroauto uzlādes cena',
      'uzlāde kwh cena',
    ],
    contentUpdatedAt: '2026-09-11T17:00:19+03:00',
  },
  {
    slug: 'nolietojums',
    category: 'auto',
    title: 'Auto nolietojums',
    h1: 'Cik daudz auto vērtība samazinās laika gaitā?',
    intro: 'Ievadi pirkuma cenu, auto vecumu un gada nolietojuma likmi, uzzini pašreizējo vērtību.',
    metaDescription:
      'Aprēķini auto pašreizējo vērtību un kopējo nolietojumu pēc pirkuma cenas, vecuma un gada nolietojuma likmes.',
    keywords: ['auto nolietojums kalkulators', 'auto vērtības samazinājums', 'auto vērtība pēc gadiem'],
    contentUpdatedAt: '2026-08-22T20:26:27+03:00',
  },
  {
    slug: 'riepu-izmers',
    category: 'auto',
    title: 'Riepu izmēra kalkulators',
    h1: 'Kā riepu izmēra maiņa ietekmē spidometra rādījumu?',
    intro: 'Ievadi vecās un jaunās riepas izmēru, uzzini spidometra kļūdu un reālo braukšanas ātrumu.',
    metaDescription:
      'Aprēķini spidometra kļūdu un reālo ātrumu pēc riepu izmēra maiņas, salīdzinot veco un jauno riepu diametru.',
    keywords: [
      'riepu izmēra kalkulators',
      'spidometra kļūda',
      'riepu diametrs',
      'riepu augstuma kalkulators',
      'riepu kalkulators',
    ],
    contentUpdatedAt: '2026-09-11T17:36:37+03:00',
  },
  {
    slug: 'cela-izmaksas',
    category: 'auto',
    title: 'Ceļa izmaksas kalkulators',
    h1: 'Cik izmaksā konkrēts brauciens?',
    intro: 'Ievadi brauciena attālumu, patēriņu un degvielas cenu, uzzini izmaksas kopā un uz vienu cilvēku.',
    metaDescription:
      'Aprēķini konkrēta brauciena degvielas izmaksas un izmaksas uz vienu cilvēku, dalot ar līdzbraucēju skaitu.',
    keywords: ['ceļa izmaksas kalkulators', 'brauciena izmaksas', 'degvielas izmaksas uz braucienu'],
    contentUpdatedAt: '2026-08-22T20:26:27+03:00',
  },
  {
    slug: 'ekspluatacijas-nodoklis',
    category: 'auto',
    title: 'Auto ekspluatācijas nodokļa kalkulators',
    h1: 'Cik liels ir tavas automašīnas ekspluatācijas nodoklis?',
    intro:
      'Ievadi automašīnas CO2 izmešus, uzzini gada transportlīdzekļa ekspluatācijas nodokli pēc likumā noteiktajām likmēm.',
    metaDescription:
      'Aprēķini transportlīdzekļa ekspluatācijas nodokli pēc CO2 izmešiem automobiļiem, kas reģistrēti no 2021. gada.',
    keywords: [
      'ekspluatācijas nodokļa kalkulators',
      'auto ekspluatācijas nodoklis',
      'transportlīdzekļa nodoklis CO2',
    ],
    contentUpdatedAt: '2026-09-11T09:52:08+03:00',
  },
  {
    slug: 'uznemuma-auto-nodoklis',
    category: 'auto',
    title: 'Uzņēmuma vieglā auto nodokļa kalkulators',
    h1: 'Cik maksā uzņēmuma vieglā auto nodoklis?',
    intro:
      'Ievadi transportlīdzekļa veidu un dzinēja jaudu, uzzini uzņēmumu vieglo transportlīdzekļu nodokli mēnesī un gadā.',
    metaDescription:
      'Aprēķini uzņēmumu vieglo transportlīdzekļu nodokli pēc transportlīdzekļa veida un dzinēja jaudas.',
    keywords: [
      'uzņēmuma auto nodoklis',
      'uzņēmumu vieglo transportlīdzekļu nodoklis',
      'uvtn kalkulators',
    ],
    contentUpdatedAt: '2026-09-11T10:23:16+03:00',
  },
  {
    slug: 'solaru-atmaksa',
    category: 'majoklis',
    title: 'Solāro paneļu atmaksa',
    h1: 'Cik gados atmaksājas solārie paneļi?',
    intro: 'Ievadi sistēmas izmaksas, jaudu un paredzamo patēriņu, uzzini atmaksāšanās laiku gados.',
    metaDescription: 'Aprēķini solāro paneļu sistēmas atmaksāšanās laiku pēc uzstādīšanas izmaksām, jaudas un pašpatēriņa.',
    keywords: ['solāro paneļu atmaksa', 'saules paneļu kalkulators', 'saules enerģijas atmaksāšanās'],
    contentUpdatedAt: '2026-08-22T20:39:05+03:00',
  },
  {
    slug: 'siltumsukna-atmaksa',
    category: 'majoklis',
    title: 'Siltumsūkņa atmaksa',
    h1: 'Cik gados atmaksājas siltumsūknis?',
    intro: 'Ievadi siltumsūkņa izmaksas, mājas siltumenerģijas patēriņu un vecās apkures cenu, uzzini atmaksāšanās laiku.',
    metaDescription: 'Aprēķini siltumsūkņa atmaksāšanās laiku, salīdzinot ar vecās apkures sistēmas izmaksām.',
    keywords: ['siltumsūkņa atmaksa', 'siltumsūkņa kalkulators', 'apkures izmaksu salīdzinājums'],
    contentUpdatedAt: '2026-08-22T20:39:05+03:00',
  },
  {
    slug: 'elektribas-rekins',
    category: 'majoklis',
    title: 'Elektrības rēķina kalkulators',
    h1: 'Cik liels būs elektrības rēķins?',
    intro: 'Ievadi mēneša patēriņu, elektrības cenu un fiksēto maksu, uzzini rēķinu mēnesī un gadā.',
    metaDescription: 'Aprēķini mājsaimniecības elektrības rēķinu mēnesī un gadā pēc patēriņa, cenas un fiksētās maksas.',
    keywords: ['elektrības rēķina kalkulators', 'elektrības cena', 'mājsaimniecības elektrības izmaksas'],
    contentUpdatedAt: '2026-08-22T20:39:05+03:00',
  },
  {
    slug: 'apkures-izmaksas',
    category: 'majoklis',
    title: 'Apkures izmaksu salīdzinājums',
    h1: 'Kurš apkures veids izmaksā lētāk?',
    intro: 'Ievadi mājas siltumenerģijas patēriņu un cenu par kWh katram apkures veidam, salīdzini gada izmaksas.',
    metaDescription: 'Salīdzini gāzes, malkas un siltumsūkņa apkures gada izmaksas pēc mājas siltumenerģijas patēriņa.',
    keywords: ['apkures izmaksu salīdzinājums', 'apkures veidu salīdzinājums', 'lētākā apkure'],
    contentUpdatedAt: '2026-08-22T20:39:05+03:00',
  },
  {
    slug: 'malkas-apjoms',
    category: 'majoklis',
    title: 'Malkas apjoma kalkulators',
    h1: 'Cik ciešas malkas ir sakrautajā grēdā?',
    intro: 'Ievadi grēdas garumu, platumu un augstumu, uzzini sakrautā apjoma un cietās koksnes apjomu.',
    metaDescription: 'Aprēķini malkas grēdas apjomu steros un cietās koksnes kubikmetros pēc grēdas izmēriem.',
    keywords: ['malkas apjoma kalkulators', 'malkas ster', 'malkas kubikmetri'],
    contentUpdatedAt: '2026-08-22T20:51:18+03:00',
  },
  {
    slug: 'krasas-daudzums',
    category: 'majoklis',
    title: 'Krāsas daudzuma kalkulators',
    h1: 'Cik daudz krāsas nepieciešams?',
    intro: 'Ievadi krāsojamo platību, krāsas patēriņu un kārtu skaitu, uzzini nepieciešamo krāsas daudzumu litros.',
    metaDescription: 'Aprēķini nepieciešamo krāsas daudzumu litros pēc krāsojamās platības, patēriņa un kārtu skaita.',
    keywords: ['krāsas daudzuma kalkulators', 'krāsas patēriņš', 'cik krāsas vajag'],
    contentUpdatedAt: '2026-08-22T20:51:18+03:00',
  },
  {
    slug: 'flizu-daudzums',
    category: 'majoklis',
    title: 'Flīžu daudzuma kalkulators',
    h1: 'Cik flīžu nepieciešams?',
    intro: 'Ievadi klājamo platību, flīzes izmēru un rezerves procentu, uzzini nepieciešamo flīžu skaitu.',
    metaDescription: 'Aprēķini nepieciešamo flīžu skaitu pēc klājamās platības, flīzes izmēra un rezerves procenta.',
    keywords: ['flīžu daudzuma kalkulators', 'flīžu skaits', 'cik flīžu vajag'],
    contentUpdatedAt: '2026-08-22T20:51:18+03:00',
  },
  {
    slug: 'betona-apjoms',
    category: 'majoklis',
    title: 'Betona apjoma kalkulators',
    h1: 'Cik daudz betona nepieciešams?',
    intro: 'Ievadi betonējamā laukuma izmērus un biezumu, uzzini nepieciešamo betona apjomu un maisu skaitu.',
    metaDescription: 'Aprēķini nepieciešamo betona apjomu kubikmetros un maisu skaitu pēc laukuma izmēriem un biezuma.',
    keywords: ['betona apjoma kalkulators', 'betona daudzums', 'betona maisu skaits'],
    contentUpdatedAt: '2026-09-05T22:52:22+03:00',
  },
  {
    slug: 'jumta-seguma-daudzums',
    category: 'majoklis',
    title: 'Jumta seguma daudzuma kalkulators',
    h1: 'Cik daudz jumta seguma materiāla nepieciešams?',
    intro:
      'Ievadi jumta pamatnes platību un slīpuma leņķi, izvēlies seguma materiālu, uzzini nepieciešamo daudzumu.',
    metaDescription:
      'Aprēķini nepieciešamo jumta seguma daudzumu, dakstiņus, metāla loksnes vai bitumena šindeļus, pēc pamatnes platības un slīpuma leņķa.',
    keywords: ['jumta seguma kalkulators', 'jumta dakstiņu skaits', 'jumta platības aprēķins'],
    contentUpdatedAt: '2026-09-05T23:35:49+03:00',
  },
  {
    slug: 'tapetes-daudzums',
    category: 'majoklis',
    title: 'Tapetes daudzuma kalkulators',
    h1: 'Cik tapešu ruļļu nepieciešams?',
    intro:
      'Ievadi sienu platību, ruļļa izmēru un raksta veidu, uzzini nepieciešamo tapešu ruļļu skaitu.',
    metaDescription:
      'Aprēķini nepieciešamo tapešu ruļļu skaitu pēc sienu platības, ruļļa izmēra un raksta atkārtojuma veida.',
    keywords: ['tapetes daudzuma kalkulators', 'tapešu ruļļu skaits', 'cik tapešu vajag'],
    contentUpdatedAt: '2026-09-05T23:35:49+03:00',
  },
  {
    slug: 'kiegelu-bloku-daudzums',
    category: 'majoklis',
    title: 'Ķieģeļu un bloku daudzuma kalkulators',
    h1: 'Cik ķieģeļu vai bloku nepieciešams sienai?',
    intro:
      'Ievadi sienas platību, vienības izmērus un šuves biezumu, uzzini nepieciešamo ķieģeļu vai bloku skaitu.',
    metaDescription:
      'Aprēķini nepieciešamo ķieģeļu vai gāzbetona bloku skaitu pēc sienas platības, vienības izmēriem un šuves biezuma.',
    keywords: ['ķieģeļu daudzuma kalkulators', 'bloku skaita aprēķins', 'cik ķieģeļu vajag'],
    contentUpdatedAt: '2026-09-05T23:35:49+03:00',
  },
  {
    slug: 'javas-apmetuma-daudzums',
    category: 'majoklis',
    title: 'Javas un apmetuma daudzuma kalkulators',
    h1: 'Cik javas vai apmetuma nepieciešams?',
    intro:
      'Izvēlies apmetumu vai mūrjavu, ievadi sienas platību un izmērus, uzzini nepieciešamo maisu skaitu.',
    metaDescription:
      'Aprēķini nepieciešamo apmetuma vai mūrjavas maisu skaitu pēc sienas platības, biezuma vai vienību izmēriem un šuves biezuma.',
    keywords: ['javas kalkulators', 'apmetuma daudzuma kalkulators', 'cik javas vajag', 'mūrjavas apjoms'],
    contentUpdatedAt: '2026-09-05T23:35:49+03:00',
  },
  {
    slug: 'gipskartona-loksnu-daudzums',
    category: 'majoklis',
    title: 'Ģipškartona lokšņu daudzuma kalkulators',
    h1: 'Cik ģipškartona lokšņu nepieciešams?',
    intro:
      'Ievadi klājamo platību un loksnes izmēru, uzzini nepieciešamo ģipškartona lokšņu skaitu.',
    metaDescription:
      'Aprēķini nepieciešamo ģipškartona lokšņu skaitu pēc sienas vai griestu platības, loksnes izmēra un rezerves procenta.',
    keywords: ['ģipškartona kalkulators', 'ģipškartona lokšņu skaits', 'cik ģipškartona vajag'],
    contentUpdatedAt: '2026-09-05T23:35:49+03:00',
  },
  {
    slug: 'grants-smilts-skembu-apjoms',
    category: 'majoklis',
    title: 'Grants, smilts un šķembu apjoma kalkulators',
    h1: 'Cik grants, smilts vai šķembu nepieciešams?',
    intro:
      'Izvēlies materiālu, ievadi aizpildāmo platību un kārtas biezumu, uzzini nepieciešamo apjomu un masu.',
    metaDescription:
      'Aprēķini nepieciešamo grants, smilts vai šķembu apjomu un masu pēc platības, kārtas biezuma un materiāla blīvuma.',
    keywords: ['grants kalkulators', 'smilts apjoma kalkulators', 'šķembu daudzuma kalkulators'],
    contentUpdatedAt: '2026-09-05T23:35:49+03:00',
  },
  {
    slug: 'terases-delu-daudzums',
    category: 'majoklis',
    title: 'Terases dēļu daudzuma kalkulators',
    h1: 'Cik terases dēļu nepieciešams?',
    intro:
      'Izvēlies materiālu, ievadi terases platību un dēļa izmēru, uzzini nepieciešamo dēļu skaitu.',
    metaDescription:
      'Aprēķini nepieciešamo terases dēļu skaitu pēc terases platības, dēļa platuma, garuma un šuves starp dēļiem.',
    keywords: ['terases dēļu kalkulators', 'terases seguma aprēķins', 'cik terases dēļu vajag'],
    contentUpdatedAt: '2026-09-05T23:35:49+03:00',
  },
  {
    slug: 'laminata-vinila-daudzums',
    category: 'majoklis',
    title: 'Laminātā un vinila grīdas seguma kalkulators',
    h1: 'Cik laminātā vai vinila grīdas seguma nepieciešams?',
    intro:
      'Izvēlies seguma veidu, ievadi grīdas platību un iepakojuma segumu, uzzini nepieciešamo iepakojumu skaitu.',
    metaDescription:
      'Aprēķini nepieciešamo laminātā vai vinila grīdas seguma iepakojumu skaitu pēc grīdas platības un viena iepakojuma seguma.',
    keywords: ['laminātā kalkulators', 'vinila grīdas kalkulators', 'grīdas seguma daudzums'],
    contentUpdatedAt: '2026-09-05T23:35:49+03:00',
  },
  {
    slug: 'pasizlidzinosas-javas-daudzums',
    category: 'majoklis',
    title: 'Pašizlīdzinošās javas daudzuma kalkulators',
    h1: 'Cik pašizlīdzinošās javas nepieciešams?',
    intro:
      'Izvēlies javas veidu, ievadi grīdas platību un kārtas biezumu, uzzini nepieciešamo maisu skaitu.',
    metaDescription:
      'Aprēķini nepieciešamo pašizlīdzinošās grīdas javas maisu skaitu pēc platības, kārtas biezuma un ražotāja norādītā patēriņa.',
    keywords: ['pašizlīdzinošā java', 'grīdas izlīdzināšanas kalkulators', 'cik javas vajag grīdai'],
    contentUpdatedAt: '2026-09-05T23:35:49+03:00',
  },
  {
    slug: 'zoga-materiala-daudzums',
    category: 'majoklis',
    title: 'Žoga materiāla daudzuma kalkulators',
    h1: 'Cik žoga materiāla nepieciešams?',
    intro:
      'Ievadi žoga garumu, statņu atstarpi un dēlīša izmēru, uzzini nepieciešamo statņu un dēlīšu skaitu.',
    metaDescription:
      'Aprēķini nepieciešamo žoga statņu un dēlīšu skaitu pēc žoga garuma, statņu atstarpes, dēlīša platuma un spraugas.',
    keywords: ['žoga kalkulators', 'žoga materiāla daudzums', 'žoga statņu skaits'],
    contentUpdatedAt: '2026-09-05T23:35:49+03:00',
  },
  {
    slug: 'siltinajuma-biezuma-kalkulators',
    category: 'majoklis',
    title: 'Siltinājuma biezuma kalkulators',
    h1: 'Cik biezai jābūt siltumizolācijai?',
    intro:
      'Ievadi pieļaujamo U vērtību un materiāla siltumvadītspēju, uzzini nepieciešamo siltinājuma biezumu.',
    metaDescription:
      'Aprēķini nepieciešamo siltinājuma biezumu pēc LBN 002-19 pieļaujamās U vērtības un izvēlētā materiāla siltumvadītspējas.',
    keywords: [
      'siltinājuma biezuma kalkulators',
      'siltinājuma biezums',
      'LBN 002-19',
    ],
    contentUpdatedAt: '2026-09-12T10:50:22+03:00',
  },
  {
    slug: 'ventilacijas-apjoma-kalkulators',
    category: 'majoklis',
    title: 'Ventilācijas apjoma kalkulators',
    h1: 'Cik daudz svaigā gaisa nepieciešams telpā?',
    intro:
      'Ievadi cilvēku skaitu un telpas tilpumu, uzzini minimālo nepieciešamo svaigā gaisa daudzumu.',
    metaDescription:
      'Aprēķini minimālo nepieciešamo svaigā gaisa daudzumu telpā (m³/h) pēc LBN 231-15 un iegūsti gaisa apmaiņas biežumu.',
    keywords: [
      'ventilācijas apjoma kalkulators',
      'gaisa apmaiņas kalkulators',
      'svaigā gaisa daudzums telpā',
    ],
    contentUpdatedAt: '2026-09-12T11:49:12+03:00',
  },
  {
    slug: 'logu-platibas-kalkulators',
    category: 'majoklis',
    title: 'Logu platības kalkulators',
    h1: 'Vai loga platība atbilst dienasgaismas prasībai?',
    intro:
      'Ievadi telpas grīdas platību un loga platību, uzzini, vai tā atbilst 1:8 prasībai.',
    metaDescription:
      'Pārbaudi, vai loga platība dzīvojamā telpā vai virtuvē atbilst LBN 200-21 prasībai (logu platība vismaz 1:8 pret grīdas platību).',
    keywords: [
      'logu platības kalkulators',
      'logu platība pret grīdas platību',
      'dienasgaismas prasība logiem',
    ],
    contentUpdatedAt: '2026-09-12T11:56:30+03:00',
  },
  {
    slug: 'kapnu-formulas-kalkulators',
    category: 'majoklis',
    title: 'Kāpņu formulas kalkulators',
    h1: 'Vai manas kāpnes būs ērtas?',
    intro:
      'Ievadi pakāpiena augstumu un platumu, uzzini, vai kāpnes atbilst Blondela ērtuma formulai.',
    metaDescription:
      'Pārbaudi kāpņu ērtumu pēc Blondela formulas (2 reizes pakāpiena augstums plus platums, 60 līdz 64 cm).',
    keywords: [
      'kāpņu formulas kalkulators',
      'blondela formula',
      'pakāpiena augstums un platums',
    ],
    contentUpdatedAt: '2026-09-12T12:08:11+03:00',
  },
  {
    slug: 'griestu-augstuma-kalkulators',
    category: 'majoklis',
    title: 'Griestu augstuma kalkulators',
    h1: 'Vai telpas griestu augstums atbilst prasībai?',
    intro:
      'Ievadi telpas griestu augstumu un izvēlies telpas veidu, uzzini, vai tas atbilst LBN 200-21 noteiktajam minimumam.',
    metaDescription:
      'Pārbaudi, vai telpas griestu augstums atbilst LBN 200-21 prasībai (dzīvojamā, publiskā, tehniskā telpa, gaitenis).',
    keywords: [
      'griestu augstuma kalkulators',
      'minimālais griestu augstums',
      'telpu augstums LBN 200-21',
    ],
    contentUpdatedAt: '2026-09-12T13:08:11+03:00',
  },
  {
    slug: 'kmi-kalkulators',
    category: 'veseliba',
    title: 'ĶMI kalkulators',
    h1: 'Kāds ir tavs ķermeņa masas indekss?',
    intro: 'Ievadi svaru un augumu, uzzini ĶMI un tā kategoriju pēc PVO klasifikācijas.',
    metaDescription: 'Aprēķini ķermeņa masas indeksu (ĶMI) no svara un auguma un uzzini tā kategoriju.',
    keywords: ['ķmi kalkulators', 'ķermeņa masas indekss', 'bmi kalkulators latviski'],
    contentUpdatedAt: '2026-09-11T12:19:45+03:00',
  },
  {
    slug: 'kaloriju-norma',
    category: 'veseliba',
    title: 'Kaloriju normas kalkulators',
    h1: 'Cik kalorijas tev vajag dienā?',
    intro: 'Ievadi svaru, augumu, vecumu un aktivitātes līmeni, uzzini bazālo metabolismu un dienas kaloriju normu.',
    metaDescription:
      'Aprēķini dienas kaloriju normu (TDEE) un bazālo metabolismu (BMR) pēc Mifflin-St Jeor formulas.',
    keywords: ['kaloriju normas kalkulators', 'bmr kalkulators', 'tdee kalkulators latviski'],
    contentUpdatedAt: '2026-09-11T12:23:04+03:00',
  },
  {
    slug: 'tauku-procents',
    category: 'veseliba',
    title: 'Ķermeņa tauku procenta kalkulators',
    h1: 'Kāds ir tavs ķermeņa tauku procents?',
    intro: 'Ievadi auguma un ķermeņa apkārtmērus, uzzini aptuveno ķermeņa tauku procentu pēc Navy metodes.',
    metaDescription:
      'Aprēķini ķermeņa tauku procentu no vidukļa, kakla un gurnu apkārtmēriem pēc ASV Jūras kara flotes metodes.',
    keywords: ['ķermeņa tauku procents', 'tauku procenta kalkulators', 'navy metode kalkulators'],
    contentUpdatedAt: '2026-09-11T12:26:07+03:00',
  },
  {
    slug: 'idealais-svars',
    category: 'veseliba',
    title: 'Ideālā svara kalkulators',
    h1: 'Kāds ir tavs ideālais svars?',
    intro: 'Ievadi augumu un dzimumu, uzzini ideālo svaru pēc Devina formulas.',
    metaDescription: 'Aprēķini ideālo svaru no auguma pēc Devina formulas, plaši lietotas medicīnā.',
    keywords: ['ideālā svara kalkulators', 'devina formula', 'ideālais svars pēc auguma'],
    contentUpdatedAt: '2026-09-11T12:29:03+03:00',
  },
  {
    slug: 'udens-norma',
    category: 'veseliba',
    title: 'Ūdens normas kalkulators',
    h1: 'Cik ūdens tev vajag dienā?',
    intro: 'Ievadi svaru, uzzini ieteicamo ūdens daudzumu dienā.',
    metaDescription: 'Aprēķini ieteicamo dienas ūdens normu no ķermeņa svara pēc vispārpieņemtas vadlīnijas.',
    keywords: ['ūdens normas kalkulators', 'cik ūdens dzert dienā', 'ūdens patēriņa kalkulators'],
    contentUpdatedAt: '2026-09-11T12:32:04+03:00',
  },
  {
    slug: 'skriesanas-temps',
    category: 'sports',
    title: 'Skriešanas tempa kalkulators',
    h1: 'Kāds ir tavs skriešanas temps?',
    intro: 'Ievadi distanci un laiku, uzzini tempu uz kilometru un vidējo ātrumu.',
    metaDescription: 'Aprēķini skriešanas tempu uz kilometru un vidējo ātrumu no distances un laika.',
    keywords: ['skriešanas tempa kalkulators', 'skriešanas temps', 'skriešanas ātrums'],
    contentUpdatedAt: '2026-08-22T21:02:45+03:00',
  },
  {
    slug: 'triatlona-planotajs',
    category: 'sports',
    title: 'Triatlona plānotājs',
    h1: 'Cik ilgs būs triatlons?',
    intro: 'Ievadi katra posma distanci un tempu, uzzini paredzamo kopējo triatlona laiku.',
    metaDescription:
      'Aprēķini paredzamo triatlona kopējo laiku no peldēšanas, riteņbraukšanas un skriešanas posmiem.',
    keywords: ['triatlona plānotājs', 'triatlona kalkulators', 'triatlona laiks'],
    contentUpdatedAt: '2026-08-22T21:02:45+03:00',
  },
  {
    slug: 'ftp-zonas',
    category: 'sports',
    title: 'FTP zonu kalkulators',
    h1: 'Kādas ir tavas riteņbraukšanas jaudas zonas?',
    intro: 'Ievadi savu FTP (funkcionālo sliekšņa jaudu), uzzini treniņu jaudas zonas vatos.',
    metaDescription:
      'Aprēķini riteņbraukšanas treniņu jaudas zonas no FTP pēc standarta septiņu zonu modeļa.',
    keywords: ['ftp zonu kalkulators', 'riteņbraukšanas jaudas zonas', 'ftp kalkulators'],
    contentUpdatedAt: '2026-08-22T21:02:45+03:00',
  },
  {
    slug: 'maratona-laika-prognoze',
    category: 'sports',
    title: 'Maratona laika prognozes kalkulators',
    h1: 'Kāds būs tavs paredzamais maratona laiks?',
    intro:
      'Ievadi nesena skrējiena distanci un laiku, uzzini prognozēto laiku maratonam, pusmaratonam vai 10 km.',
    metaDescription:
      'Prognozē maratona, pusmaratona vai 10 km laiku no nesena skrējiena rezultāta pēc Rīgela formulas.',
    keywords: ['maratona laika prognoze', 'skriešanas laika kalkulators', 'maratona laika kalkulators'],
    contentUpdatedAt: '2026-09-11T10:53:35+03:00',
  },
  {
    slug: 'vo2max',
    category: 'sports',
    title: 'VO2max kalkulators',
    h1: 'Kāds ir tavs VO2max?',
    intro: 'Ievadi 12 minūtēs nobraukto distanci, uzzini aptuveno VO2max pēc Kūpera testa.',
    metaDescription:
      'Aprēķini VO2max no Kūpera 12 minūšu skriešanas testa rezultāta un uzzini aptuveno izturības novērtējumu.',
    keywords: ['vo2max kalkulators', 'kūpera tests', 'vo2max aprēķins'],
    contentUpdatedAt: '2026-09-11T11:23:20+03:00',
  },
  {
    slug: 'trenina-kalorijas',
    category: 'sports',
    title: 'Treniņa kaloriju kalkulators',
    h1: 'Cik kalorijas sadedzina treniņā?',
    intro: 'Ievadi aktivitātes veidu, svaru un ilgumu, uzzini aptuveno sadedzināto kaloriju daudzumu.',
    metaDescription:
      'Aprēķini treniņā sadedzinātās kalorijas pēc MET metodes skriešanai, riteņbraukšanai, peldēšanai un iešanai.',
    keywords: ['treniņa kaloriju kalkulators', 'sadedzinātās kalorijas', 'met kalkulators'],
    contentUpdatedAt: '2026-09-11T11:52:10+03:00',
  },
  {
    slug: 'peldesanas-css',
    category: 'sports',
    title: 'Peldēšanas CSS kalkulators',
    h1: 'Kāds ir tavs kritiskais peldēšanas ātrums?',
    intro: 'Ievadi 400 metru un 200 metru peldējuma laiku, uzzini CSS un treniņu tempu uz 100 metriem.',
    metaDescription:
      'Aprēķini kritisko peldēšanas ātrumu (CSS) un treniņu tempu no 400 metru un 200 metru testa laika.',
    keywords: ['css kalkulators peldēšanai', 'kritiskais peldēšanas ātrums', 'peldēšanas css tests'],
    contentUpdatedAt: '2026-09-11T08:12:11+03:00',
  },
  {
    slug: 'sirdsdarbibas-zonas',
    category: 'sports',
    title: 'Sirdsdarbības zonu kalkulators',
    h1: 'Kādas ir tavas sirdsdarbības treniņu zonas?',
    intro: 'Ievadi maksimālo un miera sirdsdarbības ātrumu, uzzini treniņu zonas pēc Karvonena metodes.',
    metaDescription:
      'Aprēķini sirdsdarbības treniņu zonas pēc Karvonena metodes no maksimālā un miera pulsa.',
    keywords: ['sirdsdarbības zonu kalkulators', 'pulsa zonas', 'karvonena metode'],
    contentUpdatedAt: '2026-08-22T21:02:45+03:00',
  },
  {
    slug: 'dzimstibas-kalkulators',
    category: 'sabiedriba',
    title: 'Dzimstības kalkulators',
    h1: 'Cik bērniem Latvijā jāpiedzimst, lai iedzīvotāju skaits vairs nesarūk',
    intro:
      'Ievadi savus pieņēmumus par mirušajiem, migrāciju un iedzīvotāju skaitu un uzzini, cik bērniem jāpiedzimst, lai sasniegtu izvēlēto mērķi.',
    metaDescription:
      'Aprēķini, cik bērniem gadā jāpiedzimst Latvijā, lai iedzīvotāju skaits stabilizētos vai sasniegtu izvēlētu mērķi, pēc oficiāliem CSP datiem.',
    keywords: ['dzimstības kalkulators', 'cik bērniem jāpiedzimst Latvijā', 'Latvijas iedzīvotāju skaits'],
    contentUpdatedAt: '2026-09-05T14:49:43+03:00',
  },
  {
    slug: 'pensijas-kalkulators',
    category: 'finanses',
    title: 'Pensijas kalkulators',
    h1: 'Cik liela būs mana 1. līmeņa pensija',
    intro:
      'Ievadi dzimšanas gadu, algu un apdrošināšanas stāžu, uzzini aptuvenu 1. līmeņa vecuma pensijas apmēru pēc VSAA formulas.',
    metaDescription:
      'Aprēķini aptuvenu Latvijas 1. līmeņa vecuma pensiju pēc VSAA formulas un koeficienta G, ar redzamu aprēķinu gaitu.',
    keywords: [
      'pensijas kalkulators',
      'mana pensija',
      'kā aprēķina pensiju Latvijā',
      'koeficients G',
      'prognozējamā pensija',
      'mana pensija kalkulators',
    ],
    contentUpdatedAt: '2026-09-11T22:31:49+03:00',
  },
  {
    slug: 'priekslaicigas-pensijas-kalkulators',
    category: 'finanses',
    title: 'Priekšlaicīgas pensijas kalkulators',
    h1: 'Cik liela būs mana pensija, pensionējoties priekšlaicīgi',
    intro:
      'Ievadi dzimšanas gadu, algu un apdrošināšanas stāžu, uzzini aptuvenu 1. līmeņa pensiju, pensionējoties līdz 2 gadiem agrāk.',
    metaDescription:
      'Aprēķini aptuvenu Latvijas 1. līmeņa pensiju priekšlaicīgas pensionēšanās gadījumā (63 vai 64 gadu vecumā), ar vismaz 30 gadu apdrošināšanas stāžu.',
    keywords: [
      'priekšlaicīga pensija',
      'priekšlaicīga pensionēšanās',
      'priekšlaicīgas pensijas kalkulators',
    ],
    contentUpdatedAt: '2026-09-11T22:31:49+03:00',
  },
  {
    slug: 'pensiju-3-limena-kalkulators',
    category: 'finanses',
    title: 'Pensiju 3. līmeņa kalkulators',
    h1: 'Cik daudz sakrāsi pensiju 3. līmenī',
    intro:
      'Ievadi ikmēneša iemaksu, ienesīgumu un termiņu, uzzini uzkrāto summu un IIN atmaksas apmēru.',
    metaDescription:
      'Aprēķini pensiju 3. līmeņa uzkrājumu un iedzīvotāju ienākuma nodokļa atmaksu par iemaksām, pēc reālajiem 2026. gada nosacījumiem.',
    keywords: [
      'pensiju 3. līmenis',
      'pensiju 3. līmeņa kalkulators',
      'pensiju 3 limenis nodoklu atmaksa',
    ],
    contentUpdatedAt: '2026-09-11T22:42:26+03:00',
  },
  {
    slug: 'ieguldijumu-konta-nodoklu-kalkulators',
    category: 'finanses',
    title: 'Ieguldījumu konta nodokļu kalkulators',
    h1: 'Cik izdevīgs ir ieguldījumu konts salīdzinājumā ar parastu kontu',
    intro:
      'Ievadi iemaksas, ienesīgumu un termiņu, uzzini nodokļa atlikšanas ietaupījumu ieguldījumu kontā.',
    metaDescription:
      'Aprēķini ieguldījumu konta nodokļa atlikšanas priekšrocību salīdzinājumā ar parastu kontu, pēc reālajiem IIN nosacījumiem.',
    keywords: [
      'ieguldījumu konts',
      'ieguldījumu konta nodokļi',
      'ieguldījumu konta kalkulators',
    ],
    contentUpdatedAt: '2026-09-11T23:30:07+03:00',
  },
  {
    slug: 'tumsas-kalkulators',
    category: 'sabiedriba',
    title: 'Tumsas kalkulators',
    h1: 'Cik daudz dienu no savas dzīves esi pavadījis tumsā',
    intro:
      'Ievadi savu dzimšanas datumu un uzzini, cik dienu no savas dzīves Rīgā esi pavadījis tumsā, rēķinot pēc reālā gaismas stundu garuma svārstībām gada laikā.',
    metaDescription:
      'Aprēķini, cik dienu no savas dzīves esi pavadījis tumsā, pēc Rīgas gaismas stundu svārstībām gada laikā, ar redzamu aprēķinu gaitu.',
    keywords: ['tumsas kalkulators', 'cik tumšs ir Rīgā', 'gaismas stundas Latvijā', 'dienas garums Rīgā'],
    // Still provisional: must be re-checked against the squash merge commit's own time
    // right before merging, per CLAUDE.md, "Sitemap dates".
    contentUpdatedAt: '2026-09-05T14:49:43+03:00',
  },
  {
    slug: 'kredita-kalkulators',
    category: 'finanses',
    title: 'Patēriņa kredīta kalkulators',
    h1: 'Cik maksās tavs kredīts?',
    intro: 'Ievadi kredīta summu, procentu likmi un termiņu, uzzini ikmēneša maksājumu un kopējās izmaksas.',
    metaDescription:
      'Aprēķini patēriņa kredīta ikmēneša maksājumu, kopējās izmaksas un pārmaksu pēc anuitātes formulas.',
    keywords: ['kredīta kalkulators', 'patēriņa kredīta kalkulators', 'aizdevuma maksājuma kalkulators'],
    contentUpdatedAt: '2026-09-11T13:03:37+03:00',
  },
  {
    slug: 'hipotekas-maksajums',
    category: 'finanses',
    title: 'Hipotēkas maksājuma kalkulators',
    h1: 'Cik maksās tava hipotēka?',
    intro: 'Ievadi hipotēkas summu, procentu likmi un termiņu, uzzini ikmēneša maksājumu un kopējās izmaksas.',
    metaDescription:
      'Aprēķini hipotēkas ikmēneša maksājumu, kopējās izmaksas un pārmaksu pēc anuitātes formulas.',
    keywords: ['hipotēkas kalkulators', 'hipotēkas maksājuma kalkulators', 'mājokļa kredīta kalkulators'],
    contentUpdatedAt: '2026-09-11T13:42:15+03:00',
  },
  {
    slug: 'hipotekas-parmaksa',
    category: 'finanses',
    title: 'Hipotēkas pārmaksas kalkulators',
    h1: 'Cik var ietaupīt, maksājot vairāk par grafiku?',
    intro: 'Ievadi hipotēkas nosacījumus un papildu ikmēneša maksājumu, uzzini ietaupītos procentus un ātrāku atmaksas laiku.',
    metaDescription:
      'Aprēķini, cik procentu un laika ietaupīsi, maksājot par hipotēku vairāk nekā paredzēts grafikā.',
    keywords: ['hipotēkas pārmaksas kalkulators', 'hipotēkas priekšlaicīga atmaksa', 'kredīta ietaupījuma kalkulators'],
    contentUpdatedAt: '2026-09-11T13:46:11+03:00',
  },
  {
    slug: 'pvn-kalkulators',
    category: 'finanses',
    title: 'PVN kalkulators',
    h1: 'Cik ir PVN summa?',
    intro: 'Ievadi summu un PVN likmi, pieskaiti vai izdali PVN.',
    metaDescription: 'Aprēķini PVN summu, pieskaitot vai izdalot pievienotās vērtības nodokli no jebkuras summas.',
    keywords: ['pvn kalkulators', 'pvn aprēķins', 'pievienotās vērtības nodokļa kalkulators'],
    contentUpdatedAt: '2026-09-11T13:49:37+03:00',
  },
  {
    slug: 'uzkrajumi',
    category: 'finanses',
    title: 'Uzkrājumu kalkulators',
    h1: 'Cik izaugs tavs uzkrājums?',
    intro: 'Ievadi sākuma summu, ikmēneša iemaksu un ienesīgumu, uzzini uzkrāto summu termiņa beigās.',
    metaDescription: 'Aprēķini uzkrājuma izaugsmi ar salikto procentu efektu no sākuma summas, ikmēneša iemaksām un ienesīguma.',
    keywords: ['uzkrājumu kalkulators', 'salikto procentu kalkulators', 'ieguldījumu izaugsmes kalkulators'],
    contentUpdatedAt: '2026-09-11T13:52:12+03:00',
  },
  {
    slug: 'inflacija',
    category: 'finanses',
    title: 'Inflācijas kalkulators',
    h1: 'Kā inflācija ietekmē tavu naudu?',
    intro: 'Ievadi summu, inflācijas likmi un gadu skaitu, uzzini nākotnes pirktspēju.',
    metaDescription: 'Aprēķini, kā inflācija ietekmē naudas pirktspēju laika gaitā pēc summas, likmes un gadu skaita.',
    keywords: ['inflācijas kalkulators', 'pirktspējas kalkulators', 'naudas vērtības kalkulators'],
    contentUpdatedAt: '2026-09-11T13:56:50+03:00',
  },
  {
    slug: 'atvalinajuma-nauda',
    category: 'finanses',
    title: 'Atvaļinājuma naudas kalkulators',
    h1: 'Cik liela būs tava atvaļinājuma nauda?',
    intro: 'Ievadi vidējo dienas izpeļņu un atvaļinājuma dienu skaitu, uzzini kopējo atvaļinājuma naudas summu.',
    metaDescription: 'Aprēķini atvaļinājuma naudu no vidējās dienas izpeļņas un atvaļinājuma dienu skaita.',
    keywords: ['atvaļinājuma naudas kalkulators', 'atvaļinājuma nauda', 'vidējā izpeļņa atvaļinājumam'],
    contentUpdatedAt: '2026-09-11T14:25:12+03:00',
  },
  {
    slug: 'mun-kalkulators',
    category: 'finanses',
    title: 'Mikrouzņēmuma nodokļa kalkulators',
    h1: 'Cik liels ir mikrouzņēmuma nodoklis?',
    intro: 'Ievadi apgrozījumu, uzzini mikrouzņēmuma nodokli un summu, kas paliek pēc nodokļa.',
    metaDescription: 'Aprēķini mikrouzņēmuma nodokli 25 procentu apmērā no apgrozījuma un summu, kas paliek pēc nodokļa nomaksas.',
    keywords: ['mikrouzņēmuma nodokļa kalkulators', 'mun kalkulators', 'mikrouzņēmuma nodoklis'],
    contentUpdatedAt: '2026-09-11T14:50:16+03:00',
  },
  {
    slug: 'slimibas-nauda',
    category: 'finanses',
    title: 'Slimības naudas kalkulators',
    h1: 'Cik lielu slimības naudu maksā darba devējs?',
    intro: 'Ievadi vidējo dienas izpeļņu un darbnespējas dienu skaitu, uzzini darba devēja apmaksāto slimības naudu.',
    metaDescription: 'Aprēķini slimības naudu, ko darba devējs maksā par darbnespējas 2. līdz 9. dienu, pēc likumā noteiktajām likmēm.',
    keywords: ['slimības naudas kalkulators', 'slimības nauda', 'darbnespējas lapa a apmaksa'],
    contentUpdatedAt: '2026-09-11T15:00:04+03:00',
  },
  {
    slug: 'alga-neto',
    category: 'finanses',
    title: 'Algas neto kalkulators',
    h1: 'Cik liela būs tava alga uz rokas?',
    intro: 'Ievadi bruto algu, uzzini algu uz rokas pēc VSAOI un IIN atskaitīšanas.',
    metaDescription: 'Aprēķini neto algu no bruto algas pēc VSAOI (10,5%) un progresīvās IIN likmes ar neapliekamo minimumu.',
    keywords: ['algas neto kalkulators', 'alga uz rokas', 'bruto neto kalkulators'],
    contentUpdatedAt: '2026-09-12T10:15:36+03:00',
  },
  {
    slug: 'alga-bruto',
    category: 'finanses',
    title: 'Algas bruto kalkulators',
    h1: 'Kāda bruto alga nepieciešama, lai saņemtu vēlamo summu uz rokas?',
    intro: 'Ievadi vēlamo algu uz rokas, uzzini nepieciešamo bruto algu pēc VSAOI un IIN.',
    metaDescription: 'Aprēķini nepieciešamo bruto algu, lai pēc VSAOI un IIN atskaitīšanas saņemtu vēlamo algu uz rokas.',
    keywords: ['algas bruto kalkulators', 'neto uz bruto', 'bruto algas kalkulators'],
    contentUpdatedAt: '2026-09-12T09:56:30+03:00',
  },
  {
    slug: 'ipasuma-nodoklis',
    category: 'finanses',
    title: 'Nekustamā īpašuma nodokļa kalkulators',
    h1: 'Cik liels ir nekustamā īpašuma nodoklis?',
    intro: 'Ievadi kadastrālo vērtību un pašvaldības noteikto likmi, uzzini gada un ceturkšņa nodokli.',
    metaDescription: 'Aprēķini nekustamā īpašuma nodokli no kadastrālās vērtības un pašvaldības nodokļa likmes.',
    keywords: ['nekustamā īpašuma nodokļa kalkulators', 'nīn kalkulators', 'īpašuma nodoklis'],
    contentUpdatedAt: '2026-09-11T15:11:08+03:00',
  },
  {
    slug: 'saimnieciska-darbiba',
    category: 'finanses',
    title: 'Saimnieciskās darbības nodokļu kalkulators',
    h1: 'Cik nodokļu jāmaksā no saimnieciskās darbības ienākuma?',
    intro: 'Ievadi mēneša apliekamo ienākumu, uzzini VSAOI un IIN summu un to, kas paliek pēc nodokļiem.',
    metaDescription: 'Aprēķini VSAOI un IIN no saimnieciskās darbības ienākuma vispārējā nodokļu režīmā.',
    keywords: ['saimnieciskās darbības nodokļi', 'pašnodarbinātā kalkulators', 'saimnieciskās darbības nodokļu kalkulators'],
    contentUpdatedAt: '2026-09-12T09:56:30+03:00',
  },
  {
    slug: 'iin-kalkulators',
    category: 'finanses',
    title: 'IIN no kapitāla ienākuma kalkulators',
    h1: 'Cik nodokļa jāmaksā no kapitāla ienākuma?',
    intro: 'Ievadi ienākumu no kapitāla (peļņu, dividendes vai procentus), uzzini IIN un summu, kas paliek pēc nodokļa.',
    metaDescription: 'Aprēķini iedzīvotāju ienākuma nodokli 25,5 procentu apmērā no kapitāla pieauguma, dividendēm vai procentu ienākumiem.',
    keywords: ['iin kalkulators', 'kapitāla pieauguma nodoklis', 'dividenžu nodokļa kalkulators'],
    contentUpdatedAt: '2026-09-11T16:08:26+03:00',
  },
  {
    slug: 'grutniecibas-termins',
    category: 'veseliba',
    title: 'Grūtniecības termiņa kalkulators',
    h1: 'Kāds ir paredzamais dzemdību termiņš?',
    intro: 'Ievadi pēdējo menstruāciju pirmo dienu, uzzini paredzamo dzemdību termiņu pēc Negēles likuma.',
    metaDescription:
      'Aprēķini paredzamo dzemdību termiņu un pašreizējo grūtniecības vecumu pēc Negēles likuma.',
    keywords: ['grūtniecības termiņa kalkulators', 'dzemdību termiņa kalkulators', 'negēles likums'],
    contentUpdatedAt: '2026-09-11T13:07:33+03:00',
  },
  {
    slug: 'ovulacija',
    category: 'veseliba',
    title: 'Ovulācijas kalkulators',
    h1: 'Kad ir tavs auglīgais periods?',
    intro: 'Ievadi pēdējo menstruāciju pirmo dienu un cikla garumu, uzzini paredzamo ovulācijas dienu un auglīgo periodu.',
    metaDescription:
      'Aprēķini paredzamo ovulācijas dienu un auglīgo periodu no pēdējo menstruāciju datuma un cikla garuma.',
    keywords: ['ovulācijas kalkulators', 'auglīgais periods', 'ovulācijas diena'],
    contentUpdatedAt: '2026-09-11T13:10:56+03:00',
  },
  {
    slug: 'promiles',
    category: 'veseliba',
    title: 'Promiļu kalkulators',
    h1: 'Kāds ir aptuvenais alkohola līmenis asinīs?',
    intro: 'Ievadi svaru, izdzerto daudzumu un pagājušo laiku, uzzini aptuveno alkohola līmeni asinīs pēc Vidmarka formulas.',
    metaDescription:
      'Aprēķini aptuveno alkohola līmeni asinīs (promiles) pēc Vidmarka formulas no svara, izdzertā daudzuma un laika.',
    keywords: ['promiļu kalkulators', 'alkohola līmenis asinīs', 'vidmarka formula'],
    contentUpdatedAt: '2026-09-11T13:14:28+03:00',
  },
];

/**
 * Informational articles (no calculator attached) — see PENSION-TOPICAL-AUTHORITY-PLAN.md.
 * Rendered through `app/[category]/[calculator]/page.tsx`'s article branch with
 * `ArticleShell`, body content from `lib/articleContent.tsx`, and the same
 * `content/faq/<slug>.md` convention calculators use.
 */
export const articles: ArticleMeta[] = [
  {
    slug: 'minimala-pensija',
    category: 'finanses',
    title: 'Minimālā pensija Latvijā',
    h1: 'Cik liela ir minimālā vecuma pensija Latvijā 2026. gadā',
    intro:
      'Uzzini, kāds ir minimālās vecuma pensijas apmērs 2026. gadā, kā to aprēķina un kam tā pienākas.',
    metaDescription:
      'Minimālās vecuma pensijas apmērs Latvijā 2026. gadā: aprēķina bāze, koeficients un summa pēc apdrošināšanas stāža, ar avotu VSAA.',
    keywords: ['minimālā pensija', 'minimālā vecuma pensija', 'minimālās pensijas apmērs 2026'],
    contentUpdatedAt: '2026-09-11T22:16:13+03:00',
  },
  {
    slug: 'priekslaicigas-vs-standarta-pensija',
    category: 'finanses',
    title: 'Priekšlaicīga vai standarta pensija',
    h1: 'Priekšlaicīga vai standarta pensija, kas izdevīgāk',
    intro:
      'Salīdzini priekšlaicīgas un standarta pensionēšanās mēneša summu un uzzini, kas jāņem vērā, izvēloties.',
    metaDescription:
      'Priekšlaicīgas un standarta pensijas salīdzinājums Latvijā: kāpēc priekšlaicīgā pensija ir mazāka, kam tā pieejama, un kā izvēlēties.',
    keywords: ['priekšlaicīga vai standarta pensija', 'pensijas izvēle', 'kad izdevīgāk pensionēties'],
    contentUpdatedAt: '2026-09-11T22:43:54+03:00',
  },
  {
    slug: 'pensija-latvija-celvedis',
    category: 'finanses',
    title: 'Pensija Latvijā: pilns ceļvedis',
    h1: 'Pensija Latvijā: pilns ceļvedis',
    intro:
      'Viss par pensiju Latvijā vienā vietā: 1., 2. un 3. līmenis, priekšlaicīga pensionēšanās un minimālā pensija.',
    metaDescription:
      'Pilns ceļvedis pensijai Latvijā: kā aprēķina 1. līmeņa pensiju, priekšlaicīgas pensionēšanās nosacījumi, 3. līmeņa uzkrājumi un minimālā pensija.',
    keywords: ['pensija latvijā', 'pensijas ceļvedis', 'viss par pensiju'],
    contentUpdatedAt: '2026-09-11T23:48:12+03:00',
  },
  {
    slug: 'izdienas-pensija',
    category: 'finanses',
    title: 'Izdienas pensija',
    h1: 'Kas ir izdienas pensija un kam tā pienākas',
    intro:
      'Uzzini, kurām profesijām Latvijā pienākas izdienas pensija un kā tā atšķiras no parastās vecuma pensijas.',
    metaDescription:
      'Izdienas pensija Latvijā: kurām profesijām tā pienākas (aviācija, dzelzceļš, jūrniecība, māksla), stāža nosacījumi un atšķirība no vecuma pensijas.',
    keywords: ['izdienas pensija', 'izdienas pensija latvijā', 'kam pienākas izdienas pensija'],
    contentUpdatedAt: '2026-09-11T23:37:03+03:00',
  },
  {
    slug: 'ka-izveleties-pensiju-3-limena-planu',
    category: 'finanses',
    title: 'Kā izvēlēties pensiju 3. līmeņa plānu',
    h1: 'Kā izvēlēties pensiju 3. līmeņa plānu',
    intro:
      'Uzzini, kā izvēlēties riska pakāpi, ko ņemt vērā par izmaksām, un vai vērts iemaksāt vairākos plānos.',
    metaDescription:
      'Kā izvēlēties pensiju 3. līmeņa plānu Latvijā: riska pakāpe pēc vecuma, izmaksas un plāna maiņa, pēc Latvijas Bankas skaidrojuma.',
    keywords: [
      'pensiju 3. līmeņa plāna izvēle',
      'kā izvēlēties pensiju plānu',
      'pensiju 3. līmenis riska pakāpe',
    ],
    contentUpdatedAt: '2026-09-11T23:42:00+03:00',
  },
  {
    slug: 'etf-pamati-pensijas-uzkrajumam',
    category: 'finanses',
    title: 'ETF pamati pensijas uzkrājumam',
    h1: 'Kas ir ETF un kāpēc tie noder ilgtermiņa uzkrājumam',
    intro:
      'Vienkāršs skaidrojums, kas ir ETF, kāpēc zemas izmaksas ir svarīgas, un kā tos apliek ar nodokli Latvijā.',
    metaDescription:
      'ETF pamati ilgtermiņa uzkrājumam Latvijā: kas ir ETF, izmaksu nozīme, diversifikācija un nodokļu piemērošana.',
    keywords: ['kas ir etf', 'etf pamati', 'etf pensijas uzkrājumam'],
    contentUpdatedAt: '2026-09-11T23:45:48+03:00',
  },
];

/**
 * Slugs that ship a bespoke `app/<category>/<slug>/page.tsx` instead of going through
 * the generic `CalculatorShell` + `app/[category]/[calculator]/page.tsx` route. These
 * calculators still live in the registry above (for the category listing, homepage
 * count, related-calculators, and sitemap), but generateStaticParams for the generic
 * dynamic route excludes them, and the registry-integrity tests that assume the
 * generic shell (a mapped UI component, an explanations entry) skip them too.
 */
export const CUSTOM_ROUTED_SLUGS = new Set<string>([
  'dzimstibas-kalkulators',
  'pensijas-kalkulators',
  'priekslaicigas-pensijas-kalkulators',
  'tumsas-kalkulators',
]);

export function getCategory(slug: string): CategoryMeta | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getCalculatorsByCategory(categorySlug: string): CalculatorMeta[] {
  return calculators.filter((calculator) => calculator.category === categorySlug);
}

export function getArticlesByCategory(categorySlug: string): ArticleMeta[] {
  return articles.filter((article) => article.category === categorySlug);
}

/** Calculators and articles share one URL namespace (`/<category>/<slug>`), so category
 * pages, the homepage count, and the sitemap all need both combined. */
export function getContentByCategory(categorySlug: string): CalculatorMeta[] {
  return [...getCalculatorsByCategory(categorySlug), ...getArticlesByCategory(categorySlug)];
}

export function getCalculator(categorySlug: string, calculatorSlug: string): CalculatorMeta | undefined {
  return calculators.find(
    (calculator) => calculator.category === categorySlug && calculator.slug === calculatorSlug,
  );
}

export function getArticle(categorySlug: string, articleSlug: string): ArticleMeta | undefined {
  return articles.find((article) => article.category === categorySlug && article.slug === articleSlug);
}

/** Looks up a slug across both calculators and articles — the shared lookup the generic
 * `[calculator]` route uses before branching on which shell to render. */
export function getContent(categorySlug: string, slug: string): CalculatorMeta | undefined {
  return getCalculator(categorySlug, slug) ?? getArticle(categorySlug, slug);
}

export function isArticleSlug(categorySlug: string, slug: string): boolean {
  return getArticle(categorySlug, slug) !== undefined;
}

/**
 * Per category, the slug of a "hub" guide article that ties together several
 * calculators/articles on one topic (see e.g. lib/articleContent.tsx's
 * 'pensija-latvija-celvedis'). getRelatedCalculators always surfaces the hub first on
 * every other item in that category, since a hub is more useful to route a reader to
 * than another same-category item picked by keyword overlap alone, and it also fixes
 * an otherwise-real internal-linking gap: a hub added purely as one more `articles`
 * entry never naturally rises to the top of the default ordering below.
 */
const CATEGORY_HUB_SLUGS: Partial<Record<CategorySlug, string>> = {
  finanses: 'pensija-latvija-celvedis',
};

/**
 * Hand-curated stronger relations, layered on top of the default same-category
 * ordering below. Same-category membership alone is too coarse a signal on a site
 * this size: two items can share a category (e.g. "majoklis" has 20+ calculators
 * spanning insulation, flooring, and staircases) without being genuinely related, and
 * keyword-overlap scoring does not work either, since these titles/keywords are short,
 * domain-specific phrases with almost no shared vocabulary even between calculators
 * that clearly belong together (e.g. "siltinājuma biezums" and "ventilācijas apjoms"
 * share no words, but both come from LBN building codes and are genuinely related).
 * Add a pair only where the relation would help a reader, and add both directions
 * explicitly, since this map is not auto-mirrored.
 */
const RELATED_OVERRIDES: Record<string, string[]> = {
  // LBN building-code cluster (majoklis): room/opening dimension compliance checks.
  'griestu-augstuma-kalkulators': [
    'logu-platibas-kalkulators',
    'ventilacijas-apjoma-kalkulators',
    'siltinajuma-biezuma-kalkulators',
  ],
  'logu-platibas-kalkulators': ['griestu-augstuma-kalkulators', 'ventilacijas-apjoma-kalkulators'],
  'ventilacijas-apjoma-kalkulators': ['griestu-augstuma-kalkulators', 'logu-platibas-kalkulators'],
  'siltinajuma-biezuma-kalkulators': ['griestu-augstuma-kalkulators', 'siltumsukna-atmaksa'],

  // Heating/energy alternatives (majoklis): different ways to heat or power a home.
  'apkures-izmaksas': ['siltumsukna-atmaksa', 'elektribas-rekins', 'malkas-apjoms'],
  'siltumsukna-atmaksa': ['apkures-izmaksas', 'solaru-atmaksa', 'siltinajuma-biezuma-kalkulators'],
  'solaru-atmaksa': ['siltumsukna-atmaksa', 'elektribas-rekins'],
  'elektribas-rekins': ['apkures-izmaksas', 'solaru-atmaksa'],

  // Income structuring alternatives (finanses): different ways to earn/declare income.
  'alga-neto': ['alga-bruto', 'iin-kalkulators', 'saimnieciska-darbiba'],
  'alga-bruto': ['alga-neto', 'saimnieciska-darbiba'],
  'saimnieciska-darbiba': ['mun-kalkulators', 'alga-neto', 'iin-kalkulators'],
  'mun-kalkulators': ['saimnieciska-darbiba', 'iin-kalkulators'],
  'iin-kalkulators': ['alga-neto', 'saimnieciska-darbiba'],

  // Borrowing alternatives (finanses): loan-shaped comparisons.
  'kredita-kalkulators': ['hipotekas-maksajums', 'hipotekas-parmaksa'],
  'hipotekas-maksajums': ['hipotekas-parmaksa', 'kredita-kalkulators'],
  'hipotekas-parmaksa': ['hipotekas-maksajums', 'kredita-kalkulators'],
};

export function getRelatedCalculators(current: CalculatorMeta, limit = 4): CalculatorMeta[] {
  const pool = [...calculators, ...articles].filter(
    (item) => item.category === current.category && item.slug !== current.slug,
  );
  const poolBySlug = new Map(pool.map((item) => [item.slug, item]));

  const ranked: CalculatorMeta[] = [];
  const seen = new Set<string>();

  const add = (item: CalculatorMeta | undefined) => {
    if (!item || seen.has(item.slug)) return;
    seen.add(item.slug);
    ranked.push(item);
  };

  const hubSlug = CATEGORY_HUB_SLUGS[current.category];
  if (hubSlug && hubSlug !== current.slug) {
    add(poolBySlug.get(hubSlug));
  }

  for (const slug of RELATED_OVERRIDES[current.slug] ?? []) {
    add(poolBySlug.get(slug));
  }

  for (const item of pool) {
    add(item);
  }

  return ranked.slice(0, limit);
}
