import { describe, expect, it } from "vitest";
import { validateEmail, validatePassword, validatePasswordMatch } from "./validation";

describe('validateEmail', () => {
  it('accepts a valid email', () => {
    expect(validateEmail('a@b.com')).toBeUndefined();
  });
  it('rejects an empty value', () => {
    expect(validateEmail('')).toBeTruthy();
  });
  it('rejects a wrong format', () => {
    expect(validateEmail('abc')).toBeTruthy();
  });
});

describe('validatePassword', () => {
  it('accepts a valid password', () => {
    expect(validatePassword('Password123!', true)).toBeUndefined();
  });

  it('rejects an empty value', () => {
    expect(validatePassword('', true)).toBeTruthy();
  });

  it('rejects a password that does not meet requirements', () => {
    expect(validatePassword('Password123!', false)).toBeTruthy();
  });
});

describe('validatePasswordMatch', () => {
  it('accepts matching passwords', () => {
    expect(
      validatePasswordMatch('Password123!', 'Password123!'),
    ).toBeUndefined();
  });

  it('rejects an empty confirmation', () => {
    expect(validatePasswordMatch('Password123!', '')).toBeTruthy();
  });

  it('rejects passwords that do not match', () => {
    expect(
      validatePasswordMatch('Password123!', 'Password456!'),
    ).toBeTruthy();
  });
});
