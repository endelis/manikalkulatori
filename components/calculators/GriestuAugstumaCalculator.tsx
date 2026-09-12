'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { SelectField } from '@/components/SelectField';
import { ResultCard } from '@/components/ResultCard';
import { formatNumber } from '@/lib/format';
import {
  calculateGriestuAugstums,
  type GriestuAugstumaInputs,
  type TelpasVeids,
} from '@/lib/calculators/griestu-augstums';

const DEFAULT_INPUT: GriestuAugstumaInputs = {
  ceilingHeightM: 2.5,
  roomType: 'dzivojama-telpa',
};

const ROOM_TYPE_OPTIONS: { value: TelpasVeids; label: string }[] = [
  { value: 'dzivojama-telpa', label: 'Dzīvojamā telpa (2,5 m)' },
  { value: 'publiska-telpa', label: 'Publiskā telpa, birojs (2,7 m)' },
  { value: 'gaitenis-sanitara-telpa', label: 'Gaitenis, sanitārā telpa (2,2 m)' },
  { value: 'tehniska-telpa', label: 'Tehniskā telpa, pagrabs (1,8 m)' },
];

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
        <SelectField
          id="roomType"
          label="Telpas veids"
          value={input.roomType}
          options={ROOM_TYPE_OPTIONS}
          onChange={(value) => setInput((prev) => ({ ...prev, roomType: value as TelpasVeids }))}
        />
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
        Prasības noteiktas LBN 200-21 7. punktā: minimālais augstums no tīrās grīdas atzīmes līdz
        griestu konstrukcijas apdares apakšējai virsmai, atkarībā no telpas veida.
      </p>
    </div>
  );
}
