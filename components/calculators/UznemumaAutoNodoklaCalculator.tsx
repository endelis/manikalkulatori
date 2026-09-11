'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculateUznemumaAutoNodoklis,
  type UznemumaAutoNodoklaInputs,
  type UznemumaAutoVehicleType,
} from '@/lib/calculators/uznemuma-auto-nodoklis';

const VEHICLE_TYPE_LABELS: Record<UznemumaAutoVehicleType, string> = {
  electric: 'Elektromobilis',
  plugInHybrid: 'Spraudņa hibrīds',
  other: 'Cits (benzīns, dīzelis, parastais hibrīds)',
};

const DEFAULT_INPUT: UznemumaAutoNodoklaInputs = {
  vehicleType: 'other',
  firstRegisteredAfter2009: true,
  enginePowerKw: 90,
};

export function UznemumaAutoNodoklaCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateUznemumaAutoNodoklis(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="reveal flex flex-col gap-2" style={{ animationDelay: '60ms' }}>
        <div className="flex flex-col gap-2 sm:flex-row">
          {(Object.keys(VEHICLE_TYPE_LABELS) as UznemumaAutoVehicleType[]).map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="vehicleType"
                value={value}
                checked={input.vehicleType === value}
                onChange={() => setInput((prev) => ({ ...prev, vehicleType: value }))}
              />
              {VEHICLE_TYPE_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      {input.vehicleType === 'other' ? (
        <div className="reveal flex flex-col gap-4" style={{ animationDelay: '90ms' }}>
          <label className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm text-panel-text">
            <input
              type="checkbox"
              checked={input.firstRegisteredAfter2009}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, firstRegisteredAfter2009: e.target.checked }))
              }
            />
            Pirmreizēji reģistrēts pēc 2009. gada
          </label>
          {input.firstRegisteredAfter2009 ? (
            <NumberField
              id="enginePowerKw"
              label="Dzinēja jauda"
              unit="kW"
              value={input.enginePowerKw}
              step={5}
              onChange={(value) => setInput((prev) => ({ ...prev, enginePowerKw: value }))}
            />
          ) : null}
        </div>
      ) : null}

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Nodoklis mēnesī</dt>
          <dd className="font-mono text-value text-panel-text">{result.monthlyRateEur.toFixed(2)} EUR</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Nodoklis gadā</dt>
          <dd className="font-mono text-value text-panel-text">{result.annualRateEur.toFixed(2)} EUR</dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Aprēķins attiecas uz uzņēmumu vieglo transportlīdzekļu nodokli, kas jāmaksā par katru pilnu
        kalendāra mēnesi, kamēr transportlīdzeklis ir uzņēmuma īpašumā vai turējumā, neatkarīgi no
        faktiskā izmantojuma. Likmes noteiktas likuma 12. pantā, pārbaudītas likumi.lv 2026. gada
        11. septembrī.
      </p>
    </div>
  );
}
