'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR } from '@/lib/format';
import { calculateDegvielasIzmaksas, type DegvielasIzmaksasInputs } from '@/lib/calculators/degvielas-izmaksas';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: DegvielasIzmaksasInputs = {
  annualDistanceKm: 15000,
  consumptionLPer100km: 7.0,
  fuelPricePerLiter: 1.85,
};

export function DegvielasIzmaksasCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateDegvielasIzmaksas(input), [input]);

  const tweenedAnnualCost = useTweenedNumber(result.annualCost);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Degvielas izmaksas gadā"
        value={formatCurrencyEUR(tweenedAnnualCost)}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`${formatCurrencyEUR(result.monthlyCost)} mēnesī`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="annualDistanceKm"
          label="Gada nobraukums"
          unit="km"
          value={input.annualDistanceKm}
          step={500}
          onChange={(value) => setInput((prev) => ({ ...prev, annualDistanceKm: value }))}
        />
        <NumberField
          id="consumptionLPer100km"
          label="Patēriņš"
          unit="L/100km"
          value={input.consumptionLPer100km}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, consumptionLPer100km: value }))}
        />
        <NumberField
          id="fuelPricePerLiter"
          label="Degvielas cena"
          unit="€/L"
          value={input.fuelPricePerLiter}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, fuelPricePerLiter: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Noklusējuma degvielas cena (2026. gada augusts): 1,85 €/L. Pielāgo to pašreizējai cenai un sava
        auto reālajam patēriņam.
      </p>

      <Breakdown
        rows={[
          { label: 'Izmaksas uz 100 km', value: formatCurrencyEUR(result.costPer100km) },
          { label: 'Izmaksas mēnesī', value: formatCurrencyEUR(result.monthlyCost) },
        ]}
      />
    </div>
  );
}
