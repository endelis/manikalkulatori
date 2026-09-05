import { describe, expect, it } from 'vitest';
import { calculateTerasesDeluDaudzums } from './terases-delu-daudzums';

describe('calculateTerasesDeluDaudzums', () => {
  it('computes board count from area, board size, gap and waste percent', () => {
    const result = calculateTerasesDeluDaudzums({
      deckAreaM2: 15,
      boardWidthMm: 150,
      boardLengthMm: 2900,
      gapMm: 5,
      wastePercent: 10,
    });
    // coverage = 2.9 * 0.155 = 0.4495 m2, withWaste = 16.5 m2, boards = ceil(16.5/0.4495) = 37
    expect(result.boardCoverageM2).toBeCloseTo(0.4495, 6);
    expect(result.deckAreaWithWasteM2).toBeCloseTo(16.5, 6);
    expect(result.boardsNeeded).toBe(37);
  });

  it('needs fewer boards for a wider board, same length', () => {
    const narrow = calculateTerasesDeluDaudzums({
      deckAreaM2: 15,
      boardWidthMm: 100,
      boardLengthMm: 2900,
      gapMm: 5,
      wastePercent: 0,
    });
    const wide = calculateTerasesDeluDaudzums({
      deckAreaM2: 15,
      boardWidthMm: 200,
      boardLengthMm: 2900,
      gapMm: 5,
      wastePercent: 0,
    });
    expect(wide.boardsNeeded).toBeLessThan(narrow.boardsNeeded);
  });

  it('returns 0 boards instead of dividing by zero when board dimensions are 0', () => {
    const result = calculateTerasesDeluDaudzums({
      deckAreaM2: 15,
      boardWidthMm: 0,
      boardLengthMm: 0,
      gapMm: 5,
      wastePercent: 0,
    });
    expect(result.boardsNeeded).toBe(0);
  });
});
