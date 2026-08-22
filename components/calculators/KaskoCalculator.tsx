'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR, formatNumber } from '@/lib/format';
import { calculateKasko, type KaskoInputs } from '@/lib/calculators/kasko-kalkulators';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: KaskoInputs = {
  vehicleValue: 20000,
  annualPremium: 600,
};

export function KaskoCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateKasko(input), [input]);

  const tweenedMonthlyPremium = useTweenedNumber(result.monthlyPremium);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="KASKO izmaksas mēnesī"
        value={formatCurrencyEUR(tweenedMonthlyPremium)}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`${formatNumber(result.premiumPercentOfValue, 1)}% no auto vērtības gadā`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="vehicleValue"
          label="Auto vērtība"
          unit="€"
          value={input.vehicleValue}
          step={500}
          onChange={(value) => setInput((prev) => ({ ...prev, vehicleValue: value }))}
        />
        <NumberField
          id="annualPremium"
          label="KASKO gada prēmija"
          unit="€"
          value={input.annualPremium}
          step={10}
          onChange={(value) => setInput((prev) => ({ ...prev, annualPremium: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Ievadi savu saņemto KASKO piedāvājumu. Kalkulators neaprēķina cenu, jo tā ir individuāla katram
        apdrošinātājam.
      </p>

      <Breakdown
        rows={[
          { label: 'Gada prēmija', value: formatCurrencyEUR(input.annualPremium) },
          { label: 'Izmaksas 3 gados', value: formatCurrencyEUR(result.threeYearTotal) },
        ]}
      />
    </div>
  );
}
