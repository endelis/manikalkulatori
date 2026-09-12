'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ToggleField } from '@/components/ToggleField';
import { ResultCard } from '@/components/ResultCard';
import { formatNumber } from '@/lib/format';
import {
  calculateDarbaVietasTemperatura,
  type DarbaVietasTemperaturaInputs,
} from '@/lib/calculators/darba-vietas-temperatura';

const DEFAULT_INPUT: DarbaVietasTemperaturaInputs = {
  roomTemperatureC: 22,
  isColdPeriod: true,
};

export function DarbaVietasTemperaturaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateDarbaVietasTemperatura(input), [input]);
  const warnColor = 'var(--color-warn)';

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Pieļaujamais temperatūras diapazons"
        value={`${formatNumber(result.minTemperatureC, 0)} līdz ${formatNumber(result.maxTemperatureC, 0)} °C`}
        tone={result.isCompliant ? 'winner' : 'loser'}
        accentVar={accentVar}
        sublabel={result.isCompliant ? 'Telpas temperatūra atbilst prasībai' : 'Telpas temperatūra neatbilst prasībai'}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="roomTemperatureC"
          label="Telpas gaisa temperatūra"
          unit="°C"
          value={input.roomTemperatureC}
          step={0.5}
          min={-30}
          onChange={(value) => setInput((prev) => ({ ...prev, roomTemperatureC: value }))}
        />
        <ToggleField
          id="isColdPeriod"
          label="Vai āra gaisa vidējā temperatūra pēdējā laikā ir +10 °C vai mazāk?"
          value={input.isColdPeriod}
          onChange={(value) => setInput((prev) => ({ ...prev, isColdPeriod: value }))}
          trueLabel="Jā (auksts periods)"
          falseLabel="Nē (silts periods)"
        />
      </div>

      <p className="text-caption text-panel-faint" style={!result.isCompliant ? { color: warnColor } : undefined}>
        Prasība noteikta MK noteikumos Nr. 359 &quot;Darba aizsardzības prasības darba vietās&quot;,
        1. pielikumā, I darba kategorijai (darbs bez fiziskas piepūles vai ar nelielu piepūli,
        piemēram, biroja darbs). Fiziski smagākiem darba veidiem (II un III kategorija) ir citi,
        plašāki diapazoni, ko šis kalkulators nerēķina.
      </p>
    </div>
  );
}
