//#region imports
import { usePageTitle } from '../../hooks/usePageTitle';
import { EventsFilterBar } from './components/EventsFilterBar';
import { useEventFilters } from './hooks/useEventFilters';
import { useAuth } from '../../contexts/AuthContext';
import {
  EventsPageLayout,
  EventsPageSkeleton
} from '../../components/EventsPageLayout';
import { EventsSearchSort } from './components/EventsSearchSort';
//#endregion

export const Events = () => {
  usePageTitle('Events');

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    page,
    totalPages,
    setPage,
    searchQuery,
    setSearchQuery,
    categorySlug,
    setCategorySlug,
    sortBy,
    setSortBy,
    events,
    hasActiveFilters,
    clearFilters,
    isLoading,
    error
  } = useEventFilters();

  if (authLoading) {
    return <EventsPageSkeleton />;
  }

  return (
    <EventsPageLayout
      title='Events'
      subtitle='Discover and register for upcoming events.'
      showNav={isAuthenticated}
      toolbar={
        <>
          <EventsSearchSort
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <EventsFilterBar
            categorySlug={categorySlug}
            setCategorySlug={setCategorySlug}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        </>
      }
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      events={events}
      isLoading={isLoading}
      error={error}
    />
  );
};
