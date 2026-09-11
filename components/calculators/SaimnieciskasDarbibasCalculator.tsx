'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculateSaimnieciskaDarbiba,
  type SaimnieciskasDarbibasInputs,
} from '@/lib/calculators/saimnieciska-darbiba';

const DEFAULT_INPUT: SaimnieciskasDarbibasInputs = {
  monthlyTaxableIncomeEur: 1200,
};

export function SaimnieciskasDarbibasCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateSaimnieciskaDarbiba(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="monthlyTaxableIncomeEur"
          label="Ienākums mēnesī (ieņēmumi mīnus izdevumi)"
          unit="EUR"
          value={input.monthlyTaxableIncomeEur}
          step={50}
          onChange={(value) => setInput((prev) => ({ ...prev, monthlyTaxableIncomeEur: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Paliek pēc nodokļiem</dt>
          <dd className="font-mono text-value text-panel-text">{result.netMonthlyEur.toFixed(2)} EUR</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">VSAOI</dt>
          <dd className="font-mono text-value text-panel-text">{result.vsaoiEur.toFixed(2)} EUR</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">IIN</dt>
          <dd className="font-mono text-value text-panel-text">{result.iinEur.toFixed(2)} EUR</dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins pieņem vispārējo nodokļu režīmu: līdz minimālajai algai (780 eiro) VSAOI maksā tikai
        pensiju apdrošināšanai 10 procentu apmērā, no minimālās algas VSAOI ir 31,07 procenti, virs
        tās papildu 10 procenti. IIN aprēķina pēc progresīvās likmes atlikumam. Neietver ikgadējā
        deklarācijā piemērojamo neapliekamo minimumu vai citus atvieglojumus.
      </p>
    </div>
  );
}
