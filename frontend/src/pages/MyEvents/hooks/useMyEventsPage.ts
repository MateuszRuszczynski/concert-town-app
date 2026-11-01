//#region imports
import { useSearchParams } from 'react-router';
import { useUpdateSearchParam } from '../../../hooks/useUpdateSearchParam';
import { useMyEvents } from '../../../api/queries/events/useEventsQueries';
//#endregion

export function useMyEventsPage () {
  const [searchParams] = useSearchParams();
  const updateSearchParam = useUpdateSearchParam();

  const page = Number(searchParams.get('page')) || 1;

  const { data, isLoading, error } = useMyEvents('all', page);

  const setPage = (newPage: number) =>
    updateSearchParam({ page: newPage > 1 ? String(newPage) : null });

  return {
    events: data?.events ?? [],
    isLoading,
    page,
    totalPages: data?.totalPages ?? 1,
    setPage,
    error
  };
}
