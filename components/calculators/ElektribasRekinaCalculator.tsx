'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR } from '@/lib/format';
import { calculateElektribasRekins, type ElektribasRekinaInputs } from '@/lib/calculators/elektribas-rekins';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: ElektribasRekinaInputs = {
  monthlyConsumptionKwh: 250,
  pricePerKwh: 0.18,
  fixedMonthlyFee: 5,
};

export function ElektribasRekinaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateElektribasRekins(input), [input]);

  const tweenedTotalMonthlyCost = useTweenedNumber(result.totalMonthlyCost);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Rēķins mēnesī"
        value={formatCurrencyEUR(tweenedTotalMonthlyCost)}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`${formatCurrencyEUR(result.annualCost)} gadā`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="monthlyConsumptionKwh"
          label="Mēneša patēriņš"
          unit="kWh"
          value={input.monthlyConsumptionKwh}
          step={10}
          onChange={(value) => setInput((prev) => ({ ...prev, monthlyConsumptionKwh: value }))}
        />
        <NumberField
          id="pricePerKwh"
          label="Elektrības cena"
          unit="€/kWh"
          value={input.pricePerKwh}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, pricePerKwh: value }))}
        />
        <NumberField
          id="fixedMonthlyFee"
          label="Fiksētā mēneša maksa"
          unit="€"
          value={input.fixedMonthlyFee}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, fixedMonthlyFee: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Fiksētā maksa parasti sedz sadales tīkla pakalpojumus un atšķiras atkarībā no pieslēguma jaudas
        un tīkla operatora.
      </p>

      <Breakdown
        rows={[
          { label: 'Mainīgā daļa', value: formatCurrencyEUR(result.variableCost) },
          { label: 'Fiksētā daļa', value: formatCurrencyEUR(input.fixedMonthlyFee) },
        ]}
      />
    </div>
  );
}
