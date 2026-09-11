'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { calculateVo2max, type Vo2maxInputs } from '@/lib/calculators/vo2max';

const DEFAULT_INPUT: Vo2maxInputs = {
  distanceMeters: 2800,
};

function fitnessLabel(vo2max: number): string {
  if (vo2max < 25) return 'Zems';
  if (vo2max < 34) return 'Zemāks nekā vidēji';
  if (vo2max < 43) return 'Vidējs';
  if (vo2max < 52) return 'Labs';
  return 'Izcils';
}

export function Vo2maxCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateVo2max(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="distanceMeters"
          label="Nobrauktā distance 12 minūtēs"
          unit="m"
          value={input.distanceMeters}
          step={50}
          onChange={(value) => setInput((prev) => ({ ...prev, distanceMeters: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">VO2max</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.vo2max.toFixed(1)} ml/kg/min
          </dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Novērtējums</dt>
          <dd className="font-mono text-value text-panel-text">{fitnessLabel(result.vo2max)}</dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins balstās uz Kūpera 12 minūšu skriešanas testu. Skrien vai skrien un ej maksimāli tālu
        12 minūtēs, tad ievadi nobraukto distanci metros. Novērtējuma robežas ir vispārīgas un neņem
        vērā vecumu vai dzimumu.
      </p>
    </div>
  );
}
