import type { MetadataRoute } from 'next';
import { calculators, categories, getCalculatorsByCategory } from '@/lib/registry';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1,
  };

  // Categories with no calculators yet are real pages but have nothing to index —
  // keep them out of the sitemap until they hold at least one calculator.
  const categoryEntries: MetadataRoute.Sitemap = categories
    .filter((category) => getCalculatorsByCategory(category.slug).length > 0)
    .map((category) => ({
      url: `${SITE_URL}/${category.slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  const calculatorEntries: MetadataRoute.Sitemap = calculators.map((calculator) => ({
    url: `${SITE_URL}/${calculator.category}/${calculator.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // Static legal/info pages — indexable, so they belong in the sitemap even though they
  // are not driven by the calculator registry.
  const legalEntries: MetadataRoute.Sitemap = [
    '/par-mums',
    '/kontakti',
    '/privatuma-politika',
    '/noteikumi',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  return [homeEntry, ...categoryEntries, ...calculatorEntries, ...legalEntries];
}
