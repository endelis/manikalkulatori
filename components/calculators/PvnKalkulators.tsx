'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculatePvnKalkulators,
  type PvnDarbibasVeids,
  type PvnKalkulatoraInputs,
} from '@/lib/calculators/pvn-kalkulators';

const MODE_LABELS: Record<PvnDarbibasVeids, string> = {
  add: 'Pieskaitīt PVN summai',
  extract: 'Izdalīt PVN no summas',
};

const DEFAULT_INPUT: PvnKalkulatoraInputs = {
  amountEur: 100,
  vatRatePercent: 21,
  mode: 'add',
};

export function PvnKalkulators({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculatePvnKalkulators(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="reveal flex flex-col gap-2" style={{ animationDelay: '60ms' }}>
        <div className="flex flex-col gap-2 sm:flex-row">
          {(Object.keys(MODE_LABELS) as PvnDarbibasVeids[]).map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="mode"
                value={value}
                checked={input.mode === value}
                onChange={() => setInput((prev) => ({ ...prev, mode: value }))}
              />
              {MODE_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '90ms' }}>
        <NumberField
          id="amountEur"
          label={input.mode === 'add' ? 'Summa bez PVN' : 'Summa ar PVN'}
          unit="EUR"
          value={input.amountEur}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, amountEur: value }))}
        />
        <NumberField
          id="vatRatePercent"
          label="PVN likme"
          unit="%"
          value={input.vatRatePercent}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, vatRatePercent: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Summa bez PVN</dt>
          <dd className="font-mono text-value text-panel-text">{result.netAmountEur.toFixed(2)} EUR</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">PVN summa</dt>
          <dd className="font-mono text-value text-panel-text">{result.vatAmountEur.toFixed(2)} EUR</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Summa ar PVN</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.grossAmountEur.toFixed(2)} EUR
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Ievadi savam darījumam piemērojamo PVN likmi. Latvijā standarta un samazinātās likmes
        atšķiras pēc preces vai pakalpojuma veida, tāpēc precīzu likmi pārbaudi Valsts ieņēmumu
        dienesta mājaslapā vai pie sava grāmatveža.
      </p>
    </div>
  );
}
