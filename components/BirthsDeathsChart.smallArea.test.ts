import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BirthsDeathsChart } from './BirthsDeathsChart';
import { BirthsDeathsTable } from './BirthsDeathsTable';
import type { PopulationYearRow } from '@/lib/calculators/dzimstibas-kalkulators';

/**
 * The three bugs found while building the novads pilot (chart axis scaling, a
 * hardcoded place name and monotonic trend claim, a false zero for an unpublished
 * year) were all invisible against national-scale data and only surfaced once a small
 * area's data shape (small counts, a volatile non-monotonic series, a genuinely
 * incomplete trailing year) was run through the same shared components. Running that
 * shape here means the next such bug does not need a new page to be caught.
 */
const SMALL_AREA_ROWS: PopulationYearRow[] = [
  { year: 2021, populationAtYearStart: 2945, liveBirths: 18, deaths: 69, naturalIncrease: -51, netMigration: null },
  { year: 2022, populationAtYearStart: 2918, liveBirths: 22, deaths: 57, naturalIncrease: -35, netMigration: null },
  { year: 2023, populationAtYearStart: 3001, liveBirths: 15, deaths: 58, naturalIncrease: -43, netMigration: null },
  { year: 2024, populationAtYearStart: 2892, liveBirths: 20, deaths: 56, naturalIncrease: -36, netMigration: -36 },
];

describe('BirthsDeathsChart against a small area fixture', () => {
  it('scales the y axis to the small data instead of a fixed national-scale step', () => {
    const html = renderToStaticMarkup(
      createElement(BirthsDeathsChart, { rows: SMALL_AREA_ROWS, accentVar: '#000', tableCode: 'TEST' }),
    );
    // maxValue is 69 (2021 deaths); a fixed round-up-to-10000 step would give a y axis
    // maximum of 10000, making every point sit within the bottom 1% of the chart. The
    // scaled axis should land within an order of magnitude of the actual data.
    expect(html).not.toContain('10 000');
    expect(html).toMatch(/8[04]\b/); // niceAxisMax(69) === 80
  });

  it('uses the given place name, not a hardcoded "Latvijā", in the aria-label', () => {
    const html = renderToStaticMarkup(
      createElement(BirthsDeathsChart, {
        rows: SMALL_AREA_ROWS,
        accentVar: '#000',
        tableCode: 'TEST',
        placeName: 'Testnovadā',
      }),
    );
    expect(html).toContain('Testnovadā');
    expect(html).not.toContain('Latvijā');
  });

  it('does not assert a monotonic trend for a non-monotonic small-area series', () => {
    // This fixture's births go 18, 22, 15, 20: not steadily up or down. The
    // aria-label must not claim otherwise (the bug this guards against: a hardcoded
    // "pastāvīgi samazinājās" / "pastāvīgi palielinājās" claim lifted from the
    // national series, which happens to be monotonic, but is not true in general).
    const html = renderToStaticMarkup(
      createElement(BirthsDeathsChart, { rows: SMALL_AREA_ROWS, accentVar: '#000', tableCode: 'TEST' }),
    );
    expect(html).not.toMatch(/pastāvīgi (samazinājās|palielinājās)/);
  });
});

describe('BirthsDeathsTable against a small area fixture', () => {
  it('derives the caption year range and place name from the given rows, not a hardcoded 2015 to 2025 Latvijā', () => {
    const html = renderToStaticMarkup(
      createElement(BirthsDeathsTable, { rows: SMALL_AREA_ROWS, accentVar: '#000', placeName: 'Testnovadā' }),
    );
    expect(html).toContain('Testnovadā');
    expect(html).toContain('2021');
    expect(html).toContain('2024');
    expect(html).not.toContain('2015');
    expect(html).not.toContain('Latvijā');
  });

  it('never renders a literal 0 for a row whose caller already filtered out an unpublished year', () => {
    // The false-zero bug lived in how a caller assembled `rows`, not in this
    // component's own ?? 0 fallback (which is a legitimate default for a row that
    // genuinely has 0 events). This fixture only includes rows with real data, the
    // same shape a correct caller must produce; see novads-pilot page.tsx's
    // completeSeries filter.
    for (const row of SMALL_AREA_ROWS) {
      expect(row.liveBirths).not.toBeNull();
      expect(row.deaths).not.toBeNull();
    }
    const html = renderToStaticMarkup(
      createElement(BirthsDeathsTable, { rows: SMALL_AREA_ROWS, accentVar: '#000', placeName: 'Testnovadā' }),
    );
    // 15 is the smallest births figure in the fixture; a stray literal "0" cell would
    // indicate a null slipped through unfiltered.
    expect(html).not.toMatch(/>0</);
  });
});
