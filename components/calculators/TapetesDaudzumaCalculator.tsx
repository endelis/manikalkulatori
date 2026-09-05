'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculateTapetesDaudzums } from '@/lib/calculators/tapetes-daudzums';
import {
  DEFAULT_WALL_AREA_M2,
  DEFAULT_ROLL_WIDTH_M,
  DEFAULT_ROLL_LENGTH_M,
  EU_TECHNICAL_ROLL_LENGTH_M,
  WASTE_PERCENT_MIN,
  WASTE_PERCENT_MAX,
  PATTERN_WASTE_DEFAULTS,
  type PatternType,
} from '@/lib/calculators/tapetes-daudzums-defaults';

const PATTERN_LABELS: Record<PatternType, string> = {
  nav: 'Bez raksta vai raksts nav svarīgs',
  mazs: 'Neliels raksta atkārtojums',
  'liels-taisns': 'Liels taisns raksta atkārtojums',
  nobides: 'Nobīdes raksta atkārtojums',
};

export function TapetesDaudzumaCalculator({ accentVar }: { accentVar: string }) {
  const [wallAreaM2, setWallAreaM2] = useState(DEFAULT_WALL_AREA_M2);
  const [rollWidthM, setRollWidthM] = useState(DEFAULT_ROLL_WIDTH_M);
  const [rollLengthM, setRollLengthM] = useState(DEFAULT_ROLL_LENGTH_M);
  const [pattern, setPattern] = useState<PatternType>('nav');
  const [wastePercent, setWastePercent] = useState(PATTERN_WASTE_DEFAULTS.nav);

  const result = useMemo(
    () => calculateTapetesDaudzums({ wallAreaM2, rollWidthM, rollLengthM, wastePercent }),
    [wallAreaM2, rollWidthM, rollLengthM, wastePercent],
  );

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Nepieciešamo tapešu ruļļu skaits"
        value={`${formatNumber(result.rollsNeeded, 0)} ruļļi`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`Sienu platība ar rezervi: ${formatNumber(result.wallAreaWithWasteM2, 1)} m²`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="wallAreaM2"
          label="Kopējā sienu platība"
          unit="m²"
          value={wallAreaM2}
          step={0.5}
          onChange={setWallAreaM2}
        />
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            id="rollWidthM"
            label="Ruļļa platums"
            unit="m"
            value={rollWidthM}
            step={0.01}
            onChange={setRollWidthM}
          />
          <NumberField
            id="rollLengthM"
            label="Ruļļa garums"
            unit="m"
            value={rollLengthM}
            step={0.05}
            onChange={setRollLengthM}
          />
        </div>
      </div>

      <p className="text-caption text-panel-faint">
        Latvijas mazumtirdzniecībā ierasts izmērs ir 0,53 reiz 10 metri, bet Eiropas tehniskā specifikācija
        bieži uzrāda {formatNumber(EU_TECHNICAL_ROLL_LENGTH_M, 2)} metrus, precīzu izmēru vienmēr norāda uz
        konkrētā ruļļa etiķetes.
      </p>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-label uppercase text-panel-muted">Raksta veids</legend>
        <div className="flex flex-col gap-2">
          {(Object.keys(PATTERN_LABELS) as PatternType[]).map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="pattern"
                value={value}
                checked={pattern === value}
                onChange={() => {
                  setPattern(value);
                  setWastePercent(PATTERN_WASTE_DEFAULTS[value]);
                }}
              />
              {PATTERN_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <NumberField
          id="wastePercent"
          label="Rezerves procents"
          unit="%"
          value={wastePercent}
          step={1}
          min={0}
          max={40}
          onChange={setWastePercent}
        />
        <p className="text-caption text-panel-faint">
          Bez raksta rezerve parasti ir no {formatNumber(WASTE_PERCENT_MIN, 0)} līdz{' '}
          {formatNumber(WASTE_PERCENT_MAX, 0)} procentiem apgriešanai. Izvēloties raksta veidu iepriekš, šis
          lauks automātiski piedāvā sourced vērtību, bet paliek pielāgojams.
        </p>
      </div>

      <Breakdown
        rows={[
          { label: 'Viena ruļļa platība', value: `${formatNumber(result.rollAreaM2, 2)} m²` },
          { label: 'Platība ar rezervi', value: `${formatNumber(result.wallAreaWithWasteM2, 1)} m²` },
          { label: 'Nepieciešami ruļļi', value: `${formatNumber(result.rollsNeeded, 0)} gab.` },
        ]}
      />
    </div>
  );
}
