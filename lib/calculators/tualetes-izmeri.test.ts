import { describe, expect, it } from 'vitest';
import { calculateTualetesIzmeri } from './tualetes-izmeri';

describe('calculateTualetesIzmeri', () => {
  it('uses the general 0.8 x 1.4 m minimum by default', () => {
    const result = calculateTualetesIzmeri({ widthM: 0.9, lengthM: 1.5, isAccessible: false });

    expect(result.minWidthM).toBe(0.8);
    expect(result.minLengthM).toBe(1.4);
    expect(result.isFullyCompliant).toBe(true);
  });

  it('uses the accessible 1.6 x 2.2 m minimum when isAccessible is true', () => {
    const result = calculateTualetesIzmeri({ widthM: 1.6, lengthM: 2.2, isAccessible: true });

    expect(result.minWidthM).toBe(1.6);
    expect(result.minLengthM).toBe(2.2);
    expect(result.isFullyCompliant).toBe(true);
  });

  it('flags a width below the general minimum', () => {
    const result = calculateTualetesIzmeri({ widthM: 0.7, lengthM: 1.5, isAccessible: false });

    expect(result.isWidthCompliant).toBe(false);
    expect(result.isLengthCompliant).toBe(true);
    expect(result.isFullyCompliant).toBe(false);
  });

  it('flags a length below the general minimum', () => {
    const result = calculateTualetesIzmeri({ widthM: 0.9, lengthM: 1.3, isAccessible: false });

    expect(result.isWidthCompliant).toBe(true);
    expect(result.isLengthCompliant).toBe(false);
    expect(result.isFullyCompliant).toBe(false);
  });

  it('accepts dimensions exactly at the general minimum boundary', () => {
    const result = calculateTualetesIzmeri({ widthM: 0.8, lengthM: 1.4, isAccessible: false });

    expect(result.isFullyCompliant).toBe(true);
  });

  it('a room compliant for general use can fail the accessible minimum', () => {
    const result = calculateTualetesIzmeri({ widthM: 0.9, lengthM: 1.5, isAccessible: true });

    expect(result.isFullyCompliant).toBe(false);
  });

  it('guards against negative inputs without crashing', () => {
    const result = calculateTualetesIzmeri({ widthM: -1, lengthM: -1, isAccessible: false });

    expect(result.isFullyCompliant).toBe(false);
  });
});
