import { describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { CUSTOM_ROUTED_SLUGS, calculators, type CalculatorMeta } from './registry';

/**
 * contentUpdatedAt is hand maintained (see lib/registry.ts), not derived from git or
 * build time, so it can silently go stale. This test catches that by comparing, per
 * calculator, the exact commit time its compute/UI files last changed against
 * contentUpdatedAt's own value.
 *
 * contentUpdatedAt is a full ISO 8601 timestamp with a timezone offset, precise enough
 * to compare directly: no git blame lookup is needed to find "when was this field last
 * set" the way an earlier version of this test did, because the value itself now
 * carries that information. A bare date could not do this: if content changed a second
 * time on the same day, the correct value of the field would be unchanged, so there
 * would be no diff, so no commit, so a blame based check could never be satisfied even
 * when the field is genuinely accurate. That happened for real: dzimstibas-kalkulators'
 * date read "2026-09-03" both before and after PR #13 changed its visible copy on that
 * same day, and a blame based version of this test could not tell the two states apart.
 *
 * Timestamps are compared as actual instants (Date.getTime()), not string order, so
 * differing timezone offsets can never sort incorrectly.
 *
 * A squash merge changes this test's answer for every file the PR touched: `git log -1
 * --format=%cI -- <file>` on the base branch reports the squash commit's own time for
 * all of them, not each file's real commit time on the feature branch. contentUpdatedAt
 * set to the feature-branch commit time (correct there) goes stale the moment the PR is
 * squash merged. This happened for real: PR #19's contentUpdatedAt values were set from
 * the feature branch and had to be re-bumped to the squash commit's time (see PR
 * fix/contentupdatedat-post-squash) once this test was run against master. When setting
 * contentUpdatedAt right after a squash merge, use the squash commit's own time, not the
 * feature branch commit's.
 */

function lastCommitTimestamp(filePath: string): string | null {
  try {
    const timestamp = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      cwd: process.cwd(),
      encoding: 'utf-8',
    }).trim();
    return timestamp.length > 0 ? timestamp : null;
  } catch {
    return null;
  }
}

function componentFileForSlug(slug: string): string | null {
  const registrySource = fs.readFileSync(
    path.join(process.cwd(), 'components', 'calculators', 'registry.tsx'),
    'utf-8',
  );
  const mapMatch = registrySource.match(new RegExp(`'${slug}':\\s*(\\w+),`));
  if (!mapMatch) return null;
  const componentName = mapMatch[1];
  const importMatch = registrySource.match(
    new RegExp(`import \\{ ${componentName} \\} from '\\./(\\w+)'`),
  );
  return importMatch ? `components/calculators/${importMatch[1]}.tsx` : null;
}

// Calculators with a bespoke page (see CUSTOM_ROUTED_SLUGS in lib/registry.ts) are not
// wired into components/calculators/registry.tsx, so their UI files for drift purposes
// are their own route file, plus any bespoke interactive component they render. There is
// no registry to derive the latter from, so it is listed here explicitly per slug.
const CUSTOM_ROUTED_EXTRA_UI_FILES: Record<string, string[]> = {
  'dzimstibas-kalkulators': [
    'components/calculators/DzimstibasKalkulators.tsx',
    'components/BirthsDeathsChart.tsx',
    'components/BirthsDeathsTable.tsx',
  ],
};

function uiFilesForSlug(calc: CalculatorMeta): string[] {
  if (CUSTOM_ROUTED_SLUGS.has(calc.slug)) {
    return [`app/${calc.category}/${calc.slug}/page.tsx`, ...(CUSTOM_ROUTED_EXTRA_UI_FILES[calc.slug] ?? [])];
  }
  const componentFile = componentFileForSlug(calc.slug);
  return componentFile ? [componentFile] : [];
}

describe('calculator content drift', () => {
  for (const calc of calculators) {
    it(`${calc.slug}: contentUpdatedAt is not stale`, () => {
      const uiFiles = uiFilesForSlug(calc);
      expect(uiFiles.length, `no UI file found for slug: ${calc.slug}`).toBeGreaterThan(0);

      const files = [`lib/calculators/${calc.slug}.ts`, ...uiFiles];
      const timestamps = files.map(lastCommitTimestamp).filter((t): t is string => t !== null);

      if (timestamps.length === 0) {
        // No git history available (e.g. shallow clone) — nothing to compare against.
        return;
      }

      const latestContentChangeMs = Math.max(...timestamps.map((t) => new Date(t).getTime()));
      const recordedMs = new Date(calc.contentUpdatedAt).getTime();

      expect(
        Number.isNaN(recordedMs),
        `${calc.slug}: contentUpdatedAt "${calc.contentUpdatedAt}" is not a valid ISO 8601 timestamp`,
      ).toBe(false);

      expect(
        recordedMs >= latestContentChangeMs,
        `${calc.slug}: a tracked file changed at ${new Date(latestContentChangeMs).toISOString()}, which is after contentUpdatedAt (currently "${calc.contentUpdatedAt}"). Bump contentUpdatedAt in lib/registry.ts to the real commit time (git log -1 --format=%cI -- <file>).`,
      ).toBe(true);
    });
  }
});
