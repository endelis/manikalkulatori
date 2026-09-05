'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculateLaminataVinilaDaudzums } from '@/lib/calculators/laminata-vinila-daudzums';
import {
  FLOOR_MATERIALS,
  WASTE_PERCENT_MIN,
  WASTE_PERCENT_MAX,
  DEFAULT_WASTE_PERCENT,
  DEFAULT_AREA_M2,
  type FloorMaterialType,
} from '@/lib/calculators/laminata-vinila-daudzums-defaults';

export function LaminataVinilaDaudzumaCalculator({ accentVar }: { accentVar: string }) {
  const [materialType, setMaterialType] = useState<FloorMaterialType>('laminats');
  const [areaM2, setAreaM2] = useState(DEFAULT_AREA_M2);
  const [packCoverageM2, setPackCoverageM2] = useState(FLOOR_MATERIALS.laminats.packCoverageM2Default);
  const [wastePercent, setWastePercent] = useState(DEFAULT_WASTE_PERCENT);

  const selectedMaterial = FLOOR_MATERIALS[materialType];

  const result = useMemo(
    () => calculateLaminataVinilaDaudzums({ areaM2, packCoverageM2, wastePercent }),
    [areaM2, packCoverageM2, wastePercent],
  );

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Nepieciešamais iepakojumu skaits"
        value={`${formatNumber(result.packsNeeded, 0)} iepakojumi`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`Platība ar rezervi: ${formatNumber(result.areaWithWasteM2, 1)} m²`}
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="text-label uppercase text-panel-muted">Grīdas seguma veids</legend>
        <div className="flex flex-col gap-2">
          {(Object.keys(FLOOR_MATERIALS) as FloorMaterialType[]).map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="materialType"
                value={value}
                checked={materialType === value}
                onChange={() => {
                  setMaterialType(value);
                  setPackCoverageM2(FLOOR_MATERIALS[value].packCoverageM2Default);
                }}
              />
              {FLOOR_MATERIALS[value].label}, piemēram{' '}
              {formatNumber(FLOOR_MATERIALS[value].packCoverageM2Default, 2)}&nbsp;m²/iepakojumā
            </label>
          ))}
        </div>
      </fieldset>

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="areaM2"
          label="Grīdas platība"
          unit="m²"
          value={areaM2}
          step={0.5}
          onChange={setAreaM2}
        />
        <NumberField
          id="packCoverageM2"
          label="Viena iepakojuma segums"
          unit="m²"
          value={packCoverageM2}
          step={0.01}
          min={0}
          onChange={setPackCoverageM2}
        />
      </div>
      <p className="text-caption text-panel-faint">
        {selectedMaterial.label} iepakojuma segums parasti ir no{' '}
        {formatNumber(selectedMaterial.packCoverageM2Min, 2)} līdz{' '}
        {formatNumber(selectedMaterial.packCoverageM2Max, 2)}&nbsp;m² atkarībā no konkrētā produkta, iepriekš
        aizpildītā vērtība ir viens reāls piemērs, precīzu skaitli vienmēr pārbaudi uz izvēlētā produkta
        iepakojuma.
      </p>

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
          Ražotāja vadlīnijas iesaka {formatNumber(WASTE_PERCENT_MIN, 0)}&nbsp;procentus vienkāršam
          izkārtojumam, līdz {formatNumber(WASTE_PERCENT_MAX, 0)}&nbsp;procentiem nepieredzējušiem
          uzstādītājiem, diagonālam vai rakstainam izkārtojumam rezerve var būt vēl lielāka.
        </p>
      </div>

      <Breakdown
        rows={[
          { label: 'Platība ar rezervi', value: `${formatNumber(result.areaWithWasteM2, 1)} m²` },
          { label: 'Nepieciešami iepakojumi', value: `${formatNumber(result.packsNeeded, 0)} gab.` },
        ]}
      />
    </div>
  );
}
