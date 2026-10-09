//#region imports
import type { FC } from 'react';
import cn from 'classNames';
import type { RelationFilter } from '../../types/eventFilters';
import styles from './EventsTabs.module.scss';
//#endregion

interface Props {
  value: RelationFilter;
  onChange: (filter: RelationFilter) => void;
  showOrganizing: boolean;
}

export const EventsTabs: FC<Props> = ({ value, onChange, showOrganizing }) => (
  <div className={styles.tabs} role='tablist'>
    <button
      role='tab'
      aria-selected={value === 'all'}
      className={cn(styles.tab, { [styles.active]: value === 'all' })}
      onClick={() => onChange('all')}
    >
      All events
    </button>

    <button
      role='tab'
      aria-selected={value === 'attending'}
      className={cn(styles.tab, { [styles.active]: value === 'attending' })}
      onClick={() => onChange('attending')}
    >
      Attending
    </button>

    {showOrganizing && (
      <button
        role='tab'
        aria-selected={value === 'organizing'}
        className={cn(styles.tab, { [styles.active]: value === 'organizing' })}
        onClick={() => onChange('organizing')}
      >
        Organizing
      </button>
    )}
  </div>
);
