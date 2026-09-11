'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { calculateUzkrajumi, type UzkrajumuInputs } from '@/lib/calculators/uzkrajumi';

const DEFAULT_INPUT: UzkrajumuInputs = {
  initialAmountEur: 1000,
  monthlyContributionEur: 100,
  annualReturnPercent: 6,
  years: 10,
};

export function UzkrajumuCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateUzkrajumi(input), [input]);

  return (
    <div className="flex flex-col gap-6">
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

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Uzkrātā summa</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.futureValueEur.toFixed(2)} EUR
          </dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Kopā iemaksāts</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.totalContributedEur.toFixed(2)} EUR
          </dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Pieaugums no procentiem</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.totalGrowthEur.toFixed(2)} EUR
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins pieņem, ka ienesīgums ir vienmērīgs visā termiņā un iemaksas notiek katru mēnesi.
        Reālos ieguldījumos ienesīgums svārstās gadu no gada, tāpēc šis ir vienkāršots, ilgtermiņa
        orientējošs novērtējums, nevis garantēts rezultāts.
      </p>
    </div>
  );
}
