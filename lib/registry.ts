export type CategorySlug = 'auto' | 'finanses' | 'majoklis' | 'veseliba' | 'sports';

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
  },
  {
    slug: 'octa-kalkulators',
    category: 'auto',
    title: 'OCTA cenu salīdzinājums',
    h1: 'Kurš OCTA piedāvājums ir lētākais?',
    intro: 'Ievadi līdz trim saņemtajiem OCTA piedāvājumiem, uzzini lētāko un starpību pret dārgāko.',
    metaDescription: 'Salīdzini vairākus OCTA apdrošināšanas piedāvājumus un atrodi lētāko variantu.',
    keywords: ['OCTA kalkulators', 'OCTA cenas salīdzinājums', 'obligātā apdrošināšana'],
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
  },
  {
    slug: 'solaru-atmaksa',
    category: 'majoklis',
    title: 'Solāro paneļu atmaksa',
    h1: 'Cik gados atmaksājas solārie paneļi?',
    intro: 'Ievadi sistēmas izmaksas, jaudu un paredzamo patēriņu, uzzini atmaksāšanās laiku gados.',
    metaDescription: 'Aprēķini solāro paneļu sistēmas atmaksāšanās laiku pēc uzstādīšanas izmaksām, jaudas un pašpatēriņa.',
    keywords: ['solāro paneļu atmaksa', 'saules paneļu kalkulators', 'saules enerģijas atmaksāšanās'],
  },
  {
    slug: 'siltumsukna-atmaksa',
    category: 'majoklis',
    title: 'Siltumsūkņa atmaksa',
    h1: 'Cik gados atmaksājas siltumsūknis?',
    intro: 'Ievadi siltumsūkņa izmaksas, mājas siltumenerģijas patēriņu un vecās apkures cenu, uzzini atmaksāšanās laiku.',
    metaDescription: 'Aprēķini siltumsūkņa atmaksāšanās laiku, salīdzinot ar vecās apkures sistēmas izmaksām.',
    keywords: ['siltumsūkņa atmaksa', 'siltumsūkņa kalkulators', 'apkures izmaksu salīdzinājums'],
  },
  {
    slug: 'elektribas-rekins',
    category: 'majoklis',
    title: 'Elektrības rēķina kalkulators',
    h1: 'Cik liels būs elektrības rēķins?',
    intro: 'Ievadi mēneša patēriņu, elektrības cenu un fiksēto maksu, uzzini rēķinu mēnesī un gadā.',
    metaDescription: 'Aprēķini mājsaimniecības elektrības rēķinu mēnesī un gadā pēc patēriņa, cenas un fiksētās maksas.',
    keywords: ['elektrības rēķina kalkulators', 'elektrības cena', 'mājsaimniecības elektrības izmaksas'],
  },
  {
    slug: 'apkures-izmaksas',
    category: 'majoklis',
    title: 'Apkures izmaksu salīdzinājums',
    h1: 'Kurš apkures veids izmaksā lētāk?',
    intro: 'Ievadi mājas siltumenerģijas patēriņu un cenu par kWh katram apkures veidam, salīdzini gada izmaksas.',
    metaDescription: 'Salīdzini gāzes, malkas un siltumsūkņa apkures gada izmaksas pēc mājas siltumenerģijas patēriņa.',
    keywords: ['apkures izmaksu salīdzinājums', 'apkures veidu salīdzinājums', 'lētākā apkure'],
  },
];

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
