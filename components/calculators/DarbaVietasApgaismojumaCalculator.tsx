'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { SelectField } from '@/components/SelectField';
import { ResultCard } from '@/components/ResultCard';
import { formatNumber } from '@/lib/format';
import {
  calculateDarbaVietasApgaismojums,
  type DarbaVietasApgaismojumaInputs,
  type DarbaVeids,
} from '@/lib/calculators/darba-vietas-apgaismojums';

const DEFAULT_INPUT: DarbaVietasApgaismojumaInputs = {
  illuminanceLux: 500,
  workType: 'lasisana-rakstisana',
};

const WORK_TYPE_OPTIONS: { value: DarbaVeids; label: string }[] = [
  { value: 'lasisana-rakstisana', label: 'Lasīšana, rakstīšana, datu apstrāde (500 lx)' },
  { value: 'tehniska-raseshana', label: 'Tehniskā rasēšana (750 lx)' },
  { value: 'sapulcu-telpas', label: 'Sapulču, konferenču telpas (500 lx)' },
  { value: 'dokumentu-sistematizacija', label: 'Dokumentu sistematizācija, kopēšana (300 lx)' },
  { value: 'klientu-pienemsana', label: 'Klientu pieņemšana, reģistratūra (300 lx)' },
  { value: 'noliktavas-arhivi', label: 'Noliktavas, arhīvu telpas (200 lx)' },
];

export function DarbaVietasApgaismojumaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateDarbaVietasApgaismojums(input), [input]);
  const warnColor = 'var(--color-warn)';

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Minimālais nepieciešamais apgaismojums"
        value={`${formatNumber(result.minLux, 0)} lx`}
        tone={result.isCompliant ? 'winner' : 'loser'}
        accentVar={accentVar}
        sublabel={
          result.isCompliant
            ? 'Ievadītais apgaismojums atbilst prasībai'
            : `Trūkst ${formatNumber(result.shortfallLux, 0)} lx līdz prasībai`
        }
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <SelectField
          id="workType"
          label="Darba veids"
          value={input.workType}
          options={WORK_TYPE_OPTIONS}
          onChange={(value) => setInput((prev) => ({ ...prev, workType: value as DarbaVeids }))}
        />
        <NumberField
          id="illuminanceLux"
          label="Izmērītais apgaismojums"
          unit="lx"
          value={input.illuminanceLux}
          step={10}
          onChange={(value) => setInput((prev) => ({ ...prev, illuminanceLux: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint" style={!result.isCompliant ? { color: warnColor } : undefined}>
        Prasības noteiktas MK noteikumu Nr. 359 &quot;Darba aizsardzības prasības darba vietās&quot;
        2. pielikumā. Precīzu mērījumu var veikt tikai akreditēta laboratorija, šis kalkulators ir
        orientējošai lietošanai ar jau zināmu izmērīto vērtību.
      </p>
    </div>
  );
}
