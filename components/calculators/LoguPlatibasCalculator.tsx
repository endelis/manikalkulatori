'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { formatNumber } from '@/lib/format';
import {
  calculateLoguPlatibasAttieciba,
  type LoguPlatibasInputs,
} from '@/lib/calculators/logu-platibas-attieciba';

const DEFAULT_INPUT: LoguPlatibasInputs = {
  floorAreaM2: 16,
  plannedWindowAreaM2: 2,
};

export function LoguPlatibasCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateLoguPlatibasAttieciba(input), [input]);
  const warnColor = 'var(--color-warn)';

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Minimālā nepieciešamā logu platība"
        value={`${formatNumber(result.requiredWindowAreaM2, 2)} m²`}
        tone={result.isCompliant ? 'winner' : 'loser'}
        accentVar={accentVar}
        sublabel={
          result.isCompliant
            ? 'Ievadītā logu platība atbilst prasībai'
            : `Trūkst ${formatNumber(result.shortfallM2, 2)} m² līdz prasībai`
        }
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="floorAreaM2"
          label="Telpas grīdas platība"
          unit="m²"
          value={input.floorAreaM2}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, floorAreaM2: value }))}
        />
        <NumberField
          id="plannedWindowAreaM2"
          label="Loga (stikla) platība"
          unit="m²"
          value={input.plannedWindowAreaM2}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, plannedWindowAreaM2: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint" style={!result.isCompliant ? { color: warnColor } : undefined}>
        Prasība attiecas uz dzīvojamām telpām un virtuvēm (LBN 200-21, 99. punkts): logu platības
        attiecība pret grīdas platību ne mazāka par 1:8.
      </p>
    </div>
  );
}
