'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { calculateFtpZonas, type FtpZonuInputs } from '@/lib/calculators/ftp-zonas';

const DEFAULT_INPUT: FtpZonuInputs = {
  ftpWatts: 250,
};

export function FtpZonuCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateFtpZonas(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="ftpWatts"
          label="FTP (vati)"
          unit="W"
          value={input.ftpWatts}
          step={5}
          onChange={(value) => setInput((prev) => ({ ...prev, ftpWatts: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        {result.zones.map((zone) => (
          <div key={zone.name} className="flex items-center justify-between px-4 py-2">
            <dt className="text-sm text-panel-muted">{zone.name}</dt>
            <dd className="font-mono text-value text-panel-text">
              {zone.maxWatts === null
                ? `Virs ${zone.minWatts} W`
                : `${zone.minWatts} līdz ${zone.maxWatts} W`}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-caption text-panel-faint">
        FTP zonas balstās uz vispārpieņemtu septiņu zonu modeli. Katras zonas robežas ir procentuālas no
        FTP un noapaļotas līdz veseliem vatiem.
      </p>
    </div>
  );
}
