'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculateIpasumaNodoklis,
  type IpasumaNodoklaInputs,
} from '@/lib/calculators/ipasuma-nodoklis';

const DEFAULT_INPUT: IpasumaNodoklaInputs = {
  cadastralValueEur: 50000,
  ratePercent: 1.5,
};

export function IpasumaNodoklaCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateIpasumaNodoklis(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="cadastralValueEur"
          label="Kadastrālā vērtība"
          unit="EUR"
          value={input.cadastralValueEur}
          step={1000}
          onChange={(value) => setInput((prev) => ({ ...prev, cadastralValueEur: value }))}
        />
        <NumberField
          id="ratePercent"
          label="Nodokļa likme"
          unit="%"
          value={input.ratePercent}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, ratePercent: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Nodoklis gadā</dt>
          <dd className="font-mono text-value text-panel-text">{result.annualTaxEur.toFixed(2)} EUR</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Nodoklis ceturksnī</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.quarterlyTaxEur.toFixed(2)} EUR
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Nekustamā īpašuma nodokļa likmi nosaka katra pašvaldība atsevišķi likumā noteiktajās robežās,
        tāpēc precīzu likmi savam īpašumam der pārbaudīt attiecīgās pašvaldības mājaslapā vai
        maksāšanas paziņojumā. Kadastrālo vērtību var atrast Valsts zemes dienesta Kadastra
        informācijas sistēmā.
      </p>
    </div>
  );
}
