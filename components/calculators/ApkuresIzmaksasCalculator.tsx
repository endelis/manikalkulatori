'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR } from '@/lib/format';
import {
  calculateApkuresIzmaksas,
  type ApkuresIzmaksasInputs,
  type ApkuresIzmaksasResult,
} from '@/lib/calculators/apkures-izmaksas';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: ApkuresIzmaksasInputs = {
  annualHeatingNeedKwh: 15000,
  gasPricePerKwh: 0.12,
  firewoodPricePerKwh: 0.05,
  heatPumpPricePerKwh: 0.06,
};

const CHEAPEST_OPTION_LABEL: Record<ApkuresIzmaksasResult['cheapestOption'], string> = {
  gas: 'Gāze ir lētākā izvēle',
  firewood: 'Malka ir lētākā izvēle',
  heatPump: 'Siltumsūknis ir lētākā izvēle',
};

export function ApkuresIzmaksasCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateApkuresIzmaksas(input), [input]);

  const tweenedCheapestAmount = useTweenedNumber(result.cheapestAmount);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label={CHEAPEST_OPTION_LABEL[result.cheapestOption]}
        value={formatCurrencyEUR(tweenedCheapestAmount)}
        tone="winner"
        accentVar={accentVar}
        sublabel={`Ietaupi ${formatCurrencyEUR(result.savingsVsMostExpensive)} salīdzinājumā ar dārgāko`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="annualHeatingNeedKwh"
          label="Gada siltumenerģijas patēriņš"
          unit="kWh"
          value={input.annualHeatingNeedKwh}
          step={500}
          onChange={(value) => setInput((prev) => ({ ...prev, annualHeatingNeedKwh: value }))}
        />
        <NumberField
          id="gasPricePerKwh"
          label="Gāze"
          unit="€/kWh"
          value={input.gasPricePerKwh}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, gasPricePerKwh: value }))}
        />
        <NumberField
          id="firewoodPricePerKwh"
          label="Malka"
          unit="€/kWh"
          value={input.firewoodPricePerKwh}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, firewoodPricePerKwh: value }))}
        />
        <NumberField
          id="heatPumpPricePerKwh"
          label="Siltumsūknis"
          unit="€/kWh"
          value={input.heatPumpPricePerKwh}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, heatPumpPricePerKwh: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Cena par kWh siltumenerģijas ietver arī sistēmas efektivitāti, ne tikai kurināmā cenu. Pielāgo
        vērtības savai situācijai un pašreizējām cenām.
      </p>

      <Breakdown
        rows={[
          { label: 'Gāze', value: formatCurrencyEUR(result.gasCost) },
          { label: 'Malka', value: formatCurrencyEUR(result.firewoodCost) },
          { label: 'Siltumsūknis', value: formatCurrencyEUR(result.heatPumpCost) },
        ]}
      />
    </div>
  );
}
