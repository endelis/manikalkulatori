'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculateSlimibasNauda,
  type SlimibasNaudasInputs,
} from '@/lib/calculators/slimibas-nauda';

const DEFAULT_INPUT: SlimibasNaudasInputs = {
  averageDailyEarningsEur: 40,
  sickDays: 9,
};

export function SlimibasNaudasCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateSlimibasNauda(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="averageDailyEarningsEur"
          label="Vidējā dienas izpeļņa"
          unit="EUR"
          value={input.averageDailyEarningsEur}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, averageDailyEarningsEur: value }))}
        />
        <NumberField
          id="sickDays"
          label="Darbnespējas dienu skaits"
          unit="dienas"
          value={input.sickDays}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, sickDays: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Slimības nauda no darba devēja</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.totalSickPayEur.toFixed(2)} EUR
          </dd>
        </div>
        {result.stateBenefitDaysFrom ? (
          <div className="flex items-center justify-between px-4 py-2">
            <dt className="text-sm text-panel-muted">Valsts pabalsts sākas</dt>
            <dd className="font-mono text-value text-panel-text">
              {result.stateBenefitDaysFrom}. dienā
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="text-caption text-panel-faint">
        Pirmā darbnespējas diena nav apmaksāta, 2. un 3. dienā darba devējs maksā ne mazāk kā 75
        procentus no vidējās izpeļņas, no 4. līdz 9. dienai ne mazāk kā 80 procentus. No 10. dienas
        darbnespējas pabalstu izmaksā Valsts sociālās apdrošināšanas aģentūra, nevis darba devējs.
      </p>
    </div>
  );
}
