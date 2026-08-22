'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { ResultCard } from '@/components/ResultCard';
import { formatNumber } from '@/lib/format';
import { calculateSkriesanasTemps, type SkriesanasTempaInputs } from '@/lib/calculators/skriesanas-temps';
import { useTweenedNumber } from '@/hooks/useTweenedNumber';

const DEFAULT_INPUT: SkriesanasTempaInputs = {
  distanceKm: 10,
  hours: 0,
  minutes: 50,
  seconds: 0,
};

function formatPace(paceMinPerKm: number): string {
  const wholeMinutes = Math.floor(paceMinPerKm);
  let seconds = Math.round((paceMinPerKm - wholeMinutes) * 60);
  let minutes = wholeMinutes;
  if (seconds === 60) {
    seconds = 0;
    minutes += 1;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')} min/km`;
}

export function SkriesanasTempaCalculator({ accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculateSkriesanasTemps(input), [input]);

  const tweenedPace = useTweenedNumber(result.paceMinPerKm);

  return (
    <div className="flex flex-col gap-6">
      <ResultCard
        label="Temps"
        value={formatPace(tweenedPace)}
        tone="neutral"
        accentVar={accentVar}
        sublabel={`${formatNumber(result.speedKmh, 2)} km/h vidējais ātrums`}
      />

      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="distanceKm"
          label="Distance"
          unit="km"
          value={input.distanceKm}
          step={0.1}
          onChange={(value) => setInput((prev) => ({ ...prev, distanceKm: value }))}
        />
        <NumberField
          id="hours"
          label="Stundas"
          unit="h"
          value={input.hours}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, hours: value }))}
        />
        <NumberField
          id="minutes"
          label="Minūtes"
          unit="min"
          value={input.minutes}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, minutes: value }))}
        />
        <NumberField
          id="seconds"
          label="Sekundes"
          unit="s"
          value={input.seconds}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, seconds: value }))}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Temps rāda, cik minūšu nepieciešams, lai noskrietu vienu kilometru. Zemāks temps nozīmē ātrāku
        skrējienu.
      </p>
    </div>
  );
}
