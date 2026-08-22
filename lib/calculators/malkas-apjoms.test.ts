import { describe, expect, it } from 'vitest';
import { calculateMalkasApjoms } from './malkas-apjoms';

describe('calculateMalkasApjoms', () => {
  it('computes stacked and solid volume for a full ster', () => {
    const result = calculateMalkasApjoms({ stackLengthM: 10, stackWidthM: 1, stackHeightM: 1, solidWoodFactor: 0.65 });

    expect(result.stackedVolumeM3).toBeCloseTo(10, 2);
    expect(result.solidVolumeM3).toBeCloseTo(6.5, 2);
  });

  it('computes stacked and solid volume for a smaller stack', () => {
    const result = calculateMalkasApjoms({ stackLengthM: 2, stackWidthM: 1, stackHeightM: 1.5, solidWoodFactor: 0.7 });

    expect(result.stackedVolumeM3).toBeCloseTo(3, 2);
    expect(result.solidVolumeM3).toBeCloseTo(2.1, 2);
  });

  it('returns zero volume when stack length is zero', () => {
    const result = calculateMalkasApjoms({ stackLengthM: 0, stackWidthM: 1, stackHeightM: 1, solidWoodFactor: 0.65 });

    expect(result.stackedVolumeM3).toBe(0);
    expect(result.solidVolumeM3).toBe(0);
  });
});
