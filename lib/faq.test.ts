import { describe, expect, it } from 'vitest';
import { loadFaq } from './faq';

describe('loadFaq', () => {
  it('parses the elektroauto-vs-benzina FAQ file into question/answer pairs', () => {
    const entries = loadFaq('elektroauto-vs-benzina');

    expect(entries.length).toBeGreaterThanOrEqual(3);
    expect(entries[0].question).toBe('Vai elektroauto tiešām ir lētāks par benzīna auto?');
    expect(entries[0].answer.length).toBeGreaterThan(0);
    entries.forEach((entry) => {
      expect(entry.question.length).toBeGreaterThan(0);
      expect(entry.answer.length).toBeGreaterThan(0);
    });
  });

  it('throws when the FAQ file does not exist', () => {
    expect(() => loadFaq('does-not-exist')).toThrow();
  });
});
