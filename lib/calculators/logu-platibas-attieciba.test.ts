import { describe, expect, it } from 'vitest';
import { calculateLoguPlatibasAttieciba } from './logu-platibas-attieciba';

describe('calculateLoguPlatibasAttieciba', () => {
  it('computes the required window area as floor area divided by 8', () => {
    const result = calculateLoguPlatibasAttieciba({ floorAreaM2: 16, plannedWindowAreaM2: 2 });

    expect(result.requiredWindowAreaM2).toBeCloseTo(2, 10);
  });

  it('is compliant when the planned window area meets the requirement exactly', () => {
    const result = calculateLoguPlatibasAttieciba({ floorAreaM2: 16, plannedWindowAreaM2: 2 });

    expect(result.isCompliant).toBe(true);
    expect(result.shortfallM2).toBe(0);
  });

  it('is not compliant and reports a shortfall when the window is too small', () => {
    const result = calculateLoguPlatibasAttieciba({ floorAreaM2: 16, plannedWindowAreaM2: 1.5 });

    expect(result.isCompliant).toBe(false);
    expect(result.shortfallM2).toBeCloseTo(0.5, 10);
  });

  it('is compliant with no shortfall when the window exceeds the requirement', () => {
    const result = calculateLoguPlatibasAttieciba({ floorAreaM2: 16, plannedWindowAreaM2: 3 });

    expect(result.isCompliant).toBe(true);
    expect(result.shortfallM2).toBe(0);
  });

  it('guards against negative inputs without crashing', () => {
    const result = calculateLoguPlatibasAttieciba({ floorAreaM2: -10, plannedWindowAreaM2: -1 });

    expect(result.requiredWindowAreaM2).toBe(0);
    expect(result.shortfallM2).toBe(0);
  });
});
