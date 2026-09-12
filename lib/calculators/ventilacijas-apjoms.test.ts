import { describe, expect, it } from 'vitest';
import { calculateVentilacijasApjoms } from './ventilacijas-apjoms';

describe('calculateVentilacijasApjoms', () => {
  it('computes required fresh air as 15 m3/h per person', () => {
    const result = calculateVentilacijasApjoms({ occupantCount: 3, roomVolumeM3: 50 });

    expect(result.requiredFreshAirM3H).toBe(45);
  });

  it('computes air changes per hour as fresh air divided by room volume', () => {
    const result = calculateVentilacijasApjoms({ occupantCount: 2, roomVolumeM3: 30 });

    expect(result.airChangesPerHour).toBeCloseTo(1, 5);
  });

  it('returns zero air changes when room volume is zero, without dividing by zero', () => {
    const result = calculateVentilacijasApjoms({ occupantCount: 2, roomVolumeM3: 0 });

    expect(result.airChangesPerHour).toBe(0);
    expect(Number.isFinite(result.airChangesPerHour)).toBe(true);
  });

  it('guards against negative inputs without crashing', () => {
    const result = calculateVentilacijasApjoms({ occupantCount: -2, roomVolumeM3: -10 });

    expect(result.requiredFreshAirM3H).toBe(0);
    expect(result.airChangesPerHour).toBe(0);
  });
});
