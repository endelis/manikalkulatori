'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculateEkspluatacijasNodoklis,
  type EkspluatacijasNodoklaInputs,
} from '@/lib/calculators/ekspluatacijas-nodoklis';

const DEFAULT_INPUT: EkspluatacijasNodoklaInputs = {
  co2GramsPerKm: 130,
  engineOver3500cm3: false,
  gasEquipped: false,
};

export function EkspluatacijasNodoklaCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateEkspluatacijasNodoklis(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="co2GramsPerKm"
          label="CO2 izmeši (WLTP)"
          unit="g/km"
          value={input.co2GramsPerKm}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, co2GramsPerKm: value }))}
        />
      </div>

      <div className="reveal flex flex-col gap-2 sm:flex-row" style={{ animationDelay: '90ms' }}>
        <label className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm text-panel-text">
          <input
            type="checkbox"
            checked={input.engineOver3500cm3}
            onChange={(e) => setInput((prev) => ({ ...prev, engineOver3500cm3: e.target.checked }))}
          />
          Dzinēja tilpums virs 3500 cm³
        </label>
        <label className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm text-panel-text">
          <input
            type="checkbox"
            checked={input.gasEquipped}
            onChange={(e) => setInput((prev) => ({ ...prev, gasEquipped: e.target.checked }))}
          />
          Aprīkots ar gāzes iekārtu
        </label>
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Gada nodoklis</dt>
          <dd className="font-mono text-value text-panel-text">{result.totalEur.toFixed(2)} EUR</dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins attiecas uz vieglajiem automobiļiem (M1 kategorija), kas pirmreizēji reģistrēti no
        2021. gada 1. janvāra un kuriem CO2 izmeši mērīti pēc WLTP metodes. Likmes noteiktas
        Transportlīdzekļa ekspluatācijas nodokļa likuma 4. un 7. pantā, pārbaudītas likumi.lv
        2026. gada 11. septembrī.
      </p>
    </div>
  );
}
