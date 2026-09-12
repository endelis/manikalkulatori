'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ToggleField } from '@/components/ToggleField';
import { ResultCard } from '@/components/ResultCard';
import { formatNumber } from '@/lib/format';
import {
  calculateRiepuProtektoraDzilums,
  type RiepuProtektoraDzilumaInputs,
} from '@/lib/calculators/riepu-protektora-dzilums';

const DEFAULT_INPUT: RiepuProtektoraDzilumaInputs = {
  treadDepthMm: 3,
  isWinterSeason: false,
};

export function RiepuProtektoraDzilumaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateRiepuProtektoraDzilums(input), [input]);
  const warnColor = 'var(--color-warn)';

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Minimālais pieļaujamais protektora dziļums"
        value={`${formatNumber(result.minDepthMm, 1)} mm`}
        tone={result.isCompliant ? 'winner' : 'loser'}
        accentVar={accentVar}
        sublabel={
          result.isCompliant
            ? 'Riepa atbilst prasībai'
            : `Trūkst ${formatNumber(result.shortfallMm, 1)} mm līdz prasībai`
        }
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="treadDepthMm"
          label="Riepas protektora dziļums"
          unit="mm"
          value={input.treadDepthMm}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, treadDepthMm: value }))}
        />
        <ToggleField
          id="isWinterSeason"
          label="Vai šobrīd ir obligātā ziemas riepu lietošanas sezona (1. decembris līdz 1. martam)?"
          value={input.isWinterSeason}
          onChange={(value) => setInput((prev) => ({ ...prev, isWinterSeason: value }))}
          trueLabel="Jā"
          falseLabel="Nē"
        />
      </div>

      <p className="text-caption text-panel-faint" style={!result.isCompliant ? { color: warnColor } : undefined}>
        Prasība noteikta MK noteikumos Nr. 295 &quot;Noteikumi par transportlīdzekļu valsts tehnisko
        apskati un tehnisko kontroli uz ceļa&quot;: vieglajam automobilim protektora dziļums ne mazāks
        par 1,6 mm parastā periodā, un ne mazāks par 4 mm obligātās ziemas riepu lietošanas periodā.
      </p>
    </div>
  );
}
