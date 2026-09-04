import { describe, expect, it } from 'vitest';

describe('toolchain smoke test', () => {
  it('runs TypeScript and Vitest together', () => {
    const value: number = 1 + 1;
    expect(value).toBe(2);
  });
});
