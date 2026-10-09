//#region imports
import type { FC } from 'react';
import { Filter } from 'lucide-react';
import { CustomSelect } from '../../../../components/ui/CustomSelect';
import { FilterChip } from '../FilterChip';
import { useCategories } from '../../../../contexts/CategoriesContext/useCategories';
import styles from './EventsFilterBar.module.scss';
//#endregion

interface Props {
  categorySlug: string;
  setCategorySlug: (slug: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const EventsFilterBar: FC<Props> = ({
  categorySlug,
  setCategorySlug,
  hasActiveFilters,
  onClearFilters
}) => {
  const { categories } = useCategories();
  const selectedCategory = categories.find(c => c.slug === categorySlug);

  return (
    <div className={styles.filterBar}>
      <span className={styles.groupLabel}>
        <Filter size={12} aria-hidden='true' />
        Filter by:
      </span>

        <CustomSelect<string>
          id='category'
          value={categorySlug}
          onValueChange={setCategorySlug}
          options={categories.map(c => ({ value: c.slug, label: c.name }))}
          placeholder='All categories'
        />

      {hasActiveFilters && (
        <div className={styles.activeFilters}>
          {categorySlug !== '' && selectedCategory && (
            <FilterChip
              label={selectedCategory.name}
              onRemove={() => setCategorySlug('')}
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
