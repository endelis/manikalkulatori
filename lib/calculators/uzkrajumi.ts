export interface UzkrajumuInputs {
  initialAmountEur: number;
  monthlyContributionEur: number;
  annualReturnPercent: number;
  years: number;
}

export interface UzkrajumuResult {
  futureValueEur: number;
  totalContributedEur: number;
  totalGrowthEur: number;
}

export function calculateUzkrajumi(inputs: UzkrajumuInputs): UzkrajumuResult {
  const initial = Math.max(0, inputs.initialAmountEur);
  const monthly = Math.max(0, inputs.monthlyContributionEur);
  const months = Math.max(0, Math.round(inputs.years * 12));
  const monthlyRate = Math.max(0, inputs.annualReturnPercent) / 100 / 12;

  const totalContributedEur = initial + monthly * months;

  if (months <= 0) {
    return { futureValueEur: initial, totalContributedEur: initial, totalGrowthEur: 0 };
  }

  let futureValueEur: number;
  if (monthlyRate === 0) {
    futureValueEur = totalContributedEur;
  } else {
    const growth = Math.pow(1 + monthlyRate, months);
    futureValueEur = initial * growth + monthly * ((growth - 1) / monthlyRate);
  }

  return {
    futureValueEur,
    totalContributedEur,
    totalGrowthEur: futureValueEur - totalContributedEur,
  };
}
