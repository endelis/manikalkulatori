'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { calculateAlgaNeto, type AlgaNetoInputs } from '@/lib/calculators/alga-neto';

const DEFAULT_INPUT: AlgaNetoInputs = {
  grossMonthlyEur: 1200,
  applyNonTaxableMinimum: true,
};

export function AlgaNetoCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateAlgaNeto(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="grossMonthlyEur"
          label="Alga uz papīra (bruto)"
          unit="EUR"
          value={input.grossMonthlyEur}
          step={50}
          onChange={(value) => setInput((prev) => ({ ...prev, grossMonthlyEur: value }))}
        />
      </div>

      <label className="reveal flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm text-panel-text" style={{ animationDelay: '90ms' }}>
        <input
          type="checkbox"
          checked={input.applyNonTaxableMinimum}
          onChange={(e) => setInput((prev) => ({ ...prev, applyNonTaxableMinimum: e.target.checked }))}
        />
        Piemērot neapliekamo minimumu (iesniegta algas nodokļa grāmatiņa)
      </label>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Alga uz rokas (neto)</dt>
          <dd className="font-mono text-value text-panel-text">{result.netMonthlyEur.toFixed(2)} EUR</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">VSAOI (10,5%)</dt>
          <dd className="font-mono text-value text-panel-text">{result.vsaoiEur.toFixed(2)} EUR</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Neapliekamais minimums</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.nonTaxableMinimumEur.toFixed(2)} EUR
          </dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">IIN</dt>
          <dd className="font-mono text-value text-panel-text">{result.iinEur.toFixed(2)} EUR</dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins izmanto VSAOI darbinieka daļu 10,5 procenti, progresīvo IIN likmi 25,5 procenti
        līdz 8775 eiro mēnesī un 33 procenti virs tā, un neapliekamo minimumu līdz 550 eiro mēnesī,
        kas lineāri samazinās no 500 līdz 1800 eiro ienākumiem. Neietver atvieglojumus par
        apgādājamiem. Precīzu summu var atšķirties atkarībā no individuālajiem apstākļiem, pārbaudi
        ar VID kalkulatoru.
      </p>
    </div>
  );
}
