'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ToggleField } from '@/components/ToggleField';
import { ResultCard, type ResultCardTone } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR } from '@/lib/format';
import { calculateEkiiAtbalsts, type EkiiInputs } from '@/lib/calculators/ekii-atbalsts';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: EkiiInputs = {
  vehiclePriceExclVat: 35000,
  isUsed: false,
  isPhev: false,
  hasFamilyCard: false,
  seatCount: 5,
  childrenCount: 0,
};

const INELIGIBLE_LABELS: Record<string, string> = {
  'price-too-high': 'Auto cena pārsniedz atbalsta cenas griestus',
  'price-too-low': 'Lietota auto cena ir zemāka par minimālo',
  'phev-used-not-eligible': 'Lietoti spraudņa hibrīdi atbalstu nesaņem',
};

export function EkiiAtbalstsCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateEkiiAtbalsts(input), [input]);

  const tone: ResultCardTone = result.eligible ? 'winner' : 'loser';
  const label = result.eligible
    ? 'Pieejamais EKII atbalsts'
    : (result.ineligibleReason && INELIGIBLE_LABELS[result.ineligibleReason]) || '';

  const tweenedGrantAmount = useTweenedNumber(result.eligible ? result.grantAmount : 0);
  const tweenedNetPrice = useTweenedNumber(result.netPriceExclVat);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label={label}
        value={formatCurrencyEUR(result.eligible ? tweenedGrantAmount : 0)}
        tone={tone}
        accentVar={accentVar}
        sublabel={
          result.eligible ? `Auto cena pēc atbalsta: ${formatCurrencyEUR(tweenedNetPrice)}` : undefined
        }
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="vehiclePriceExclVat"
          label="Auto cena bez PVN"
          unit="€"
          value={input.vehiclePriceExclVat}
          step={500}
          onChange={(value) => setInput((prev) => ({ ...prev, vehiclePriceExclVat: value }))}
        />
        <ToggleField
          id="isUsed"
          label="Auto statuss"
          value={input.isUsed}
          falseLabel="Jauns"
          trueLabel="Lietots"
          onChange={(value) => setInput((prev) => ({ ...prev, isUsed: value }))}
        />
        <ToggleField
          id="isPhev"
          label="Auto tips"
          value={input.isPhev}
          falseLabel="Elektroauto"
          trueLabel="Spraudņa hibrīds"
          onChange={(value) => setInput((prev) => ({ ...prev, isPhev: value }))}
        />
        <ToggleField
          id="hasFamilyCard"
          label="Goda ģimenes apliecība"
          value={input.hasFamilyCard}
          falseLabel="Nav"
          trueLabel="Ir"
          onChange={(value) => setInput((prev) => ({ ...prev, hasFamilyCard: value }))}
        />
        <NumberField
          id="seatCount"
          label="Sēdvietu skaits"
          value={input.seatCount}
          step={1}
          min={2}
          onChange={(value) => setInput((prev) => ({ ...prev, seatCount: value }))}
        />
        {input.hasFamilyCard ? (
          <NumberField
            id="childrenCount"
            label="Bērnu skaits ģimenē"
            value={input.childrenCount}
            step={1}
            min={0}
            onChange={(value) => setInput((prev) => ({ ...prev, childrenCount: value }))}
          />
        ) : null}
      </div>

      <p className="text-caption text-panel-faint">
        Aprēķins ir orientējošs un balstīts uz 2026. gada EKII programmas nosacījumiem. Galīgo
        atbilstību apstiprina Vides investīciju fonds.
      </p>

      <Breakdown
        rows={[
          { label: 'Auto cena bez PVN', value: formatCurrencyEUR(input.vehiclePriceExclVat) },
          { label: 'Cenas griesti', value: formatCurrencyEUR(result.priceCapExclVat) },
          { label: 'EKII atbalsts', value: formatCurrencyEUR(result.grantAmount) },
        ]}
      />
    </div>
  );
}
