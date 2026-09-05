'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculateGrantsSmiltsSkembuApjoms } from '@/lib/calculators/grants-smilts-skembu-apjoms';
import {
  MATERIALS,
  COMPACTION_PERCENT_MIN,
  COMPACTION_PERCENT_MAX,
  DEFAULT_COMPACTION_PERCENT,
  DEFAULT_AREA_M2,
  DEFAULT_DEPTH_MM,
  type MaterialType,
} from '@/lib/calculators/grants-smilts-skembu-apjoms-defaults';

export function GrantsSmiltsSkembuApjomaCalculator({ accentVar }: { accentVar: string }) {
  const [materialType, setMaterialType] = useState<MaterialType>('smilts');
  const [areaM2, setAreaM2] = useState(DEFAULT_AREA_M2);
  const [depthMm, setDepthMm] = useState(DEFAULT_DEPTH_MM);
  const [densityTPerM3, setDensityTPerM3] = useState(MATERIALS.smilts.densityTPerM3Default);
  const [compactionPercent, setCompactionPercent] = useState(DEFAULT_COMPACTION_PERCENT);

  const selectedMaterial = MATERIALS[materialType];

  const result = useMemo(
    () => calculateGrantsSmiltsSkembuApjoms({ areaM2, depthMm, compactionPercent, densityTPerM3 }),
    [areaM2, depthMm, compactionPercent, densityTPerM3],
  );

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Nepieciešamais daudzums"
        value={`${formatNumber(result.massTonnes, 2)} t`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`Apjoms ar sablīvēšanās rezervi: ${formatNumber(result.volumeWithCompactionM3, 2)} m³`}
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="text-label uppercase text-panel-muted">Materiāls</legend>
        <div className="flex flex-col gap-2">
          {(Object.keys(MATERIALS) as MaterialType[]).map((value) => (
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
                  setDensityTPerM3(MATERIALS[value].densityTPerM3Default);
                }}
              />
              {MATERIALS[value].label}, aptuveni{' '}
              {formatNumber(MATERIALS[value].densityTPerM3Default, 2)}&nbsp;t/m³
            </label>
          ))}
        </div>
      </fieldset>

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="areaM2"
          label="Aizpildāmā platība"
          unit="m²"
          value={areaM2}
          step={0.5}
          onChange={setAreaM2}
        />
        <NumberField
          id="depthMm"
          label="Kārtas biezums"
          unit="mm"
          value={depthMm}
          step={10}
          min={0}
          onChange={setDepthMm}
        />
      </div>

      <div className="flex flex-col gap-2">
        <NumberField
          id="densityTPerM3"
          label="Materiāla blīvums"
          unit="t/m³"
          value={densityTPerM3}
          step={0.05}
          min={0}
          onChange={setDensityTPerM3}
        />
        <p className="text-caption text-panel-faint">
          {selectedMaterial.sourced ? (
            <>
              {selectedMaterial.label} blīvums, {formatNumber(selectedMaterial.densityTPerM3Min, 2)} līdz{' '}
              {formatNumber(selectedMaterial.densityTPerM3Max, 2)}&nbsp;t/m³, ir tieši norādīts Latvijas
              karjera materiālu tirgotāja lapā, sk. Avoti. Reālā piegāde var atšķirties, tāpēc vērtība
              paliek pielāgojama.
            </>
          ) : (
            <>
              {selectedMaterial.label} blīvums parasti ir no{' '}
              {formatNumber(selectedMaterial.densityTPerM3Min, 2)} līdz{' '}
              {formatNumber(selectedMaterial.densityTPerM3Max, 2)}&nbsp;t/m³ atkarībā no frakcijas un
              mitruma, neviens pārbaudītais Latvijas piegādātājs nepublicē precīzu skaitli, tāpēc šī ir
              aplēse, ne citēts fakts, un to vari brīvi pielāgot pēc konkrētā piegādātāja informācijas.
            </>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <NumberField
          id="compactionPercent"
          label="Sablīvēšanās rezerve"
          unit="%"
          value={compactionPercent}
          step={1}
          min={0}
          max={40}
          onChange={setCompactionPercent}
        />
        <p className="text-caption text-panel-faint">
          Irdens materiāls sablīvējoties samazina apjomu, tāpēc parasti jāpasūta no{' '}
          {formatNumber(COMPACTION_PERCENT_MIN, 0)} līdz {formatNumber(COMPACTION_PERCENT_MAX, 0)} procentiem
          vairāk nekā gala kārtas apjoms. Nav atrasts Latvijai specifisks avots šim procentam, tas ir
          pielāgojams lauks, nevis citēts fakts.
        </p>
      </div>

      <Breakdown
        rows={[
          { label: 'Apjoms bez rezerves', value: `${formatNumber(result.volumeM3, 2)} m³` },
          { label: 'Apjoms ar rezervi', value: `${formatNumber(result.volumeWithCompactionM3, 2)} m³` },
          { label: 'Nepieciešamā masa', value: `${formatNumber(result.massTonnes, 2)} t` },
        ]}
      />
    </div>
  );
}
