export interface IinKalkulatoraInputs {
  capitalIncomeEur: number;
}

export interface IinKalkulatoraResult {
  taxEur: number;
  netEur: number;
}

const CAPITAL_INCOME_IIN_RATE = 0.255;

export function calculateIinKalkulators(inputs: IinKalkulatoraInputs): IinKalkulatoraResult {
  const capitalIncomeEur = Math.max(0, inputs.capitalIncomeEur);
  const taxEur = capitalIncomeEur * CAPITAL_INCOME_IIN_RATE;

  return { taxEur, netEur: capitalIncomeEur - taxEur };
}
