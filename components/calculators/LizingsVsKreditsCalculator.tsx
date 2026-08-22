'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR } from '@/lib/format';
import { calculateLizingsVsKredits, type LizingsVsKreditsInputs } from '@/lib/calculators/lizings-vs-kredits';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: LizingsVsKreditsInputs = {
  vehiclePrice: 25000,
  downPayment: 2500,
  termMonths: 36,
  loanAnnualRatePercent: 6,
  leaseAnnualRatePercent: 4,
  residualValuePercent: 50,
};

export function LizingsVsKreditsCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateLizingsVsKredits(input), [input]);

  let label: string;
  if (result.cheaperOption === 'lease') {
    label = 'Līzings ir lētāks mēnesī';
  } else if (result.cheaperOption === 'loan') {
    label = 'Kredīts ir lētāks mēnesī';
  } else {
    label = 'Abas izvēles izmaksā vienādi';
  }

  const tweenedMonthlySavings = useTweenedNumber(result.monthlySavings);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label={label}
        value={formatCurrencyEUR(tweenedMonthlySavings)}
        tone="neutral"
        accentVar={accentVar}
        sublabel="starpība mēnesī"
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="vehiclePrice"
          label="Auto cena"
          unit="€"
          value={input.vehiclePrice}
          step={500}
          onChange={(value) => setInput((prev) => ({ ...prev, vehiclePrice: value }))}
        />
        <NumberField
          id="downPayment"
          label="Pirmā iemaksa"
          unit="€"
          value={input.downPayment}
          step={500}
          onChange={(value) => setInput((prev) => ({ ...prev, downPayment: value }))}
        />
        <NumberField
          id="termMonths"
          label="Termiņš"
          unit="mēneši"
          value={input.termMonths}
          step={6}
          onChange={(value) => setInput((prev) => ({ ...prev, termMonths: value }))}
        />
        <NumberField
          id="loanAnnualRatePercent"
          label="Kredīta gada likme"
          unit="%"
          value={input.loanAnnualRatePercent}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, loanAnnualRatePercent: value }))}
        />
        <NumberField
          id="leaseAnnualRatePercent"
          label="Līzinga gada likme"
          unit="%"
          value={input.leaseAnnualRatePercent}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, leaseAnnualRatePercent: value }))}
        />
        <NumberField
          id="residualValuePercent"
          label="Atlikusī vērtība"
          unit="%"
          value={input.residualValuePercent}
          step={5}
          onChange={(value) => setInput((prev) => ({ ...prev, residualValuePercent: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Pēc kredīta termiņa beigām auto pieder tev. Pēc līzinga termiņa beigām auto jāatdod, jāizpērk par
        atlikušo vērtību, vai jāatjauno līgums, tāpēc zemāks mēneša maksājums nenozīmē automātiski
        izdevīgāku izvēli.
      </p>

      <Breakdown
        rows={[
          { label: 'Kredīta maksājums mēnesī', value: formatCurrencyEUR(result.loanMonthlyPayment) },
          { label: 'Līzinga maksājums mēnesī', value: formatCurrencyEUR(result.leaseMonthlyPayment) },
          { label: 'Kredīta kopējās izmaksas', value: formatCurrencyEUR(result.loanTotalCost) },
          { label: 'Līzinga kopējās izmaksas', value: formatCurrencyEUR(result.leaseTotalCost) },
        ]}
      />
    </div>
  );
}
