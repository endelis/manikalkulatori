'use client';

import { useMemo, useState } from 'react';
import { computeTumsas } from '@/lib/calculators/tumsas-kalkulators';
import { NumberField } from '@/components/NumberField';
import { formatNumber } from '@/lib/format';

interface TumsasKalkulatorsProps {
  accentVar: string;
  averageDaylightHours: number;
  amplitudeHours: number;
  summerSolsticeDayOfYear: number;
  today: string;
  minBirthYear: number;
  defaultBirthDay: number;
  defaultBirthMonth: number;
  defaultBirthYear: number;
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/** True only for a real calendar date: Date.UTC silently rolls "30 February" over into
 * March, so a round trip through the constructed date's own components is the only way
 * to catch that instead of quietly miscomputing. */
function isValidCalendarDate(year: number, month: number, day: number): boolean {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function TumsasKalkulators({
  accentVar,
  averageDaylightHours,
  amplitudeHours,
  summerSolsticeDayOfYear,
  today,
  minBirthYear,
  defaultBirthDay,
  defaultBirthMonth,
  defaultBirthYear,
}: TumsasKalkulatorsProps) {
  const [birthDay, setBirthDay] = useState(defaultBirthDay);
  const [birthMonth, setBirthMonth] = useState(defaultBirthMonth);
  const [birthYear, setBirthYear] = useState(defaultBirthYear);

  const todayYear = Number(today.slice(0, 4));

  const validationError = useMemo(() => {
    if (birthYear < minBirthYear) {
      return `Ievadi dzimšanas gadu ${minBirthYear}. gadā vai vēlāk.`;
    }
    if (birthMonth < 1 || birthMonth > 12) {
      return 'Mēnesim jābūt no 1 līdz 12.';
    }
    if (birthDay < 1 || birthDay > 31) {
      return 'Dienai jābūt no 1 līdz 31.';
    }
    if (!isValidCalendarDate(birthYear, birthMonth, birthDay)) {
      return 'Šāds datums neeksistē. Pārbaudi dienu un mēnesi.';
    }
    if (birthYear > todayYear || `${birthYear}-${pad2(birthMonth)}-${pad2(birthDay)}` > today) {
      return 'Dzimšanas datums nedrīkst būt nākotnē.';
    }
    return null;
  }, [birthDay, birthMonth, birthYear, minBirthYear, today, todayYear]);

  const result = useMemo(() => {
    if (validationError) return { value: null, error: validationError };
    const birthDate = `${birthYear}-${pad2(birthMonth)}-${pad2(birthDay)}`;
    try {
      return {
        value: computeTumsas({
          birthDate,
          today,
          averageDaylightHours,
          amplitudeHours,
          summerSolsticeDayOfYear,
        }),
        error: null as string | null,
      };
    } catch (error) {
      return { value: null, error: error instanceof Error ? error.message : String(error) };
    }
  }, [
    validationError,
    birthYear,
    birthMonth,
    birthDay,
    today,
    averageDaylightHours,
    amplitudeHours,
    summerSolsticeDayOfYear,
  ]);

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
            <p className="text-sm text-panel-muted">Tumsā pavadītas dienas kopš dzimšanas</p>
            <p className="font-mono text-hero" style={{ color: accentVar }}>
              {formatNumber(result.value!.totalDarkDays, 0)}
            </p>
            <p className="mt-2 text-sm text-panel-muted">
              Tas ir apmēram {formatNumber(result.value!.darkYears, 0)} gadi un{' '}
              {formatNumber(result.value!.darkMonths, 0)} mēneši, jeb{' '}
              {formatNumber(result.value!.percentDark, 1)} procenti no visām{' '}
              {formatNumber(result.value!.totalDaysLived, 0)} līdz šim nodzīvotajām dienām.
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <NumberField id="dzimsanas-diena" label="Diena" value={birthDay} onChange={setBirthDay} min={1} max={31} />
        <NumberField
          id="dzimsanas-menesis"
          label="Mēnesis"
          value={birthMonth}
          onChange={setBirthMonth}
          min={1}
          max={12}
        />
        <NumberField
          id="dzimsanas-gads"
          label="Gads"
          value={birthYear}
          onChange={setBirthYear}
          min={minBirthYear}
          max={todayYear}
        />
      </div>
    </div>
  );
}
