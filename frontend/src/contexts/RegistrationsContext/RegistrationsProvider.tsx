//#region imports
import {
  useCallback,
  useEffect,
  useState,
  type FC,
  type ReactNode
} from 'react';
import type { Bookings } from '../../api/bookings/bookingsTypes';
import { useAuth } from '../AuthContext';
import { bookingsService } from '../../api/bookings/bookingsService';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { RegistrationsContext } from './RegistrationsContext';
import { useEvents } from '../EventContext';
import type { EventDetails } from '../../types/events';
import { getEvent, mapEventResponseToEventDetails, type EventResponse } from '../../api/events';
//#endregion

type Props = {
  children: ReactNode;
};

export const RegistrationsProvider: FC<Props> = ({ children }) => {
  const [registrations, setRegistrations] = useState<Bookings[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<EventDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token, isLoading: isAuthLoading } = useAuth();
  const { refetchEvents } = useEvents();

  const refetchRegistrations = useCallback(async () => {
    if (isAuthLoading || !token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await bookingsService.getRegistrations({}, token);
      setRegistrations(response.results);

      const results = await Promise.allSettled(
        response.results.map(r => getEvent(String(r.event)))
      );

      const details = results
        .filter(
          (r): r is PromiseFulfilledResult<EventResponse> =>
            r.status === 'fulfilled'
        )
        .map(r => r.value);
      setAttendingEvents(details.map(mapEventResponseToEventDetails));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load registrations'));
    } finally {
      setIsLoading(false);
    }
  }, [isAuthLoading, token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetchRegistrations();
  }, [refetchRegistrations]);

  const register = useCallback(
    async (eventId: number) => {
      if (!token) throw new Error('Not authenticated');
      await bookingsService.register(eventId, token);
      await refetchEvents();

      await refetchRegistrations();
    },
    [token, refetchEvents, refetchRegistrations]
  );

  const cancelRegistration = useCallback(
    async (eventId: number) => {
      if (!token) throw new Error('Not authenticated');
      const registration = registrations.find(r => r.event === eventId);

      if (!registration)
        throw new Error('Registration not found for this event');
      await bookingsService.cancelRegistration(registration.id, token);
      await refetchEvents();

      await refetchRegistrations();
    },
    [token, registrations, refetchEvents, refetchRegistrations]
  );

  return (
    <RegistrationsContext.Provider
      value={{
        registrations,
        attendingEvents,
        isLoading,
        error,
        register,
        cancelRegistration,
        refetchRegistrations
      }}
    >
      {children}
    </RegistrationsContext.Provider>
  );
};
