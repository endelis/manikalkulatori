'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { calculateKmi, type KmiCategory, type KmiInputs } from '@/lib/calculators/kmi-kalkulators';

const CATEGORY_LABELS: Record<KmiCategory, string> = {
  underweight: 'Nepietiekams svars',
  normal: 'Normāls svars',
  overweight: 'Liekais svars',
  obese: 'Aptaukošanās',
};

const DEFAULT_INPUT: KmiInputs = {
  weightKg: 70,
  heightCm: 175,
};

export function KmiKalkulators({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateKmi(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
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
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">ĶMI</dt>
          <dd className="font-mono text-value text-panel-text">{result.bmi.toFixed(1)}</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Kategorija</dt>
          <dd className="font-mono text-value text-panel-text">{CATEGORY_LABELS[result.category]}</dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Ķermeņa masas indekss (ĶMI) aprēķināts, dalot svaru kilogramos ar augumu metros kvadrātā, pēc
        Pasaules Veselības organizācijas standarta klasifikācijas. Šis ir vispārīgs orientējošs rādītājs,
        nevis medicīnisks slēdziens; tas neņem vērā muskuļu masu, vecumu vai ķermeņa uzbūvi.
      </p>
    </div>
  );
}
