import { ImageResponse } from 'next/og';
import { computePension } from '@/lib/calculators/pensijas-kalkulators';
import {
  DEFAULT_BIRTH_YEAR,
  DEFAULT_GROSS_SALARY_MONTHLY,
  DEFAULT_INSURANCE_RECORD_YEARS,
  DEFAULT_WAGE_GROWTH_PERCENT,
  DEFAULT_EARLY_RETIREMENT_AGE,
  NDC_START_YEAR,
  PILLAR_1_CONTRIBUTION_RATE_PERCENT,
  WAGE_INDEX_SERIES,
  G_COEFFICIENT_TABLE,
  CURRENT_YEAR,
} from '@/lib/calculators/pensijas-kalkulators-defaults';
import { formatCurrencyEUR } from '@/lib/format';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  const result = computePension({
    currentYear: CURRENT_YEAR,
    birthYear: DEFAULT_BIRTH_YEAR,
    currentGrossSalaryMonthly: DEFAULT_GROSS_SALARY_MONTHLY,
    insuranceRecordYears: DEFAULT_INSURANCE_RECORD_YEARS,
    wageGrowthPercent: DEFAULT_WAGE_GROWTH_PERCENT,
    retirementAge: DEFAULT_EARLY_RETIREMENT_AGE,
    ndcStartYear: NDC_START_YEAR,
    pillar1ContributionRatePercent: PILLAR_1_CONTRIBUTION_RATE_PERCENT,
    wageIndexSeries: WAGE_INDEX_SERIES,
    gTable: G_COEFFICIENT_TABLE,
  });
  const monthly = formatCurrencyEUR(result.monthlyPension, { maximumFractionDigits: 0 });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAFAF9',
          color: '#1C1917',
          fontFamily: 'sans-serif',
          padding: 64,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 32, color: '#57534E', marginBottom: 16 }}>Manikalkulatori.lv</div>
        <div style={{ fontSize: 110, fontWeight: 700, color: '#2563EB', display: 'flex' }}>{monthly}</div>
        <div style={{ fontSize: 40, color: '#1C1917', marginTop: 16 }}>aptuvenā pensija priekšlaicīgi pensionējoties</div>
        <div style={{ fontSize: 28, color: '#57534E', marginTop: 8, display: 'flex' }}>
          {DEFAULT_EARLY_RETIREMENT_AGE} gadu vecumā, ar vismaz 30 gadu stāžu
        </div>
      </div>
    ),
    { ...size },
  );
}
