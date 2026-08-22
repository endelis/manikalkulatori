import type { MetadataRoute } from 'next';
import { calculators, categories } from '@/lib/registry';

const BASE_URL = 'https://manikalkulatori.lv';

export default function sitemap(): MetadataRoute.Sitemap {
  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: BASE_URL,
    changeFrequency: 'weekly',
    priority: 1,
  };

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/${category.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const calculatorEntries: MetadataRoute.Sitemap = calculators.map((calculator) => ({
    url: `${BASE_URL}/${calculator.category}/${calculator.slug}`,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [homeEntry, ...categoryEntries, ...calculatorEntries];
}
