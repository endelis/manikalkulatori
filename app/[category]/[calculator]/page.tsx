import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { calculators, getCalculator, getCategory, getRelatedCalculators } from '@/lib/registry';
import { loadFaq } from '@/lib/faq';
import { buildBreadcrumbSchema, buildFaqSchema, buildSoftwareApplicationSchema } from '@/lib/schema';
import { CalculatorShell } from '@/components/CalculatorShell';
import { getCalculatorComponent } from '@/components/calculators/registry';

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
  };
}

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

  const url = `https://manikalkulatori.lv/${category.slug}/${calculator.slug}`;

  const softwareSchema = buildSoftwareApplicationSchema({
    name: calculator.title,
    description: calculator.metaDescription,
    url,
    category: 'FinanceApplication',
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Sākums', url: 'https://manikalkulatori.lv' },
    { name: category.title, url: `https://manikalkulatori.lv/${category.slug}` },
    { name: calculator.title, url },
  ]);

  const faqSchema = buildFaqSchema(faq);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <CalculatorShell category={category} calculator={calculator} faq={faq} related={related}>
        <CalculatorComponent />
      </CalculatorShell>
    </>
  );
}
