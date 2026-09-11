export interface SlimibasNaudasInputs {
  averageDailyEarningsEur: number;
  sickDays: number;
}

export interface SlimibasNaudasResult {
  employerPaidDays: number;
  totalSickPayEur: number;
  stateBenefitDaysFrom: number | null;
}

const EMPLOYER_OBLIGATION_DAYS = 9;
const DAY_2_3_RATE = 0.75;
const DAY_4_9_RATE = 0.8;

export function calculateSlimibasNauda(inputs: SlimibasNaudasInputs): SlimibasNaudasResult {
  const averageDailyEarningsEur = Math.max(0, inputs.averageDailyEarningsEur);
  const sickDays = Math.max(0, Math.round(inputs.sickDays));

  const employerPaidDays = Math.min(sickDays, EMPLOYER_OBLIGATION_DAYS);

  let totalSickPayEur = 0;
  for (let day = 1; day <= employerPaidDays; day += 1) {
    if (day === 1) continue;
    const rate = day <= 3 ? DAY_2_3_RATE : DAY_4_9_RATE;
    totalSickPayEur += averageDailyEarningsEur * rate;
  }

  return {
    employerPaidDays,
    totalSickPayEur,
    stateBenefitDaysFrom: sickDays > EMPLOYER_OBLIGATION_DAYS ? EMPLOYER_OBLIGATION_DAYS + 1 : null,
  };
}
