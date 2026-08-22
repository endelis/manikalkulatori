export interface OctaInputs {
  quote1: number;
  quote2: number;
  quote3: number;
}

export interface OctaResult {
  cheapestAmount: number;
  cheapestQuoteNumber: 1 | 2 | 3;
  mostExpensiveAmount: number;
  savings: number;
}

export function calculateOcta(inputs: OctaInputs): OctaResult {
  const amounts: [number, 1 | 2 | 3][] = [
    [inputs.quote1, 1],
    [inputs.quote2, 2],
    [inputs.quote3, 3],
  ];
  const cheapestAmount = Math.min(inputs.quote1, inputs.quote2, inputs.quote3);
  const mostExpensiveAmount = Math.max(inputs.quote1, inputs.quote2, inputs.quote3);
  const cheapestQuoteNumber = amounts.find(([amount]) => amount === cheapestAmount)![1];
  const savings = mostExpensiveAmount - cheapestAmount;
  return { cheapestAmount, cheapestQuoteNumber, mostExpensiveAmount, savings };
}
