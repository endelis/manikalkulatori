'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ToggleField } from '@/components/ToggleField';
import { ResultCard } from '@/components/ResultCard';
import { formatNumber } from '@/lib/format';
import {
  calculateBaseinaUdensTemperatura,
  type BaseinaUdensTemperaturaInputs,
} from '@/lib/calculators/baseina-udens-temperatura';

const DEFAULT_INPUT: BaseinaUdensTemperaturaInputs = {
  waterTemperatureC: 28,
  isChildrenPool: false,
};

export function BaseinaUdensTemperaturaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateBaseinaUdensTemperatura(input), [input]);
  const warnColor = 'var(--color-warn)';

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Pieļaujamais ūdens temperatūras diapazons"
        value={`${formatNumber(result.minTemperatureC, 0)} līdz ${formatNumber(result.maxTemperatureC, 0)} °C`}
        tone={result.isCompliant ? 'winner' : 'loser'}
        accentVar={accentVar}
        sublabel={result.isCompliant ? 'Ūdens temperatūra atbilst prasībai' : 'Ūdens temperatūra neatbilst prasībai'}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="waterTemperatureC"
          label="Baseina ūdens temperatūra"
          unit="°C"
          value={input.waterTemperatureC}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, waterTemperatureC: value }))}
        />
        <ToggleField
          id="isChildrenPool"
          label="Vai baseins paredzēts tikai bērniem?"
          value={input.isChildrenPool}
          onChange={(value) => setInput((prev) => ({ ...prev, isChildrenPool: value }))}
          trueLabel="Jā"
          falseLabel="Nē"
        />
      </div>

      <p className="text-caption text-panel-faint" style={!result.isCompliant ? { color: warnColor } : undefined}>
        Prasība noteikta MK noteikumu Nr. 470 &quot;Higiēnas prasības baseina un pirts
        pakalpojumiem&quot; 15. punktā. Telpas gaisa temperatūrai jābūt par 1 līdz 3 °C augstākai par
        ūdens temperatūru, bet ne zemākai par 26 °C (16. punkts).
      </p>
    </div>
  );
}
