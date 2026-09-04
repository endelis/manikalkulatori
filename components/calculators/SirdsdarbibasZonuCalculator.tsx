'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { calculateSirdsdarbibasZonas, type SirdsdarbibasZonuInputs } from '@/lib/calculators/sirdsdarbibas-zonas';

const DEFAULT_INPUT: SirdsdarbibasZonuInputs = {
  maxHeartRate: 190,
  restingHeartRate: 60,
};

export function SirdsdarbibasZonuCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateSirdsdarbibasZonas(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="maxHeartRate"
          label="Maksimālais pulss"
          unit="bpm"
          value={input.maxHeartRate}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, maxHeartRate: value }))}
        />
        <NumberField
          id="restingHeartRate"
          label="Miera pulss"
          unit="bpm"
          value={input.restingHeartRate}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, restingHeartRate: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        {result.zones.map((zone) => (
          <div key={zone.name} className="flex items-center justify-between px-4 py-2">
            <dt className="text-sm text-panel-muted">{zone.name}</dt>
            <dd className="font-mono text-value text-panel-text">
              {zone.minBpm} līdz {zone.maxBpm} bpm
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins izmanto Karvonena metodi, kas ņem vērā gan maksimālo, gan miera pulsu, tāpēc precīzāk
        atspoguļo individuālo fizisko sagatavotību nekā vienkāršas procentuālas zonas no maksimālā pulsa
        vien.
      </p>
    </div>
  );
}
