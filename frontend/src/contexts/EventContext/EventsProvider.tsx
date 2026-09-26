//#region imports
import {
  useState,
  useCallback,
  type FC,
  type ReactNode,
  useEffect
} from 'react';
import { EventsContext } from './EventsContext';
import type { EventDetails, EventFormData } from '../../types/events';
import { useAuth } from '../AuthContext';
import {
  getActiveMyEvents,
  getDrafts,
  mapEventFormDataToEventRequest,
  mapEventResponseToEventDetails
} from '../../api/events';
import { getErrorMessage } from '../../utils/getErrorMessage';
import {
  createEvent,
  getEvents,
  getMyEvents,
  eventsService
} from '../../api/events';
//#endregion

type Props = {
  children: ReactNode;
};

export const EventsProvider: FC<Props> = ({ children }) => {
  //#region state
  const [events, setEvents] = useState<EventDetails[]>([]);
  const [myEvents, setMyEvents] = useState<EventDetails[]>([]);
  const [drafts, setDrafts] = useState<EventDetails[]>([]);
  const [activeMyEvents, setActiveMyEvents] = useState<EventDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMyEventsLoading, setIsMyEventsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, token } = useAuth();
  //#endregion

  //#region fetchers
  const refetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getEvents();
      setEvents(response.results.map(e => mapEventResponseToEventDetails(e)));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load events'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetchMyEvents = useCallback(async () => {
    if (!token || user?.role === 'customer') {
      setMyEvents([]);
      return;
    }
    try {
      const response = await getMyEvents({}, token);
      setMyEvents(response.results.map(mapEventResponseToEventDetails));
    } catch {
      setMyEvents([]);
    }
  }, [token, user?.role]);

  const refetchDrafts = useCallback(async () => {
    if (!token || user?.role === 'customer') {
      setDrafts([]);
      return;
    }
    try {
      const response = await getDrafts(token);
      setDrafts(response.results.map(mapEventResponseToEventDetails));
    } catch {
      setDrafts([]);
    }
  }, [token, user?.role]);

  const refetchActiveMyEvents = useCallback(async () => {
    if (!token || user?.role === 'customer') {
      setActiveMyEvents([]);
      return;
    }
    try {
      const response = await getActiveMyEvents(token);
      setActiveMyEvents(response.results.map(mapEventResponseToEventDetails));
    } catch {
      setActiveMyEvents([]);
    }
  }, [token, user?.role]);

  const refetchMyEventsData = useCallback(async () => {
    if (!token || user?.role === 'customer') {
      setMyEvents([]);
      setDrafts([]);
      setActiveMyEvents([]);
      return;
    }

    setIsMyEventsLoading(true);

    try {
      await Promise.all([
        refetchMyEvents(),
        refetchDrafts(),
        refetchActiveMyEvents()
      ]);
    } finally {
      setIsMyEventsLoading(false);
    }
  }, [
    token,
    user?.role,
    refetchMyEvents,
    refetchDrafts,
    refetchActiveMyEvents
  ]);
  //#endregion

  //#region effects
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetchEvents();
  }, [refetchEvents]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetchMyEventsData();
  }, [refetchMyEventsData]);
  //#endregion

  //#region mutations
  const addEvent = useCallback(
    async (data: EventFormData) => {
      if (!token) throw new Error('Not authenticated');
      const response = await createEvent(
        mapEventFormDataToEventRequest(data),
        token
      );
      const newEvent = mapEventResponseToEventDetails(response);
      setEvents(prev => [newEvent, ...prev]);
      await refetchMyEventsData();
    },
    [token, refetchMyEventsData]
  );

  const updateEvent = useCallback(
    async (id: number, data: Partial<EventFormData>) => {
      if (!token) throw new Error('Not authenticated');
      const payload = mapEventFormDataToEventRequest(data as EventFormData);
      const response = await eventsService.updateEvent(id, payload, token);
      const updated = mapEventResponseToEventDetails(response);
      setEvents(prev => prev.map(e => (e.id === id ? updated : e)));
      await refetchMyEventsData();
    },
    [token, refetchMyEventsData]
  );

  const deleteEvent = useCallback(
    async (id: number) => {
      if (!token) throw new Error('Not authenticated');
      await eventsService.deleteEvent(id, token);
      setEvents(prev => prev.filter(e => e.id !== id));
      await refetchMyEventsData();
    },
    [token, refetchMyEventsData]
  );
  //#endregion

  return (
    <EventsContext.Provider
      value={{
        events,
        myEvents,
        drafts,
        activeMyEvents,
        isLoading,
        error,
        isMyEventsLoading,
        addEvent,
        updateEvent,
        deleteEvent,
        refetchEvents
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
