'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { calculatePromiles, type PromilesDzimums, type PromilesInputs } from '@/lib/calculators/promiles';

const SEX_LABELS: Record<PromilesDzimums, string> = {
  male: 'Vīrietis',
  female: 'Sieviete',
};

const DEFAULT_INPUT: PromilesInputs = {
  sex: 'male',
  weightKg: 80,
  volumeMl: 500,
  abvPercent: 5,
  hoursElapsed: 1,
};

export function PromilesCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculatePromiles(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="reveal flex flex-col gap-2" style={{ animationDelay: '60ms' }}>
        <div className="flex flex-col gap-2 sm:flex-row">
          {(Object.keys(SEX_LABELS) as PromilesDzimums[]).map((value) => (
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
          id="weightKg"
          label="Svars"
          unit="kg"
          value={input.weightKg}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, weightKg: value }))}
        />
        <NumberField
          id="hoursElapsed"
          label="Laiks kopš dzeršanas sākuma"
          unit="h"
          value={input.hoursElapsed}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, hoursElapsed: value }))}
        />
        <NumberField
          id="volumeMl"
          label="Izdzertais tilpums"
          unit="ml"
          value={input.volumeMl}
          step={50}
          onChange={(value) => setInput((prev) => ({ ...prev, volumeMl: value }))}
        />
        <NumberField
          id="abvPercent"
          label="Alkohola saturs"
          unit="%"
          value={input.abvPercent}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, abvPercent: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Aptuvenais alkohola līmenis asinīs</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.bloodAlcoholPermille.toFixed(2)} ‰
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins balstās uz Vidmarka formulu un ir tikai aptuvens novērtējums; individuālas atšķirības
        vielmaiņā, ēdiena daudzums un citi faktori var mainīt reālo līmeni ievērojami. Šis rezultāts
        nekādā gadījumā nav derīgs juridisks vai medicīnisks mērījums un nedrīkst kalpot par pamatu
        lēmumam vadīt transportlīdzekli. Vienīgais uzticamais mērījums ir oficiāls elpas vai asins
        tests.
      </p>
    </div>
  );
}
