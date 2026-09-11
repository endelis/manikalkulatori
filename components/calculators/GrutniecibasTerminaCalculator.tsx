'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculateGrutniecibasTermins,
  type GrutniecibasTerminaInputs,
} from '@/lib/calculators/grutniecibas-termins';

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

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`;
}

const DEFAULT_INPUT: Omit<GrutniecibasTerminaInputs, 'today'> = {
  lmpYear: 2026,
  lmpMonth: 1,
  lmpDay: 1,
};

export function GrutniecibasTerminaCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const today = useMemo(() => todayIso(), []);

  const result = useMemo(
    () => calculateGrutniecibasTermins({ ...input, today }),
    [input, today],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="lmpDay"
          label="Pēdējo menstruāciju diena"
          unit=""
          value={input.lmpDay}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, lmpDay: value }))}
        />
        <NumberField
          id="lmpMonth"
          label="Mēnesis"
          unit=""
          value={input.lmpMonth}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, lmpMonth: value }))}
        />
        <NumberField
          id="lmpYear"
          label="Gads"
          unit=""
          value={input.lmpYear}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, lmpYear: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Paredzamais dzemdību termiņš</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.dueDate
              ? `${result.dueDate.day}. ${MONTH_NAMES[result.dueDate.month - 1]} ${result.dueDate.year}`
              : 'Nederīgs datums'}
          </dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Pašreizējais grūtniecības vecums</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.gestationalWeeks} ned. {result.gestationalDaysRemainder} d.
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins balstās uz Negēles likumu: paredzamais termiņš ir 280 dienas (40 nedēļas) pēc pēdējo
        menstruāciju pirmās dienas. Šis ir informatīvs aprēķins, nevis medicīnisks slēdziens; reālais
        dzemdību datums var atšķirties par vairākām nedēļām. Precīzu termiņu nosaka ārsts, izmantojot
        arī ultrasonogrāfiju.
      </p>
    </div>
  );
}
