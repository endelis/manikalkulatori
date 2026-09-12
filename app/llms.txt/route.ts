import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/site';
import { categories, getContentByCategory } from '@/lib/registry';

export function GET() {
  const lines: string[] = [
    '# Manikalkulatori.lv',
    '',
    '> Bezmaksas kalkulatori auto, finanšu, mājokļa, veselības un sporta jautājumiem latviešu valodā. Katrs kalkulators parāda rezultātu uzreiz, bez reģistrēšanās un bez maksas.',
    '',
    'Valoda: latviešu (lv). Visas cenas eiro (EUR).',
    '',
  ];

  for (const category of categories) {
    const items = getContentByCategory(category.slug);
    if (items.length === 0) continue;

    lines.push(`## ${category.title}`);
    lines.push('');
    for (const item of items) {
      lines.push(`- [${item.title}](${SITE_URL}/${category.slug}/${item.slug}): ${item.metaDescription}`);
    }
    lines.push('');
  }

  return new NextResponse(lines.join('\n').trimEnd() + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
