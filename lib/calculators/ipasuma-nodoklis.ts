export interface IpasumaNodoklaInputs {
  cadastralValueEur: number;
  ratePercent: number;
}

export interface IpasumaNodoklaResult {
  annualTaxEur: number;
  quarterlyTaxEur: number;
}

export function calculateIpasumaNodoklis(inputs: IpasumaNodoklaInputs): IpasumaNodoklaResult {
  const cadastralValueEur = Math.max(0, inputs.cadastralValueEur);
  const ratePercent = Math.max(0, inputs.ratePercent);

  const annualTaxEur = cadastralValueEur * (ratePercent / 100);

  return { annualTaxEur, quarterlyTaxEur: annualTaxEur / 4 };
}
