'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { Breakdown } from '@/components/Breakdown';
import {
  calculateTriatlonaPlanotajs,
  type TriatlonaPlanotajaInputs,
} from '@/lib/calculators/triatlona-planotajs';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: TriatlonaPlanotajaInputs = {
  swimDistanceM: 1500,
  swimPaceMinPer100m: 2,
  t1Minutes: 3,
  bikeDistanceKm: 40,
  bikeSpeedKmh: 30,
  t2Minutes: 2,
  runDistanceKm: 10,
  runPaceMinPerKm: 5,
};

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const remaining = totalMinutes - hours * 60;
  let minutes = Math.floor(remaining);
  let seconds = Math.round((remaining - minutes) * 60);
  if (seconds === 60) {
    seconds = 0;
    minutes += 1;
  }
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function TriatlonaPlanotajaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateTriatlonaPlanotajs(input), [input]);

  const tweenedTotal = useTweenedNumber(result.totalTimeMinutes);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Paredzamais kopējais laiks"
        value={formatDuration(tweenedTotal)}
        tone="neutral"
        accentVar={accentVar}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="swimDistanceM"
          label="Peldēšanas distance"
          unit="m"
          value={input.swimDistanceM}
          step={50}
          onChange={(value) => setInput((prev) => ({ ...prev, swimDistanceM: value }))}
        />
        <NumberField
          id="swimPaceMinPer100m"
          label="Peldēšanas temps"
          unit="min/100m"
          value={input.swimPaceMinPer100m}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, swimPaceMinPer100m: value }))}
        />
        <NumberField
          id="t1Minutes"
          label="1. pāreja (T1)"
          unit="min"
          value={input.t1Minutes}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, t1Minutes: value }))}
        />
        <NumberField
          id="bikeDistanceKm"
          label="Riteņbraukšanas distance"
          unit="km"
          value={input.bikeDistanceKm}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, bikeDistanceKm: value }))}
        />
        <NumberField
          id="bikeSpeedKmh"
          label="Riteņbraukšanas ātrums"
          unit="km/h"
          value={input.bikeSpeedKmh}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, bikeSpeedKmh: value }))}
        />
        <NumberField
          id="t2Minutes"
          label="2. pāreja (T2)"
          unit="min"
          value={input.t2Minutes}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, t2Minutes: value }))}
        />
        <NumberField
          id="runDistanceKm"
          label="Skrējiena distance"
          unit="km"
          value={input.runDistanceKm}
          step={0.5}
          onChange={(value) => setInput((prev) => ({ ...prev, runDistanceKm: value }))}
        />
        <NumberField
          id="runPaceMinPerKm"
          label="Skrējiena temps"
          unit="min/km"
          value={input.runPaceMinPerKm}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, runPaceMinPerKm: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Šis ir aprēķins, kas balstīts uz tavis norādīto tempu katrā posmā, nevis prognoze. Reālais laiks
        atšķirsies atkarībā no trases profila, laikapstākļiem un formas sacensību dienā.
      </p>

      <Breakdown
        rows={[
          { label: 'Peldēšana', value: formatDuration(result.swimTimeMinutes) },
          { label: 'Riteņbraukšana', value: formatDuration(result.bikeTimeMinutes) },
          { label: 'Skriešana', value: formatDuration(result.runTimeMinutes) },
        ]}
      />
    </div>
  );
}
