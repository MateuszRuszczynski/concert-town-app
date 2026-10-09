import type { EventDetails } from '../../../types/events';

function isValidDate (dateString: string | undefined): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

function toDateKey (date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function groupEventsByDate (
  events: EventDetails[]
): Map<string, EventDetails[]> {
  const map = new Map<string, EventDetails[]>();

  for (const event of events) {
    if (!isValidDate(event.startsAt)) continue;

    const key = event.startsAt.slice(0, 10);
    const existing = map.get(key) ?? [];
    map.set(key, [...existing, event]);
  }

  return map;
}

export { toDateKey };
