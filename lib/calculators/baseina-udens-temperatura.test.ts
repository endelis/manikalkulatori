import { describe, expect, it } from 'vitest';
import { calculateBaseinaUdensTemperatura } from './baseina-udens-temperatura';

describe('calculateBaseinaUdensTemperatura', () => {
  it('uses the 26-30°C range for a standard pool', () => {
    const result = calculateBaseinaUdensTemperatura({ waterTemperatureC: 28, isChildrenPool: false });

    expect(result.minTemperatureC).toBe(26);
    expect(result.maxTemperatureC).toBe(30);
    expect(result.isCompliant).toBe(true);
  });

  it('uses the 28-32°C range for a children\'s pool', () => {
    const result = calculateBaseinaUdensTemperatura({ waterTemperatureC: 30, isChildrenPool: true });

    expect(result.minTemperatureC).toBe(28);
    expect(result.maxTemperatureC).toBe(32);
    expect(result.isCompliant).toBe(true);
  });

  it('flags a standard pool below the minimum', () => {
    const result = calculateBaseinaUdensTemperatura({ waterTemperatureC: 24, isChildrenPool: false });

    expect(result.isCompliant).toBe(false);
  });

  it('flags a standard pool above the maximum', () => {
    const result = calculateBaseinaUdensTemperatura({ waterTemperatureC: 32, isChildrenPool: false });

    expect(result.isCompliant).toBe(false);
  });

  it('flags a children\'s pool temperature that is fine for a standard pool but too low for children', () => {
    const result = calculateBaseinaUdensTemperatura({ waterTemperatureC: 27, isChildrenPool: true });

    expect(result.isCompliant).toBe(false);
  });

  it('accepts temperatures exactly at each boundary', () => {
    expect(calculateBaseinaUdensTemperatura({ waterTemperatureC: 26, isChildrenPool: false }).isCompliant).toBe(true);
    expect(calculateBaseinaUdensTemperatura({ waterTemperatureC: 30, isChildrenPool: false }).isCompliant).toBe(true);
    expect(calculateBaseinaUdensTemperatura({ waterTemperatureC: 28, isChildrenPool: true }).isCompliant).toBe(true);
    expect(calculateBaseinaUdensTemperatura({ waterTemperatureC: 32, isChildrenPool: true }).isCompliant).toBe(true);
  });
});
