'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { calculateIinKalkulators, type IinKalkulatoraInputs } from '@/lib/calculators/iin-kalkulators';

const DEFAULT_INPUT: IinKalkulatoraInputs = {
  capitalIncomeEur: 1000,
};

export function IinKalkulators({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateIinKalkulators(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="capitalIncomeEur"
          label="Ienākums no kapitāla (peļņa)"
          unit="EUR"
          value={input.capitalIncomeEur}
          step={100}
          onChange={(value) => setInput((prev) => ({ ...prev, capitalIncomeEur: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">IIN (25,5%)</dt>
          <dd className="font-mono text-value text-panel-text">{result.taxEur.toFixed(2)} EUR</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Paliek pēc nodokļa</dt>
          <dd className="font-mono text-value text-panel-text">{result.netEur.toFixed(2)} EUR</dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins izmanto 25,5 procentu likmi ienākumam no kapitāla, tostarp kapitāla pieaugumam
        (peļņa no nekustamā īpašuma, vērtspapīru vai citu kapitāla aktīvu pārdošanas), dividendēm un
        procentu ienākumiem. Darījumiem, kas sākti pirms 2025. gada un nav pabeigti, var piemērot
        pārejas perioda likmi 20 procenti; precīzus nosacījumus pārbaudi VID mājaslapā.
      </p>
    </div>
  );
}
