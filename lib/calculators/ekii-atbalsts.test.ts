import { describe, expect, it } from 'vitest';
import { calculateEkiiAtbalsts } from './ekii-atbalsts';

describe('calculateEkiiAtbalsts', () => {
  it('standard buyer, new EV', () => {
    const result = calculateEkiiAtbalsts({
      vehiclePriceExclVat: 35000,
      isUsed: false,
      isPhev: false,
      hasFamilyCard: false,
      seatCount: 5,
      childrenCount: 0,
    });

    expect(result.eligible).toBe(true);
    expect(result.grantAmount).toBe(4000);
    expect(result.netPriceExclVat).toBe(31000);
  });

  it('standard buyer, used EV', () => {
    const result = calculateEkiiAtbalsts({
      vehiclePriceExclVat: 12000,
      isUsed: true,
      isPhev: false,
      hasFamilyCard: false,
      seatCount: 5,
      childrenCount: 0,
    });

    expect(result.eligible).toBe(true);
    expect(result.grantAmount).toBe(3000);
    expect(result.netPriceExclVat).toBe(9000);
  });

  it('family card, 7 seats, new PHEV', () => {
    const result = calculateEkiiAtbalsts({
      vehiclePriceExclVat: 50000,
      isUsed: false,
      isPhev: true,
      hasFamilyCard: true,
      seatCount: 7,
      childrenCount: 0,
    });

    expect(result.eligible).toBe(true);
    expect(result.priceCapExclVat).toBe(60000);
    expect(result.grantAmount).toBe(9000);
    expect(result.netPriceExclVat).toBe(41000);
  });

  it('family card, 5 seats, used EV', () => {
    const result = calculateEkiiAtbalsts({
      vehiclePriceExclVat: 20000,
      isUsed: true,
      isPhev: false,
      hasFamilyCard: true,
      seatCount: 5,
      childrenCount: 0,
    });

    expect(result.eligible).toBe(true);
    expect(result.grantAmount).toBe(5000);
    expect(result.netPriceExclVat).toBe(15000);
  });

  it('family card, 6 seats, new EV, 4 children', () => {
    const result = calculateEkiiAtbalsts({
      vehiclePriceExclVat: 55000,
      isUsed: false,
      isPhev: false,
      hasFamilyCard: true,
      seatCount: 6,
      childrenCount: 4,
    });

    expect(result.eligible).toBe(true);
    expect(result.grantAmount).toBe(7750);
    expect(result.netPriceExclVat).toBe(47250);
  });

  it('used PHEV is not eligible', () => {
    const result = calculateEkiiAtbalsts({
      vehiclePriceExclVat: 20000,
      isUsed: true,
      isPhev: true,
      hasFamilyCard: false,
      seatCount: 5,
      childrenCount: 0,
    });

    expect(result.eligible).toBe(false);
    expect(result.ineligibleReason).toBe('phev-used-not-eligible');
    expect(result.grantAmount).toBe(0);
  });

  it('price above cap is not eligible', () => {
    const result = calculateEkiiAtbalsts({
      vehiclePriceExclVat: 46000,
      isUsed: false,
      isPhev: false,
      hasFamilyCard: false,
      seatCount: 5,
      childrenCount: 0,
    });

    expect(result.eligible).toBe(false);
    expect(result.ineligibleReason).toBe('price-too-high');
    expect(result.grantAmount).toBe(0);
  });

  it('used price below minimum is not eligible', () => {
    const result = calculateEkiiAtbalsts({
      vehiclePriceExclVat: 5000,
      isUsed: true,
      isPhev: false,
      hasFamilyCard: false,
      seatCount: 5,
      childrenCount: 0,
    });

    expect(result.eligible).toBe(false);
    expect(result.ineligibleReason).toBe('price-too-low');
    expect(result.grantAmount).toBe(0);
  });
});
