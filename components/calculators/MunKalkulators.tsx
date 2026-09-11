'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { calculateMunKalkulators, type MunKalkulatoraInputs } from '@/lib/calculators/mun-kalkulators';

const DEFAULT_INPUT: MunKalkulatoraInputs = {
  turnoverEur: 10000,
};

export function MunKalkulators({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateMunKalkulators(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="turnoverEur"
          label="Apgrozījums"
          unit="EUR"
          value={input.turnoverEur}
          step={100}
          onChange={(value) => setInput((prev) => ({ ...prev, turnoverEur: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Mikrouzņēmuma nodoklis</dt>
          <dd className="font-mono text-value text-panel-text">{result.taxEur.toFixed(2)} EUR</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Paliek pēc nodokļa</dt>
          <dd className="font-mono text-value text-panel-text">{result.netEur.toFixed(2)} EUR</dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins izmanto mikrouzņēmumu nodokļa likmi 25 procenti no apgrozījuma, kas noteikta
        Mikrouzņēmumu nodokļa likuma 6. pantā jaunajiem nodokļa maksātājiem. Jau pirms 2021. gada
        reģistrētiem maksātājiem var piemērot atšķirīgu pārejas perioda kārtību.
      </p>
    </div>
  );
}
