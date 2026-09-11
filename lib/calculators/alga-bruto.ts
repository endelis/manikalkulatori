import { calculateAlgaNeto } from './alga-neto';

export interface AlgaBrutoInputs {
  targetNetMonthlyEur: number;
  applyNonTaxableMinimum: boolean;
}

export interface AlgaBrutoResult {
  grossMonthlyEur: number;
  vsaoiEur: number;
  iinEur: number;
}

const SEARCH_UPPER_BOUND_EUR = 1_000_000;
const SEARCH_ITERATIONS = 60;

export function calculateAlgaBruto(inputs: AlgaBrutoInputs): AlgaBrutoResult {
  const targetNetMonthlyEur = Math.max(0, inputs.targetNetMonthlyEur);

  if (targetNetMonthlyEur === 0) {
    return { grossMonthlyEur: 0, vsaoiEur: 0, iinEur: 0 };
  }

  let low = 0;
  let high = SEARCH_UPPER_BOUND_EUR;

  for (let i = 0; i < SEARCH_ITERATIONS; i += 1) {
    const mid = (low + high) / 2;
    const { netMonthlyEur } = calculateAlgaNeto({
      grossMonthlyEur: mid,
      applyNonTaxableMinimum: inputs.applyNonTaxableMinimum,
    });

    if (netMonthlyEur < targetNetMonthlyEur) {
      low = mid;
    } else {
      high = mid;
    }
  }

  const grossMonthlyEur = high;
  const { vsaoiEur, iinEur } = calculateAlgaNeto({
    grossMonthlyEur,
    applyNonTaxableMinimum: inputs.applyNonTaxableMinimum,
  });

  return { grossMonthlyEur, vsaoiEur, iinEur };
}
