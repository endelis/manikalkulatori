'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculateFlizuDaudzums, type FlizuDaudzumaInputs } from '@/lib/calculators/flizu-daudzums';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: FlizuDaudzumaInputs = {
  areaM2: 20,
  tileWidthM: 0.3,
  tileHeightM: 0.3,
  wastePercent: 10,
};

export function FlizuDaudzumaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateFlizuDaudzums(input), [input]);

  const tweenedTilesToBuy = useTweenedNumber(result.tilesToBuy);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Nepieciešamais flīžu skaits"
        value={`${formatNumber(Math.round(tweenedTilesToBuy), 0)} gab.`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`${formatNumber(result.tilesNeededRaw, 0)} gab. bez rezerves`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="areaM2"
          label="Klājamā platība"
          unit="m²"
          value={input.areaM2}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, areaM2: value }))}
        />
        <NumberField
          id="tileWidthM"
          label="Flīzes platums"
          unit="m"
          value={input.tileWidthM}
          step={0.05}
          onChange={(value) => setInput((prev) => ({ ...prev, tileWidthM: value }))}
        />
        <NumberField
          id="tileHeightM"
          label="Flīzes augstums"
          unit="m"
          value={input.tileHeightM}
          step={0.05}
          onChange={(value) => setInput((prev) => ({ ...prev, tileHeightM: value }))}
        />
        <NumberField
          id="wastePercent"
          label="Rezerves procents"
          unit="%"
          value={input.wastePercent}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, wastePercent: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Rezerves procents sedz griezumus, bojājumus un turpmāku remontu. Neregulārām telpām vai
        diagonālam klājumam ieteicams lielāks rezerves procents.
      </p>

      <Breakdown
        rows={[
          { label: 'Bez rezerves', value: `${formatNumber(result.tilesNeededRaw, 1)} gab.` },
          { label: 'Ar rezervi', value: `${formatNumber(result.tilesWithWaste, 1)} gab.` },
        ]}
      />
    </div>
  );
}
