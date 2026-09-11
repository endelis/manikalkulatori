'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculateKalorijuNorma,
  type KalorijuNormasAktivitate,
  type KalorijuNormasDzimums,
  type KalorijuNormasInputs,
} from '@/lib/calculators/kaloriju-norma';

const SEX_LABELS: Record<KalorijuNormasDzimums, string> = {
  male: 'Vīrietis',
  female: 'Sieviete',
};

const ACTIVITY_LABELS: Record<KalorijuNormasAktivitate, string> = {
  sedentary: 'Mazkustīgs (nav treniņu)',
  light: 'Viegla aktivitāte (1-3 treniņi nedēļā)',
  moderate: 'Vidēja aktivitāte (3-5 treniņi nedēļā)',
  active: 'Augsta aktivitāte (6-7 treniņi nedēļā)',
  veryActive: 'Ļoti augsta aktivitāte (fizisks darbs vai divi treniņi dienā)',
};

const DEFAULT_INPUT: KalorijuNormasInputs = {
  sex: 'male',
  weightKg: 80,
  heightCm: 180,
  age: 30,
  activityLevel: 'moderate',
};

export function KalorijuNormasCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateKalorijuNorma(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="reveal flex flex-col gap-2" style={{ animationDelay: '60ms' }}>
        <div className="flex flex-col gap-2 sm:flex-row">
          {(Object.keys(SEX_LABELS) as KalorijuNormasDzimums[]).map((value) => (
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

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: '90ms' }}>
        <NumberField
          id="weightKg"
          label="Svars"
          unit="kg"
          value={input.weightKg}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, weightKg: value }))}
        />
        <NumberField
          id="heightCm"
          label="Augums"
          unit="cm"
          value={input.heightCm}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, heightCm: value }))}
        />
        <NumberField
          id="age"
          label="Vecums"
          unit="gadi"
          value={input.age}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, age: value }))}
        />
      </div>

      <fieldset className="reveal flex flex-col gap-2" style={{ animationDelay: '120ms' }}>
        <div className="flex flex-col gap-2">
          {(Object.keys(ACTIVITY_LABELS) as KalorijuNormasAktivitate[]).map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="activityLevel"
                value={value}
                checked={input.activityLevel === value}
                onChange={() => setInput((prev) => ({ ...prev, activityLevel: value }))}
              />
              {ACTIVITY_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Bazālais metabolisms (BMR)</dt>
          <dd className="font-mono text-value text-panel-text">{Math.round(result.bmr)} kcal</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Dienas kaloriju norma (TDEE)</dt>
          <dd className="font-mono text-value text-panel-text">{Math.round(result.tdee)} kcal</dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        BMR aprēķināts pēc Mifflin-St Jeor formulas, TDEE iegūts, reizinot BMR ar aktivitātes līmeņa
        koeficientu. Šis ir vispārīgs novērtējums, individuālā vielmaiņa var atšķirties.
      </p>
    </div>
  );
}
