import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PensijasKalkulators } from './PensijasKalkulators';
import {
  CURRENT_YEAR,
  NDC_START_YEAR,
  PILLAR_1_CONTRIBUTION_RATE_PERCENT,
  WAGE_INDEX_SERIES,
  G_COEFFICIENT_TABLE,
  MIN_RETIREMENT_AGE,
  MAX_RETIREMENT_AGE,
  DEFAULT_BIRTH_YEAR,
  DEFAULT_GROSS_SALARY_MONTHLY,
  DEFAULT_INSURANCE_RECORD_YEARS,
  DEFAULT_WAGE_GROWTH_PERCENT,
  DEFAULT_RETIREMENT_AGE,
  RECENT_ACTUAL_WAGE_GROWTH_PERCENT,
  RECENT_ACTUAL_WAGE_GROWTH_YEAR,
  FORECAST_WAGE_GROWTH_PERCENT,
  FORECAST_WAGE_GROWTH_YEAR,
} from '@/lib/calculators/pensijas-kalkulators-defaults';

const BASE_PROPS = {
  accentVar: '#000',
  currentYear: CURRENT_YEAR,
  ndcStartYear: NDC_START_YEAR,
  pillar1ContributionRatePercent: PILLAR_1_CONTRIBUTION_RATE_PERCENT,
  wageIndexSeries: WAGE_INDEX_SERIES,
  gTable: G_COEFFICIENT_TABLE,
  minRetirementAge: MIN_RETIREMENT_AGE,
  maxRetirementAge: MAX_RETIREMENT_AGE,
  defaultGrossSalaryMonthly: DEFAULT_GROSS_SALARY_MONTHLY,
  defaultInsuranceRecordYears: DEFAULT_INSURANCE_RECORD_YEARS,
  defaultWageGrowthPercent: DEFAULT_WAGE_GROWTH_PERCENT,
  defaultRetirementAge: DEFAULT_RETIREMENT_AGE,
  recentActualWageGrowthPercent: RECENT_ACTUAL_WAGE_GROWTH_PERCENT,
  recentActualWageGrowthYear: RECENT_ACTUAL_WAGE_GROWTH_YEAR,
  forecastWageGrowthPercent: FORECAST_WAGE_GROWTH_PERCENT,
  forecastWageGrowthYear: FORECAST_WAGE_GROWTH_YEAR,
};

const CAVEAT_TEXT = 'iespējams, ir apdrošināšanas stāžs arī pirms 1996';

describe('PensijasKalkulators, pre 1996 record caveat', () => {
  it('shows the caveat for a birth year old enough to plausibly have pre 1996 record', () => {
    const html = renderToStaticMarkup(
      createElement(PensijasKalkulators, { ...BASE_PROPS, defaultBirthYear: 1970 }),
    );
    expect(html).toContain(CAVEAT_TEXT);
  });

  it('does not show the caveat for the default birth year (1990, too young for pre 1996 record)', () => {
    const html = renderToStaticMarkup(
      createElement(PensijasKalkulators, { ...BASE_PROPS, defaultBirthYear: DEFAULT_BIRTH_YEAR }),
    );
    expect(html).not.toContain(CAVEAT_TEXT);
  });
});

describe('PensijasKalkulators, initial render', () => {
  it('renders the headline result and every input label with the default props', () => {
    const html = renderToStaticMarkup(
      createElement(PensijasKalkulators, { ...BASE_PROPS, defaultBirthYear: DEFAULT_BIRTH_YEAR }),
    );
    expect(html).toContain('Aptuvenā 1. līmeņa pensija mēnesī');
    expect(html).toContain('Dzimšanas gads');
    expect(html).toContain('Pašreizējā bruto alga');
    expect(html).toContain('Apdrošināšanas stāžs kopš 1996. gada');
    expect(html).toContain('Algas pieauguma pieņēmums');
    expect(html).toContain('Pensionēšanās vecums');
  });
});
