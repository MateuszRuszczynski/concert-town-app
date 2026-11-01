import { describe, expect, it } from "vitest";
import { mapEventFormDataToPatch } from "./eventsMappers";

describe('mapEventFormDataToPatch', () => {
  it('maps only provided fields', () => {
    expect(mapEventFormDataToPatch({ title: 'title', capacity: 50 })).toEqual({
      title: 'title',
      total_seats: 50
    });
  });
  it('maps status to is_active', () => {
    expect(mapEventFormDataToPatch({ status: 'canceled' })).toEqual({
      is_active: false
    });
  });
});
