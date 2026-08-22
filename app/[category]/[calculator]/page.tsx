import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { calculators, getCalculator, getCategory, getRelatedCalculators } from '@/lib/registry';
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
  return calculators.map((calculator) => ({
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
