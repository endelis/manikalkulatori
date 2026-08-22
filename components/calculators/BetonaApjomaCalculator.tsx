'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculateBetonaApjoms, type BetonaApjomaInputs } from '@/lib/calculators/betona-apjoms';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: BetonaApjomaInputs = {
  lengthM: 5,
  widthM: 4,
  thicknessM: 0.1,
  bagYieldM3: 0.012,
};

export function BetonaApjomaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateBetonaApjoms(input), [input]);

  const tweenedVolume = useTweenedNumber(result.volumeM3);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Nepieciešamais betona apjoms"
        value={`${formatNumber(tweenedVolume, 2)} m³`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`${formatNumber(result.bagsNeeded, 0)} maisi`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="lengthM"
          label="Garums"
          unit="m"
          value={input.lengthM}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, lengthM: value }))}
        />
        <NumberField
          id="widthM"
          label="Platums"
          unit="m"
          value={input.widthM}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, widthM: value }))}
        />
        <NumberField
          id="thicknessM"
          label="Biezums"
          unit="m"
          value={input.thicknessM}
          step={0.01}
          onChange={(value) => setInput((prev) => ({ ...prev, thicknessM: value }))}
        />
        <NumberField
          id="bagYieldM3"
          label="Viena maisa iznākums"
          unit="m³"
          value={input.bagYieldM3}
          step={0.001}
          onChange={(value) => setInput((prev) => ({ ...prev, bagYieldM3: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Viena maisa iznākums atšķiras atkarībā no ražotāja un maisījuma veida, precīzu vērtību norāda uz
        iepakojuma. Lielākiem darbiem parasti izdevīgāk pasūtīt gatavo betonu ar autoreduktoru.
      </p>

      <Breakdown rows={[{ label: 'Maisu skaits', value: `${formatNumber(result.bagsNeeded, 0)} gab.` }]} />
    </div>
  );
}
