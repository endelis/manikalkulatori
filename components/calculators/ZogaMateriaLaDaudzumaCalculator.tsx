'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculateZogaMateriaLaDaudzums } from '@/lib/calculators/zoga-materiala-daudzums';
import {
  POST_SPACING_M_MIN,
  POST_SPACING_M_MAX,
  DEFAULT_POST_SPACING_M,
  HOLE_DIAMETER_MM_EXAMPLE,
  HOLE_DEPTH_MM_EXAMPLE,
  BOARD_WIDTH_MM_MIN,
  BOARD_WIDTH_MM_MAX,
  DEFAULT_BOARD_WIDTH_MM,
  GAP_MM_MIN,
  GAP_MM_MAX,
  DEFAULT_GAP_MM,
  DEFAULT_WASTE_PERCENT,
  DEFAULT_FENCE_LENGTH_M,
} from '@/lib/calculators/zoga-materiala-daudzums-defaults';

export function ZogaMateriaLaDaudzumaCalculator({ accentVar }: { accentVar: string }) {
  const [fenceLengthM, setFenceLengthM] = useState(DEFAULT_FENCE_LENGTH_M);
  const [postSpacingM, setPostSpacingM] = useState(DEFAULT_POST_SPACING_M);
  const [boardWidthMm, setBoardWidthMm] = useState(DEFAULT_BOARD_WIDTH_MM);
  const [gapMm, setGapMm] = useState(DEFAULT_GAP_MM);
  const [wastePercent, setWastePercent] = useState(DEFAULT_WASTE_PERCENT);

  const result = useMemo(
    () => calculateZogaMateriaLaDaudzums({ fenceLengthM, postSpacingM, boardWidthMm, gapMm, wastePercent }),
    [fenceLengthM, postSpacingM, boardWidthMm, gapMm, wastePercent],
  );

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Nepieciešamie statņi un dēlīši"
        value={`${formatNumber(result.postsNeeded, 0)} statņi, ${formatNumber(result.boardsNeeded, 0)} dēlīši`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`Žoga garums ar rezervi: ${formatNumber(result.fenceLengthWithWasteM, 1)} m`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="fenceLengthM"
          label="Žoga garums"
          unit="m"
          value={fenceLengthM}
          step={0.5}
          onChange={setFenceLengthM}
        />
        <NumberField
          id="postSpacingM"
          label="Attālums starp statņiem"
          unit="m"
          value={postSpacingM}
          step={0.1}
          min={0}
          onChange={setPostSpacingM}
        />
      </div>
      <p className="text-caption text-panel-faint">
        Koka žogiem attālums starp statņiem parasti ir no {formatNumber(POST_SPACING_M_MIN, 0)} līdz{' '}
        {formatNumber(POST_SPACING_M_MAX, 0)}&nbsp;metriem, nav atrasts viens autoritatīvs Latvijas
        standarts, tikai vairāku avotu konverģējošs diapazons. Statņu skaits ietver statni abos žoga galos.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          id="boardWidthMm"
          label="Dēlīša platums"
          unit="mm"
          value={boardWidthMm}
          step={1}
          min={0}
          onChange={setBoardWidthMm}
        />
        <NumberField
          id="gapMm"
          label="Sprauga starp dēlīšiem"
          unit="mm"
          value={gapMm}
          step={1}
          min={0}
          onChange={setGapMm}
        />
      </div>
      <p className="text-caption text-panel-faint">
        Dēlīša platums {formatNumber(BOARD_WIDTH_MM_MIN, 0)} līdz {formatNumber(BOARD_WIDTH_MM_MAX, 0)}
        &nbsp;milimetriem atkārtojas vairākos Latvijas kokmateriālu tirgotājos.
        Sprauga ir tavs izvēles jautājums: aptuveni dēļa platuma lieluma sprauga dod puscaurredzamu žogu,
        neliela {formatNumber(GAP_MM_MIN, 0)} līdz {formatNumber(DEFAULT_GAP_MM, 0)}&nbsp;mm sprauga dod
        gandrīz necaurredzamu privātuma žogu ar vietu koka žūšanai.
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
          Nav atrasts Latvijai specifisks avots šim procentam, tas ir pielāgojams lauks, nevis citēts fakts.
        </p>
      </div>

      <Breakdown
        rows={[
          { label: 'Statņu skaits', value: `${formatNumber(result.postsNeeded, 0)} gab.` },
          { label: 'Viena dēlīša segums', value: `${formatNumber(result.boardCoverageM, 3)} m` },
          { label: 'Žoga garums ar rezervi', value: `${formatNumber(result.fenceLengthWithWasteM, 1)} m` },
          { label: 'Dēlīšu skaits', value: `${formatNumber(result.boardsNeeded, 0)} gab.` },
        ]}
      />

      <p className="text-caption text-panel-faint">
        Katram statnim parasti vajadzīga betonēta bedre, apmēram {formatNumber(HOLE_DIAMETER_MM_EXAMPLE, 0)}
        &nbsp;mm diametrā un {formatNumber(HOLE_DEPTH_MM_EXAMPLE, 0)}&nbsp;mm dziļumā ir bieži sastopams
        piemērs. Vienas bedres betona daudzumu aprēķini{' '}
        <a
          href="/majoklis/betona-apjoms"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          betona apjoma kalkulatorā
        </a>
        , tad reizini ar statņu skaitu, sk. Biežāk uzdotos jautājumus.
      </p>
    </div>
  );
}
