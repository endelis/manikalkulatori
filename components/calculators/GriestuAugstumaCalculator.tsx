'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { formatNumber } from '@/lib/format';
import { calculateGriestuAugstums, type GriestuAugstumaInputs } from '@/lib/calculators/griestu-augstums';

const DEFAULT_INPUT: GriestuAugstumaInputs = {
  ceilingHeightM: 2.5,
};

export function GriestuAugstumaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateGriestuAugstums(input), [input]);
  const warnColor = 'var(--color-warn)';

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Minimālais griestu augstums"
        value={`${formatNumber(result.minHeightM, 2)} m`}
        tone={result.isCompliant ? 'winner' : 'loser'}
        accentVar={accentVar}
        sublabel={
          result.isCompliant
            ? 'Ievadītais augstums atbilst prasībai'
            : `Trūkst ${formatNumber(result.shortfallM, 2)} m līdz prasībai`
        }
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="ceilingHeightM"
          label="Telpas griestu augstums"
          unit="m"
          value={input.ceilingHeightM}
          step={0.05}
          onChange={(value) => setInput((prev) => ({ ...prev, ceilingHeightM: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint" style={!result.isCompliant ? { color: warnColor } : undefined}>
        Prasība attiecas uz dzīvojamām telpām (LBN 200-21, 7.2. punkts): griestu augstums no tīrās
        grīdas atzīmes ne mazāks par 2,5 m.
      </p>
    </div>
  );
}
