//#region imports
import type { FC } from 'react';
import { CategoryFilterDropdown } from '../CategoryFilterDropdown/CategoryFilterDropdown';
import { FilterChip } from '../FilterChip/FilterChip';
import {
  LOCATION_FILTER_OPTIONS,
  PRICE_FILTER_OPTIONS
} from '../../utils/sortOptions';
import styles from './EventsFilterBar.module.scss';
import type { EventCategory } from '../../../../types/events';
import { CustomSelect } from '../../../../components/CustomSelect';
import type { LocationFilter, PriceFilter } from '../../types/eventFilters';
import { Filter } from 'lucide-react';
//#endregion

interface Props {
  selectedCategories: EventCategory[];
  onCategoriesChange: (categories: EventCategory[]) => void;
  locationFilter: LocationFilter;
  onLocationFilterChange: (filter: LocationFilter) => void;
  priceFilter: PriceFilter;
  onPriceFilterChange: (filter: PriceFilter) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onRemoveCategory: (category: EventCategory) => void;
}

export const EventsFilterBar: FC<Props> = ({
  selectedCategories,
  onCategoriesChange,
  locationFilter,
  onLocationFilterChange,
  priceFilter,
  onPriceFilterChange,
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
