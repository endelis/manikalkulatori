'use client';

import { useMemo, useState } from 'react';
import { computePension, type PensionInput } from '@/lib/calculators/pensijas-kalkulators';
import { NumberField } from '@/components/NumberField';
import { formatCurrencyEUR, formatNumber } from '@/lib/format';

interface PensijasKalkulatorsProps {
  accentVar: string;
  currentYear: number;
  ndcStartYear: number;
  pillar1ContributionRatePercent: number;
  wageIndexSeries: Record<number, number>;
  gTable: Record<number, number>;
  minRetirementAge: number;
  maxRetirementAge: number;
  defaultBirthYear: number;
  defaultGrossSalaryMonthly: number;
  defaultInsuranceRecordYears: number;
  defaultWageGrowthPercent: number;
  defaultRetirementAge: number;
  recentActualWageGrowthPercent: number;
  recentActualWageGrowthYear: number;
  forecastWageGrowthPercent: number;
  forecastWageGrowthYear: number;
}

// Assumed legal working age, used only to decide whether to show the pre 1996 record
// caveat near the result (see the prompt's own example threshold, born before roughly
// 1978). Not a statistical figure requiring citation, and not part of the compute
// module's own math, so it lives here rather than in pensijas-kalkulators-defaults.ts.
const LEGAL_WORKING_AGE = 18;

export function PensijasKalkulators({
  accentVar,
  currentYear,
  ndcStartYear,
  pillar1ContributionRatePercent,
  wageIndexSeries,
  gTable,
  minRetirementAge,
  maxRetirementAge,
  defaultBirthYear,
  defaultGrossSalaryMonthly,
  defaultInsuranceRecordYears,
  defaultWageGrowthPercent,
  defaultRetirementAge,
  recentActualWageGrowthPercent,
  recentActualWageGrowthYear,
  forecastWageGrowthPercent,
  forecastWageGrowthYear,
}: PensijasKalkulatorsProps) {
  const [birthYear, setBirthYear] = useState(defaultBirthYear);
  const [grossSalaryMonthly, setGrossSalaryMonthly] = useState(defaultGrossSalaryMonthly);
  const [insuranceRecordYears, setInsuranceRecordYears] = useState(defaultInsuranceRecordYears);
  const [wageGrowthPercent, setWageGrowthPercent] = useState(defaultWageGrowthPercent);
  const [retirementAge, setRetirementAge] = useState(defaultRetirementAge);

  const input: PensionInput = useMemo(
    () => ({
      currentYear,
      birthYear,
      currentGrossSalaryMonthly: grossSalaryMonthly,
      insuranceRecordYears,
      wageGrowthPercent,
      retirementAge,
      ndcStartYear,
      pillar1ContributionRatePercent,
      wageIndexSeries,
      gTable,
    }),
    [
      currentYear,
      birthYear,
      grossSalaryMonthly,
      insuranceRecordYears,
      wageGrowthPercent,
      retirementAge,
      ndcStartYear,
      pillar1ContributionRatePercent,
      wageIndexSeries,
      gTable,
    ],
  );

  const result = useMemo(() => {
    try {
      return { value: computePension(input), error: null as string | null };
    } catch (error) {
      return { value: null, error: error instanceof Error ? error.message : String(error) };
    }
  }, [input]);

  const likelyPre1996Record = birthYear <= ndcStartYear - LEGAL_WORKING_AGE;

  return (
    <div className="flex flex-col gap-6">
      <div
        aria-live="polite"
        className="reveal rounded-lg border bg-panel-surface p-6"
        style={{ borderColor: accentVar }}
      >
        {result.error ? (
          <p className="text-sm text-panel-muted">{result.error}</p>
        ) : (
          <>
            <p className="text-sm text-panel-muted">
              Aptuvenā 1. līmeņa pensija mēnesī, pensionējoties {retirementAge} gadu vecumā{' '}
              {result.value!.retirementYear}. gadā
            </p>
            <p className="font-mono text-hero" style={{ color: accentVar }}>
              {formatCurrencyEUR(result.value!.monthlyPension, { maximumFractionDigits: 0 })}
            </p>
            <p className="mt-2 text-sm text-panel-muted">
              Uzkrātais kapitāls kopā {formatCurrencyEUR(result.value!.capitalTotal, { maximumFractionDigits: 0 })},
              koeficients G šajā vecumā ir {formatNumber(result.value!.gValue, 2)}.
            </p>
            <p className="mt-1 text-sm text-panel-muted">
              No tā {formatCurrencyEUR(result.value!.capitalPast, { maximumFractionDigits: 0 })} veido jau nostrādātais
              stāžs ({formatNumber(result.value!.effectiveServiceYears, 0)} gadi kopš{' '}
              {result.value!.serviceStartYear}. gada) un{' '}
              {formatCurrencyEUR(result.value!.capitalFuture, { maximumFractionDigits: 0 })} veido gaidāmās iemaksas
              līdz pensionēšanās gadam.
            </p>
            {likelyPre1996Record ? (
              <p className="mt-2 text-sm text-panel-muted">
                Tavs dzimšanas gads liecina, ka tev, iespējams, ir apdrošināšanas stāžs arī pirms 1996. gada. Šis
                kalkulators to neieskaita, tāpēc tava reālā pensija visticamāk būs lielāka nekā šeit parādītā.
              </p>
            ) : null}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          id="dzimsanas-gads"
          label="Dzimšanas gads"
          value={birthYear}
          onChange={setBirthYear}
          min={1940}
          max={currentYear - LEGAL_WORKING_AGE}
        />
        <NumberField
          id="bruto-alga"
          label="Pašreizējā bruto alga"
          value={grossSalaryMonthly}
          onChange={setGrossSalaryMonthly}
          unit="EUR mēnesī"
        />
        <NumberField
          id="apdrosinasanas-stazs"
          label="Apdrošināšanas stāžs kopš 1996. gada"
          value={insuranceRecordYears}
          onChange={setInsuranceRecordYears}
          unit="gadi"
          max={currentYear - ndcStartYear}
        />
        <NumberField
          id="algas-pieaugums"
          label="Algas pieauguma pieņēmums"
          value={wageGrowthPercent}
          onChange={setWageGrowthPercent}
          unit="% gadā"
          step={0.1}
          min={-10}
          max={20}
        />
      </div>

      <p className="text-caption text-panel-faint">
        Algas pieauguma pieņēmums ir konservatīva ilgtermiņa vērtība, ko vari mainīt. Tuvākai atsaucei:{' '}
        {recentActualWageGrowthYear}. gadā vidējā bruto alga Latvijā pieauga par{' '}
        {formatNumber(recentActualWageGrowthPercent, 1)}%, un banku prognoze {forecastWageGrowthYear}. gadam ir
        apmēram {formatNumber(forecastWageGrowthPercent, 0)}%. Tie ir īstermiņa skaitļi un nav noklusējums, jo tos
        nevar pamatoti attiecināt uz trīsdesmit un vairāk gadu projekciju.
      </p>

      <fieldset className="flex flex-col gap-2 rounded-lg border border-panel-border bg-panel-surface-2 p-4">
        <label htmlFor="pensionesanas-vecums" className="text-label uppercase text-panel-muted">
          Pensionēšanās vecums
        </label>
        <div className="flex items-center gap-4">
          <input
            id="pensionesanas-vecums"
            type="range"
            min={minRetirementAge}
            max={maxRetirementAge}
            step={1}
            value={retirementAge}
            onChange={(event) => setRetirementAge(Number(event.target.value))}
            className="w-full accent-[var(--accent)]"
            style={{ '--accent': accentVar } as React.CSSProperties}
          />
          <span className="font-mono text-lg text-panel-text">{retirementAge}</span>
        </div>
        <p className="text-caption text-panel-faint">
          No {minRetirementAge} līdz {maxRetirementAge} gadiem, tikai atliktā pensionēšanās. Vispārējā vecuma
          pensija Latvijā nav pieejama pirms 65 gadu vecuma, un priekšlaicīga pensionēšanās ar citu kārtību šeit nav
          modelēta.
        </p>
      </fieldset>
    </div>
  );
}
