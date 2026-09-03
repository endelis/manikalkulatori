import type { MetadataRoute } from 'next';
import { calculators, categories, getCalculatorsByCategory } from '@/lib/registry';
import { SITE_URL } from '@/lib/site';

// Hand maintained: bump a page's date here only when its rendered content actually changes.
const LEGAL_PAGE_UPDATED_AT: Record<string, string> = {
  '/par-mums': '2026-08-22',
  '/kontakti': '2026-08-22',
  '/privatuma-politika': '2026-09-03',
  '/noteikumi': '2026-08-22',
};

function latest(dates: string[]): string {
  return dates.reduce((max, date) => (date > max ? date : max));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified: latest(calculators.map((calculator) => calculator.contentUpdatedAt)),
    changeFrequency: 'weekly',
    priority: 1,
  };

  // Categories with no calculators yet are real pages but have nothing to index —
  // keep them out of the sitemap until they hold at least one calculator.
  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter((category) => getCalculatorsByCategory(category.slug).length > 0)
    .map((category) => ({
      url: `${SITE_URL}/${category.slug}`,
      lastModified: latest(getCalculatorsByCategory(category.slug).map((c) => c.contentUpdatedAt)),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  const calculatorEntries: MetadataRoute.Sitemap = calculators.map((calculator) => ({
    url: `${SITE_URL}/${calculator.category}/${calculator.slug}`,
    lastModified: calculator.contentUpdatedAt,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // Static legal/info pages — indexable, so they belong in the sitemap even though they
  // are not driven by the calculator registry.
  const legalEntries: MetadataRoute.Sitemap = Object.entries(LEGAL_PAGE_UPDATED_AT).map(([path, updatedAt]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: updatedAt,
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  return [homeEntry, ...categoryEntries, ...calculatorEntries, ...legalEntries];
}
