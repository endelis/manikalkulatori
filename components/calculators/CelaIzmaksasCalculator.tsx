'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR } from '@/lib/format';
import { calculateCelaIzmaksas, type CelaIzmaksasInputs } from '@/lib/calculators/cela-izmaksas';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: CelaIzmaksasInputs = {
  distanceKm: 350,
  consumptionLPer100km: 7.0,
  fuelPricePerLiter: 1.85,
  peopleCount: 1,
};

export function CelaIzmaksasCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateCelaIzmaksas(input), [input]);

  const tweenedTripCost = useTweenedNumber(result.tripCost);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Brauciena izmaksas"
        value={formatCurrencyEUR(tweenedTripCost)}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`${formatCurrencyEUR(result.costPerPerson)} uz vienu cilvēku`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="distanceKm"
          label="Attālums"
          unit="km"
          value={input.distanceKm}
          step={10}
          onChange={(value) => setInput((prev) => ({ ...prev, distanceKm: value }))}
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
        <NumberField
          id="peopleCount"
          label="Līdzbraucēju skaits"
          value={input.peopleCount}
          min={1}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, peopleCount: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Aprēķins pieņem vienu virzienu. Turp un atpakaļ braucienam dubulto attālumu.
      </p>

      <Breakdown
        rows={[
          { label: 'Kopējās izmaksas', value: formatCurrencyEUR(result.tripCost) },
          { label: 'Izmaksas uz personu', value: formatCurrencyEUR(result.costPerPerson) },
        ]}
      />
    </div>
  );
}
