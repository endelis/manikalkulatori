import { describe, expect, it } from 'vitest';
import { calculateKapnuFormula } from './kapnu-formula';

describe('calculateKapnuFormula', () => {
  it('computes the Blondel sum as 2x riser height plus tread depth', () => {
    const result = calculateKapnuFormula({ riserHeightCm: 17, treadDepthCm: 28 });

    expect(result.formulaSumCm).toBe(62);
  });

  it('is comfortable when the sum falls within 60 to 64 cm', () => {
    const result = calculateKapnuFormula({ riserHeightCm: 17, treadDepthCm: 28 });

    expect(result.isComfortable).toBe(true);
    expect(result.differenceFromRangeCm).toBe(0);
  });

  it('reports how far below the range a shallow/tall combination falls', () => {
    const result = calculateKapnuFormula({ riserHeightCm: 14, treadDepthCm: 25 });

    expect(result.formulaSumCm).toBe(53);
    expect(result.isComfortable).toBe(false);
    expect(result.differenceFromRangeCm).toBe(7);
  });

  it('reports how far above the range a steep combination falls', () => {
    const result = calculateKapnuFormula({ riserHeightCm: 20, treadDepthCm: 30 });

    expect(result.formulaSumCm).toBe(70);
    expect(result.isComfortable).toBe(false);
    expect(result.differenceFromRangeCm).toBe(6);
  });

  it('guards against negative inputs without crashing', () => {
    const result = calculateKapnuFormula({ riserHeightCm: -5, treadDepthCm: -10 });

    expect(result.formulaSumCm).toBe(0);
  });
});
