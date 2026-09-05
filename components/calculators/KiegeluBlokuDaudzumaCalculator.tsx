'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculateKiegeluBlokuDaudzums } from '@/lib/calculators/kiegelu-bloku-daudzums';
import {
  DEFAULT_WALL_AREA_M2,
  JOINT_THICKNESS_MM_MIN,
  JOINT_THICKNESS_MM_MAX,
  DEFAULT_JOINT_THICKNESS_MM,
  DEFAULT_WASTE_PERCENT,
  UNIT_DEFAULTS,
  type UnitType,
} from '@/lib/calculators/kiegelu-bloku-daudzums-defaults';

const UNIT_LABELS: Record<UnitType, string> = {
  kiegelis: 'Keramiskais ķieģelis',
  bloks: 'Gāzbetona bloks',
};

export function KiegeluBlokuDaudzumaCalculator({ accentVar }: { accentVar: string }) {
  const [unitType, setUnitType] = useState<UnitType>('kiegelis');
  const [wallAreaM2, setWallAreaM2] = useState(DEFAULT_WALL_AREA_M2);
  const [unitLengthMm, setUnitLengthMm] = useState(UNIT_DEFAULTS.kiegelis.lengthMm);
  const [unitHeightMm, setUnitHeightMm] = useState(UNIT_DEFAULTS.kiegelis.heightMm);
  const [jointThicknessMm, setJointThicknessMm] = useState(DEFAULT_JOINT_THICKNESS_MM);
  const [wastePercent, setWastePercent] = useState(DEFAULT_WASTE_PERCENT);

  const result = useMemo(
    () =>
      calculateKiegeluBlokuDaudzums({
        wallAreaM2,
        unitLengthMm,
        unitHeightMm,
        jointThicknessMm,
        wastePercent,
      }),
    [wallAreaM2, unitLengthMm, unitHeightMm, jointThicknessMm, wastePercent],
  );

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Nepieciešamais vienību skaits"
        value={`${formatNumber(result.unitsNeeded, 0)} gab.`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`Sienu platība ar rezervi: ${formatNumber(result.wallAreaWithWasteM2, 1)} m²`}
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="text-label uppercase text-panel-muted">Mūrniecības materiāls</legend>
        <div className="flex flex-col gap-2">
          {(Object.keys(UNIT_LABELS) as UnitType[]).map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="unitType"
                value={value}
                checked={unitType === value}
                onChange={() => {
                  setUnitType(value);
                  setUnitLengthMm(UNIT_DEFAULTS[value].lengthMm);
                  setUnitHeightMm(UNIT_DEFAULTS[value].heightMm);
                }}
              />
              {UNIT_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

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
            id="unitLengthMm"
            label="Vienības garums"
            unit="mm"
            value={unitLengthMm}
            step={1}
            onChange={setUnitLengthMm}
          />
          <NumberField
            id="unitHeightMm"
            label="Vienības augstums"
            unit="mm"
            value={unitHeightMm}
            step={1}
            onChange={setUnitHeightMm}
          />
        </div>
      </div>

      <p className="text-caption text-panel-faint">
        Garums un augstums ir mūra sienas redzamajā sejā mērāmie izmēri, sienas biezuma virziens neietekmē
        vienību skaitu uz vienu kvadrātmetru sienas. Mainot materiāla veidu, izmēri automātiski uzpildās ar
        avotā norādītu piemēru, bet paliek pielāgojami konkrētajam produktam.
      </p>

      <div className="flex flex-col gap-2">
        <NumberField
          id="jointThicknessMm"
          label="Šuves biezums"
          unit="mm"
          value={jointThicknessMm}
          step={1}
          min={0}
          onChange={setJointThicknessMm}
        />
        <p className="text-caption text-panel-faint">
          Parastai mūrēšanai šuves biezums parasti ir no {formatNumber(JOINT_THICKNESS_MM_MIN, 0)} līdz{' '}
          {formatNumber(JOINT_THICKNESS_MM_MAX, 0)} milimetriem.
        </p>
      </div>

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
          Rezerves procents sedz lūzumus un pielāgošanu ap ailēm, konkrētam objektam pielāgojama vērtība, nevis
          citēts fakts.
        </p>
      </div>

      <Breakdown
        rows={[
          { label: 'Vienas vienības efektīvā platība', value: `${formatNumber(result.effectiveUnitAreaM2, 4)} m²` },
          { label: 'Platība ar rezervi', value: `${formatNumber(result.wallAreaWithWasteM2, 1)} m²` },
          { label: 'Nepieciešamas vienības', value: `${formatNumber(result.unitsNeeded, 0)} gab.` },
        ]}
      />
    </div>
  );
}
