'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR, formatNumber } from '@/lib/format';
import { calculateSiltumsuknaAtmaksas, type SiltumsuknaAtmaksasInputs } from '@/lib/calculators/siltumsukna-atmaksa';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: SiltumsuknaAtmaksasInputs = {
  heatPumpCostEur: 6000,
  annualHeatingNeedKwh: 15000,
  heatPumpCop: 3.5,
  oldHeatingPricePerKwh: 0.09,
  electricityPricePerKwh: 0.18,
};

export function SiltumsuknaAtmaksasCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateSiltumsuknaAtmaksas(input), [input]);

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
          id="heatPumpCostEur"
          label="Siltumsūkņa izmaksas"
          unit="€"
          value={input.heatPumpCostEur}
          step={100}
          onChange={(value) => setInput((prev) => ({ ...prev, heatPumpCostEur: value }))}
        />
        <NumberField
          id="annualHeatingNeedKwh"
          label="Gada siltumenerģijas patēriņš"
          unit="kWh"
          value={input.annualHeatingNeedKwh}
          step={500}
          onChange={(value) => setInput((prev) => ({ ...prev, annualHeatingNeedKwh: value }))}
        />
        <NumberField
          id="heatPumpCop"
          label="Siltumsūkņa COP"
          value={input.heatPumpCop}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, heatPumpCop: value }))}
        />
        <NumberField
          id="oldHeatingPricePerKwh"
          label="Vecās apkures cena"
          unit="€/kWh"
          value={input.oldHeatingPricePerKwh}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, oldHeatingPricePerKwh: value }))}
        />
        <NumberField
          id="electricityPricePerKwh"
          label="Elektrības cena"
          unit="€/kWh"
          value={input.electricityPricePerKwh}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, electricityPricePerKwh: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        COP (veiktspējas koeficients) rāda, cik reizes vairāk siltumenerģijas siltumsūknis saražo par
        patērēto elektrību. Reālais COP atšķiras atkarībā no ārgaisa temperatūras un sistēmas tipa.
      </p>

      <Breakdown
        rows={[
          { label: 'Siltumsūkņa izmaksas gadā', value: formatCurrencyEUR(result.heatPumpAnnualCost) },
          { label: 'Vecās apkures izmaksas gadā', value: formatCurrencyEUR(result.oldAnnualCost) },
        ]}
      />
    </div>
  );
}
