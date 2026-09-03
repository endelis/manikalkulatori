import { describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { CUSTOM_ROUTED_SLUGS, calculators, type CalculatorMeta } from './registry';

/**
 * contentUpdatedAt is hand maintained (see lib/registry.ts), not derived from git or
 * build time, so it can silently go stale. This test catches that: it reads the real
 * last commit date of each calculator's compute module and UI component from git
 * history and fails if that date is later than the recorded contentUpdatedAt, which
 * means someone changed a calculator's numbers or copy without bumping the field.
 */

function lastCommitDate(filePath: string): string | null {
  try {
    const date = execSync(`git log -1 --format=%cd --date=short -- "${filePath}"`, {
      cwd: process.cwd(),
      encoding: 'utf-8',
    }).trim();
    return date.length > 0 ? date : null;
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
// wired into components/calculators/registry.tsx, so their "UI file" for drift purposes
// is their own route file instead of a shared component.
function uiFileForSlug(calc: CalculatorMeta): string | null {
  if (CUSTOM_ROUTED_SLUGS.has(calc.slug)) {
    return `app/${calc.category}/${calc.slug}/page.tsx`;
  }
  return componentFileForSlug(calc.slug);
}

describe('calculator content drift', () => {
  for (const calc of calculators) {
    it(`${calc.slug}: contentUpdatedAt is not stale`, () => {
      const computeFile = `lib/calculators/${calc.slug}.ts`;
      const componentFile = uiFileForSlug(calc);
      expect(componentFile, `no UI file found for slug: ${calc.slug}`).not.toBeNull();

      const dates = [lastCommitDate(computeFile), lastCommitDate(componentFile!)].filter(
        (d): d is string => d !== null,
      );

      if (dates.length === 0) {
        // No git history available (e.g. shallow clone) — nothing to compare against.
        return;
      }

      const latestChange = dates.reduce((max, d) => (d > max ? d : max));
      expect(
        calc.contentUpdatedAt >= latestChange,
        `${calc.slug} was last changed ${latestChange} but contentUpdatedAt is still ${calc.contentUpdatedAt}. Bump contentUpdatedAt in lib/registry.ts.`,
      ).toBe(true);
    });
  }
});
