'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { formatNumber } from '@/lib/format';
import {
  calculateVentilacijasApjoms,
  type VentilacijasApjomaInputs,
} from '@/lib/calculators/ventilacijas-apjoms';

const DEFAULT_INPUT: VentilacijasApjomaInputs = {
  occupantCount: 4,
  roomVolumeM3: 45,
};

export function VentilacijasApjomaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateVentilacijasApjoms(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Minimālais svaigā gaisa daudzums"
        value={`${formatNumber(result.requiredFreshAirM3H, 0)} m³/h`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`${formatNumber(result.airChangesPerHour, 2)} gaisa apmaiņas stundā šim telpas tilpumam`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="occupantCount"
          label="Cilvēku skaits telpā"
          value={input.occupantCount}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, occupantCount: value }))}
        />
        <NumberField
          id="roomVolumeM3"
          label="Telpas tilpums"
          unit="m³"
          value={input.roomVolumeM3}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, roomVolumeM3: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        15 m³/h uz cilvēku ir absolūtais minimums, ja telpas vienīgais gaisa piesārņojuma avots ir
        cilvēki. Virtuvēm, vannas istabām un telpām ar citiem piesārņojuma avotiem (mitrums, gatavošana,
        ķīmiskas vielas) nepieciešams vairāk, un precīzu projektēšanas apjomu nosaka pēc LVS EN 16798-1.
      </p>
    </div>
  );
}
