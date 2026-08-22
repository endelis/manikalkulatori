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
