'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculateIdealaisSvars,
  type IdealaSvaraDzimums,
  type IdealaSvaraInputs,
} from '@/lib/calculators/idealais-svars';

const SEX_LABELS: Record<IdealaSvaraDzimums, string> = {
  male: 'Vīrietis',
  female: 'Sieviete',
};

const DEFAULT_INPUT: IdealaSvaraInputs = {
  sex: 'male',
  heightCm: 180,
};

export function IdealaSvaraCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateIdealaisSvars(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="reveal flex flex-col gap-2" style={{ animationDelay: '60ms' }}>
        <div className="flex flex-col gap-2 sm:flex-row">
          {(Object.keys(SEX_LABELS) as IdealaSvaraDzimums[]).map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="sex"
                value={value}
                checked={input.sex === value}
                onChange={() => setInput((prev) => ({ ...prev, sex: value }))}
              />
              {SEX_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '90ms' }}>
        <NumberField
          id="heightCm"
          label="Augums"
          unit="cm"
          value={input.heightCm}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, heightCm: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Ideālais svars</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.idealWeightKg.toFixed(1)} kg
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins balstās uz Devina formulu, kas plaši lietota medicīnā kā orientējošs atskaites punkts.
        Formula neņem vērā ķermeņa uzbūvi, muskuļu masu vai vecumu, tāpēc rezultāts ir vispārīgs
        orientieris, nevis individuāls mērķis.
      </p>
    </div>
  );
}
