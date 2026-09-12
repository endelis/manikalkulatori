'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import {
  calculateKapnuPakapienaIzmeri,
  type KapnuPakapienaIzmeruInputs,
} from '@/lib/calculators/kapnu-pakapiena-izmeri';

const DEFAULT_INPUT: KapnuPakapienaIzmeruInputs = {
  riserHeightCm: 17,
  treadDepthCm: 29,
};

export function KapnuPakapienaIzmeruCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateKapnuPakapienaIzmeri(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Atbilstība LBN 200-21 prasībām"
        value={result.isFullyCompliant ? 'Atbilst' : 'Neatbilst'}
        tone={result.isFullyCompliant ? 'winner' : 'loser'}
        accentVar={accentVar}
        sublabel="Prasība: pakāpiena augstums 12 līdz 18 cm, platums plus divi augstumi 60 līdz 65 cm"
      />

      <Breakdown
        rows={[
          {
            label: 'Pakāpiena augstums (prasība 12 līdz 18 cm)',
            value: result.isHeightCompliant ? 'Atbilst' : 'Neatbilst',
          },
          {
            label: `Platums + 2 × augstums = ${formatNumber(result.formulaSumCm, 1)} cm (prasība 60 līdz 65 cm)`,
            value: result.isSumCompliant ? 'Atbilst' : 'Neatbilst',
          },
        ]}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="riserHeightCm"
          label="Pakāpiena augstums"
          unit="cm"
          value={input.riserHeightCm}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, riserHeightCm: value }))}
        />
        <NumberField
          id="treadDepthCm"
          label="Pakāpiena platums (dziļums)"
          unit="cm"
          value={input.treadDepthCm}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, treadDepthCm: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Šī ir LBN 200-21 noteiktā juridiskā prasība pakāpiena izmēriem, kas atšķiras no Blondela ērtuma
        formulas (60 līdz 64 cm, bez atsevišķa augstuma ierobežojuma). Prasība neietver kāpņu
        drošības nosacījumus (margu augstums, laida platums, pakāpienu vienmērīgums), tiem konsultējies
        ar būvspeciālistu.
      </p>
    </div>
  );
}
