import { describe, expect, it } from 'vitest';
import { calculatePeldesanasCss } from './peldesanas-css';

describe('calculatePeldesanasCss', () => {
  it('computes CSS and pace for a 7:00 / 3:20 test pair', () => {
    const result = calculatePeldesanasCss({
      time400Min: 7,
      time400Sec: 0,
      time200Min: 3,
      time200Sec: 20,
    });

    expect(result.cssMetersPerSecond).toBeCloseTo(200 / 220, 5);
    expect(result.pacePer100Seconds).toBe(110);
  });

  it('computes CSS for a faster swimmer', () => {
    const result = calculatePeldesanasCss({
      time400Min: 5,
      time400Sec: 30,
      time200Min: 2,
      time200Sec: 35,
    });

    expect(result.cssMetersPerSecond).toBeCloseTo(200 / 175, 5);
    expect(result.pacePer100Seconds).toBe(87.5);
  });

  it('guards against a non-positive time difference without crashing', () => {
    const result = calculatePeldesanasCss({
      time400Min: 3,
      time400Sec: 0,
      time200Min: 3,
      time200Sec: 0,
    });

    expect(result.cssMetersPerSecond).toBe(0);
    expect(result.pacePer100Seconds).toBe(0);
  });
});
