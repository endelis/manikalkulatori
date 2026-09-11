export interface IeguldijumuKontaInputs {
  initialAmountEur: number;
  monthlyContributionEur: number;
  annualReturnPercent: number;
  years: number;
}

export interface IeguldijumuKontaResult {
  /** Ending balance before tax, same for both paths since both compound at the same rate. */
  futureValueEur: number;
  totalContributedEur: number;
  /** Ieguldījumu konts: tax is due only once, on withdrawal, on the amount withdrawn in
   * excess of total deposits (likuma "Par iedzīvotāju ienākuma nodokli" methodology,
   * "Ienākums no ieguldījumu konta", VID, 27.12.2024). */
  investmentAccountTaxEur: number;
  investmentAccountNetEur: number;
  /** Regular account comparison: a simplified worst case where every year's realized
   * growth is taxed immediately (full annual realization), so less principal compounds
   * forward than in the investment account. Real regular-account tax timing depends on
   * actual trading behavior; this is an illustrative upper bound on the tax drag, not a
   * claim about any specific trading pattern. */
  regularAccountNetEur: number;
  /** investmentAccountNetEur - regularAccountNetEur. */
  taxDeferralBenefitEur: number;
}

const IIN_RATE = 0.255;

export function calculateIeguldijumuKonta(inputs: IeguldijumuKontaInputs): IeguldijumuKontaResult {
  const initial = Math.max(0, inputs.initialAmountEur);
  const monthly = Math.max(0, inputs.monthlyContributionEur);
  const months = Math.max(0, Math.round(inputs.years * 12));
  const monthlyRate = Math.max(0, inputs.annualReturnPercent) / 100 / 12;

  const totalContributedEur = initial + monthly * months;

  let futureValueEur: number;
  if (months <= 0) {
    futureValueEur = initial;
  } else if (monthlyRate === 0) {
    futureValueEur = totalContributedEur;
  } else {
    const growth = Math.pow(1 + monthlyRate, months);
    futureValueEur = initial * growth + monthly * ((growth - 1) / monthlyRate);
  }

  const investmentAccountTaxEur = Math.max(0, futureValueEur - totalContributedEur) * IIN_RATE;
  const investmentAccountNetEur = futureValueEur - investmentAccountTaxEur;

  let regularBalance = initial;
  let balanceAtLastTaxPoint = initial;
  for (let month = 1; month <= months; month += 1) {
    regularBalance = regularBalance * (1 + monthlyRate) + monthly;
    if (month % 12 === 0) {
      const growthSinceLastTaxPoint = regularBalance - balanceAtLastTaxPoint - monthly * 12;
      regularBalance -= Math.max(0, growthSinceLastTaxPoint) * IIN_RATE;
      balanceAtLastTaxPoint = regularBalance;
    }
  }
  const remainingMonths = months % 12;
  if (remainingMonths !== 0) {
    const growthSinceLastTaxPoint = regularBalance - balanceAtLastTaxPoint - monthly * remainingMonths;
    regularBalance -= Math.max(0, growthSinceLastTaxPoint) * IIN_RATE;
  }
  const regularAccountNetEur = regularBalance;

  return {
    futureValueEur,
    totalContributedEur,
    investmentAccountTaxEur,
    investmentAccountNetEur,
    regularAccountNetEur,
    taxDeferralBenefitEur: investmentAccountNetEur - regularAccountNetEur,
  };
}
