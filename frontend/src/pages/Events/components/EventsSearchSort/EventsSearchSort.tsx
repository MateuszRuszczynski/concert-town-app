//#region imports
import type { FC } from "react";
import { ArrowUpDown, Search, X } from "lucide-react";
import { CustomSelect } from "../../../../components/ui/CustomSelect";
import { FormField } from "../../../../components/ui/FormField";
import { SORT_OPTIONS, type SortBy } from "../../utils/sortOptions";
import baseStyles from './base.module.scss';
import styles from './EventsSearchSort.module.scss';
//#endregion

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortBy;
  onSortChange: (value: SortBy) => void;
}

export const EventsSearchSort: FC<Props> = ({ searchQuery, onSearchChange, sortBy, onSortChange }) => (
  <div className={baseStyles.searchSortRow}>
    <div className={baseStyles.searchBar}>
      <FormField
        id="search"
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search events..."
        startAdornment={<Search size={16} aria-hidden="true" />}
        endAdornment={
          searchQuery && (
            <button type="button" className={styles.clearSearchButton} onClick={() => onSearchChange('')} aria-label="Clear search">
              <X size={14} aria-hidden="true" />
            </button>
          )
        }
      />
    </div>

    <div className={baseStyles.sort}>
      <CustomSelect
        id="sort"
        label={<><ArrowUpDown size={12} /> Sort by:</>}
        value={sortBy}
        onValueChange={onSortChange}
        options={SORT_OPTIONS}
      />
    </div>
  </div>
);