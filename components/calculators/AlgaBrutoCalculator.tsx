'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { calculateAlgaBruto, type AlgaBrutoInputs } from '@/lib/calculators/alga-bruto';

const DEFAULT_INPUT: AlgaBrutoInputs = {
  targetNetMonthlyEur: 1000,
  applyNonTaxableMinimum: true,
};

export function AlgaBrutoCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateAlgaBruto(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="targetNetMonthlyEur"
          label="Vēlamā alga uz rokas (neto)"
          unit="EUR"
          value={input.targetNetMonthlyEur}
          step={50}
          onChange={(value) => setInput((prev) => ({ ...prev, targetNetMonthlyEur: value }))}
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
          <dt className="text-sm text-panel-muted">Nepieciešamā alga uz papīra (bruto)</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.grossMonthlyEur.toFixed(2)} EUR
          </dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">VSAOI (10,5%)</dt>
          <dd className="font-mono text-value text-panel-text">{result.vsaoiEur.toFixed(2)} EUR</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">IIN</dt>
          <dd className="font-mono text-value text-panel-text">{result.iinEur.toFixed(2)} EUR</dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins atrod bruto algu, kas pēc VSAOI darbinieka daļas (10,5%) un progresīvās IIN likmes
        (25,5% līdz 8775 eiro mēnesī, 33% virs tā) atskaitīšanas dod tieši ievadīto neto summu.
        Neietver atvieglojumus par apgādājamiem.
      </p>
    </div>
  );
}
