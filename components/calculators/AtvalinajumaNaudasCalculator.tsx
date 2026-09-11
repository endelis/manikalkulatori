'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculateAtvalinajumaNauda,
  type AtvalinajumaNaudasInputs,
} from '@/lib/calculators/atvalinajuma-nauda';

const DEFAULT_INPUT: AtvalinajumaNaudasInputs = {
  averageDailyEarningsEur: 40,
  vacationDays: 28,
};

export function AtvalinajumaNaudasCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateAtvalinajumaNauda(input), [input]);

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
          id="vacationDays"
          label="Atvaļinājuma dienas"
          unit="dienas"
          value={input.vacationDays}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, vacationDays: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Atvaļinājuma nauda</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.totalVacationPayEur.toFixed(2)} EUR
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins reizina ievadīto vidējo dienas izpeļņu ar atvaļinājuma dienu skaitu. Vidējo dienas
        izpeļņu darba devējs aprēķina pēc Darba likumā noteiktās metodikas, ņemot vērā iepriekšējo
        sešu mēnešu ienākumus, tāpēc precīzu vērtību der pārbaudīt algas lapiņā vai pie sava
        grāmatveža.
      </p>
    </div>
  );
}
