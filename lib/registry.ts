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
  /** ISO date (YYYY-MM-DD) of the last change to this calculator's rendered numbers or copy. Bump by hand, never auto-generate. */
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
    contentUpdatedAt: '2026-08-22',
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
    contentUpdatedAt: '2026-08-22',
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
    contentUpdatedAt: '2026-08-22',
  },
  {
    slug: 'octa-kalkulators',
    category: 'auto',
    title: 'OCTA cenu salīdzinājums',
    h1: 'Kurš OCTA piedāvājums ir lētākais?',
    intro: 'Ievadi līdz trim saņemtajiem OCTA piedāvājumiem, uzzini lētāko un starpību pret dārgāko.',
    metaDescription: 'Salīdzini vairākus OCTA apdrošināšanas piedāvājumus un atrodi lētāko variantu.',
    keywords: ['OCTA kalkulators', 'OCTA cenas salīdzinājums', 'obligātā apdrošināšana'],
    contentUpdatedAt: '2026-08-22',
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
    contentUpdatedAt: '2026-08-22',
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
    contentUpdatedAt: '2026-08-22',
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
    contentUpdatedAt: '2026-08-22',
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
    contentUpdatedAt: '2026-08-22',
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
    contentUpdatedAt: '2026-08-22',
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
    contentUpdatedAt: '2026-08-22',
  },
  {
    slug: 'solaru-atmaksa',
    category: 'majoklis',
    title: 'Solāro paneļu atmaksa',
    h1: 'Cik gados atmaksājas solārie paneļi?',
    intro: 'Ievadi sistēmas izmaksas, jaudu un paredzamo patēriņu, uzzini atmaksāšanās laiku gados.',
    metaDescription: 'Aprēķini solāro paneļu sistēmas atmaksāšanās laiku pēc uzstādīšanas izmaksām, jaudas un pašpatēriņa.',
    keywords: ['solāro paneļu atmaksa', 'saules paneļu kalkulators', 'saules enerģijas atmaksāšanās'],
    contentUpdatedAt: '2026-08-22',
  },
  {
    slug: 'siltumsukna-atmaksa',
    category: 'majoklis',
    title: 'Siltumsūkņa atmaksa',
    h1: 'Cik gados atmaksājas siltumsūknis?',
    intro: 'Ievadi siltumsūkņa izmaksas, mājas siltumenerģijas patēriņu un vecās apkures cenu, uzzini atmaksāšanās laiku.',
    metaDescription: 'Aprēķini siltumsūkņa atmaksāšanās laiku, salīdzinot ar vecās apkures sistēmas izmaksām.',
    keywords: ['siltumsūkņa atmaksa', 'siltumsūkņa kalkulators', 'apkures izmaksu salīdzinājums'],
    contentUpdatedAt: '2026-08-22',
  },
  {
    slug: 'elektribas-rekins',
    category: 'majoklis',
    title: 'Elektrības rēķina kalkulators',
    h1: 'Cik liels būs elektrības rēķins?',
    intro: 'Ievadi mēneša patēriņu, elektrības cenu un fiksēto maksu, uzzini rēķinu mēnesī un gadā.',
    metaDescription: 'Aprēķini mājsaimniecības elektrības rēķinu mēnesī un gadā pēc patēriņa, cenas un fiksētās maksas.',
    keywords: ['elektrības rēķina kalkulators', 'elektrības cena', 'mājsaimniecības elektrības izmaksas'],
    contentUpdatedAt: '2026-08-22',
  },
  {
    slug: 'apkures-izmaksas',
    category: 'majoklis',
    title: 'Apkures izmaksu salīdzinājums',
    h1: 'Kurš apkures veids izmaksā lētāk?',
    intro: 'Ievadi mājas siltumenerģijas patēriņu un cenu par kWh katram apkures veidam, salīdzini gada izmaksas.',
    metaDescription: 'Salīdzini gāzes, malkas un siltumsūkņa apkures gada izmaksas pēc mājas siltumenerģijas patēriņa.',
    keywords: ['apkures izmaksu salīdzinājums', 'apkures veidu salīdzinājums', 'lētākā apkure'],
    contentUpdatedAt: '2026-08-22',
  },
  {
    slug: 'malkas-apjoms',
    category: 'majoklis',
    title: 'Malkas apjoma kalkulators',
    h1: 'Cik ciešas malkas ir sakrautajā grēdā?',
    intro: 'Ievadi grēdas garumu, platumu un augstumu, uzzini sakrautā apjoma un cietās koksnes apjomu.',
    metaDescription: 'Aprēķini malkas grēdas apjomu steros un cietās koksnes kubikmetros pēc grēdas izmēriem.',
    keywords: ['malkas apjoma kalkulators', 'malkas ster', 'malkas kubikmetri'],
    contentUpdatedAt: '2026-08-22',
  },
  {
    slug: 'krasas-daudzums',
    category: 'majoklis',
    title: 'Krāsas daudzuma kalkulators',
    h1: 'Cik daudz krāsas nepieciešams?',
    intro: 'Ievadi krāsojamo platību, krāsas patēriņu un kārtu skaitu, uzzini nepieciešamo krāsas daudzumu litros.',
    metaDescription: 'Aprēķini nepieciešamo krāsas daudzumu litros pēc krāsojamās platības, patēriņa un kārtu skaita.',
    keywords: ['krāsas daudzuma kalkulators', 'krāsas patēriņš', 'cik krāsas vajag'],
    contentUpdatedAt: '2026-08-22',
  },
  {
    slug: 'flizu-daudzums',
    category: 'majoklis',
    title: 'Flīžu daudzuma kalkulators',
    h1: 'Cik flīžu nepieciešams?',
    intro: 'Ievadi klājamo platību, flīzes izmēru un rezerves procentu, uzzini nepieciešamo flīžu skaitu.',
    metaDescription: 'Aprēķini nepieciešamo flīžu skaitu pēc klājamās platības, flīzes izmēra un rezerves procenta.',
    keywords: ['flīžu daudzuma kalkulators', 'flīžu skaits', 'cik flīžu vajag'],
    contentUpdatedAt: '2026-08-22',
  },
  {
    slug: 'betona-apjoms',
    category: 'majoklis',
    title: 'Betona apjoma kalkulators',
    h1: 'Cik daudz betona nepieciešams?',
    intro: 'Ievadi betonējamā laukuma izmērus un biezumu, uzzini nepieciešamo betona apjomu un maisu skaitu.',
    metaDescription: 'Aprēķini nepieciešamo betona apjomu kubikmetros un maisu skaitu pēc laukuma izmēriem un biezuma.',
    keywords: ['betona apjoma kalkulators', 'betona daudzums', 'betona maisu skaits'],
    contentUpdatedAt: '2026-08-22',
  },
  {
    slug: 'skriesanas-temps',
    category: 'sports',
    title: 'Skriešanas tempa kalkulators',
    h1: 'Kāds ir tavs skriešanas temps?',
    intro: 'Ievadi distanci un laiku, uzzini tempu uz kilometru un vidējo ātrumu.',
    metaDescription: 'Aprēķini skriešanas tempu uz kilometru un vidējo ātrumu no distances un laika.',
    keywords: ['skriešanas tempa kalkulators', 'skriešanas temps', 'skriešanas ātrums'],
    contentUpdatedAt: '2026-08-22',
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
    contentUpdatedAt: '2026-08-22',
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
    contentUpdatedAt: '2026-08-22',
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
    contentUpdatedAt: '2026-08-22',
  },
  {
    slug: 'dzimstibas-kalkulators',
    category: 'sabiedriba',
    title: 'Dzimstības kalkulators',
    h1: 'Cik bērniem Latvijā jāpiedzimst, lai iedzīvotāju skaits vairs nesarūk',
    intro:
      'Ievadi savus pieņēmumus par mirušajiem, migrāciju un iedzīvotāju skaitu, uzzini, cik bērniem jāpiedzimst, lai sasniegtu izvēlēto mērķi.',
    metaDescription:
      'Aprēķini, cik bērniem gadā jāpiedzimst Latvijā, lai iedzīvotāju skaits stabilizētos vai sasniegtu izvēlētu mērķi, pēc oficiāliem CSP datiem.',
    keywords: ['dzimstības kalkulators', 'cik bērniem jāpiedzimst Latvijā', 'Latvijas iedzīvotāju skaits'],
    contentUpdatedAt: '2026-09-03',
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
export const CUSTOM_ROUTED_SLUGS = new Set<string>(['dzimstibas-kalkulators']);

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
