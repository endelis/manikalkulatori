'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculateRiepuIzmers, type RiepuIzmeraInputs } from '@/lib/calculators/riepu-izmers';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: RiepuIzmeraInputs = {
  originalWidthMm: 205,
  originalAspectRatio: 55,
  originalRimInches: 16,
  newWidthMm: 205,
  newAspectRatio: 60,
  newRimInches: 16,
  indicatedSpeedKmh: 100,
};

export function RiepuIzmeraCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateRiepuIzmers(input), [input]);

  const tweenedActualSpeed = useTweenedNumber(result.actualSpeedKmh);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Reālais ātrums"
        value={`${formatNumber(tweenedActualSpeed, 1)} km/h`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`Spidometra kļūda: ${formatNumber(result.speedoErrorPercent, 2)}%`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="originalWidthMm"
          label="Vecā riepa: platums"
          unit="mm"
          value={input.originalWidthMm}
          step={5}
          onChange={(value) => setInput((prev) => ({ ...prev, originalWidthMm: value }))}
        />
        <NumberField
          id="originalAspectRatio"
          label="Vecā riepa: profils"
          unit="%"
          value={input.originalAspectRatio}
          step={5}
          onChange={(value) => setInput((prev) => ({ ...prev, originalAspectRatio: value }))}
        />
        <NumberField
          id="originalRimInches"
          label="Vecā riepa: disks"
          unit="collas"
          value={input.originalRimInches}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, originalRimInches: value }))}
        />
        <NumberField
          id="newWidthMm"
          label="Jaunā riepa: platums"
          unit="mm"
          value={input.newWidthMm}
          step={5}
          onChange={(value) => setInput((prev) => ({ ...prev, newWidthMm: value }))}
        />
        <NumberField
          id="newAspectRatio"
          label="Jaunā riepa: profils"
          unit="%"
          value={input.newAspectRatio}
          step={5}
          onChange={(value) => setInput((prev) => ({ ...prev, newAspectRatio: value }))}
        />
        <NumberField
          id="newRimInches"
          label="Jaunā riepa: disks"
          unit="collas"
          value={input.newRimInches}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, newRimInches: value }))}
        />
        <NumberField
          id="indicatedSpeedKmh"
          label="Spidometra rādījums"
          unit="km/h"
          value={input.indicatedSpeedKmh}
          step={5}
          onChange={(value) => setInput((prev) => ({ ...prev, indicatedSpeedKmh: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Aprēķins ir tuvinājums, kas balstās uz riepas izmēra apzīmējumu. Reālo diametru var ietekmēt
        konkrētā riepas ražotāja un modeļa atšķirības.
      </p>

      <Breakdown
        rows={[
          { label: 'Vecās riepas diametrs', value: `${formatNumber(result.originalDiameterMm, 1)} mm` },
          { label: 'Jaunās riepas diametrs', value: `${formatNumber(result.newDiameterMm, 1)} mm` },
        ]}
      />
    </div>
  );
}
