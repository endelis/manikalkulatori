'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculateMalkasApjoms, type MalkasApjomaInputs } from '@/lib/calculators/malkas-apjoms';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: MalkasApjomaInputs = {
  stackLengthM: 10,
  stackWidthM: 1,
  stackHeightM: 1,
  solidWoodFactor: 0.65,
};

export function MalkasApjomaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateMalkasApjoms(input), [input]);

  const tweenedSolidVolume = useTweenedNumber(result.solidVolumeM3);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Cietās koksnes apjoms"
        value={`${formatNumber(tweenedSolidVolume, 2)} m³`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`${formatNumber(result.stackedVolumeM3, 2)} m³ sakrautā apjoma`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="stackLengthM"
          label="Grēdas garums"
          unit="m"
          value={input.stackLengthM}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, stackLengthM: value }))}
        />
        <NumberField
          id="stackWidthM"
          label="Grēdas platums"
          unit="m"
          value={input.stackWidthM}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, stackWidthM: value }))}
        />
        <NumberField
          id="stackHeightM"
          label="Grēdas augstums"
          unit="m"
          value={input.stackHeightM}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, stackHeightM: value }))}
        />
        <NumberField
          id="solidWoodFactor"
          label="Cietās koksnes koeficients"
          value={input.solidWoodFactor}
          step={0.05}
          onChange={(value) => setInput((prev) => ({ ...prev, solidWoodFactor: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Sakrautajā malkas grēdā starp pagalēm ir gaisa spraugas, tāpēc cietās koksnes apjoms vienmēr ir
        mazāks par sakrauto apjomu. Koeficients atšķiras atkarībā no pagaļu garuma un kraušanas kārtības.
      </p>

      <Breakdown
        rows={[
          { label: 'Sakrautais apjoms (steri)', value: `${formatNumber(result.stackedVolumeM3, 2)} m³` },
          { label: 'Cietās koksnes apjoms', value: `${formatNumber(result.solidVolumeM3, 2)} m³` },
        ]}
      />
    </div>
  );
}
