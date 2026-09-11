'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculateHipotekasMaksajums,
  type HipotekasMaksajumaInputs,
} from '@/lib/calculators/hipotekas-maksajums';

const DEFAULT_INPUT: HipotekasMaksajumaInputs = {
  principalEur: 100000,
  annualRatePercent: 4.5,
  termYears: 25,
};

export function HipotekasMaksajumaCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateHipotekasMaksajums(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: '60ms' }}>
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
          label="Termiņš"
          unit="gadi"
          value={input.termYears}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, termYears: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Ikmēneša maksājums</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.monthlyPaymentEur.toFixed(2)} EUR
          </dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Kopējās izmaksas</dt>
          <dd className="font-mono text-value text-panel-text">{result.totalCostEur.toFixed(2)} EUR</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Pārmaksa (procenti)</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.totalInterestEur.toFixed(2)} EUR
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins izmanto standarta anuitātes formulu ar vienādiem ikmēneša maksājumiem visā termiņa
        laikā. Ievadi reālo gada procentu likmi no sava piedāvājuma; bankas gada procentu likme var
        atšķirties no gada procentu likmes (GPL), kas ietver arī citas maksas.
      </p>
    </div>
  );
}
