import { describe, expect, it } from 'vitest';
import { calculateDarbaVietasApgaismojums } from './darba-vietas-apgaismojums';

describe('calculateDarbaVietasApgaismojums', () => {
  it('reports 500 lx for reading/writing/data processing', () => {
    const result = calculateDarbaVietasApgaismojums({ illuminanceLux: 500, workType: 'lasisana-rakstisana' });

    expect(result.minLux).toBe(500);
    expect(result.isCompliant).toBe(true);
  });

  it('reports 750 lx for technical drawing', () => {
    const result = calculateDarbaVietasApgaismojums({ illuminanceLux: 750, workType: 'tehniska-raseshana' });

    expect(result.minLux).toBe(750);
  });

  it('reports 300 lx for document filing and client reception', () => {
    expect(
      calculateDarbaVietasApgaismojums({ illuminanceLux: 300, workType: 'dokumentu-sistematizacija' }).minLux,
    ).toBe(300);
    expect(
      calculateDarbaVietasApgaismojums({ illuminanceLux: 300, workType: 'klientu-pienemsana' }).minLux,
    ).toBe(300);
  });

  it('reports 200 lx for storage/archive rooms', () => {
    const result = calculateDarbaVietasApgaismojums({ illuminanceLux: 200, workType: 'noliktavas-arhivi' });

    expect(result.minLux).toBe(200);
  });

  it('flags non-compliance and reports the shortfall when illuminance is too low', () => {
    const result = calculateDarbaVietasApgaismojums({ illuminanceLux: 350, workType: 'lasisana-rakstisana' });

    expect(result.isCompliant).toBe(false);
    expect(result.shortfallLux).toBe(150);
  });

  it('is compliant with no shortfall when illuminance exceeds the requirement', () => {
    const result = calculateDarbaVietasApgaismojums({ illuminanceLux: 600, workType: 'lasisana-rakstisana' });

    expect(result.isCompliant).toBe(true);
    expect(result.shortfallLux).toBe(0);
  });

  it('guards against negative input without crashing', () => {
    const result = calculateDarbaVietasApgaismojums({ illuminanceLux: -10, workType: 'sapulcu-telpas' });

    expect(result.isCompliant).toBe(false);
    expect(result.shortfallLux).toBe(500);
  });
});
