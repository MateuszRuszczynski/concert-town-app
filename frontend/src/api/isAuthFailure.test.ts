import { describe, it, expect } from 'vitest';
import { isAuthFailure } from './isAuthFailure';
import { ApiError } from './ApiError';

describe('isAuthFailure', () => {
  it('returns true for status 400 and 401', () => {
    expect(isAuthFailure(new ApiError(400, {}))).toBe(true);
    expect(isAuthFailure(new ApiError(401, {}))).toBe(true);
  });

  it('returns false for other errors', () => {
    expect(isAuthFailure(new ApiError(500, {}))).toBe(false);
    expect(isAuthFailure(new Error('Failed'))).toBe(false);
  });
});
