'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { calculateInflacija, type InflacijasInputs } from '@/lib/calculators/inflacija';

const DEFAULT_INPUT: InflacijasInputs = {
  amountEur: 1000,
  annualInflationPercent: 3,
  years: 10,
};

export function InflacijasCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateInflacija(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="amountEur"
          label="Summa šodien"
          unit="EUR"
          value={input.amountEur}
          step={100}
          onChange={(value) => setInput((prev) => ({ ...prev, amountEur: value }))}
        />
        <NumberField
          id="annualInflationPercent"
          label="Gada inflācija"
          unit="%"
          value={input.annualInflationPercent}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, annualInflationPercent: value }))}
        />
        <NumberField
          id="years"
          label="Gadu skaits"
          unit="gadi"
          value={input.years}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, years: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Pirktspēja pēc {input.years} gadiem</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.futurePurchasingPowerEur.toFixed(2)} EUR
          </dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Zaudētā pirktspēja</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.purchasingPowerLostEur.toFixed(2)} EUR
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins parāda, cik liela būtu šodienas summas pirktspēja pēc norādītā gadu skaita pie
        vienmērīgas gada inflācijas. Ievadi inflācijas likmi, kuru vēlies pārbaudīt; reālā inflācija
        gadu no gada svārstās.
      </p>
    </div>
  );
}
