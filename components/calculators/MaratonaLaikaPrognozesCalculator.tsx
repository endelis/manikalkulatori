'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import {
  calculateMaratonaLaikaPrognoze,
  type MaratonaLaikaPrognozesInputs,
} from '@/lib/calculators/maratona-laika-prognoze';

const TARGET_DISTANCE_OPTIONS: { label: string; km: number }[] = [
  { label: '10 km', km: 10 },
  { label: 'Puse maratons', km: 21.0975 },
  { label: 'Maratons', km: 42.195 },
];

const DEFAULT_INPUT: MaratonaLaikaPrognozesInputs = {
  referenceDistanceKm: 5,
  referenceHours: 0,
  referenceMinutes: 22,
  referenceSeconds: 30,
  targetDistanceKm: 42.195,
};

function formatDuration(totalSeconds: number): string {
  const wholeSeconds = Math.round(totalSeconds);
  const hours = Math.floor(wholeSeconds / 3600);
  const minutes = Math.floor((wholeSeconds % 3600) / 60);
  const seconds = wholeSeconds % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function MaratonaLaikaPrognozesCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateMaratonaLaikaPrognoze(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="referenceDistanceKm"
          label="Nesenā skrējiena distance"
          unit="km"
          value={input.referenceDistanceKm}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, referenceDistanceKm: value }))}
        />
        <NumberField
          id="referenceHours"
          label="Skrējiena laiks, stundas"
          unit="h"
          value={input.referenceHours}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, referenceHours: value }))}
        />
        <NumberField
          id="referenceMinutes"
          label="Skrējiena laiks, minūtes"
          unit="min"
          value={input.referenceMinutes}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, referenceMinutes: value }))}
        />
        <NumberField
          id="referenceSeconds"
          label="Skrējiena laiks, sekundes"
          unit="s"
          value={input.referenceSeconds}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, referenceSeconds: value }))}
        />
      </div>

      <fieldset className="reveal flex flex-col gap-2" style={{ animationDelay: '90ms' }}>
        <div className="flex flex-col gap-2 sm:flex-row">
          {TARGET_DISTANCE_OPTIONS.map((option) => (
            <label
              key={option.km}
              className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="targetDistance"
                value={option.km}
                checked={input.targetDistanceKm === option.km}
                onChange={() => setInput((prev) => ({ ...prev, targetDistanceKm: option.km }))}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Paredzamais laiks</dt>
          <dd className="font-mono text-value text-panel-text">
            {formatDuration(result.predictedTotalSeconds)}
          </dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Vidējais temps</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.predictedPaceMinPerKm.toFixed(2)} min/km
          </dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        Prognoze aprēķināta pēc Rīgela formulas, kas paredz garākas distances laiku no īsākas distances
        rezultāta. Formula pieņem stabilu treniņu līmeni un neietver apstākļu (karstums, reljefs)
        ietekmi, tāpēc reālais rezultāts var atšķirties.
      </p>
    </div>
  );
}
