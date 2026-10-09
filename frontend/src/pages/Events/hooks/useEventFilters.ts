//#region imports
import { useSearchParams } from 'react-router';
import { useUpdateSearchParam } from '../../../hooks/useUpdateSearchParam';
import type { EventDetails } from '../../../types/events';
import { useEffect, useState } from 'react';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import {
  eventsService,
  mapEventResponseToEventDetails
} from '../../../api/events';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import type { SortBy } from '../utils/sortOptions';
import { getTotalPages } from '../../../utils/pagination';
//#endregion

export function useEventFilters () {
  const [searchParams] = useSearchParams();
  const updateSearchParam = useUpdateSearchParam();

  const searchQuery = searchParams.get('search') ?? '';
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);
  const categorySlug = searchParams.get('category') ?? '';
  const sortBy = (searchParams.get('sort') as SortBy) ?? 'date';
  const page = Number(searchParams.get('page')) || 1;

  const [events, setEvents] = useState<EventDetails[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEvents () {
      setIsLoading(true);

      try {
        const response = await eventsService.getEvents({
          search: debouncedSearchQuery || undefined,
          category: categorySlug || undefined,
          ordering: sortBy,
          is_active: true,
          page
        });
        setEvents(response.results.map(e => mapEventResponseToEventDetails(e)));
        setTotalPages(getTotalPages(response.count, 10));
      } catch (err) {
        setError(getErrorMessage(err) || 'Something went wrong!');
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, [debouncedSearchQuery, categorySlug, sortBy, page]);

  const setSearchQuery = (value: string) =>
    updateSearchParam({ search: value || null, page: null });
  const setCategorySlug = (slug: string) =>
    updateSearchParam({ category: slug || null, page: null });
  const setSortBy = (sort: SortBy) => updateSearchParam({ sort, page: null });
  const setPage = (newPage: number) => updateSearchParam({ page: newPage > 1 ? String(newPage) : null });

  const hasActiveFilters = categorySlug !== '';

  const clearFilters = () => updateSearchParam({ category: null });

  return {
    page,
    setPage,
    searchQuery,
    setSearchQuery,
    categorySlug,
    setCategorySlug,
    sortBy,
    setSortBy,
    events,
    isLoading,
    hasActiveFilters,
    clearFilters,
    error,
    totalPages
  };
}
