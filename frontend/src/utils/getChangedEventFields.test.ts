//#region imports
import { describe, expect, it } from "vitest";
import { getChangedEventFields } from "./getChangedEventFields";
import type { EventFormData } from "../types/events";
//#endregion

const base: EventFormData = {
  title: 'Concert',
  description: 'Desc',
  host: 'Host',
  categoryId: 1,
  startsAt: '2026-10-20T13:00:00Z',
  endsAt: '2026-10-20T19:00:00Z',
  location: { city: 'Kyiv', venue: 'Hall' },
  capacity: 100,
  price: '25.00',
  status: 'published'
};

describe('getChangedEventFields', () => {
  it('returns an empty object when nothing changed', () => {
    expect(getChangedEventFields(base, { ...base })).toEqual({});
  });
  it('returns only the changed field', () => {
    expect(getChangedEventFields(base, { ...base, title: 'New' })).toEqual({
      title: 'New'
    });
  });
  it('detects a changed location', () => {
    const next = { ...base, location: { city: 'Lviv', venue: 'Hall' } };
    expect(getChangedEventFields(base, next)).toEqual({
      location: { city: 'Lviv', venue: 'Hall' }
    });
  });
  it('detects online switch', () => {
    expect(
      getChangedEventFields(base, { ...base, location: 'online' })
    ).toEqual({ location: 'online' });
  });
});
