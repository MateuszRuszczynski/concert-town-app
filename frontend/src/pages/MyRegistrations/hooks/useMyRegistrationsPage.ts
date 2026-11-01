//#region imports
import { useSearchParams } from 'react-router';
import { useUpdateSearchParam } from '../../../hooks/useUpdateSearchParam';
import { useMyRegistrations } from '../../../api/queries/registrations';
//#endregion

export function useMyRegistrationsPage () {
  const [searchParams] = useSearchParams();
  const updateSearchParam = useUpdateSearchParam();

  const page = Number(searchParams.get('page')) || 1;

  const { data, isLoading, error } = useMyRegistrations(page);

  const setPage = (newPage: number) =>
    updateSearchParam({ page: newPage > 1 ? String(newPage) : null });

  return {
    events: data?.events ?? [],
    totalPages: data?.totalPages ?? 1,
    page,
    setPage,
    isLoading,
    error
  };
}
