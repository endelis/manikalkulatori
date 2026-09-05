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

export const categories: CategoryMeta[] = [
  {
    slug: 'auto',
    title: 'Auto un transports',
    description: 'Kalkulatori auto izmaksām, apdrošināšanai un līzingam.',
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
    keywords: ['KASKO kalkulators', 'KASKO cena', 'auto apdrošināšana'],
    contentUpdatedAt: '2026-08-22T20:18:36+03:00',
  },
  {
    slug: 'octa-kalkulators',
    category: 'auto',
    title: 'OCTA cenu salīdzinājums',
    h1: 'Kurš OCTA piedāvājums ir lētākais?',
    intro: 'Ievadi līdz trim saņemtajiem OCTA piedāvājumiem, uzzini lētāko un starpību pret dārgāko.',
    metaDescription: 'Salīdzini vairākus OCTA apdrošināšanas piedāvājumus un atrodi lētāko variantu.',
    keywords: ['OCTA kalkulators', 'OCTA cenas salīdzinājums', 'obligātā apdrošināšana'],
    contentUpdatedAt: '2026-08-22T20:18:36+03:00',
  },
  {
    slug: 'lizings-vs-kredits',
    category: 'auto',
    title: 'Līzings vs kredīts auto',
    h1: 'Līzings vai kredīts, kas izmaksā lētāk mēnesī?',
    intro: 'Ievadi auto cenu un savu piedāvājumu, salīdzini kredīta un līzinga mēneša maksājumu.',
    metaDescription:
      'Salīdzini auto kredīta un līzinga mēneša maksājumu pēc auto cenas, pirmās iemaksas, termiņa un likmēm.',
    keywords: ['līzings vs kredīts', 'auto līzings kalkulators', 'auto kredīts kalkulators'],
    contentUpdatedAt: '2026-08-22T20:18:36+03:00',
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
    keywords: ['elektroauto uzlādes izmaksas', 'uzlādes cena mājās', 'publiskā lādēšana cena'],
    contentUpdatedAt: '2026-08-22T20:26:27+03:00',
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
    keywords: ['riepu izmēra kalkulators', 'spidometra kļūda', 'riepu diametrs'],
    contentUpdatedAt: '2026-08-22T20:26:27+03:00',
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
    contentUpdatedAt: '2026-08-22T20:51:18+03:00',
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
    contentUpdatedAt: '2026-09-05T16:09:58+03:00',
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
    contentUpdatedAt: '2026-09-05T16:55:56+03:00',
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
    contentUpdatedAt: '2026-09-05T16:55:56+03:00',
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
    contentUpdatedAt: '2026-09-05T20:04:57+03:00',
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
    contentUpdatedAt: '2026-09-05T20:21:35+03:00',
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
    contentUpdatedAt: '2026-09-05T21:36:08+03:00',
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
    contentUpdatedAt: '2026-09-05T21:45:44+03:00',
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
    contentUpdatedAt: '2026-09-05T22:20:00+03:00',
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
    keywords: ['pensijas kalkulators', 'mana pensija', 'kā aprēķina pensiju Latvijā', 'koeficients G'],
    contentUpdatedAt: '2026-09-04T20:40:47+03:00',
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
  'tumsas-kalkulators',
]);

export function getCategory(slug: string): CategoryMeta | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getCalculatorsByCategory(categorySlug: string): CalculatorMeta[] {
  return calculators.filter((calculator) => calculator.category === categorySlug);
}

export function getCalculator(categorySlug: string, calculatorSlug: string): CalculatorMeta | undefined {
  return calculators.find(
    (calculator) => calculator.category === categorySlug && calculator.slug === calculatorSlug,
  );
}

export function getRelatedCalculators(current: CalculatorMeta, limit = 4): CalculatorMeta[] {
  return calculators
    .filter((calculator) => calculator.category === current.category && calculator.slug !== current.slug)
    .slice(0, limit);
}
