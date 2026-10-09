//#region imports
import { useSearchParams } from 'react-router';
import { useUpdateSearchParam } from '../../../hooks/useUpdateSearchParam';
import { useAuth } from '../../../contexts/AuthContext';
import type { EventDetails } from '../../../types/events';
import { useEffect, useState } from 'react';
import {
  getMyEvents,
  mapEventResponseToEventDetails
} from '../../../api/events';
import { getTotalPages } from '../../../utils/pagination';
//#endregion

export function useMyEventFilters () {
  const [searchParams] = useSearchParams();
  const updateSearchParam = useUpdateSearchParam();
  const { token, isOrganizerOrAdmin } = useAuth();

  const page = Number(searchParams.get('page')) || 1;

  const [events, setEvents] = useState<EventDetails[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchMyEvents () {
      if (!token || !isOrganizerOrAdmin) return;
      setIsLoading(true);
      try {
        const response = await getMyEvents({ page }, token);
        setEvents(response.results.map(mapEventResponseToEventDetails));
        setTotalPages(getTotalPages(response.count, 10));
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyEvents();
  }, [token, isOrganizerOrAdmin, page]);

  const setPage = (newPage: number) => updateSearchParam({ page: newPage > 1 ? String(newPage) : null })

  return { events, isLoading, page, totalPages, setPage };
}
