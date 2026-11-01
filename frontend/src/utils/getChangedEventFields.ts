import type { EventFormData } from '../types/events';
import { areDateTimesEqual } from './date/areDateTimesEqual';

export function getChangedEventFields (
  initialValues: EventFormData,
  currentValues: EventFormData
): Partial<EventFormData> {
  const changedFields: Partial<EventFormData> = {};

  for (const key of Object.keys(currentValues) as (keyof EventFormData)[]) {
    if (key === 'location') {
      const initialLocation = initialValues.location;
      const currentLocation = currentValues.location;

      const isEqual =
        typeof initialLocation === 'string' ||
        typeof currentLocation === 'string'
          ? initialLocation === currentLocation
          : initialLocation.city === currentLocation.city &&
            initialLocation.venue === currentLocation.venue;

      if (!isEqual) {
        changedFields.location = currentLocation;
      }

      continue;
    }

    if (key === 'startsAt' || key === 'endsAt') {
      if (
        !areDateTimesEqual(initialValues[key], currentValues[key])
      ) {
        changedFields[key] = currentValues[key];
      }
      continue;
    }

    if (!Object.is(initialValues[key], currentValues[key])) {
      Object.assign(changedFields, {
        [key]: currentValues[key]
      });
    }
  }

  return changedFields;
}
