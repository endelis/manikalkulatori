'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { formatNumber } from '@/lib/format';
import {
  calculateBernuSedeklisaPrasiba,
  type BernuSedeklisaPrasibaInputs,
} from '@/lib/calculators/bernu-sedeklisa-prasiba';

const DEFAULT_INPUT: BernuSedeklisaPrasibaInputs = {
  childHeightCm: 120,
};

export function BernuSedeklisaPrasibaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateBernuSedeklisaPrasiba(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Autosēdeklīša vai paliktņa prasība"
        value={result.isSeatRequired ? 'Nepieciešams' : 'Nav obligāts'}
        tone={result.isSeatRequired ? 'neutral' : 'winner'}
        accentVar={accentVar}
        sublabel={`Robeža: ${formatNumber(result.thresholdCm, 0)} cm augums, nevis vecums`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="childHeightCm"
          label="Bērna augums"
          unit="cm"
          value={input.childHeightCm}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, childHeightCm: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Ceļu satiksmes noteikumu 185. punkts: ja automobilī, kura sēdvietas aprīkotas ar drošības
        jostām, pārvadā bērnu, kura augums nepārsniedz 150 cm, bērnam jāatrodas viņa vecumam un svaram
        piemērotā sēdeklītī vai uz paliktņa, un jābūt piesprādzētam ar drošības jostu. Kritērijs ir
        augums, nevis dzimšanas diena.
      </p>
    </div>
  );
}
