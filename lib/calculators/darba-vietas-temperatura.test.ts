import { describe, expect, it } from 'vitest';
import { calculateDarbaVietasTemperatura } from './darba-vietas-temperatura';

describe('calculateDarbaVietasTemperatura', () => {
  it('uses the 19-25°C cold-period range', () => {
    const result = calculateDarbaVietasTemperatura({ roomTemperatureC: 22, isColdPeriod: true });

    expect(result.minTemperatureC).toBe(19);
    expect(result.maxTemperatureC).toBe(25);
    expect(result.isCompliant).toBe(true);
  });

  it('uses the 20-28°C warm-period range', () => {
    const result = calculateDarbaVietasTemperatura({ roomTemperatureC: 24, isColdPeriod: false });

    expect(result.minTemperatureC).toBe(20);
    expect(result.maxTemperatureC).toBe(28);
    expect(result.isCompliant).toBe(true);
  });

  it('flags a temperature below the cold-period minimum', () => {
    const result = calculateDarbaVietasTemperatura({ roomTemperatureC: 17, isColdPeriod: true });

    expect(result.isCompliant).toBe(false);
  });

  it('flags a temperature above the warm-period maximum', () => {
    const result = calculateDarbaVietasTemperatura({ roomTemperatureC: 30, isColdPeriod: false });

    expect(result.isCompliant).toBe(false);
  });

  it('accepts temperatures exactly at each boundary', () => {
    expect(calculateDarbaVietasTemperatura({ roomTemperatureC: 19, isColdPeriod: true }).isCompliant).toBe(true);
    expect(calculateDarbaVietasTemperatura({ roomTemperatureC: 25, isColdPeriod: true }).isCompliant).toBe(true);
    expect(calculateDarbaVietasTemperatura({ roomTemperatureC: 20, isColdPeriod: false }).isCompliant).toBe(true);
    expect(calculateDarbaVietasTemperatura({ roomTemperatureC: 28, isColdPeriod: false }).isCompliant).toBe(true);
  });

  it('handles a below-zero room temperature without crashing', () => {
    const result = calculateDarbaVietasTemperatura({ roomTemperatureC: -5, isColdPeriod: true });

    expect(result.isCompliant).toBe(false);
  });
});
