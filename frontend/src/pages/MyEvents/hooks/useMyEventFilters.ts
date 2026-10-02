//#region imports
import { useSearchParams } from 'react-router';
import { useUpdateSearchParam } from '../../../hooks/useUpdateSearchParam';
import { useAuth } from '../../../contexts/AuthContext';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import type { SortBy } from '../../Events/utils/sortOptions';
import type { EventDetails } from '../../../types/events';
import { useEffect, useState } from 'react';
import {
  getMyEvents,
  mapEventResponseToEventDetails
} from '../../../api/events';
//#endregion

export function useMyEventFilters () {
  const [searchParams] = useSearchParams();
  const updateSearchParam = useUpdateSearchParam();
  const { token, isOrganizerOrAdmin } = useAuth();

  const searchQuery = searchParams.get('search') ?? '';
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);
  const sortBy = (searchParams.get('sort') as SortBy) ?? 'date';

  const [events, setEvents] = useState<EventDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchMyEvents () {
      if (!token || !isOrganizerOrAdmin) return;
      setIsLoading(true);
      try {
        const response = await getMyEvents(
          {
            search: debouncedSearchQuery || undefined,
            ordering: sortBy
          },
          token
        );
        setEvents(response.results.map(mapEventResponseToEventDetails));
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyEvents();
  }, [token, debouncedSearchQuery, sortBy, isOrganizerOrAdmin]);

  const setSearchQuery = (value: string) =>
    updateSearchParam({ search: value || null });
  const setSortBy = (sort: SortBy) => updateSearchParam({ sort });

  return { searchQuery, setSearchQuery, sortBy, setSortBy, events, isLoading };
}
