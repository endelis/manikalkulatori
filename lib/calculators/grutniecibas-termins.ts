export interface GrutniecibasTerminaInputs {
  lmpYear: number;
  lmpMonth: number;
  lmpDay: number;
  today: string;
}

export interface GrutniecibasTerminaResult {
  dueDate: { year: number; month: number; day: number } | null;
  gestationalWeeks: number;
  gestationalDaysRemainder: number;
}

const PREGNANCY_LENGTH_DAYS = 280;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function calculateGrutniecibasTermins(
  inputs: GrutniecibasTerminaInputs,
): GrutniecibasTerminaResult {
  if (!isValidCalendarDate(inputs.lmpYear, inputs.lmpMonth, inputs.lmpDay)) {
    return { dueDate: null, gestationalWeeks: 0, gestationalDaysRemainder: 0 };
  }

  const lmpMs = Date.UTC(inputs.lmpYear, inputs.lmpMonth - 1, inputs.lmpDay);
  const dueMs = lmpMs + PREGNANCY_LENGTH_DAYS * MS_PER_DAY;
  const dueDateObj = new Date(dueMs);

  const todayParts = inputs.today.split('-').map(Number);
  const nowMs = Date.UTC(todayParts[0], todayParts[1] - 1, todayParts[2]);
  const elapsedDays = Math.max(0, Math.floor((nowMs - lmpMs) / MS_PER_DAY));
  const gestationalWeeks = Math.floor(elapsedDays / 7);
  const gestationalDaysRemainder = elapsedDays % 7;

  return {
    dueDate: {
      year: dueDateObj.getUTCFullYear(),
      month: dueDateObj.getUTCMonth() + 1,
      day: dueDateObj.getUTCDate(),
    },
    gestationalWeeks,
    gestationalDaysRemainder,
  };
}
