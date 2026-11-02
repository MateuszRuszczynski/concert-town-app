//#region imports
import { describe, it, expect } from 'vitest';
import { getErrorMessage } from './getErrorMessage';
import { ApiError } from '../api/ApiError';
//#endregion

describe('getErrorMessage', () => {
  it('returns the detail message', () => {
    expect(getErrorMessage({ detail: 'Invalid credentials' })).toBe(
      'Invalid credentials'
    );
  });

  it('returns the ApiError detail message', () => {
    expect(getErrorMessage(new ApiError(401, { detail: 'Unauthorized' }))).toBe(
      'Unauthorized'
    );
  });

  it('returns the Error message', () => {
    expect(getErrorMessage(new Error('Something failed'))).toBe(
      'Something failed'
    );
  });

  it('returns the fallback for an unknown error', () => {
    expect(getErrorMessage(null)).toBe('Something went wrong. Try again.');
  });

  it('returns the email validation error message', () => {
    expect(getErrorMessage({ email: ['Already exists'] })).toBe(
      'Already exists'
    );
  });
});
