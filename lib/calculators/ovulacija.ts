export interface OvulacijasInputs {
  lmpYear: number;
  lmpMonth: number;
  lmpDay: number;
  cycleLengthDays: number;
}

export interface OvulacijasDatums {
  year: number;
  month: number;
  day: number;
}

export interface OvulacijasResult {
  ovulationDate: OvulacijasDatums | null;
  fertileWindowStart: OvulacijasDatums | null;
  fertileWindowEnd: OvulacijasDatums | null;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const LUTEAL_PHASE_DAYS = 14;
const FERTILE_WINDOW_START_OFFSET_DAYS = 5;
const FERTILE_WINDOW_END_OFFSET_DAYS = 1;

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function toDatums(ms: number): OvulacijasDatums {
  const date = new Date(ms);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

export function calculateOvulacija(inputs: OvulacijasInputs): OvulacijasResult {
  const cycleLengthDays = Math.round(inputs.cycleLengthDays);

  if (
    !isValidCalendarDate(inputs.lmpYear, inputs.lmpMonth, inputs.lmpDay) ||
    cycleLengthDays <= LUTEAL_PHASE_DAYS
  ) {
    return { ovulationDate: null, fertileWindowStart: null, fertileWindowEnd: null };
  }

  const lmpMs = Date.UTC(inputs.lmpYear, inputs.lmpMonth - 1, inputs.lmpDay);
  const ovulationDayOfCycle = cycleLengthDays - LUTEAL_PHASE_DAYS;
  const ovulationMs = lmpMs + (ovulationDayOfCycle - 1) * MS_PER_DAY;

  return {
    ovulationDate: toDatums(ovulationMs),
    fertileWindowStart: toDatums(ovulationMs - FERTILE_WINDOW_START_OFFSET_DAYS * MS_PER_DAY),
    fertileWindowEnd: toDatums(ovulationMs + FERTILE_WINDOW_END_OFFSET_DAYS * MS_PER_DAY),
  };
}
