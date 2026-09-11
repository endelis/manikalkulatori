'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { calculateUdensNorma, type UdensNormasInputs } from '@/lib/calculators/udens-norma';

const DEFAULT_INPUT: UdensNormasInputs = {
  weightKg: 75,
};

export function UdensNormasCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateUdensNorma(input), [input]);

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
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Ieteicamā ūdens norma dienā</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.waterLiters.toFixed(2)} L
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins balstās uz vispārpieņemtu vadlīniju: 33 ml ūdens uz kilogramu ķermeņa svara dienā.
        Faktiskā vajadzība palielinās karstā laikā, fiziskas slodzes laikā un slimības gadījumā. Šis
        ir orientējošs, nevis medicīnisks rādītājs.
      </p>
    </div>
  );
}
