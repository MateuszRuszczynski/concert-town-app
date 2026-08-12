//#region imports
import { useState, useMemo } from 'react';
import { getVisibleEvents } from '../utils/getVisibleEvents';
import type { EventDetails, EventCategory } from '../../../types/events';
import type { LocationFilter, PriceFilter, SortOption } from '../types/eventFilters';
//#endregion

export function useEventFilters(events: EventDetails[]) {
  //#region input controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [locationFilter, setLocationFilter] = useState<LocationFilter>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  //#endregion

  const visibleEvents = useMemo(
    () => getVisibleEvents(events, { searchQuery, selectedCategories, locationFilter, priceFilter, sortBy }),
    [events, searchQuery, selectedCategories, locationFilter, priceFilter, sortBy]
  );

  const hasActiveFilters =
  selectedCategories.length > 0 || locationFilter !== 'all' || priceFilter !== 'all';

  //#region reset
  const clearFilters = () => {
    setSelectedCategories([]);
    setLocationFilter('all');
    setPriceFilter('all');
  };

  const removeCategory = (category: EventCategory) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== category));
  };
  //#endregion

  return {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setSelectedCategories,
    locationFilter,
    setLocationFilter,
    priceFilter,
    setPriceFilter,
    sortBy,
    setSortBy,
    visibleEvents,
    hasActiveFilters,
    clearFilters,
    removeCategory,
  };
}
