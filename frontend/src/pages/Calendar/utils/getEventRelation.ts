import type { EventDetails } from "../../../types/events";
import type { RelationFilter } from "../../Events/types/eventFilters";

export function getEventRelation(
  event: EventDetails,
  myEvents: EventDetails[],
  registeredEventIds: Set<number>
): RelationFilter | undefined {
  if (myEvents.some((e) => e.id === event.id)) return 'organizing';
  if (registeredEventIds.has(event.id)) return 'attending';
  return undefined;
}
