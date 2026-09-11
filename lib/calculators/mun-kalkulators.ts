export interface MunKalkulatoraInputs {
  turnoverEur: number;
}

export interface MunKalkulatoraResult {
  taxEur: number;
  netEur: number;
}

const MUN_RATE = 0.25;

export function calculateMunKalkulators(inputs: MunKalkulatoraInputs): MunKalkulatoraResult {
  const turnoverEur = Math.max(0, inputs.turnoverEur);
  const taxEur = turnoverEur * MUN_RATE;

  return { taxEur, netEur: turnoverEur - taxEur };
}
