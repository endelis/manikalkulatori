export interface AtvalinajumaNaudasInputs {
  averageDailyEarningsEur: number;
  vacationDays: number;
}

export interface AtvalinajumaNaudasResult {
  totalVacationPayEur: number;
}

export function calculateAtvalinajumaNauda(
  inputs: AtvalinajumaNaudasInputs,
): AtvalinajumaNaudasResult {
  const averageDailyEarningsEur = Math.max(0, inputs.averageDailyEarningsEur);
  const vacationDays = Math.max(0, inputs.vacationDays);

  return { totalVacationPayEur: averageDailyEarningsEur * vacationDays };
}
