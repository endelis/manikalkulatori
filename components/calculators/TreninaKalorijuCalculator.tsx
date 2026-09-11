'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculateTreninaKalorijas,
  type TreninaAktivitate,
  type TreninaKalorijuInputs,
} from '@/lib/calculators/trenina-kalorijas';

const ACTIVITY_LABELS: Record<TreninaAktivitate, string> = {
  walking: 'Iešana',
  running: 'Skriešana',
  cycling: 'Riteņbraukšana',
  swimming: 'Peldēšana',
};

const DEFAULT_INPUT: TreninaKalorijuInputs = {
  activity: 'running',
  weightKg: 75,
  durationMinutes: 30,
};

export function TreninaKalorijuCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateTreninaKalorijas(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="reveal flex flex-col gap-2" style={{ animationDelay: '60ms' }}>
        <div className="flex flex-col gap-2 sm:flex-row">
          {(Object.keys(ACTIVITY_LABELS) as TreninaAktivitate[]).map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="activity"
                value={value}
                checked={input.activity === value}
                onChange={() => setInput((prev) => ({ ...prev, activity: value }))}
              />
              {ACTIVITY_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '90ms' }}>
        <NumberField
          id="weightKg"
          label="Ķermeņa svars"
          unit="kg"
          value={input.weightKg}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, weightKg: value }))}
        />
        <NumberField
          id="durationMinutes"
          label="Treniņa ilgums"
          unit="min"
          value={input.durationMinutes}
          step={5}
          onChange={(value) => setInput((prev) => ({ ...prev, durationMinutes: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Sadedzinātās kalorijas</dt>
          <dd className="font-mono text-value text-panel-text">
            {Math.round(result.caloriesBurned)} kcal
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins balstās uz MET (vielmaiņas ekvivalenta) formulu: kalorijas ir aktivitātes MET vērtība
        reizināta ar svaru kilogramos un ilgumu stundās. Vērtības ir vidējas mērena intensitātes
        aktivitātei, reāls patēriņš atkarīgs no tempa un individuālām atšķirībām.
      </p>
    </div>
  );
}
