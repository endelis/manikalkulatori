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

// Content pages driven by sourced data rather than the calculator registry, but still
// indexable. Bump the date only when the page's rendered figures or copy change.
const INFO_PAGE_UPDATED_AT: Record<string, string> = {
  '/sabiedriba/iedzivotaju-skaits-latvija': '2026-09-03',
};

// Calculator contentUpdatedAt values are full ISO 8601 timestamps with a timezone
// offset; comparing them as actual instants (not string order) keeps this correct even
// if entries ever carry differing offsets.
function latest(timestamps: string[]): string {
  return timestamps.reduce((max, timestamp) => (new Date(timestamp) > new Date(max) ? timestamp : max));
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

  const infoEntries: MetadataRoute.Sitemap = Object.entries(INFO_PAGE_UPDATED_AT).map(([path, updatedAt]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [homeEntry, ...categoryEntries, ...calculatorEntries, ...legalEntries, ...infoEntries];
}
