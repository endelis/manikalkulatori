'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculateTaukuProcents,
  type TaukuProcentaDzimums,
  type TaukuProcentaInputs,
} from '@/lib/calculators/tauku-procents';

const SEX_LABELS: Record<TaukuProcentaDzimums, string> = {
  male: 'Vīrietis',
  female: 'Sieviete',
};

const DEFAULT_INPUT: TaukuProcentaInputs = {
  sex: 'male',
  heightCm: 180,
  neckCm: 38,
  waistCm: 85,
  hipCm: 95,
};

export function TaukuProcentaCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateTaukuProcents(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="reveal flex flex-col gap-2" style={{ animationDelay: '60ms' }}>
        <div className="flex flex-col gap-2 sm:flex-row">
          {(Object.keys(SEX_LABELS) as TaukuProcentaDzimums[]).map((value) => (
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
        <NumberField
          id="neckCm"
          label="Kakla apkārtmērs"
          unit="cm"
          value={input.neckCm}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, neckCm: value }))}
        />
        <NumberField
          id="waistCm"
          label="Vidukļa apkārtmērs"
          unit="cm"
          value={input.waistCm}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, waistCm: value }))}
        />
        {input.sex === 'female' ? (
          <NumberField
            id="hipCm"
            label="Gurnu apkārtmērs"
            unit="cm"
            value={input.hipCm}
            step={0.5}
            onChange={(value) => setInput((prev) => ({ ...prev, hipCm: value }))}
          />
        ) : null}
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Ķermeņa tauku procents</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.bodyFatPercent.toFixed(1)} %
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins balstās uz ASV Jūras kara flotes (Navy) metodi, kas izmanto ķermeņa apkārtmērus.
        Mēri vidukli šaurākajā vietā un kaklu zem balsenes vaļīgi piegulošu mērlenti. Rezultāts ir
        novērtējums, ne precīzs mērījums.
      </p>
    </div>
  );
}
