import { describe, expect, it } from 'vitest';
import { calculateBernuSedeklisaPrasiba } from './bernu-sedeklisa-prasiba';

describe('calculateBernuSedeklisaPrasiba', () => {
  it('requires a seat for a child shorter than 150 cm', () => {
    const result = calculateBernuSedeklisaPrasiba({ childHeightCm: 120 });

    expect(result.thresholdCm).toBe(150);
    expect(result.isSeatRequired).toBe(true);
  });

  it('does not require a seat at exactly 150 cm', () => {
    const result = calculateBernuSedeklisaPrasiba({ childHeightCm: 150 });

    expect(result.isSeatRequired).toBe(false);
  });

  it('does not require a seat above 150 cm', () => {
    const result = calculateBernuSedeklisaPrasiba({ childHeightCm: 160 });

    expect(result.isSeatRequired).toBe(false);
  });

  it('guards against negative input without crashing', () => {
    const result = calculateBernuSedeklisaPrasiba({ childHeightCm: -10 });

    expect(result.isSeatRequired).toBe(true);
  });
});
