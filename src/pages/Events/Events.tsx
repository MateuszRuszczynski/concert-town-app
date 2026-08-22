//#region imports
import { PageHeader } from '../../components/PageHeader';
import { useEvents } from '../../contexts/EventContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useEventFilters } from './hooks/useEventFilters';
import { ArrowUpDown, Search, X } from 'lucide-react';
import { CustomSelect } from '../../components/CustomSelect';
import { SORT_OPTIONS } from './utils/sortOptions';
import { EventsFilterBar } from './components/EventsFilterBar';
import { EventItem } from '../../components/EventItem';
import { FormField } from '../../components/FormField';
import styles from './Events.module.scss';
//#endregion

export const Events = () => {
  usePageTitle('Events');

  const { events } = useEvents();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setSelectedCategories,
    locationFilter,
    setLocationFilter,
    priceFilter,
    setPriceFilter,
    relationFilter,
    setRelationFilter,
    sortBy,
    setSortBy,
    visibleEvents,
    hasActiveFilters,
    clearFilters,
    removeCategory
  } = useEventFilters(events);

  return (
    <section className={styles.events}>
      <PageHeader
        title='Events'
        subtitle='Manage and track all of your events.'
      />

      <div className={styles.toolbar}>
        <div className={styles.searchSortRow}>
          <div className={styles.searchBar}>
            <FormField
              id='search'
              type='text'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='Search events...'
              startAdornment={<Search size={16} aria-hidden='true' />}
              endAdornment={
                searchQuery && (
                  <button
                    type='button'
                    className={styles.clearSearchButton}
                    onClick={() => setSearchQuery('')}
                    aria-label='Clear search'
                  >
                    <X size={14} aria-hidden='true' />
                  </button>
                )
              }
            />
          </div>

          <div className={styles.sort}>
            <CustomSelect
              id='sort'
              label={
                <>
                  <ArrowUpDown size={12} /> Sort by:
                </>
              }
              value={sortBy}
              onValueChange={setSortBy}
              options={SORT_OPTIONS}
            />
          </div>
        </div>

        <EventsFilterBar
          values={{
            selectedCategories,
            locationFilter,
            priceFilter,
            relationFilter
          }}
          updates={{
            onCategoriesChange: setSelectedCategories,
            onLocationFilterChange: setLocationFilter,
            onPriceFilterChange: setPriceFilter,
            onRelationFilterChange: setRelationFilter
          }}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          onRemoveCategory={removeCategory}
        />
      </div>

      <ul className={styles.eventsList}>
        {visibleEvents.map(event => (
          <li key={event.id} className={styles.eventListItem}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>

      {visibleEvents.length === 0 && (
        <div className={styles.emptyBlock}>No events match your filters.</div>
      )}
    </section>
  );
};
