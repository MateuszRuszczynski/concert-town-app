import type { EventDetails, RelationFilter } from "../../../types/events";

export function getEventRelation(
  event: EventDetails,
  myEvents: EventDetails[],
  attendedEvents: EventDetails[],
): RelationFilter | undefined {
  if (myEvents.some((e) => e.id === event.id)) return 'organizing';
  if (attendedEvents.some((e) => e.id === event.id)) return 'attending';
  return undefined;
}
