'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR, formatNumber } from '@/lib/format';
import { calculateNolietojums, type NolietojumsInputs } from '@/lib/calculators/nolietojums';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: NolietojumsInputs = {
  purchasePrice: 25000,
  ageYears: 3,
  annualDepreciationRatePercent: 15,
};

export function NolietojumsCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateNolietojums(input), [input]);

  const tweenedCurrentValue = useTweenedNumber(result.currentValue);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Pašreizējā auto vērtība"
        value={formatCurrencyEUR(tweenedCurrentValue)}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`Nolietojums: ${formatNumber(result.depreciationPercent, 1)}%`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="purchasePrice"
          label="Pirkuma cena"
          unit="€"
          value={input.purchasePrice}
          step={500}
          onChange={(value) => setInput((prev) => ({ ...prev, purchasePrice: value }))}
        />
        <NumberField
          id="ageYears"
          label="Auto vecums"
          unit="gadi"
          value={input.ageYears}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, ageYears: value }))}
        />
        <NumberField
          id="annualDepreciationRatePercent"
          label="Gada nolietojuma likme"
          unit="%"
          value={input.annualDepreciationRatePercent}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, annualDepreciationRatePercent: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Nolietojuma likme ir vidēja vērtība. Faktiskais nolietojums atšķiras pēc auto markas, modeļa,
        stāvokļa un tirgus pieprasījuma. Pielāgo likmi savam auto tipam.
      </p>

      <Breakdown
        rows={[
          { label: 'Kopējais nolietojums', value: formatCurrencyEUR(result.totalDepreciation) },
          { label: 'Pirkuma cena', value: formatCurrencyEUR(input.purchasePrice) },
        ]}
      />
    </div>
  );
}
