import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';

// Same guard as lib/registry.test.ts's contentUpdatedAt check, applied to every
// lastModified value the sitemap actually emits (calculator entries plus the static
// legal/info page maps in sitemap.ts), so a bare date cannot creep back into any of
// them and reintroduce the same-day deadlock lib/calculatorContentDrift.test.ts exists
// to catch.
const FULL_ISO_8601_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;

describe('sitemap', () => {
  it('emits a full ISO 8601 timestamp with a timezone offset for every URL, not a bare date', () => {
    const entries = sitemap();
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      const lastModified = String(entry.lastModified);
      expect(
        FULL_ISO_8601_WITH_OFFSET.test(lastModified),
        `${entry.url}: lastModified "${lastModified}" is not a full ISO 8601 timestamp with a timezone offset`,
      ).toBe(true);
    }
  });
});
