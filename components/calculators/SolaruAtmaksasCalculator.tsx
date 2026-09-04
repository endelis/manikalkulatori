'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR, formatNumber } from '@/lib/format';
import { calculateSolaruAtmaksas, type SolaruAtmaksasInputs } from '@/lib/calculators/solaru-atmaksa';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: SolaruAtmaksasInputs = {
  systemCostEur: 8000,
  systemSizeKwp: 6,
  annualGenerationPerKwp: 950,
  selfConsumptionPercent: 40,
  electricityPricePerKwh: 0.18,
  exportPricePerKwh: 0.06,
};

export function SolaruAtmaksasCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateSolaruAtmaksas(input), [input]);

  const isFinitePayback = Number.isFinite(result.paybackYears);
  const tweenedPayback = useTweenedNumber(isFinitePayback ? result.paybackYears : 0);
  const paybackValue = isFinitePayback ? `${formatNumber(tweenedPayback, 1)} gadi` : 'Neatmaksājas';

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Atmaksāšanās laiks"
        value={paybackValue}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`${formatCurrencyEUR(result.annualSavings)} ietaupījums gadā`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="systemCostEur"
          label="Sistēmas izmaksas"
          unit="€"
          value={input.systemCostEur}
          step={100}
          onChange={(value) => setInput((prev) => ({ ...prev, systemCostEur: value }))}
        />
        <NumberField
          id="systemSizeKwp"
          label="Sistēmas jauda"
          unit="kWp"
          value={input.systemSizeKwp}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, systemSizeKwp: value }))}
        />
        <NumberField
          id="annualGenerationPerKwp"
          label="Gada izstrāde uz kWp"
          unit="kWh/kWp"
          value={input.annualGenerationPerKwp}
          step={25}
          onChange={(value) => setInput((prev) => ({ ...prev, annualGenerationPerKwp: value }))}
        />
        <NumberField
          id="selfConsumptionPercent"
          label="Pašpatēriņš"
          unit="%"
          value={input.selfConsumptionPercent}
          step={5}
          onChange={(value) => setInput((prev) => ({ ...prev, selfConsumptionPercent: value }))}
        />
        <NumberField
          id="electricityPricePerKwh"
          label="Elektrības cena"
          unit="€/kWh"
          value={input.electricityPricePerKwh}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, electricityPricePerKwh: value }))}
        />
        <NumberField
          id="exportPricePerKwh"
          label="Pārpalikuma pārdošanas cena"
          unit="€/kWh"
          value={input.exportPricePerKwh}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, exportPricePerKwh: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Gada izstrāde uz kWp ir vidēja vērtība Latvijas klimatam. Pašpatēriņa daļa un pārpalikuma cena
        atšķiras atkarībā no elektroapgādes tīkla operatora un tavas patēriņa struktūras.
      </p>

      <Breakdown
        rows={[
          { label: 'Gada izstrāde', value: `${formatNumber(result.annualGenerationKwh, 0)} kWh` },
          { label: 'Gada ietaupījums', value: formatCurrencyEUR(result.annualSavings) },
        ]}
      />
    </div>
  );
}
