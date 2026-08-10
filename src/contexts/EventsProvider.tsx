import { useState, useCallback, type FC, type ReactNode } from 'react';
import { EventsContext } from './EventsContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_EVENTS } from '../pages/Events/defaultEvents';
import type { EventDetails, EventFormData } from '../types/events';

export const EventsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useLocalStorage<EventDetails[]>(DEFAULT_EVENTS, 'events');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
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
          relation: 'organizing',
        };
        setEvents((prev) => [newEvent, ...prev]);
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
        setEvents((prev) =>
          prev.map((event) => (event.id === id ? { ...event, ...data } : event))
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
        setEvents((prev) => prev.filter((event) => event.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete event');
        throw err;
      }
    },
    [setEvents]
  );

  return (
    <EventsContext.Provider
      value={{ events, isLoading, error, addEvent, updateEvent, deleteEvent, refetchEvents }}
    >
      {children}
    </EventsContext.Provider>
  );
};
