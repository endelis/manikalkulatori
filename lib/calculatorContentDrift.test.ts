import { describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { CUSTOM_ROUTED_SLUGS, calculators, type CalculatorMeta } from './registry';

/**
 * contentUpdatedAt is hand maintained (see lib/registry.ts), not derived from git or
 * build time, so it can silently go stale. This test catches that by comparing, per
 * calculator, the exact commit time its compute/UI files last changed against the
 * exact commit time its own contentUpdatedAt line was last set (via git blame on that
 * one line, not the whole file, since many calculators share both the file and often
 * the exact same date string).
 *
 * Full commit timestamps (git %cI), not day-truncated dates, are compared. A previous
 * version of this test truncated file commit dates to the day and compared them against
 * the day-only contentUpdatedAt string, which meant any edit landing on the same
 * calendar day as the last recorded date passed silently, whether or not the field was
 * actually bumped. Using precise timestamps on both sides fixes that: a later commit on
 * the same day still produces a strictly later timestamp and is correctly caught.
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

function contentUpdatedAtCommitTimestamp(slug: string): string | null {
  const registryPath = path.join(process.cwd(), 'lib', 'registry.ts');
  const lines = fs.readFileSync(registryPath, 'utf-8').split('\n');
  const slugLineIndex = lines.findIndex((line) => line.includes(`slug: '${slug}',`));
  if (slugLineIndex === -1) return null;

  const contentUpdatedAtOffset = lines
    .slice(slugLineIndex, slugLineIndex + 20)
    .findIndex((line) => line.includes('contentUpdatedAt:'));
  if (contentUpdatedAtOffset === -1) return null;

  const lineNumber = slugLineIndex + contentUpdatedAtOffset + 1; // git blame -L is 1-indexed

  try {
    const blame = execSync(`git blame -L ${lineNumber},${lineNumber} --porcelain -- lib/registry.ts`, {
      cwd: process.cwd(),
      encoding: 'utf-8',
    });
    const sha = blame.split('\n')[0].split(' ')[0];
    if (!sha || /^0+$/.test(sha)) return null; // line not committed yet
    const timestamp = execSync(`git log -1 --format=%cI ${sha}`, {
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
  'dzimstibas-kalkulators': ['components/calculators/DzimstibasKalkulators.tsx'],
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

      const latestContentChange = timestamps.reduce((max, t) => (t > max ? t : max));

      const bumpTimestamp = contentUpdatedAtCommitTimestamp(calc.slug);
      if (bumpTimestamp === null) {
        // contentUpdatedAt line not committed yet — nothing to compare against.
        return;
      }

      expect(
        bumpTimestamp >= latestContentChange,
        `${calc.slug}: a tracked file changed at ${latestContentChange}, which is after contentUpdatedAt was last set (commit at ${bumpTimestamp}, currently reads "${calc.contentUpdatedAt}"). Bump contentUpdatedAt in lib/registry.ts.`,
      ).toBe(true);
    });
  }
});
