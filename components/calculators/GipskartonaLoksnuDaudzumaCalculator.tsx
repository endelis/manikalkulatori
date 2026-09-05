'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculateGipskartonaLoksnuDaudzums } from '@/lib/calculators/gipskartona-loksnu-daudzums';
import {
  SHEET_WIDTH_MM,
  DEFAULT_SHEET_LENGTH_MM,
  SHEET_LENGTH_MM_OPTIONS,
  WASTE_PERCENT_MIN,
  WASTE_PERCENT_MAX,
  DEFAULT_WASTE_PERCENT,
  DEFAULT_WALL_AREA_M2,
} from '@/lib/calculators/gipskartona-loksnu-daudzums-defaults';

export function GipskartonaLoksnuDaudzumaCalculator({ accentVar }: { accentVar: string }) {
  const [wallAreaM2, setWallAreaM2] = useState(DEFAULT_WALL_AREA_M2);
  const [sheetWidthMm, setSheetWidthMm] = useState(SHEET_WIDTH_MM);
  const [sheetLengthMm, setSheetLengthMm] = useState(DEFAULT_SHEET_LENGTH_MM);
  const [wastePercent, setWastePercent] = useState(DEFAULT_WASTE_PERCENT);

  const result = useMemo(
    () => calculateGipskartonaLoksnuDaudzums({ wallAreaM2, sheetWidthMm, sheetLengthMm, wastePercent }),
    [wallAreaM2, sheetWidthMm, sheetLengthMm, wastePercent],
  );

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Nepieciešamais lokšņu skaits"
        value={`${formatNumber(result.sheetsNeeded, 0)} loksnes`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`Platība ar rezervi: ${formatNumber(result.wallAreaWithWasteM2, 1)} m²`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="wallAreaM2"
          label="Klājamā virsmas platība"
          unit="m²"
          value={wallAreaM2}
          step={0.5}
          onChange={setWallAreaM2}
        />
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            id="sheetWidthMm"
            label="Loksnes platums"
            unit="mm"
            value={sheetWidthMm}
            step={1}
            onChange={setSheetWidthMm}
          />
          <NumberField
            id="sheetLengthMm"
            label="Loksnes garums"
            unit="mm"
            value={sheetLengthMm}
            step={1}
            onChange={setSheetLengthMm}
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-label uppercase text-panel-muted">Ierastie garumi</legend>
        <div className="flex flex-col gap-2">
          {SHEET_LENGTH_MM_OPTIONS.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="sheetLengthOption"
                value={option}
                checked={sheetLengthMm === option}
                onChange={() => setSheetLengthMm(option)}
              />
              {formatNumber(SHEET_WIDTH_MM, 0)}&nbsp;×&nbsp;{formatNumber(option, 0)}&nbsp;mm
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
          Vienkāršai taisnstūra sienai bieži pietiek ar {formatNumber(WASTE_PERCENT_MIN, 0)}&nbsp;procentiem,
          bet telpām ar daudz logu un durvju izgriezumu vai sarežģītu griestu formu rezerve var sasniegt{' '}
          {formatNumber(WASTE_PERCENT_MAX, 0)}&nbsp;procentus.
        </p>
      </div>

      <Breakdown
        rows={[
          { label: 'Vienas loksnes platība', value: `${formatNumber(result.sheetAreaM2, 2)} m²` },
          { label: 'Platība ar rezervi', value: `${formatNumber(result.wallAreaWithWasteM2, 1)} m²` },
          { label: 'Nepieciešamas loksnes', value: `${formatNumber(result.sheetsNeeded, 0)} gab.` },
        ]}
      />
    </div>
  );
}
