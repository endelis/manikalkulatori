import { describe, expect, it } from 'vitest';
import { calculateSiltinajumaBiezums } from './siltinajuma-biezums';

describe('calculateSiltinajumaBiezums', () => {
  it('computes required thickness as lambda divided by max U-value', () => {
    const result = calculateSiltinajumaBiezums({ maxUValue: 0.2, materialLambda: 0.04 });

    expect(result.requiredThicknessM).toBeCloseTo(0.2, 10);
    expect(result.requiredThicknessMm).toBeCloseTo(200, 5);
    expect(result.requiredThicknessCm).toBeCloseTo(20, 5);
  });

  it('requires more thickness for a higher-conductivity material at the same U-value', () => {
    const lowConductivity = calculateSiltinajumaBiezums({ maxUValue: 0.2, materialLambda: 0.024 });
    const highConductivity = calculateSiltinajumaBiezums({ maxUValue: 0.2, materialLambda: 0.04 });

    expect(highConductivity.requiredThicknessMm).toBeGreaterThan(lowConductivity.requiredThicknessMm);
  });

  it('requires less thickness for a stricter (lower) U-value target', () => {
    const looseTarget = calculateSiltinajumaBiezums({ maxUValue: 0.3, materialLambda: 0.035 });
    const strictTarget = calculateSiltinajumaBiezums({ maxUValue: 0.2, materialLambda: 0.035 });

    expect(strictTarget.requiredThicknessMm).toBeGreaterThan(looseTarget.requiredThicknessMm);
  });

  it('guards against a zero or negative U-value without dividing by zero', () => {
    const result = calculateSiltinajumaBiezums({ maxUValue: 0, materialLambda: 0.04 });

    expect(Number.isFinite(result.requiredThicknessMm)).toBe(true);
    expect(result.requiredThicknessMm).toBeGreaterThan(0);
  });

  it('guards against a negative lambda without crashing', () => {
    const result = calculateSiltinajumaBiezums({ maxUValue: 0.2, materialLambda: -0.04 });

    expect(result.requiredThicknessMm).toBe(0);
  });
});
