'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import {
  calculateJumtaSeguma,
  type JumtaMaterials,
  type JumtaSegumaInput,
} from '@/lib/calculators/jumta-seguma-daudzums';
import {
  DEFAULT_FOOTPRINT_AREA_M2,
  DEFAULT_PITCH_DEGREES,
  DEFAULT_TILES_PER_M2,
  TILES_PER_M2_MIN,
  TILES_PER_M2_MAX,
  SHEET_EFFECTIVE_WIDTH_M,
  SHEET_MAX_LENGTH_M,
  DEFAULT_SHEET_LENGTH_M,
  DEFAULT_PACKAGE_COVERAGE_M2,
  PACKAGE_COVERAGE_M2_MIN,
  PACKAGE_COVERAGE_M2_MAX,
  DEFAULT_WASTE_PERCENT,
  WASTE_PERCENT_MIN,
  WASTE_PERCENT_MAX,
} from '@/lib/calculators/jumta-seguma-daudzums-defaults';

const MATERIAL_LABELS: Record<JumtaMaterials, string> = {
  dakstini: 'Betona vai keramikas dakstiņi',
  'metala-loksnes': 'Metāla loksnes',
  'bitumena-sindeli': 'Bitumena šindeļi',
};

const UNIT_LABELS: Record<JumtaMaterials, string> = {
  dakstini: 'dakstiņi',
  'metala-loksnes': 'loksnes',
  'bitumena-sindeli': 'iepakojumi',
};

export function JumtaSegumaDaudzumaCalculator({ accentVar }: { accentVar: string }) {
  const [footprintAreaM2, setFootprintAreaM2] = useState(DEFAULT_FOOTPRINT_AREA_M2);
  const [pitchDegrees, setPitchDegrees] = useState(DEFAULT_PITCH_DEGREES);
  const [wastePercent, setWastePercent] = useState(DEFAULT_WASTE_PERCENT);
  const [material, setMaterial] = useState<JumtaMaterials>('dakstini');

  const [tilesPerM2, setTilesPerM2] = useState(DEFAULT_TILES_PER_M2);
  const [sheetEffectiveWidthM, setSheetEffectiveWidthM] = useState(SHEET_EFFECTIVE_WIDTH_M);
  const [sheetLengthM, setSheetLengthM] = useState(DEFAULT_SHEET_LENGTH_M);
  const [packageCoverageM2, setPackageCoverageM2] = useState(DEFAULT_PACKAGE_COVERAGE_M2);

  const input: JumtaSegumaInput = useMemo(
    () => ({
      footprintAreaM2,
      pitchDegrees,
      wastePercent,
      material,
      tilesPerM2,
      sheetEffectiveWidthM,
      sheetLengthM,
      packageCoverageM2,
    }),
    [
      footprintAreaM2,
      pitchDegrees,
      wastePercent,
      material,
      tilesPerM2,
      sheetEffectiveWidthM,
      sheetLengthM,
      packageCoverageM2,
    ],
  );

  const result = useMemo(() => calculateJumtaSeguma(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Nepieciešamais daudzums"
        value={`${formatNumber(result.unitsNeeded, 0)} ${UNIT_LABELS[material]}`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`Jumta laukums ar slīpumu: ${formatNumber(result.roofAreaM2, 1)} m², ar rezervi: ${formatNumber(result.roofAreaWithWasteM2, 1)} m²`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="footprintAreaM2"
          label="Jumta pamatnes platība"
          unit="m²"
          value={footprintAreaM2}
          step={1}
          onChange={setFootprintAreaM2}
        />
        <NumberField
          id="pitchDegrees"
          label="Jumta slīpuma leņķis"
          unit="°"
          value={pitchDegrees}
          step={1}
          max={80}
          onChange={setPitchDegrees}
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-label uppercase text-panel-muted">Seguma materiāls</legend>
        <div className="flex flex-col gap-2 sm:flex-row">
          {(Object.keys(MATERIAL_LABELS) as JumtaMaterials[]).map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="material"
                value={value}
                checked={material === value}
                onChange={() => setMaterial(value)}
              />
              {MATERIAL_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      {material === 'dakstini' ? (
        <div className="flex flex-col gap-2">
          <NumberField
            id="tilesPerM2"
            label="Dakstiņu skaits uz m²"
            unit="gab/m²"
            value={tilesPerM2}
            step={0.1}
            min={TILES_PER_M2_MIN}
            max={TILES_PER_M2_MAX}
            onChange={setTilesPerM2}
          />
          <p className="text-caption text-panel-faint">
            Precīzais skaits atkarīgs no dakstiņu modeļa un jumta slīpuma, sourced diapazons ir no{' '}
            {formatNumber(TILES_PER_M2_MIN, 1)} līdz {formatNumber(TILES_PER_M2_MAX, 1)} gab/m², pārbaudi
            konkrētā ražotāja montāžas instrukciju.
          </p>
        </div>
      ) : null}

      {material === 'metala-loksnes' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberField
            id="sheetEffectiveWidthM"
            label="Loksnes efektīvais platums"
            unit="m"
            value={sheetEffectiveWidthM}
            step={0.05}
            onChange={setSheetEffectiveWidthM}
          />
          <NumberField
            id="sheetLengthM"
            label="Loksnes garums"
            unit="m"
            value={sheetLengthM}
            step={0.1}
            max={SHEET_MAX_LENGTH_M}
            onChange={setSheetLengthM}
          />
        </div>
      ) : null}

      {material === 'bitumena-sindeli' ? (
        <div className="flex flex-col gap-2">
          <NumberField
            id="packageCoverageM2"
            label="Viena iepakojuma segums"
            unit="m²"
            value={packageCoverageM2}
            step={0.1}
            min={PACKAGE_COVERAGE_M2_MIN}
            max={PACKAGE_COVERAGE_M2_MAX}
            onChange={setPackageCoverageM2}
          />
          <p className="text-caption text-panel-faint">
            Segums atšķiras pa ražotājiem, sourced diapazons ir no {formatNumber(PACKAGE_COVERAGE_M2_MIN, 1)} līdz{' '}
            {formatNumber(PACKAGE_COVERAGE_M2_MAX, 1)} m² uz iepakojumu, precīzu vērtību norāda uz iepakojuma.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <NumberField
          id="wastePercent"
          label="Rezerves procents"
          unit="%"
          value={wastePercent}
          step={1}
          min={0}
          max={30}
          onChange={setWastePercent}
        />
        <p className="text-caption text-panel-faint">
          Nav atrasts stingrs avots konkrētam procentam, tikai nozares konvencija no {formatNumber(WASTE_PERCENT_MIN, 0)}{' '}
          līdz {formatNumber(WASTE_PERCENT_MAX, 0)} procentiem apgriešanas un pārklāšanās dēļ, tāpēc šis ir
          pielāgojams lauks, nevis citēts fakts.
        </p>
      </div>

      <Breakdown
        rows={[
          { label: 'Jumta platība ar slīpumu', value: `${formatNumber(result.roofAreaM2, 1)} m²` },
          { label: 'Platība ar rezervi', value: `${formatNumber(result.roofAreaWithWasteM2, 1)} m²` },
          { label: 'Nepieciešams', value: `${formatNumber(result.unitsNeeded, 0)} ${UNIT_LABELS[material]}` },
        ]}
      />
    </div>
  );
}
