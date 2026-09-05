'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatNumber } from '@/lib/format';
import { calculatePasizlidzinosasJavasDaudzums } from '@/lib/calculators/pasizlidzinosas-javas-daudzums';
import {
  PRODUCTS,
  WASTE_PERCENT_MIN,
  WASTE_PERCENT_MAX,
  DEFAULT_WASTE_PERCENT,
  DEFAULT_AREA_M2,
  type ProductIndex,
} from '@/lib/calculators/pasizlidzinosas-javas-daudzums-defaults';

export function PasizlidzinosasJavasDaudzumaCalculator({ accentVar }: { accentVar: string }) {
  const [areaM2, setAreaM2] = useState(DEFAULT_AREA_M2);
  const [productIndex, setProductIndex] = useState<ProductIndex>(0);
  const [thicknessMm, setThicknessMm] = useState(PRODUCTS[0].thicknessMmMin);
  const [wastePercent, setWastePercent] = useState(DEFAULT_WASTE_PERCENT);

  const selectedProduct = PRODUCTS[productIndex];

  const result = useMemo(
    () =>
      calculatePasizlidzinosasJavasDaudzums({
        areaM2,
        thicknessMm,
        consumptionKgPerM2PerMm: selectedProduct.consumptionKgPerM2PerMm,
        bagSizeKg: selectedProduct.bagSizeKg,
        wastePercent,
      }),
    [areaM2, thicknessMm, selectedProduct, wastePercent],
  );

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Nepieciešamais maisu skaits"
        value={`${formatNumber(result.bagsNeeded, 0)} maisi`}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`Nepieciešamais sausā maisījuma daudzums: ${formatNumber(result.kgNeeded, 1)} kg`}
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="text-label uppercase text-panel-muted">Java</legend>
        <div className="flex flex-col gap-2">
          {PRODUCTS.map((product, index) => (
            <label
              key={product.name}
              className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="product"
                value={index}
                checked={productIndex === index}
                onChange={() => {
                  setProductIndex(index as ProductIndex);
                  setThicknessMm(PRODUCTS[index].thicknessMmMin);
                }}
              />
              {product.name}, {formatNumber(product.consumptionKgPerM2PerMm, 1)}&nbsp;kg/m²/mm, kārta
              {' '}{formatNumber(product.thicknessMmMin, 0)}&nbsp;līdz{' '}
              {formatNumber(product.thicknessMmMax, 0)}&nbsp;mm
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
          id="thicknessMm"
          label="Kārtas biezums"
          unit="mm"
          value={thicknessMm}
          step={1}
          min={0}
          onChange={setThicknessMm}
        />
      </div>
      <p className="text-caption text-panel-faint">
        Izvēlētā java ražotāja datu lapā norādīta lietošanai {formatNumber(selectedProduct.thicknessMmMin, 0)}
        &nbsp;līdz {formatNumber(selectedProduct.thicknessMmMax, 0)}&nbsp;mm biezumā, ārpus šī diapazona
        patēriņš var neatbilst norādītajam.
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
          Nevienā no pārbaudītajām ražotāja datu lapām nav minēts rezerves procents šim materiālam, tāpēc
          šī vērtība ir vispārīga būvniecības konvencija ({formatNumber(WASTE_PERCENT_MIN, 0)} līdz{' '}
          {formatNumber(WASTE_PERCENT_MAX, 0)}&nbsp;%), ne šī materiāla ražotāja fakts.
        </p>
      </div>

      <Breakdown
        rows={[
          { label: 'Platība ar rezervi', value: `${formatNumber(result.areaWithWasteM2, 1)} m²` },
          { label: 'Nepieciešamais daudzums', value: `${formatNumber(result.kgNeeded, 1)} kg` },
          { label: 'Nepieciešami maisi', value: `${formatNumber(result.bagsNeeded, 0)} gab.` },
        ]}
      />
    </div>
  );
}
