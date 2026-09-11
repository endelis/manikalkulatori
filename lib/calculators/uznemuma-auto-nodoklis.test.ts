import { describe, expect, it } from 'vitest';
import { calculateUznemumaAutoNodoklis } from './uznemuma-auto-nodoklis';

describe('calculateUznemumaAutoNodoklis', () => {
  it('applies the flat 15 EUR rate for electric vehicles', () => {
    const result = calculateUznemumaAutoNodoklis({
      vehicleType: 'electric',
      firstRegisteredAfter2009: true,
      enginePowerKw: 150,
    });

    expect(result.monthlyRateEur).toBe(15);
    expect(result.annualRateEur).toBe(180);
  });

  it('applies the flat 25 EUR rate for plug-in hybrids', () => {
    const result = calculateUznemumaAutoNodoklis({
      vehicleType: 'plugInHybrid',
      firstRegisteredAfter2009: true,
      enginePowerKw: 150,
    });

    expect(result.monthlyRateEur).toBe(25);
    expect(result.annualRateEur).toBe(300);
  });

  it('applies the flat 33 EUR rate up to 110 kW', () => {
    const result = calculateUznemumaAutoNodoklis({
      vehicleType: 'other',
      firstRegisteredAfter2009: true,
      enginePowerKw: 90,
    });

    expect(result.monthlyRateEur).toBe(33);
  });

  it('applies the per-kW rate for the 111-130 kW band', () => {
    const result = calculateUznemumaAutoNodoklis({
      vehicleType: 'other',
      firstRegisteredAfter2009: true,
      enginePowerKw: 120,
    });

    expect(result.monthlyRateEur).toBeCloseTo(120 * 0.3, 5);
  });

  it('applies the per-kW rate for engines over 200 kW', () => {
    const result = calculateUznemumaAutoNodoklis({
      vehicleType: 'other',
      firstRegisteredAfter2009: true,
      enginePowerKw: 250,
    });

    expect(result.monthlyRateEur).toBeCloseTo(250 * 0.7, 5);
  });

  it('applies the flat 60 EUR rate for vehicles not first registered after 2009', () => {
    const result = calculateUznemumaAutoNodoklis({
      vehicleType: 'other',
      firstRegisteredAfter2009: false,
      enginePowerKw: 90,
    });

    expect(result.monthlyRateEur).toBe(60);
    expect(result.annualRateEur).toBe(720);
  });
});
