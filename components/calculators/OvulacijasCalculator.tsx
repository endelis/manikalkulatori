'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { calculateOvulacija, type OvulacijasInputs } from '@/lib/calculators/ovulacija';

const MONTH_NAMES = [
  'janvāris',
  'februāris',
  'marts',
  'aprīlis',
  'maijs',
  'jūnijs',
  'jūlijs',
  'augusts',
  'septembris',
  'oktobris',
  'novembris',
  'decembris',
];

function formatDate(d: { year: number; month: number; day: number } | null): string {
  if (!d) return 'Nederīgs datums';
  return `${d.day}. ${MONTH_NAMES[d.month - 1]}`;
}

const DEFAULT_INPUT: OvulacijasInputs = {
  lmpYear: 2026,
  lmpMonth: 1,
  lmpDay: 1,
  cycleLengthDays: 28,
};

export function OvulacijasCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateOvulacija(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-4" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="lmpDay"
          label="Pēdējo menstruāciju diena"
          value={input.lmpDay}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, lmpDay: value }))}
        />
        <NumberField
          id="lmpMonth"
          label="Mēnesis"
          value={input.lmpMonth}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, lmpMonth: value }))}
        />
        <NumberField
          id="lmpYear"
          label="Gads"
          value={input.lmpYear}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, lmpYear: value }))}
        />
        <NumberField
          id="cycleLengthDays"
          label="Cikla garums"
          unit="dienas"
          value={input.cycleLengthDays}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, cycleLengthDays: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Paredzamā ovulācijas diena</dt>
          <dd className="font-mono text-value text-panel-text">{formatDate(result.ovulationDate)}</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Auglīgais periods</dt>
          <dd className="font-mono text-value text-panel-text">
            {formatDate(result.fertileWindowStart)} līdz {formatDate(result.fertileWindowEnd)}
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins pieņem, ka ovulācija notiek 14 dienas pirms nākamā cikla sākuma, un auglīgais periods
        ir piecas dienas pirms ovulācijas līdz vienai dienai pēc tās. Šis ir informatīvs aprēķins,
        nevis medicīnisks slēdziens; reālā ovulācijas diena var atšķirties, īpaši, ja cikls nav
        regulārs.
      </p>
    </div>
  );
}
