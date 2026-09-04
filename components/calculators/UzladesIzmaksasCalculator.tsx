'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR, formatNumber } from '@/lib/format';
import { calculateUzladesIzmaksas, type UzladesIzmaksasInputs } from '@/lib/calculators/uzlades-izmaksas';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: UzladesIzmaksasInputs = {
  annualDistanceKm: 15000,
  consumptionKwhPer100km: 16.5,
  homePricePerKwh: 0.18,
  publicPricePerKwh: 0.45,
  homeChargingPercent: 80,
};

export function UzladesIzmaksasCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateUzladesIzmaksas(input), [input]);

  const tweenedTotalCost = useTweenedNumber(result.totalCost);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Uzlādes izmaksas gadā"
        value={formatCurrencyEUR(tweenedTotalCost)}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`${formatCurrencyEUR(result.extraCostVsAllHome)} vairāk nekā uzlādējot tikai mājās`}
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
          id="consumptionKwhPer100km"
          label="Patēriņš"
          unit="kWh/100km"
          value={input.consumptionKwhPer100km}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, consumptionKwhPer100km: value }))}
        />
        <NumberField
          id="homePricePerKwh"
          label="Cena mājās"
          unit="€/kWh"
          value={input.homePricePerKwh}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, homePricePerKwh: value }))}
        />
        <NumberField
          id="publicPricePerKwh"
          label="Cena publiski"
          unit="€/kWh"
          value={input.publicPricePerKwh}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, publicPricePerKwh: value }))}
        />
        <NumberField
          id="homeChargingPercent"
          label="Uzlāde mājās"
          unit="%"
          value={input.homeChargingPercent}
          step={5}
          onChange={(value) => setInput((prev) => ({ ...prev, homeChargingPercent: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Publiskās lādēšanas cena var būt ievērojami augstāka par mājas cenu un atšķiras starp
        operatoriem. Pielāgo abas cenas savai situācijai.
      </p>

      <Breakdown
        rows={[
          { label: 'Izmaksas mājās', value: formatCurrencyEUR(result.homeCost) },
          { label: 'Izmaksas publiski', value: formatCurrencyEUR(result.publicCost) },
          { label: 'Kopējā enerģija', value: `${formatNumber(result.totalKwh, 0)} kWh` },
        ]}
      />
    </div>
  );
}
