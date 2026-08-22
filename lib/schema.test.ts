import { describe, expect, it } from 'vitest';
import { buildBreadcrumbSchema, buildFaqSchema, buildSoftwareApplicationSchema } from './schema';

describe('buildSoftwareApplicationSchema', () => {
  it('builds a schema.org SoftwareApplication node', () => {
    const schema = buildSoftwareApplicationSchema({
      name: 'Elektroauto vs benzīna auto izmaksas',
      description: 'Salīdzini elektroauto un benzīna auto ekspluatācijas izmaksas.',
      url: 'https://manikalkulatori.lv/auto/elektroauto-vs-benzina',
      category: 'FinanceApplication',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('SoftwareApplication');
    expect(schema.name).toBe('Elektroauto vs benzīna auto izmaksas');
    expect(schema.url).toBe('https://manikalkulatori.lv/auto/elektroauto-vs-benzina');
    expect(schema.offers).toEqual({ '@type': 'Offer', price: '0', priceCurrency: 'EUR' });
  });
});

describe('buildBreadcrumbSchema', () => {
  it('builds an ordered BreadcrumbList', () => {
    const schema = buildBreadcrumbSchema([
      { name: 'Sākums', url: 'https://manikalkulatori.lv' },
      { name: 'Auto', url: 'https://manikalkulatori.lv/auto' },
    ]);

    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(2);
    expect(schema.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Sākums',
      item: 'https://manikalkulatori.lv',
    });
    expect(schema.itemListElement[1].position).toBe(2);
  });
});

describe('buildFaqSchema', () => {
  it('builds a FAQPage schema from question/answer pairs', () => {
    const schema = buildFaqSchema([
      { question: 'Kas ir EKII atbalsts?', answer: 'Valsts atbalsts elektroauto iegādei.' },
    ]);

    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity[0]).toEqual({
      '@type': 'Question',
      name: 'Kas ir EKII atbalsts?',
      acceptedAnswer: { '@type': 'Answer', text: 'Valsts atbalsts elektroauto iegādei.' },
    });
  });
});
