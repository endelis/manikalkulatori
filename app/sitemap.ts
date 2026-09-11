import type { MetadataRoute } from 'next';
import { calculators, categories, getCalculatorsByCategory } from '@/lib/registry';
import { SITE_URL } from '@/lib/site';
import { NOVADS_PILOT_AREAS } from '@/lib/novads-pilot-data';

// Hand maintained: bump a page's timestamp here only when its rendered content
// actually changes, to the real commit time (git log -1 --format=%cI -- <page file>),
// not now. Full ISO 8601 with a timezone offset, same format and same reasoning as
// contentUpdatedAt in lib/registry.ts: a bare date cannot represent a second same-day
// change, see lib/calculatorContentDrift.test.ts and lib/registry.test.ts.
const LEGAL_PAGE_UPDATED_AT: Record<string, string> = {
  '/par-mums': '2026-08-22T17:05:41+03:00',
  '/kontakti': '2026-08-22T17:05:41+03:00',
  '/privatuma-politika': '2026-09-03T18:48:53+03:00',
  '/noteikumi': '2026-08-22T17:05:41+03:00',
};

// Content pages driven by sourced data rather than the calculator registry, but still
// indexable. Bump the timestamp only when the page's rendered figures or copy change.
const INFO_PAGE_UPDATED_AT: Record<string, string> = {
  '/sabiedriba/iedzivotaju-skaits-latvija': '2026-09-04T13:22:48+03:00',
};

// Novads pilot pages (three only, see lib/novads-pilot-data.ts). Each entry's timestamp
// is bumped to that page's own real commit time once committed, matching the pattern
// above.
const NOVADS_PILOT_UPDATED_AT: Record<string, string> = Object.fromEntries(
  NOVADS_PILOT_AREAS.map((area) => [`/sabiedriba/iedzivotaju-skaits/${area.slug}`, '2026-09-04T13:22:48+03:00']),
);

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

  const novadsPilotEntries: MetadataRoute.Sitemap = Object.entries(NOVADS_PILOT_UPDATED_AT).map(
    ([path, updatedAt]) => ({
      url: `${SITE_URL}${path}`,
      lastModified: updatedAt,
      changeFrequency: 'monthly',
      priority: 0.5,
    }),
  );

  return [
    homeEntry,
    ...categoryEntries,
    ...calculatorEntries,
    ...legalEntries,
    ...infoEntries,
    ...novadsPilotEntries,
  ];
}
