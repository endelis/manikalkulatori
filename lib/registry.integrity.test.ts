import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { calculators } from './registry';
import { calculatorComponents } from '@/components/calculators/registry';

describe('registry integrity', () => {
  it('every registered calculator has a UI component', () => {
    for (const calc of calculators) {
      expect(calculatorComponents[calc.slug], `missing UI component for slug: ${calc.slug}`).toBeDefined();
    }
  });

  it('every registered calculator has a FAQ markdown file', () => {
    for (const calc of calculators) {
      const faqPath = path.join(process.cwd(), 'content', 'faq', `${calc.slug}.md`);
      expect(fs.existsSync(faqPath), `missing FAQ file for slug: ${calc.slug}`).toBe(true);
    }
  });

  it('every registered calculator has a non-empty intro', () => {
    for (const calc of calculators) {
      expect(calc.intro.trim().length, `empty intro for slug: ${calc.slug}`).toBeGreaterThan(0);
    }
  });

  it('every registered calculator has an explanation entry', () => {
    // The explanations map lives inline in the dynamic route file, not as importable data,
    // so this check reads the file's source and looks for each slug as an object key rather
    // than importing the record directly.
    const routeSource = fs.readFileSync(
      path.join(process.cwd(), 'app', '[category]', '[calculator]', 'page.tsx'),
      'utf-8',
    );
    for (const calc of calculators) {
      expect(
        routeSource.includes(`'${calc.slug}':`),
        `missing explanations entry for slug: ${calc.slug}`,
      ).toBe(true);
    }
  });

  it('calculator slugs are unique within each category', () => {
    const seen = new Set<string>();
    for (const calc of calculators) {
      const key = `${calc.category}/${calc.slug}`;
      expect(seen.has(key), `duplicate slug in category: ${key}`).toBe(false);
      seen.add(key);
    }
  });
});
