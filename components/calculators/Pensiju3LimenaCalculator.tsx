'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR } from '@/lib/format';
import {
  calculatePensiju3Limena,
  type Pensiju3LimenaInputs,
} from '@/lib/calculators/pensiju-3-limena-kalkulators';

const DEFAULT_INPUT: Pensiju3LimenaInputs = {
  monthlyContributionEur: 50,
  annualReturnPercent: 5,
  years: 20,
  annualGrossIncomeEur: 21780, // 1815 EUR/month, 2025 CSP average, context only
};

export function Pensiju3LimenaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculatePensiju3Limena(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Uzkrātā summa pensiju 3. līmenī"
        value={formatCurrencyEUR(result.futureValueEur)}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`Plus ${formatCurrencyEUR(result.totalTaxRefundEur)} IIN atmaksā kopā par visiem gadiem`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
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
          label="Termiņš līdz pensijai"
          unit="gadi"
          value={input.years}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, years: value }))}
        />
        <NumberField
          id="annualGrossIncomeEur"
          label="Gada bruto ienākumi"
          unit="EUR"
          value={input.annualGrossIncomeEur}
          step={500}
          onChange={(value) => setInput((prev) => ({ ...prev, annualGrossIncomeEur: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Gada bruto ienākumi nosaka, cik liela iemaksas daļa ir tiesīga uz IIN atmaksu (10% no ienākuma,
        ne vairāk kā 4000 EUR gadā). Iemaksas virs šī apmēra joprojām aug uzkrājumā, bet par tām atmaksu
        nesaņem.
      </p>

      <Breakdown
        rows={[
          { label: 'Kopā iemaksāts', value: formatCurrencyEUR(result.totalContributedEur) },
          { label: 'Pieaugums no ienesīguma', value: formatCurrencyEUR(result.totalGrowthEur) },
          { label: 'IIN atmaksa gadā', value: formatCurrencyEUR(result.annualTaxRefundEur) },
          { label: 'IIN atmaksa kopā', value: formatCurrencyEUR(result.totalTaxRefundEur) },
        ]}
      />
    </div>
  );
}
