'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import { formatCurrencyEUR } from '@/lib/format';
import { calculateOcta, type OctaInputs } from '@/lib/calculators/octa-kalkulators';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: OctaInputs = {
  quote1: 85,
  quote2: 92,
  quote3: 78,
};

export function OctaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateOcta(input), [input]);

  const tweenedCheapestAmount = useTweenedNumber(result.cheapestAmount);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label={`${result.cheapestQuoteNumber}. piedāvājums ir lētākais`}
        value={formatCurrencyEUR(tweenedCheapestAmount)}
        tone="winner"
        accentVar={accentVar}
        sublabel={`Ietaupi ${formatCurrencyEUR(result.savings)} salīdzinājumā ar dārgāko`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="quote1"
          label="1. piedāvājums"
          unit="€"
          value={input.quote1}
          step={5}
          onChange={(value) => setInput((prev) => ({ ...prev, quote1: value }))}
        />
        <NumberField
          id="quote2"
          label="2. piedāvājums"
          unit="€"
          value={input.quote2}
          step={5}
          onChange={(value) => setInput((prev) => ({ ...prev, quote2: value }))}
        />
        <NumberField
          id="quote3"
          label="3. piedāvājums"
          unit="€"
          value={input.quote3}
          step={5}
          onChange={(value) => setInput((prev) => ({ ...prev, quote3: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        OCTA ir obligāta visiem reģistrētiem transportlīdzekļiem. Cena atšķiras starp apdrošinātājiem,
        tāpēc vērts salīdzināt vairākus piedāvājumus pirms izvēles.
      </p>

      <Breakdown
        rows={[
          { label: 'Lētākais piedāvājums', value: formatCurrencyEUR(result.cheapestAmount) },
          { label: 'Dārgākais piedāvājums', value: formatCurrencyEUR(result.mostExpensiveAmount) },
        ]}
      />
    </div>
  );
}
