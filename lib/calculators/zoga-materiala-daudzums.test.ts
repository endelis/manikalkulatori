import { describe, expect, it } from 'vitest';
import { calculateZogaMateriaLaDaudzums } from './zoga-materiala-daudzums';

describe('calculateZogaMateriaLaDaudzums', () => {
  it('computes post count and board count from length, spacing, board size and waste', () => {
    const result = calculateZogaMateriaLaDaudzums({
      fenceLengthM: 20,
      postSpacingM: 2.5,
      boardWidthMm: 95,
      gapMm: 20,
      wastePercent: 5,
    });
    // posts: 20 / 2.5 = 8 intervals, +1 = 9 posts
    // board coverage = 0.115 m, withWaste = 21 m, boards = ceil(21/0.115) = 183
    expect(result.postsNeeded).toBe(9);
    expect(result.boardCoverageM).toBeCloseTo(0.115, 6);
    expect(result.fenceLengthWithWasteM).toBeCloseTo(21, 6);
    expect(result.boardsNeeded).toBe(183);
  });

  it('needs one extra post when length is not an exact multiple of spacing', () => {
    const result = calculateZogaMateriaLaDaudzums({
      fenceLengthM: 21,
      postSpacingM: 2.5,
      boardWidthMm: 95,
      gapMm: 20,
      wastePercent: 0,
    });
    // 21 / 2.5 = 8.4 intervals, ceil = 9, +1 = 10 posts
    expect(result.postsNeeded).toBe(10);
  });

  it('returns 0 posts and 0 boards instead of dividing by zero when spacing or board width is 0', () => {
    const zeroSpacing = calculateZogaMateriaLaDaudzums({
      fenceLengthM: 20,
      postSpacingM: 0,
      boardWidthMm: 95,
      gapMm: 20,
      wastePercent: 0,
    });
    expect(zeroSpacing.postsNeeded).toBe(0);

    const zeroBoard = calculateZogaMateriaLaDaudzums({
      fenceLengthM: 20,
      postSpacingM: 2.5,
      boardWidthMm: 0,
      gapMm: 20,
      wastePercent: 0,
    });
    expect(zeroBoard.boardsNeeded).toBe(0);
  });
});
