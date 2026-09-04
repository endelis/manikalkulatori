import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TumsasKalkulators } from './TumsasKalkulators';
import {
  AVERAGE_DAYLIGHT_HOURS,
  AMPLITUDE_HOURS,
  SUMMER_SOLSTICE_DAY_OF_YEAR,
  TODAY_ISO,
  MIN_BIRTH_YEAR,
  DEFAULT_BIRTH_DAY,
  DEFAULT_BIRTH_MONTH,
  DEFAULT_BIRTH_YEAR,
} from '@/lib/calculators/tumsas-kalkulators-defaults';

const BASE_PROPS = {
  accentVar: '#000',
  averageDaylightHours: AVERAGE_DAYLIGHT_HOURS,
  amplitudeHours: AMPLITUDE_HOURS,
  summerSolsticeDayOfYear: SUMMER_SOLSTICE_DAY_OF_YEAR,
  today: TODAY_ISO,
  minBirthYear: MIN_BIRTH_YEAR,
};

function render(overrides: Partial<typeof BASE_PROPS & { defaultBirthDay: number; defaultBirthMonth: number; defaultBirthYear: number }>) {
  return renderToStaticMarkup(
    createElement(TumsasKalkulators, {
      ...BASE_PROPS,
      defaultBirthDay: DEFAULT_BIRTH_DAY,
      defaultBirthMonth: DEFAULT_BIRTH_MONTH,
      defaultBirthYear: DEFAULT_BIRTH_YEAR,
      ...overrides,
    }),
  );
}

describe('TumsasKalkulators, initial render', () => {
  it('renders the result and all three date input labels with the default props', () => {
    const html = render({});
    expect(html).toContain('Tumsā pavadītas dienas kopš dzimšanas');
    expect(html).toContain('Diena');
    expect(html).toContain('Mēnesis');
    expect(html).toContain('Gads');
  });
});

describe('TumsasKalkulators, date validation', () => {
  it('rejects a birth date in the future', () => {
    const html = render({ defaultBirthYear: 2027, defaultBirthMonth: 1, defaultBirthDay: 1 });
    expect(html).toContain('nedrīkst būt nākotnē');
  });

  it('rejects a birth date equal to tomorrow relative to TODAY_ISO, same year and month', () => {
    // TODAY_ISO is 2026-09-04.
    const html = render({ defaultBirthYear: 2026, defaultBirthMonth: 9, defaultBirthDay: 5 });
    expect(html).toContain('nedrīkst būt nākotnē');
  });

  it('accepts a birth date equal to today', () => {
    const html = render({ defaultBirthYear: 2026, defaultBirthMonth: 9, defaultBirthDay: 4 });
    expect(html).not.toContain('nedrīkst būt nākotnē');
    expect(html).toContain('Tumsā pavadītas dienas kopš dzimšanas');
  });

  it('rejects a birth year before the sane lower bound', () => {
    const html = render({ defaultBirthYear: MIN_BIRTH_YEAR - 1, defaultBirthMonth: 1, defaultBirthDay: 1 });
    expect(html).toContain(`${MIN_BIRTH_YEAR}. gadā vai vēlāk`);
  });

  it('accepts a birth year exactly at the sane lower bound', () => {
    const html = render({ defaultBirthYear: MIN_BIRTH_YEAR, defaultBirthMonth: 1, defaultBirthDay: 1 });
    expect(html).not.toContain('gadā vai vēlāk');
  });

  it('rejects a calendar date that does not exist (30 February)', () => {
    const html = render({ defaultBirthYear: 1990, defaultBirthMonth: 2, defaultBirthDay: 30 });
    expect(html).toContain('neeksistē');
  });

  it('rejects 29 February in a non leap year', () => {
    const html = render({ defaultBirthYear: 1990, defaultBirthMonth: 2, defaultBirthDay: 29 });
    expect(html).toContain('neeksistē');
  });

  it('accepts 29 February in a leap year', () => {
    const html = render({ defaultBirthYear: 1992, defaultBirthMonth: 2, defaultBirthDay: 29 });
    expect(html).not.toContain('neeksistē');
    expect(html).toContain('Tumsā pavadītas dienas kopš dzimšanas');
  });

  it('rejects a month outside 1 to 12 before even checking calendar validity', () => {
    const html = render({ defaultBirthYear: 1990, defaultBirthMonth: 13, defaultBirthDay: 1 });
    expect(html).toContain('Mēnesim jābūt no 1 līdz 12');
  });

  it('rejects a day outside 1 to 31', () => {
    const html = render({ defaultBirthYear: 1990, defaultBirthMonth: 1, defaultBirthDay: 32 });
    expect(html).toContain('Dienai jābūt no 1 līdz 31');
  });
});
