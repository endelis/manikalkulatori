export interface ApkuresIzmaksasInputs {
  annualHeatingNeedKwh: number;
  gasPricePerKwh: number;
  firewoodPricePerKwh: number;
  heatPumpPricePerKwh: number;
}

export interface ApkuresIzmaksasResult {
  gasCost: number;
  firewoodCost: number;
  heatPumpCost: number;
  cheapestOption: 'gas' | 'firewood' | 'heatPump';
  cheapestAmount: number;
  savingsVsMostExpensive: number;
}

export function calculateApkuresIzmaksas(inputs: ApkuresIzmaksasInputs): ApkuresIzmaksasResult {
  const gasCost = inputs.annualHeatingNeedKwh * inputs.gasPricePerKwh;
  const firewoodCost = inputs.annualHeatingNeedKwh * inputs.firewoodPricePerKwh;
  const heatPumpCost = inputs.annualHeatingNeedKwh * inputs.heatPumpPricePerKwh;

  const options: [ApkuresIzmaksasResult['cheapestOption'], number][] = [
    ['gas', gasCost],
    ['firewood', firewoodCost],
    ['heatPump', heatPumpCost],
  ];
  const cheapestAmount = Math.min(gasCost, firewoodCost, heatPumpCost);
  const mostExpensiveAmount = Math.max(gasCost, firewoodCost, heatPumpCost);
  const cheapestOption = options.find(([, amount]) => amount === cheapestAmount)![0];

  return {
    gasCost,
    firewoodCost,
    heatPumpCost,
    cheapestOption,
    cheapestAmount,
    savingsVsMostExpensive: mostExpensiveAmount - cheapestAmount,
  };
}
