import { describe, it, expect } from 'vitest';
import { areDateTimesEqual } from './areDateTimesEqual';

describe('areDateTimesEqual', () => {
  it('treats ISO and input formats of the same moment as equal', () => {
    expect(
      areDateTimesEqual('2026-10-20T13:00:00.000Z', '2026-10-20T13:00:00Z')
    ).toBe(true);
  });
  it('detects different times', () => {
    expect(
      areDateTimesEqual('2026-10-20T13:00:00Z', '2026-10-20T14:00:00Z')
    ).toBe(false);
  });
});
