//#region imports
import { useState, useCallback, type FC, type ReactNode } from 'react';
import { EventsContext } from './EventsContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { DEFAULT_EVENTS } from '../../pages/Events/defaultEvents';
import type { EventDetails, EventFormData } from '../../types/events';
//#endregion

export const EventsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useLocalStorage<EventDetails[]>(
    DEFAULT_EVENTS,
    'events'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const SIMULATED_DELAY_MS = 800;

  const refetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addEvent = useCallback(
    async (data: EventFormData) => {
      setError(null);
      try {
        const newEvent: EventDetails = {
          ...data,
          id: crypto.randomUUID(),
          registeredCount: 0,
          relation: 'organizing'
        };
        setEvents(prev => [newEvent, ...prev]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create event');
        throw err;
      }
    },
    [setEvents]
  );

  const updateEvent = useCallback(
    async (id: string, data: Partial<EventFormData>) => {
      setError(null);
      try {
        setEvents(prev =>
          prev.map(event => (event.id === id ? { ...event, ...data } : event))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update event');
        throw err;
      }
    },
    [setEvents]
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY_MS));
        setEvents(prev => prev.filter(event => event.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete event');
        throw err;
      }
    },
    [setEvents]
  );

  const registerForEvent = useCallback(
    async (id: string) => {
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY_MS));

        setEvents(prev =>
          prev.map(event =>
            event.id === id
              ? {
                  ...event,
                  relation: 'attending',
                  registeredCount: event.registeredCount + 1
                }
              : event
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to register');
        throw err;
      }
    },
    [setEvents]
  );

  const cancelRegistration = useCallback(
    async (id: string) => {
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY_MS));
        setEvents(prev =>
          prev.map(event =>
            event.id === id
              ? {
                  ...event,
                  relation: undefined,
                  registeredCount: Math.max(0, event.registeredCount - 1)
                }
              : event
          )
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to cancel registration'
        );
        throw err;
      }
    },
    [setEvents]
  );

  return (
    <EventsContext.Provider
      value={{
        events,
        isLoading,
        error,
        addEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        cancelRegistration,
        refetchEvents
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
