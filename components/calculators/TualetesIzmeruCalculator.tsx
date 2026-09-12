'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ToggleField } from '@/components/ToggleField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculateTualetesIzmeri, type TualetesIzmeruInputs } from '@/lib/calculators/tualetes-izmeri';

const DEFAULT_INPUT: TualetesIzmeruInputs = {
  widthM: 0.9,
  lengthM: 1.5,
  isAccessible: false,
};

export function TualetesIzmeruCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateTualetesIzmeri(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Atbilstība LBN 200-21 prasībām"
        value={result.isFullyCompliant ? 'Atbilst' : 'Neatbilst'}
        tone={result.isFullyCompliant ? 'winner' : 'loser'}
        accentVar={accentVar}
        sublabel={`Minimālais izmērs: ${formatNumber(result.minWidthM, 1)} × ${formatNumber(result.minLengthM, 1)} m`}
      />

      <Breakdown
        rows={[
          { label: `Platums (min. ${formatNumber(result.minWidthM, 1)} m)`, value: result.isWidthCompliant ? 'Atbilst' : 'Neatbilst' },
          { label: `Garums (min. ${formatNumber(result.minLengthM, 1)} m)`, value: result.isLengthCompliant ? 'Atbilst' : 'Neatbilst' },
        ]}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="widthM"
          label="Telpas platums"
          unit="m"
          value={input.widthM}
          step={0.05}
          onChange={(value) => setInput((prev) => ({ ...prev, widthM: value }))}
        />
        <NumberField
          id="lengthM"
          label="Telpas garums"
          unit="m"
          value={input.lengthM}
          step={0.05}
          onChange={(value) => setInput((prev) => ({ ...prev, lengthM: value }))}
        />
        <ToggleField
          id="isAccessible"
          label="Vai telpai jābūt pieejamai personām ar funkcionāliem traucējumiem?"
          value={input.isAccessible}
          onChange={(value) => setInput((prev) => ({ ...prev, isAccessible: value }))}
          trueLabel="Jā"
          falseLabel="Nē"
        />
      </div>

      <p className="text-caption text-panel-faint">
        LBN 200-21 118. punkts nosaka tualetes minimālo izmēru: vispārīgi 0,8 × 1,4 m, personām ar
        funkcionāliem traucējumiem 1,6 × 2,2 m.
      </p>
    </div>
  );
}
