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
}

interface Props {
  values: FilterValues;
  updates: FilterUpdates;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onRemoveCategory: (category: EventCategory) => void;
}

export const EventsFilterBar: FC<Props> = ({
  values,
  updates,
  hasActiveFilters,
  onClearFilters,
  onRemoveCategory
}) => (
  <div className={styles.filterBar}>
    <span className={styles.groupLabel}>
      <Filter size={12} aria-hidden='true' />
      Filter by:
    </span>

    <div className={styles.controls}>
      <CategoryFilterDropdown
        selected={values.selectedCategories}
        onChange={updates.onCategoriesChange}
      />

      <CustomSelect<LocationFilter>
        id='location-filter'
        value={values.locationFilter}
        onValueChange={updates.onLocationFilterChange}
        options={LOCATION_FILTER_OPTIONS}
      />

      <CustomSelect<PriceFilter>
        id='price-filter'
        value={values.priceFilter}
        onValueChange={updates.onPriceFilterChange}
        options={PRICE_FILTER_OPTIONS}
      />

      <CustomSelect<RelationFilter>
        id='relation-filter'
        value={values.relationFilter}
        onValueChange={updates.onRelationFilterChange}
        options={RELATION_FILTER_OPTIONS}
      />
    </div>

    {hasActiveFilters && (
      <div className={styles.activeFilters}>
        {values.selectedCategories.map(category => (
          <FilterChip
            key={category}
            label={category}
            onRemove={() => onRemoveCategory(category)}
          />
        ))}

        {values.locationFilter !== 'all' && (
          <FilterChip
            label={values.locationFilter === 'online' ? 'Online' : 'Offline'}
            onRemove={() => updates.onLocationFilterChange('all')}
          />
        )}

        {values.priceFilter !== 'all' && (
          <FilterChip
            label={values.priceFilter === 'free' ? 'Free' : 'Paid'}
            onRemove={() => updates.onPriceFilterChange('all')}
          />
        )}

        {values.relationFilter !== 'all' && (
          <FilterChip
            label={values.relationFilter === 'organizing' ? 'Organizing' : 'Attending'}
            onRemove={() => updates.onRelationFilterChange('all')}
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
