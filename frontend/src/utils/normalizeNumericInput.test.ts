import { describe, it, expect } from 'vitest';
import { normalizeNumericInput } from './normalizeNumericInput';

describe('normalizeNumericInput', () => {
  it('removes leading zeros', () => {
    expect(normalizeNumericInput('03')).toBe('3');
  });
  it('returns "0" for empty input', () => {
    expect(normalizeNumericInput('')).toBe('0');
  });
  it('strips non-digit characters', () => {
    expect(normalizeNumericInput('1a2')).toBe('12');
  });
});
