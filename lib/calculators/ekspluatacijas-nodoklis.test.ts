import { describe, expect, it } from 'vitest';
import { calculateEkspluatacijasNodoklis } from './ekspluatacijas-nodoklis';

describe('calculateEkspluatacijasNodoklis', () => {
  it('returns 0 for a zero-emission vehicle', () => {
    const result = calculateEkspluatacijasNodoklis({
      co2GramsPerKm: 0,
      engineOver3500cm3: false,
      gasEquipped: false,
    });

    expect(result).toEqual({ baseRateEur: 0, surchargeEur: 0, totalEur: 0 });
  });

  it('picks the correct band for a mid-range emitter', () => {
    const result = calculateEkspluatacijasNodoklis({
      co2GramsPerKm: 120,
      engineOver3500cm3: false,
      gasEquipped: false,
    });

    expect(result.baseRateEur).toBe(72);
    expect(result.totalEur).toBe(72);
  });

  it('applies the top band for emissions of 401 g/km or more', () => {
    const result = calculateEkspluatacijasNodoklis({
      co2GramsPerKm: 450,
      engineOver3500cm3: false,
      gasEquipped: false,
    });

    expect(result.baseRateEur).toBe(834);
  });

  it('adds the 330 EUR surcharge for engines over 3500 cm3', () => {
    const result = calculateEkspluatacijasNodoklis({
      co2GramsPerKm: 200,
      engineOver3500cm3: true,
      gasEquipped: false,
    });

    expect(result.baseRateEur).toBe(147);
    expect(result.surchargeEur).toBe(330);
    expect(result.totalEur).toBe(477);
  });

  it('applies the 10% gas-equipped discount to the combined total', () => {
    const result = calculateEkspluatacijasNodoklis({
      co2GramsPerKm: 200,
      engineOver3500cm3: true,
      gasEquipped: true,
    });

    expect(result.totalEur).toBeCloseTo(477 * 0.9, 5);
  });

  it('guards against a negative CO2 input without crashing', () => {
    const result = calculateEkspluatacijasNodoklis({
      co2GramsPerKm: -10,
      engineOver3500cm3: false,
      gasEquipped: false,
    });

    expect(result.baseRateEur).toBe(0);
  });
});
