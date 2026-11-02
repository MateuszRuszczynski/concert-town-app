//#region imports
import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '../categories/categoriesService';
import { queryKeys } from './queryKeys';
//#endregion

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => categoriesService.getCategories(),
    select: data => data.results,
    staleTime: 60 * 60 * 1000,
  });
}
