'use client';

import { useMemo, useState } from 'react';
import {
  cohortRatio,
  cohortSize,
  computeDzimstibas,
  type DzimstibasInput,
  type DzimstibasMode,
  type PopulationYearRow,
  type TargetInputType,
} from '@/lib/calculators/dzimstibas-kalkulators';
import { NumberField } from '@/components/NumberField';
import { formatNumber } from '@/lib/format';

interface DzimstibasKalkulatorsProps {
  accentVar: string;
  currentYear: number;
  defaultDeaths: number;
  defaultNetMigration: number;
  defaultPopulation: number;
  defaultBirthsCurrent: number;
  defaultTfrCurrent: number;
  populationSeries: PopulationYearRow[];
}

const MODE_LABELS: Record<DzimstibasMode, string> = {
  'nulles-dabiskais': 'Nulles dabiskais pieaugums',
  'nulles-kopejas': 'Nulles kopējās izmaiņas',
  'merka-izaugsme': 'Mērķa izaugsme',
};

export function DzimstibasKalkulators({
  accentVar,
  currentYear,
  defaultDeaths,
  defaultNetMigration,
  defaultPopulation,
  defaultBirthsCurrent,
  defaultTfrCurrent,
  populationSeries,
}: DzimstibasKalkulatorsProps) {
  const [mode, setMode] = useState<DzimstibasMode>('nulles-dabiskais');
  const [deaths, setDeaths] = useState(defaultDeaths);
  const [netMigration, setNetMigration] = useState(defaultNetMigration);
  const [population, setPopulation] = useState(defaultPopulation);
  const [birthsCurrent, setBirthsCurrent] = useState(defaultBirthsCurrent);
  const [targetInputType, setTargetInputType] = useState<TargetInputType>('likme');
  const [growthRatePercent, setGrowthRatePercent] = useState(0);
  const [targetYear, setTargetYear] = useState(currentYear + 10);
  const [targetPopulation, setTargetPopulation] = useState(defaultPopulation);

  const [birthYear, setBirthYear] = useState<number | ''>('');

  const input: DzimstibasInput = useMemo(() => {
    const base = { deaths, netMigration, population, birthsCurrent, tfrCurrent: defaultTfrCurrent };
    if (mode === 'nulles-dabiskais') return { ...base, mode };
    if (mode === 'nulles-kopejas') return { ...base, mode };
    if (targetInputType === 'likme') {
      return { ...base, mode, targetInputType, growthRatePercent };
    }
    return { ...base, mode, targetInputType, targetPopulation, currentYear, targetYear };
  }, [
    mode,
    deaths,
    netMigration,
    population,
    birthsCurrent,
    defaultTfrCurrent,
    targetInputType,
    growthRatePercent,
    targetPopulation,
    currentYear,
    targetYear,
  ]);

  const result = useMemo(() => {
    try {
      return { value: computeDzimstibas(input), error: null as string | null };
    } catch (error) {
      return { value: null, error: error instanceof Error ? error.message : String(error) };
    }
  }, [input]);

  const cohort = useMemo(() => {
    if (birthYear === '') return null;
    try {
      const size = cohortSize(birthYear, populationSeries);
      const ratio = cohortRatio(birthYear, populationSeries, defaultBirthsCurrent);
      return { size, ratio, error: null as string | null };
    } catch (error) {
      return { size: null, ratio: null, error: error instanceof Error ? error.message : String(error) };
    }
  }, [birthYear, populationSeries, defaultBirthsCurrent]);

  return (
    <div className="flex flex-col gap-6">
      <div aria-live="polite" className="reveal rounded-lg border bg-panel-surface p-6" style={{ borderColor: accentVar }}>
        {result.error ? (
          <p className="text-sm text-panel-muted">{result.error}</p>
        ) : (
          <>
            <p className="text-sm text-panel-muted">Bērni dienā, lai sasniegtu izvēlēto mērķi</p>
            <p className="font-mono text-hero" style={{ color: accentVar }}>
              {formatNumber(result.value!.perDay, 1)}
            </p>
            <p className="mt-2 text-sm text-panel-muted">
              {formatNumber(result.value!.perMonth, 0)} bērni mēnesī, {formatNumber(result.value!.birthsNeeded, 0)}{' '}
              bērni gadā
            </p>
            <p className="mt-1 text-sm text-panel-muted">
              Pašlaik piedzimst apmēram {formatNumber(defaultBirthsCurrent / 365.25, 1)} bērni dienā, vajadzētu{' '}
              {formatNumber(result.value!.perDay, 1)}
              {result.value!.multiplier !== null
                ? `, tas ir ${formatNumber(result.value!.multiplier, 2)} reizes vairāk`
                : ''}
              .
            </p>
            {result.value!.tfrNeeded !== null ? (
              <p className="mt-1 text-caption text-panel-faint">
                Aptuveni atbilstu summārajam dzimstības koeficientam {formatNumber(result.value!.tfrNeeded, 2)}{' '}
                (lineārs tuvinājums, nevis precīzs demogrāfisks aprēķins pa vecuma grupām).
              </p>
            ) : null}
          </>
        )}
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-label uppercase text-panel-muted">Mērķis</legend>
        <div className="flex flex-col gap-2 sm:flex-row">
          {(Object.keys(MODE_LABELS) as DzimstibasMode[]).map((value) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-panel-border bg-panel-surface-2 px-3 py-2 text-sm"
            >
              <input
                type="radio"
                name="mode"
                value={value}
                checked={mode === value}
                onChange={() => setMode(value)}
              />
              {MODE_LABELS[value]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField id="mirusie" label="Mirušie gadā" value={deaths} onChange={setDeaths} unit="cilvēki" />
        <NumberField
          id="dzimusie"
          label="Dzimušie gadā"
          value={birthsCurrent}
          onChange={setBirthsCurrent}
          unit="bērni"
        />
        <NumberField
          id="migracija"
          label="Migrācijas saldo"
          value={netMigration}
          onChange={setNetMigration}
          unit="cilvēki"
          min={-1_000_000}
        />
        <NumberField
          id="iedzivotaji"
          label="Iedzīvotāju skaits"
          value={population}
          onChange={setPopulation}
          unit="cilvēki"
        />
      </div>

      {mode === 'merka-izaugsme' ? (
        <fieldset className="flex flex-col gap-4 rounded-lg border border-panel-border bg-panel-surface p-4">
          <legend className="text-label uppercase text-panel-muted">Mērķa izaugsmes ievade</legend>
          <div className="flex gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="targetInputType"
                checked={targetInputType === 'likme'}
                onChange={() => setTargetInputType('likme')}
              />
              Izaugsmes likme
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="targetInputType"
                checked={targetInputType === 'merkis'}
                onChange={() => setTargetInputType('merkis')}
              />
              Mērķa iedzīvotāju skaits
            </label>
          </div>
          {targetInputType === 'likme' ? (
            <NumberField
              id="izaugsmes-likme"
              label="Izaugsmes likme"
              value={growthRatePercent}
              onChange={setGrowthRatePercent}
              unit="% gadā"
              step={0.1}
              min={-100}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <NumberField id="merka-gads" label="Mērķa gads" value={targetYear} onChange={setTargetYear} />
              <NumberField
                id="merka-iedzivotaji"
                label="Mērķa iedzīvotāju skaits"
                value={targetPopulation}
                onChange={setTargetPopulation}
                unit="cilvēki"
              />
            </div>
          )}
        </fieldset>
      ) : null}

      <section aria-labelledby="paaudze-heading" className="flex flex-col gap-3 rounded-lg border border-panel-border bg-panel-surface p-4">
        <h3 id="paaudze-heading" className="font-sans text-h2">
          Tava paaudze
        </h3>
        <NumberField
          id="dzimsanas-gads"
          label="Tavs dzimšanas gads"
          value={birthYear === '' ? Number.NaN : birthYear}
          onChange={(value) => setBirthYear(Number.isNaN(value) ? '' : value)}
          min={1920}
          max={2025}
        />
        <div aria-live="polite">
          {cohort === null ? null : cohort.error ? (
            <p className="text-sm text-panel-muted">{cohort.error}</p>
          ) : (
            <p className="text-sm text-panel-muted">
              {birthYear}. gadā Latvijā piedzima {formatNumber(cohort.size!, 0)} bērni.
              {cohort.ratio !== null
                ? ` Tas ir ${formatNumber(cohort.ratio, 2)} reizes vairāk nekā 2025. gadā.`
                : ''}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
