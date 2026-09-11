export type PvnDarbibasVeids = 'add' | 'extract';

export interface PvnKalkulatoraInputs {
  amountEur: number;
  vatRatePercent: number;
  mode: PvnDarbibasVeids;
}

export interface PvnKalkulatoraResult {
  netAmountEur: number;
  vatAmountEur: number;
  grossAmountEur: number;
}

export function calculatePvnKalkulators(inputs: PvnKalkulatoraInputs): PvnKalkulatoraResult {
  const amount = Math.max(0, inputs.amountEur);
  const rate = Math.max(0, inputs.vatRatePercent) / 100;

  if (inputs.mode === 'add') {
    const netAmountEur = amount;
    const vatAmountEur = amount * rate;
    return { netAmountEur, vatAmountEur, grossAmountEur: netAmountEur + vatAmountEur };
  }

  const grossAmountEur = amount;
  const netAmountEur = grossAmountEur / (1 + rate);
  const vatAmountEur = grossAmountEur - netAmountEur;
  return { netAmountEur, vatAmountEur, grossAmountEur };
}
