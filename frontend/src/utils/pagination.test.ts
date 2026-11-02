import { describe, it, expect } from 'vitest';
import { getTotalPages } from './pagination';

describe('getTotalPages', () => {
  it('returns the correct number of pages', () => {
    expect(getTotalPages(100, 10)).toBe(10);
  });

  it('rounds up when items do not fill a full page', () => {
    expect(getTotalPages(21, 10)).toBe(3);
  });

  it('returns 0 when count is 0', () => {
    expect(getTotalPages(0, 10)).toBe(0);
  });
});
