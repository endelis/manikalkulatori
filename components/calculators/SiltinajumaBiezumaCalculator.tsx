'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { formatNumber } from '@/lib/format';
import {
  calculateSiltinajumaBiezums,
  type SiltinajumaBiezumaInputs,
} from '@/lib/calculators/siltinajuma-biezums';

const DEFAULT_INPUT: SiltinajumaBiezumaInputs = {
  maxUValue: 0.2, // jumti un pārsegumi, dzīvojamām ēkām, LBN 002-19
  materialLambda: 0.037, // tipiska minerālvate
};

export function SiltinajumaBiezumaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateSiltinajumaBiezums(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Nepieciešamais siltinājuma biezums"
        value={`${formatNumber(result.requiredThicknessMm, 0)} mm`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`${formatNumber(result.requiredThicknessCm, 1)} cm`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="maxUValue"
          label="Pieļaujamais U (siltuma caurlaidība)"
          unit="W/(m²·K)"
          value={input.maxUValue}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, maxUValue: value }))}
        />
        <NumberField
          id="materialLambda"
          label="Materiāla λ (siltumvadītspēja)"
          unit="W/(m·K)"
          value={input.materialLambda}
          step={0.001}
          onChange={(value) => setInput((prev) => ({ ...prev, materialLambda: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Noklusējuma vērtības atbilst jumtam vai pārsegumam dzīvojamā ēkā un tipiskai minerālvatei.
        Sadaļā zemāk atrodami vērtību diapazoni citiem konstrukcijas elementiem un materiāliem.
      </p>
    </div>
  );
}
