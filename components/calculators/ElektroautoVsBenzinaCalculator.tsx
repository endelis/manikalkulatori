'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR, formatNumber } from '@/lib/format';
import { computeEvVsIce } from '@/lib/calculators/elektroauto-vs-benzina';

// Latvia defaults, Aug 2026 — all-in household electricity (energy + Sadales tīkls
// distribution + 21% PVN), 95-octane pump price, real-world mixed-driving consumption
// for a compact crossover class (Hyundai Kona Electric-class EV vs. equivalent petrol).
// Prices move often — revisit periodically.
const DEFAULT_INPUT = {
  annualDistanceKm: 15000,
  evConsumptionKwhPer100km: 16.5,
  electricityPricePerKwh: 0.18,
  iceConsumptionLPer100km: 7.0,
  fuelPricePerLiter: 1.85,
};

export function ElektroautoVsBenzinaCalculator() {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => computeEvVsIce(input), [input]);

  const verdictLabel =
    result.cheaperOption === 'ev'
      ? 'Elektroauto lētāks gadā'
      : result.cheaperOption === 'ice'
        ? 'Benzīna auto lētāks gadā'
        : 'Izmaksas ir vienādas';

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label={verdictLabel}
        value={formatCurrencyEUR(Math.abs(result.annualSavings))}
        accentVar="var(--color-accent-auto)"
        sublabel={`5 gados: ${formatCurrencyEUR(Math.abs(result.fiveYearSavings))}`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          id="annualDistanceKm"
          label="Gada nobraukums"
          unit="km"
          value={input.annualDistanceKm}
          step={500}
          onChange={(value) => setInput((prev) => ({ ...prev, annualDistanceKm: value }))}
        />
        <NumberField
          id="evConsumptionKwhPer100km"
          label="Elektroauto patēriņš"
          unit="kWh/100km"
          value={input.evConsumptionKwhPer100km}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, evConsumptionKwhPer100km: value }))}
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
          id="iceConsumptionLPer100km"
          label="Benzīna auto patēriņš"
          unit="L/100km"
          value={input.iceConsumptionLPer100km}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, iceConsumptionLPer100km: value }))}
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

      <p className="text-xs text-panel-muted">
        Noklusējuma vērtības (2026. gada augusts): elektrība 0,18 €/kWh, benzīns 1,85 €/L — pielāgo tās
        savai situācijai un pašreizējām cenām.
      </p>

      <Breakdown
        rows={[
          { label: 'Elektroauto enerģijas izmaksas / gadā', value: formatCurrencyEUR(result.evAnnualEnergyCost) },
          { label: 'Benzīna auto degvielas izmaksas / gadā', value: formatCurrencyEUR(result.iceAnnualFuelCost) },
          { label: 'Gada nobraukums', value: `${formatNumber(input.annualDistanceKm)} km` },
        ]}
      />
    </div>
  );
}
