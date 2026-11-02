//#region imports
import { useAllRegistrations } from '../api/queries/registrations';
import { useAuth } from '../contexts/AuthContext';
import type { EventDetails } from '../types/events';
//#endregion

export function useEventRelation (
  event: EventDetails | undefined
): 'organizing' | 'attending' | undefined {
  const { user, isAuthenticated } = useAuth();
  const { data } = useAllRegistrations();

  if (!event) return;
  if (!isAuthenticated) return undefined;
  const isRegistered = data?.registrations.some(r => r.event.id === event.id);

  if (isRegistered) return 'attending';
  if (event.organizerId === user?.id) return 'organizing';

  return undefined;
}
