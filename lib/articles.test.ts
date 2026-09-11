import { describe, expect, it } from 'vitest';
import { articles, calculators, getArticle, getArticlesByCategory, getContentByCategory } from './registry';

describe('articles', () => {
  it('every article has a full ISO 8601 timestamp with a timezone offset', () => {
    const FULL_ISO_8601_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;
    for (const article of articles) {
      expect(
        FULL_ISO_8601_WITH_OFFSET.test(article.contentUpdatedAt),
        `${article.slug}: contentUpdatedAt "${article.contentUpdatedAt}" is not a full ISO 8601 timestamp`,
      ).toBe(true);
    }
  });

  it('every article has a parseable, non-future timestamp', () => {
    const now = Date.now();
    for (const article of articles) {
      const parsed = new Date(article.contentUpdatedAt).getTime();
      expect(Number.isNaN(parsed), `${article.slug}: contentUpdatedAt does not parse`).toBe(false);
      expect(parsed, `${article.slug}: contentUpdatedAt is in the future`).toBeLessThanOrEqual(now);
    }
  });

  it('no article slug collides with a calculator slug in the same category', () => {
    for (const article of articles) {
      const collision = calculators.find(
        (calculator) => calculator.category === article.category && calculator.slug === article.slug,
      );
      expect(collision, `${article.category}/${article.slug} is used by both a calculator and an article`).toBeUndefined();
    }
  });

  it('no two articles share a slug within the same category', () => {
    const seen = new Set<string>();
    for (const article of articles) {
      const key = `${article.category}/${article.slug}`;
      expect(seen.has(key), `duplicate article slug: ${key}`).toBe(false);
      seen.add(key);
    }
  });
});

describe('getArticlesByCategory', () => {
  it('returns only articles in the given category', () => {
    for (const article of articles) {
      const result = getArticlesByCategory(article.category);
      expect(result.every((a) => a.category === article.category)).toBe(true);
    }
  });
});

describe('getArticle', () => {
  it('finds an article by category and slug', () => {
    for (const article of articles) {
      expect(getArticle(article.category, article.slug)?.title).toBe(article.title);
    }
  });

  it('returns undefined for an unknown slug', () => {
    expect(getArticle('finanses', 'nezinams-raksts')).toBeUndefined();
  });
});

describe('getContentByCategory', () => {
  it('combines calculators and articles for a category', () => {
    for (const article of articles) {
      const combined = getContentByCategory(article.category);
      expect(combined.some((item) => item.slug === article.slug)).toBe(true);
    }
  });
});
