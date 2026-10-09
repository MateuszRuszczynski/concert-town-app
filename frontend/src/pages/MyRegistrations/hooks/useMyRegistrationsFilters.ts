//#region imports
import { useSearchParams } from 'react-router';
import { useUpdateSearchParam } from '../../../hooks/useUpdateSearchParam';
import { useAuth } from '../../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import type { EventDetails } from '../../../types/events';
import { getRegistrations } from '../../../api/bookings/bookingsService';
import { getTotalPages } from '../../../utils/pagination';
import { getEvent, mapEventResponseToEventDetails } from '../../../api/events';
//#endregion

export function useMyRegistationsFilters () {
  const [searchParams] = useSearchParams();
  const updateSearchParam = useUpdateSearchParam();

  const { token } = useAuth();

  const page = Number(searchParams.get('page')) || 1;

  const [events, setEvents] = useState<EventDetails[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchMyRegisteredEvents () {
      if (!token) return;
      setIsLoading(true);
      try {
        const response = await getRegistrations({ page }, token);

        const eventDetails = await Promise.all(
        response.results.map((r) => getEvent(String(r.event)))
      );

        setEvents(eventDetails.map(mapEventResponseToEventDetails));
        setTotalPages(getTotalPages(response.count, 10));
      }  finally {
        setIsLoading(false);
      }
    }
    fetchMyRegisteredEvents();
  }, [token, page]);

  const setPage = (newPage: number) =>
    updateSearchParam({ page: newPage > 1 ? String(newPage) : null });

  return { events, isLoading, page, setPage, totalPages };
}
