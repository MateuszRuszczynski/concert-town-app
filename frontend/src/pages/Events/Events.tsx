//#region imports
import { usePageTitle } from '../../hooks/usePageTitle';
import { EventsFilterBar } from './components/EventsFilterBar';
import { useEventFilters } from './hooks/useEventFilters';
import { useAuth } from '../../contexts/AuthContext';
import {
  EventsPageLayout,
  EventsPageSkeleton
} from '../../components/EventsPageLayout';
import { useEvents } from '../../contexts/EventContext';
import { EventsSearchSort } from './components/EventsSearchSort';
//#endregion

export const Events = () => {
  usePageTitle('Events');

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isLoading: eventsLoading } = useEvents();

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
    isLoading
  } = useEventFilters();

  if (authLoading || eventsLoading) {
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
    />
  );
};
