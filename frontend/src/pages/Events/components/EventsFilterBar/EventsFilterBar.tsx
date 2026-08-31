//#region imports
import type { FC } from 'react';
import type { EventCategory } from '../../../../types/events';
import type {
  LocationFilter,
  PriceFilter,
  RelationFilter
} from '../../types/eventFilters';
import { Filter } from 'lucide-react';
import { CategoryFilterDropdown } from '../CategoryFilterDropdown';
import { CustomSelect } from '../../../../components/CustomSelect';
import {
  LOCATION_FILTER_OPTIONS,
  PRICE_FILTER_OPTIONS,
  RELATION_FILTER_OPTIONS
} from '../../utils/sortOptions';
import { FilterChip } from '../FilterChip';
import styles from './EventsFilterBar.module.scss';
//#endregion

interface FilterValues {
  selectedCategories: EventCategory[];
  locationFilter: LocationFilter;
  priceFilter: PriceFilter;
  relationFilter: RelationFilter;
}

interface FilterUpdates {
  onCategoriesChange: (categories: EventCategory[]) => void;
  onLocationFilterChange: (filter: LocationFilter) => void;
  onPriceFilterChange: (filter: PriceFilter) => void;
  onRelationFilterChange: (filter: RelationFilter) => void;
  onRemoveCategory: (category: EventCategory) => void;
}

interface Props {
  values: FilterValues;
  updates: FilterUpdates;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const EventsFilterBar: FC<Props> = ({
  values,
  updates,
  hasActiveFilters,
  onClearFilters
}) => {
  const { selectedCategories, locationFilter, priceFilter, relationFilter } =
    values;
  const {
    onCategoriesChange,
    onLocationFilterChange,
    onPriceFilterChange,
    onRelationFilterChange,
    onRemoveCategory
  } = updates;

  return (
    <div className={styles.filterBar}>
      <span className={styles.groupLabel}>
        <Filter size={12} aria-hidden='true' />
        Filter by:
      </span>

      <div className={styles.controls}>
        <CategoryFilterDropdown
          selected={selectedCategories}
          onChange={onCategoriesChange}
        />

        <CustomSelect<LocationFilter>
          id='location-filter'
          value={locationFilter}
          onValueChange={onLocationFilterChange}
          options={LOCATION_FILTER_OPTIONS}
        />

        <CustomSelect<PriceFilter>
          id='price-filter'
          value={priceFilter}
          onValueChange={onPriceFilterChange}
          options={PRICE_FILTER_OPTIONS}
        />

        <CustomSelect<RelationFilter>
          id='relation-filter'
          value={relationFilter}
          onValueChange={onRelationFilterChange}
          options={RELATION_FILTER_OPTIONS}
        />
      </div>

      {hasActiveFilters && (
        <div className={styles.activeFilters}>
          {selectedCategories.map(category => (
            <FilterChip
              key={category}
              label={category}
              onRemove={() => onRemoveCategory(category)}
            />
          ))}

          {locationFilter !== 'all' && (
            <FilterChip
              label={locationFilter === 'online' ? 'Online' : 'Offline'}
              onRemove={() => onLocationFilterChange('all')}
            />
          )}

          {priceFilter !== 'all' && (
            <FilterChip
              label={priceFilter === 'free' ? 'Free' : 'Paid'}
              onRemove={() => onPriceFilterChange('all')}
            />
          )}

          {relationFilter !== 'all' && (
            <FilterChip
              label={
                relationFilter === 'organizing' ? 'Organizing' : 'Attending'
              }
              onRemove={() => onRelationFilterChange('all')}
            />
          )}

          <button
            type='button'
            className={styles.clearAllButton}
            onClick={onClearFilters}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
