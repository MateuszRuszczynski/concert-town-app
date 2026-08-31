//#region imports
import { useMemo } from 'react';
import { getVisibleEvents } from '../utils/getVisibleEvents';
import type { EventDetails, EventCategory } from '../../../types/events';
import {
  DEFAULT_LOCATION,
  DEFAULT_PRICE,
  DEFAULT_RELATION,
  DEFAULT_SORT,
  type LocationFilter,
  type PriceFilter,
  type RelationFilter,
  type SortOption
} from '../types/eventFilters';
import { useSearchParams } from 'react-router';
import { useUpdateSearchParam } from '../../../hooks/useUpdateSearchParam';
//#endregion

export function useEventFilters (events: EventDetails[]) {
  //#region searchParams hooks
  const [searchParams] = useSearchParams();
  const updateSearchParam = useUpdateSearchParam();
  //#endregion

  //#region current filter & sort values
  const searchQuery = searchParams.get('search') ?? '';
  const sortBy = (searchParams.get('sort') as SortOption) ?? DEFAULT_SORT;
  const selectedCategories = useMemo(() => {
    const raw = searchParams.get('categories');
    return raw ? (raw.split(',') as EventCategory[]) : [];
  }, [searchParams]);
  const locationFilter =
    (searchParams.get('location') as LocationFilter) ?? DEFAULT_LOCATION;
  const priceFilter =
    (searchParams.get('price') as PriceFilter) ?? DEFAULT_PRICE;
  const relationFilter =
    (searchParams.get('relation') as RelationFilter) ?? DEFAULT_RELATION;

  const filterValues = {
    selectedCategories,
    locationFilter,
    priceFilter,
    relationFilter,
  };
  //#endregion

  //#region update handlers
  const setSearchQuery = (value: string) =>
    updateSearchParam({ search: value || null });

  const setSelectedCategories = (categories: EventCategory[]) =>
    updateSearchParam({
      categories: categories.length > 0 ? categories.join(',') : null
    });

  const setLocationFilter = (filter: LocationFilter) =>
    updateSearchParam({
      location: filter !== DEFAULT_LOCATION ? filter : null
    });

  const setPriceFilter = (filter: PriceFilter) =>
    updateSearchParam({ price: filter !== DEFAULT_PRICE ? filter : null });

  const setRelationFilter = (filter: RelationFilter) =>
    updateSearchParam({
      relation: filter !== DEFAULT_RELATION ? filter : null
    });

  const setSortBy = (sort: SortOption) => updateSearchParam({ sort });

  //#endregion

  //#region derived values
  const visibleEvents = useMemo(
    () =>
      getVisibleEvents(events, {
        searchQuery,
        selectedCategories,
        locationFilter,
        priceFilter,
        relationFilter,
        sortBy
      }),
    [
      events,
      searchQuery,
      selectedCategories,
      locationFilter,
      priceFilter,
      relationFilter,
      sortBy
    ]
  );

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    locationFilter !== 'all' ||
    priceFilter !== 'all' ||
    relationFilter !== 'all';

  //#endregion

  //#region filter actions
  const clearFilters = () => {
    updateSearchParam({
      categories: null,
      location: null,
      price: null,
      relation: null
    });
  };

  const removeCategory = (category: EventCategory) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category));
  };

  const filterUpdates = {
    onCategoriesChange: setSelectedCategories,
    onLocationFilterChange: setLocationFilter,
    onPriceFilterChange: setPriceFilter,
    onRelationFilterChange: setRelationFilter,
    onRemoveCategory: removeCategory,
  };
  //#endregion

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterValues,
    filterUpdates,
    clearFilters,
    visibleEvents,
    hasActiveFilters,
  };
}
