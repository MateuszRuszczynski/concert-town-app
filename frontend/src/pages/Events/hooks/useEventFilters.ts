//#region imports
import { useSearchParams } from 'react-router';
import { useUpdateSearchParam } from '../../../hooks/useUpdateSearchParam';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import type { SortBy } from '../utils/sortOptions';
import { useEventsList } from '../../../api/queries/events/useEventsQueries';
//#endregion

export function useEventFilters () {
  //#region searchParams

  const [searchParams] = useSearchParams();
  const updateSearchParam = useUpdateSearchParam();

  const searchQuery = searchParams.get('search') ?? '';
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);
  const categorySlug = searchParams.get('category') ?? '';
  const sortBy = (searchParams.get('sort') as SortBy) ?? 'date';
  const page = Number(searchParams.get('page')) || 1;

  //#endregion

  //#region updating searchParams

  const setSearchQuery = (value: string) =>
    updateSearchParam({ search: value || null, page: null });
  const setCategorySlug = (slug: string) =>
    updateSearchParam({ category: slug || null, page: null });
  const setSortBy = (sort: SortBy) => updateSearchParam({ sort, page: null });
  const setPage = (newPage: number) =>
    updateSearchParam({ page: newPage > 1 ? String(newPage) : null });

  //#endregion

  const { data, isLoading, error } = useEventsList({
    search: debouncedSearchQuery || undefined,
    category: categorySlug || undefined,
    ordering: sortBy,
    page
  });

  
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
    events: data?.events ?? [],
    isLoading,
    hasActiveFilters,
    clearFilters,
    error,
    totalPages: data?.totalPages ?? 1,
  };
}
