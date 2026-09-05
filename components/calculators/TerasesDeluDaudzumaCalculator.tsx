'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculateTerasesDeluDaudzums } from '@/lib/calculators/terases-delu-daudzums';
import {
  TERASES_MATERIALS,
  GAP_MM_MIN,
  GAP_MM_MAX,
  DEFAULT_GAP_MM,
  WASTE_PERCENT_MIN,
  WASTE_PERCENT_MAX,
  DEFAULT_WASTE_PERCENT,
  DEFAULT_DECK_AREA_M2,
  type TerasesMaterialType,
} from '@/lib/calculators/terases-delu-daudzums-defaults';

export function TerasesDeluDaudzumaCalculator({ accentVar }: { accentVar: string }) {
  const [materialType, setMaterialType] = useState<TerasesMaterialType>('kompozits');
  const [deckAreaM2, setDeckAreaM2] = useState(DEFAULT_DECK_AREA_M2);
  const [boardWidthMm, setBoardWidthMm] = useState(TERASES_MATERIALS.kompozits.widthMmDefault);
  const [boardLengthMm, setBoardLengthMm] = useState(TERASES_MATERIALS.kompozits.lengthMmDefault);
  const [gapMm, setGapMm] = useState(DEFAULT_GAP_MM);
  const [wastePercent, setWastePercent] = useState(DEFAULT_WASTE_PERCENT);

  const result = useMemo(
    () => calculateTerasesDeluDaudzums({ deckAreaM2, boardWidthMm, boardLengthMm, gapMm, wastePercent }),
    [deckAreaM2, boardWidthMm, boardLengthMm, gapMm, wastePercent],
  );

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Nepieciešamais dēļu skaits"
        value={`${formatNumber(result.boardsNeeded, 0)} dēļi`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`Platība ar rezervi: ${formatNumber(result.deckAreaWithWasteM2, 1)} m²`}
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="text-label uppercase text-panel-muted">Materiāls</legend>
        <div className="flex flex-col gap-2">
          {(Object.keys(TERASES_MATERIALS) as TerasesMaterialType[]).map((value) => (
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
                  setBoardWidthMm(TERASES_MATERIALS[value].widthMmDefault);
                  setBoardLengthMm(TERASES_MATERIALS[value].lengthMmDefault);
                }}
              />
              {TERASES_MATERIALS[value].label}, piemēram{' '}
              {formatNumber(TERASES_MATERIALS[value].widthMmDefault, 0)}&nbsp;×&nbsp;
              {formatNumber(TERASES_MATERIALS[value].lengthMmDefault, 0)}&nbsp;mm
            </label>
          ))}
        </div>
      </fieldset>

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="deckAreaM2"
          label="Terases platība"
          unit="m²"
          value={deckAreaM2}
          step={0.5}
          onChange={setDeckAreaM2}
        />
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            id="boardWidthMm"
            label="Dēļa platums"
            unit="mm"
            value={boardWidthMm}
            step={1}
            onChange={setBoardWidthMm}
          />
          <NumberField
            id="boardLengthMm"
            label="Dēļa garums"
            unit="mm"
            value={boardLengthMm}
            step={10}
            onChange={setBoardLengthMm}
          />
        </div>
      </div>
      <p className="text-caption text-panel-faint">
        Dažādiem terases dēļu produktiem platums un garums atšķiras, iepriekš aizpildītā vērtība ir viena
        reāla piemēra izmērs, ne universāls standarts, precīzu izmēru vienmēr pārbaudi uz konkrētā produkta
        etiķetes.
      </p>

      <div className="flex flex-col gap-2">
        <NumberField
          id="gapMm"
          label="Šuve starp dēļiem"
          unit="mm"
          value={gapMm}
          step={1}
          min={0}
          onChange={setGapMm}
        />
        <p className="text-caption text-panel-faint">
          Šuve parasti ir no {formatNumber(GAP_MM_MIN, 0)} līdz {formatNumber(GAP_MM_MAX, 0)} milimetriem,
          kompozītam materiālam ap 4 līdz 5&nbsp;mm, sausam kokam 4 līdz 6&nbsp;mm, bet svaigi impregnētam
          slapjam kokam sākumā tikai 2 līdz 3&nbsp;mm, jo koks žūstot paplašina šuvi.
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
          Vienkāršam taisnstūra izkārtojumam bieži pietiek ar {formatNumber(WASTE_PERCENT_MIN, 0)}
          &nbsp;procentiem, slīpam vai rakstainam izkārtojumam rezerve var sasniegt{' '}
          {formatNumber(WASTE_PERCENT_MAX, 0)}&nbsp;procentus. Nav atrasts Latvijai specifisks avots šim
          procentam, tas ir pielāgojams lauks.
        </p>
      </div>

      <Breakdown
        rows={[
          { label: 'Viena dēļa segums', value: `${formatNumber(result.boardCoverageM2, 3)} m²` },
          { label: 'Platība ar rezervi', value: `${formatNumber(result.deckAreaWithWasteM2, 1)} m²` },
          { label: 'Nepieciešami dēļi', value: `${formatNumber(result.boardsNeeded, 0)} gab.` },
        ]}
      />
    </div>
  );
}
