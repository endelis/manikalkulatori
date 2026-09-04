'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculateKrasasDaudzums, type KrasasDaudzumaInputs } from '@/lib/calculators/krasas-daudzums';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: KrasasDaudzumaInputs = {
  areaM2: 40,
  coveragePerLiterM2: 10,
  coats: 2,
};

export function KrasasDaudzumaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateKrasasDaudzums(input), [input]);

  const tweenedLiters = useTweenedNumber(result.litersNeeded);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Nepieciešamais krāsas daudzums"
        value={`${formatNumber(tweenedLiters, 1)} L`}
        tone="neutral"
        accentVar={accentVar}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="areaM2"
          label="Krāsojamā platība"
          unit="m²"
          value={input.areaM2}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, areaM2: value }))}
        />
        <NumberField
          id="coveragePerLiterM2"
          label="Patēriņš uz litru"
          unit="m²/L"
          value={input.coveragePerLiterM2}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, coveragePerLiterM2: value }))}
        />
        <NumberField
          id="coats"
          label="Kārtu skaits"
          value={input.coats}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, coats: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Faktiskais patēriņš atšķiras atkarībā no virsmas struktūras, krāsošanas metodes un krāsas veida.
        Precīzu patēriņu uz litru parasti norāda uz krāsas iepakojuma.
      </p>

      <Breakdown rows={[{ label: 'Kārtu skaits', value: `${input.coats}` }]} />
    </div>
  );
}
