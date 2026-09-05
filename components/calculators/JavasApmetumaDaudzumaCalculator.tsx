'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculateApmetumaDaudzums, calculateJavasDaudzums } from '@/lib/calculators/javas-apmetuma-daudzums';
import {
  APMETUMS_PRODUCTS,
  APMETUMS_THICKNESS_MM_MIN,
  APMETUMS_THICKNESS_MM_MAX,
  DEFAULT_APMETUMS_THICKNESS_MM,
  MURJAVA_YIELD_KG_PER_LITER,
  MURJAVA_YIELD_BAG_SIZE_KG,
  MURJAVA_YIELD_PRODUCT_NAME,
  DEFAULT_WASTE_PERCENT,
  DEFAULT_WALL_AREA_M2,
} from '@/lib/calculators/javas-apmetuma-daudzums-defaults';
import {
  JOINT_THICKNESS_MM_MIN,
  JOINT_THICKNESS_MM_MAX,
  DEFAULT_JOINT_THICKNESS_MM,
  UNIT_DEFAULTS,
  type UnitType,
} from '@/lib/calculators/kiegelu-bloku-daudzums-defaults';

type Mode = 'apmetums' | 'java';

const UNIT_LABELS: Record<UnitType, string> = {
  kiegelis: 'Keramiskais ķieģelis',
  bloks: 'Gāzbetona bloks',
};

export function JavasApmetumaDaudzumaCalculator({ accentVar }: { accentVar: string }) {
  const [mode, setMode] = useState<Mode>('apmetums');

  const [apmetumsWallAreaM2, setApmetumsWallAreaM2] = useState(DEFAULT_WALL_AREA_M2);
  const [productIndex, setProductIndex] = useState(0);
  const [thicknessMm, setThicknessMm] = useState(DEFAULT_APMETUMS_THICKNESS_MM);
  const [apmetumsWastePercent, setApmetumsWastePercent] = useState(DEFAULT_WASTE_PERCENT);

  const selectedProduct = APMETUMS_PRODUCTS[productIndex];

  const apmetumaResult = useMemo(
    () =>
      calculateApmetumaDaudzums({
        wallAreaM2: apmetumsWallAreaM2,
        thicknessMm,
        consumptionKgPerM2PerMm: selectedProduct.consumptionKgPerM2PerMm,
        bagSizeKg: selectedProduct.bagSizeKg,
        wastePercent: apmetumsWastePercent,
      }),
    [apmetumsWallAreaM2, thicknessMm, selectedProduct, apmetumsWastePercent],
  );

  const [javaWallAreaM2, setJavaWallAreaM2] = useState(DEFAULT_WALL_AREA_M2);
  const [unitType, setUnitType] = useState<UnitType>('kiegelis');
  const [unitLengthMm, setUnitLengthMm] = useState(UNIT_DEFAULTS.kiegelis.lengthMm);
  const [unitWidthMm, setUnitWidthMm] = useState(UNIT_DEFAULTS.kiegelis.widthMm);
  const [unitHeightMm, setUnitHeightMm] = useState(UNIT_DEFAULTS.kiegelis.heightMm);
  const [jointThicknessMm, setJointThicknessMm] = useState(DEFAULT_JOINT_THICKNESS_MM);
  const [javaWastePercent, setJavaWastePercent] = useState(DEFAULT_WASTE_PERCENT);

  const javaResult = useMemo(
    () =>
      calculateJavasDaudzums({
        wallAreaM2: javaWallAreaM2,
        unitLengthMm,
        unitWidthMm,
        unitHeightMm,
        jointThicknessMm,
        yieldKgPerLiter: MURJAVA_YIELD_KG_PER_LITER,
        bagSizeKg: MURJAVA_YIELD_BAG_SIZE_KG,
        wastePercent: javaWastePercent,
      }),
    [javaWallAreaM2, unitLengthMm, unitWidthMm, unitHeightMm, jointThicknessMm, javaWastePercent],
  );

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-label uppercase text-panel-muted">Ko rēķini</legend>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm">
            <input
              type="radio"
              name="mode"
              value="apmetums"
              checked={mode === 'apmetums'}
              onChange={() => setMode('apmetums')}
            />
            Apmetums (siltuma un apdares kārta uz sienas virsmas)
          </label>
          <label className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm">
            <input
              type="radio"
              name="mode"
              value="java"
              checked={mode === 'java'}
              onChange={() => setMode('java')}
            />
            Mūrjava (šuvju aizpildījums starp ķieģeļiem vai blokiem)
          </label>
        </div>
      </fieldset>

      {mode === 'apmetums' ? (
        <>
          <ResultCard
            label="Nepieciešamais maisu skaits"
            value={`${formatNumber(apmetumaResult.bagsNeeded, 0)} maisi`}
            tone="neutral"
            accentVar={accentVar}
            sublabel={`Nepieciešamais sausā maisījuma daudzums: ${formatNumber(apmetumaResult.kgNeeded, 1)} kg`}
          />

          <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
            <NumberField
              id="apmetumsWallAreaM2"
              label="Apmetamā virsmas platība"
              unit="m²"
              value={apmetumsWallAreaM2}
              step={0.5}
              onChange={setApmetumsWallAreaM2}
            />
            <NumberField
              id="thicknessMm"
              label="Apmetuma biezums"
              unit="mm"
              value={thicknessMm}
              step={1}
              min={0}
              onChange={setThicknessMm}
            />
          </div>
          <p className="text-caption text-panel-faint">
            Ierastais apmetuma biezums ir no {formatNumber(APMETUMS_THICKNESS_MM_MIN, 0)} līdz{' '}
            {formatNumber(APMETUMS_THICKNESS_MM_MAX, 0)} milimetriem, precīzu vērtību konkrētajam gadījumam
            nosaka pamatnes līdzenums.
          </p>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-label uppercase text-panel-muted">Materiāls</legend>
            <div className="flex flex-col gap-2">
              {APMETUMS_PRODUCTS.map((product, index) => (
                <label
                  key={product.name}
                  className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm"
                >
                  <input
                    type="radio"
                    name="apmetumsProduct"
                    value={index}
                    checked={productIndex === index}
                    onChange={() => setProductIndex(index as 0 | 1 | 2)}
                  />
                  {product.name}, {formatNumber(product.consumptionKgPerM2PerMm, 1)}&nbsp;kg/m²/mm, maiss{' '}
                  {formatNumber(product.bagSizeKg, 0)}&nbsp;kg
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <NumberField
              id="apmetumsWastePercent"
              label="Rezerves procents"
              unit="%"
              value={apmetumsWastePercent}
              step={1}
              min={0}
              max={40}
              onChange={setApmetumsWastePercent}
            />
            <p className="text-caption text-panel-faint">
              Rezerves procents sedz maisījuma zudumus un pamatnes nelīdzenumus, konkrētam objektam
              pielāgojama vērtība, nevis citēts fakts.
            </p>
          </div>

          <Breakdown
            rows={[
              { label: 'Platība ar rezervi', value: `${formatNumber(apmetumaResult.wallAreaWithWasteM2, 1)} m²` },
              { label: 'Nepieciešamais daudzums', value: `${formatNumber(apmetumaResult.kgNeeded, 1)} kg` },
              { label: 'Nepieciešami maisi', value: `${formatNumber(apmetumaResult.bagsNeeded, 0)} gab.` },
            ]}
          />
        </>
      ) : (
        <>
          <ResultCard
            label="Nepieciešamais maisu skaits"
            value={`${formatNumber(javaResult.bagsNeeded, 0)} maisi`}
            tone="neutral"
            accentVar={accentVar}
            sublabel={`Aprēķinātais javas apjoms: ${formatNumber(javaResult.mortarVolumeLiters, 1)} L`}
          />

          <p className="text-caption text-panel-faint">
            Javas apjomu aprēķina ģeometriski, no sienas apjoma atņemot ķieģeļu vai bloku apjomu, izmantojot
            to pašu vienību skaitu, ko dotu{' '}
            <Link
              href="/majoklis/kiegelu-bloku-daudzums"
              className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
            >
              ķieģeļu un bloku daudzuma kalkulators
            </Link>
            . Ja tā rezultāts jau ir zināms, vienkārši ievadi tos pašus izmērus šeit.
          </p>

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
                    name="javaUnitType"
                    value={value}
                    checked={unitType === value}
                    onChange={() => {
                      setUnitType(value);
                      setUnitLengthMm(UNIT_DEFAULTS[value].lengthMm);
                      setUnitWidthMm(UNIT_DEFAULTS[value].widthMm);
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
              id="javaWallAreaM2"
              label="Sienas platība"
              unit="m²"
              value={javaWallAreaM2}
              step={0.5}
              onChange={setJavaWallAreaM2}
            />
            <div className="grid grid-cols-3 gap-2">
              <NumberField
                id="unitLengthMm"
                label="Garums"
                unit="mm"
                value={unitLengthMm}
                step={1}
                onChange={setUnitLengthMm}
              />
              <NumberField
                id="unitWidthMm"
                label="Platums"
                unit="mm"
                value={unitWidthMm}
                step={1}
                onChange={setUnitWidthMm}
              />
              <NumberField
                id="unitHeightMm"
                label="Augstums"
                unit="mm"
                value={unitHeightMm}
                step={1}
                onChange={setUnitHeightMm}
              />
            </div>
          </div>
          <p className="text-caption text-panel-faint">
            Platums šeit ir sienas biezuma virziens, tas nosaka javas apjomu, bet neietekmē vienību skaitu uz
            vienu kvadrātmetru sienas sejas.
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
              id="javaWastePercent"
              label="Rezerves procents"
              unit="%"
              value={javaWastePercent}
              step={1}
              min={0}
              max={40}
              onChange={setJavaWastePercent}
            />
            <p className="text-caption text-panel-faint">
              Rezerves procents sedz javas zudumus mūrēšanas laikā, konkrētam objektam pielāgojama vērtība,
              nevis citēts fakts.
            </p>
          </div>

          <Breakdown
            rows={[
              { label: 'Vienību skaits', value: `${formatNumber(javaResult.unitsNeeded, 0)} gab.` },
              { label: 'Javas apjoms', value: `${formatNumber(javaResult.mortarVolumeLiters, 1)} L` },
              { label: 'Sausā maisījuma daudzums', value: `${formatNumber(javaResult.kgNeeded, 1)} kg` },
              { label: 'Nepieciešami maisi', value: `${formatNumber(javaResult.bagsNeeded, 0)} gab.` },
            ]}
          />
          <p className="text-caption text-panel-faint">
            Aprēķins pieņem, ka {MURJAVA_YIELD_PRODUCT_NAME} produkta iznākums ir raksturīgs mūrjavai kopumā,
            atsevišķiem produktiem iznākums var atšķirties, sk. Avoti.
          </p>
        </>
      )}
    </div>
  );
}
