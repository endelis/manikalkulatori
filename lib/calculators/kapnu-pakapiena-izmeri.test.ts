import { describe, expect, it } from 'vitest';
import { calculateKapnuPakapienaIzmeri } from './kapnu-pakapiena-izmeri';

describe('calculateKapnuPakapienaIzmeri', () => {
  it('is fully compliant for a typical residential stair', () => {
    const result = calculateKapnuPakapienaIzmeri({ riserHeightCm: 17, treadDepthCm: 29 });

    expect(result.isHeightCompliant).toBe(true);
    expect(result.formulaSumCm).toBe(63);
    expect(result.isSumCompliant).toBe(true);
    expect(result.isFullyCompliant).toBe(true);
  });

  it('flags a riser height below the 12 cm minimum', () => {
    const result = calculateKapnuPakapienaIzmeri({ riserHeightCm: 10, treadDepthCm: 40 });

    expect(result.isHeightCompliant).toBe(false);
  });

  it('flags a riser height above the 18 cm maximum', () => {
    const result = calculateKapnuPakapienaIzmeri({ riserHeightCm: 20, treadDepthCm: 25 });

    expect(result.isHeightCompliant).toBe(false);
  });

  it('accepts riser height exactly at each boundary', () => {
    expect(calculateKapnuPakapienaIzmeri({ riserHeightCm: 12, treadDepthCm: 30 }).isHeightCompliant).toBe(true);
    expect(calculateKapnuPakapienaIzmeri({ riserHeightCm: 18, treadDepthCm: 30 }).isHeightCompliant).toBe(true);
  });

  it('flags a formula sum outside the 60-65 cm range', () => {
    const tooLow = calculateKapnuPakapienaIzmeri({ riserHeightCm: 12, treadDepthCm: 20 });
    expect(tooLow.formulaSumCm).toBe(44);
    expect(tooLow.isSumCompliant).toBe(false);

    const tooHigh = calculateKapnuPakapienaIzmeri({ riserHeightCm: 18, treadDepthCm: 35 });
    expect(tooHigh.formulaSumCm).toBe(71);
    expect(tooHigh.isSumCompliant).toBe(false);
  });

  it('is not fully compliant if only one of the two checks fails', () => {
    // Height out of range but sum happens to land in range.
    const result = calculateKapnuPakapienaIzmeri({ riserHeightCm: 20, treadDepthCm: 21 });
    expect(result.formulaSumCm).toBe(61);
    expect(result.isSumCompliant).toBe(true);
    expect(result.isHeightCompliant).toBe(false);
    expect(result.isFullyCompliant).toBe(false);
  });

  it('guards against negative inputs without crashing', () => {
    const result = calculateKapnuPakapienaIzmeri({ riserHeightCm: -5, treadDepthCm: -10 });

    expect(result.isHeightCompliant).toBe(false);
    expect(result.formulaSumCm).toBe(0);
    expect(result.isFullyCompliant).toBe(false);
  });
});
