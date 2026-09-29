//#region imports
import { useCallback, useEffect, useState } from 'react';
import type { EventDetails } from '../../../types/events';
import { getEvent, mapEventResponseToEventDetails } from '../../../api/events';
//#endregion

export function useEvent (id: string | undefined) {
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvent = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setEvent(null);

    try {
      const resp = await getEvent(id);
      setEvent(mapEventResponseToEventDetails(resp));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvent();
  }, [fetchEvent]);

  return {
    event,
    isLoading,
    refetch: fetchEvent
  };
}
