'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculateHipotekasParmaksa,
  type HipotekasParmaksasInputs,
} from '@/lib/calculators/hipotekas-parmaksa';

const DEFAULT_INPUT: HipotekasParmaksasInputs = {
  principalEur: 100000,
  annualRatePercent: 4.5,
  termYears: 25,
  extraMonthlyPaymentEur: 100,
};

function formatMonths(months: number): string {
  const wholeMonths = Math.round(months);
  const years = Math.floor(wholeMonths / 12);
  const remMonths = wholeMonths % 12;
  if (years === 0) return `${remMonths} mēn.`;
  if (remMonths === 0) return `${years} g.`;
  return `${years} g. ${remMonths} mēn.`;
}

export function HipotekasParmaksasCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateHipotekasParmaksa(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="principalEur"
          label="Hipotēkas summa"
          unit="EUR"
          value={input.principalEur}
          step={1000}
          onChange={(value) => setInput((prev) => ({ ...prev, principalEur: value }))}
        />
        <NumberField
          id="annualRatePercent"
          label="Gada procentu likme"
          unit="%"
          value={input.annualRatePercent}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, annualRatePercent: value }))}
        />
        <NumberField
          id="termYears"
          label="Sākotnējais termiņš"
          unit="gadi"
          value={input.termYears}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, termYears: value }))}
        />
        <NumberField
          id="extraMonthlyPaymentEur"
          label="Papildu ikmēneša maksājums"
          unit="EUR"
          value={input.extraMonthlyPaymentEur}
          step={10}
          onChange={(value) => setInput((prev) => ({ ...prev, extraMonthlyPaymentEur: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Ietaupītie procenti</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.interestSavedEur.toFixed(2)} EUR
          </dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Ātrāka atmaksa par</dt>
          <dd className="font-mono text-value text-panel-text">{formatMonths(result.monthsSaved)}</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Jaunais atmaksas laiks</dt>
          <dd className="font-mono text-value text-panel-text">
            {formatMonths(result.newPayoffMonths)}
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins pieņem, ka papildu summa katru mēnesi tiek pievienota parastajam maksājumam un pilnībā
        novirzīta pamatsummas samazināšanai. Pārliecinies, vai tavai hipotēkai nav priekšlaicīgas
        atmaksas komisijas, pirms maksā vairāk par grafiku.
      </p>
    </div>
  );
}
