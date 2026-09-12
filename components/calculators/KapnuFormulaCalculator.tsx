'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { formatNumber } from '@/lib/format';
import { calculateKapnuFormula, type KapnuFormulaInputs } from '@/lib/calculators/kapnu-formula';

const DEFAULT_INPUT: KapnuFormulaInputs = {
  riserHeightCm: 17,
  treadDepthCm: 28,
};

export function KapnuFormulaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateKapnuFormula(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="2 × pakāpiena augstums + platums"
        value={`${formatNumber(result.formulaSumCm, 0)} cm`}
        tone={result.isComfortable ? 'winner' : 'loser'}
        accentVar={accentVar}
        sublabel={
          result.isComfortable
            ? 'Ērtā diapazonā (60 līdz 64 cm)'
            : `${formatNumber(result.differenceFromRangeCm, 0)} cm ārpus ērtā diapazona (60 līdz 64 cm)`
        }
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="riserHeightCm"
          label="Pakāpiena augstums"
          unit="cm"
          value={input.riserHeightCm}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, riserHeightCm: value }))}
        />
        <NumberField
          id="treadDepthCm"
          label="Pakāpiena platums (dziļums)"
          unit="cm"
          value={input.treadDepthCm}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, treadDepthCm: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Blondela formula ir plaši atzīts, gadsimtiem pārbaudīts ērtuma princips, nevis Latvijas
        normatīvs. Konkrētiem kāpņu drošības nosacījumiem (margu augstums, laida platums) konsultējies
        ar būvspeciālistu.
      </p>
    </div>
  );
}
