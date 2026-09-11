'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR } from '@/lib/format';
import {
  calculateIeguldijumuKonta,
  type IeguldijumuKontaInputs,
} from '@/lib/calculators/ieguldijumu-konta-nodoklu-kalkulators';

const DEFAULT_INPUT: IeguldijumuKontaInputs = {
  initialAmountEur: 0,
  monthlyContributionEur: 100,
  annualReturnPercent: 6,
  years: 15,
};

export function IeguldijumuKontaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateIeguldijumuKonta(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Ietaupījums no nodokļa atlikšanas"
        value={formatCurrencyEUR(result.taxDeferralBenefitEur)}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`Ieguldījumu kontā pēc nodokļa: ${formatCurrencyEUR(result.investmentAccountNetEur)}`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="initialAmountEur"
          label="Sākuma summa"
          unit="EUR"
          value={input.initialAmountEur}
          step={100}
          onChange={(value) => setInput((prev) => ({ ...prev, initialAmountEur: value }))}
        />
        <NumberField
          id="monthlyContributionEur"
          label="Ikmēneša iemaksa"
          unit="EUR"
          value={input.monthlyContributionEur}
          step={10}
          onChange={(value) => setInput((prev) => ({ ...prev, monthlyContributionEur: value }))}
        />
        <NumberField
          id="annualReturnPercent"
          label="Gada ienesīgums"
          unit="%"
          value={input.annualReturnPercent}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, annualReturnPercent: value }))}
        />
        <NumberField
          id="years"
          label="Termiņš"
          unit="gadi"
          value={input.years}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, years: value }))}
        />
      </div>

      <Breakdown
        rows={[
          { label: 'Vērtība pirms nodokļa', value: formatCurrencyEUR(result.futureValueEur) },
          { label: 'Kopā iemaksāts', value: formatCurrencyEUR(result.totalContributedEur) },
          { label: 'Nodoklis ieguldījumu kontā (vienreiz, izņemot)', value: formatCurrencyEUR(result.investmentAccountTaxEur) },
          { label: 'Vērtība parastā kontā (nodoklis ik gadu)', value: formatCurrencyEUR(result.regularAccountNetEur) },
        ]}
      />

      <p className="text-caption text-panel-faint">
        Parastā konta summa pieņem sliktāko gadījumu, ka katra gada peļņa tiek realizēta un aplikta ar
        nodokli tajā pašā gadā. Reālā parastā konta nodokļa aplikšana atkarīga no tā, cik bieži faktiski
        pārdod un pērc, tāpēc šī ir ilustratīva augšējā robeža nodokļa ietekmei, nevis konkrēta
        prognoze.
      </p>
    </div>
  );
}
