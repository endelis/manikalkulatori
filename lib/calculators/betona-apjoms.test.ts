import { describe, expect, it } from 'vitest';
import { calculateBetonaApjoms } from './betona-apjoms';

describe('calculateBetonaApjoms', () => {
  it('computes volume and bags needed for a slab', () => {
    const result = calculateBetonaApjoms({ lengthM: 5, widthM: 4, thicknessM: 0.1, bagYieldM3: 0.012 });

    expect(result.volumeM3).toBeCloseTo(2, 2);
    expect(result.bagsNeeded).toBe(167);
  });

  it('computes volume and bags needed for a smaller slab', () => {
    const result = calculateBetonaApjoms({ lengthM: 3, widthM: 2, thicknessM: 0.15, bagYieldM3: 0.012 });

    expect(result.volumeM3).toBeCloseTo(0.9, 2);
    expect(result.bagsNeeded).toBe(75);
  });

  it('guards against division by zero when bag yield is zero', () => {
    const result = calculateBetonaApjoms({ lengthM: 2, widthM: 2, thicknessM: 0.1, bagYieldM3: 0 });

    expect(result.volumeM3).toBeCloseTo(0.4, 2);
    expect(result.bagsNeeded).toBe(0);
  });
});
