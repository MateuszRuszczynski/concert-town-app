//#region imports
import {
  useCallback,
  useEffect,
  useMemo,
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
//#endregion

type Props = {
  children: ReactNode;
};

export const RegistrationsProvider: FC<Props> = ({ children }) => {
  const [registrations, setRegistrations] = useState<Bookings[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();
  const { events, refetchEvents } = useEvents();

  const attendingEvents = useMemo(() => {
    const registeredIds = new Set(registrations.map((r) => r.event));
    return events.filter((e) => registeredIds.has(e.id));
  }, [events, registrations]);

  const refetchRegistrations = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await bookingsService.getRegistrations({}, token);
      setRegistrations(response.results);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load registrations'));
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetchRegistrations();
  }, [refetchRegistrations]);

  const register = useCallback(
    async (eventId: number) => {
      if (!token) throw new Error('Not authenticated');
      const newRegistration = await bookingsService.register(eventId, token);
      await refetchEvents();

      setRegistrations(prev => [...prev, newRegistration.registration]);
    },
    [token, refetchEvents]
  );

  const cancelRegistration = useCallback(
    async (eventId: number) => {
      if (!token) throw new Error('Not authenticated');
      const registration = registrations.find(r => r.event === eventId);

      if (!registration)
        throw new Error('Registration not found for this event');
      await bookingsService.cancelRegistration(registration.id, token);
      await refetchEvents();
      setRegistrations(prev => prev.filter(r => r.id !== registration.id));
    },
    [token, registrations, refetchEvents]
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
