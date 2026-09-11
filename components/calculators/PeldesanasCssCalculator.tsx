'use client';

import { useMemo, useState } from 'react';
import { NumberField } from '@/components/NumberField';
import { calculatePeldesanasCss, type PeldesanasCssInputs } from '@/lib/calculators/peldesanas-css';

const DEFAULT_INPUT: PeldesanasCssInputs = {
  time400Min: 7,
  time400Sec: 0,
  time200Min: 3,
  time200Sec: 20,
};

function formatPace(seconds: number): string {
  const wholeSeconds = Math.round(seconds);
  const min = Math.floor(wholeSeconds / 60);
  const sec = wholeSeconds % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function PeldesanasCssCalculator({ accentVar: _accentVar }: { accentVar: string }) {
  const [input, setInput] = useState(DEFAULT_INPUT);

  const result = useMemo(() => calculatePeldesanasCss(input), [input]);

  return (
    <div className="flex flex-col gap-6">
      <div className="reveal grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ animationDelay: '60ms' }}>
        <NumberField
          id="time400Min"
          label="400 m laiks, minūtes"
          unit="min"
          value={input.time400Min}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, time400Min: value }))}
        />
        <NumberField
          id="time400Sec"
          label="400 m laiks, sekundes"
          unit="s"
          value={input.time400Sec}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, time400Sec: value }))}
        />
        <NumberField
          id="time200Min"
          label="200 m laiks, minūtes"
          unit="min"
          value={input.time200Min}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, time200Min: value }))}
        />
        <NumberField
          id="time200Sec"
          label="200 m laiks, sekundes"
          unit="s"
          value={input.time200Sec}
          step={1}
          onChange={(value) => setInput((prev) => ({ ...prev, time200Sec: value }))}
        />
      </div>

      <dl className="divide-y divide-panel-border rounded-lg border border-panel-border bg-panel-surface">
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Kritiskais peldēšanas ātrums (CSS)</dt>
          <dd className="font-mono text-value text-panel-text">
            {result.cssMetersPerSecond.toFixed(2)} m/s
          </dd>
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <dt className="text-sm text-panel-muted">Temps uz 100 m</dt>
          <dd className="font-mono text-value text-panel-text">{formatPace(result.pacePer100Seconds)} / 100 m</dd>
        </div>
      </dl>

      <p className="text-caption text-panel-faint">
        CSS aprēķina no 400 metru un 200 metru peldējuma laika starpības. Ievadi abus laikus atsevišķi
        izmērīta maksimālas piepūles testa rezultātus.
      </p>
    </div>
  );
}
