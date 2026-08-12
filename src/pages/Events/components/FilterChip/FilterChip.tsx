//#region imports
import type { FC } from 'react';
import { X } from 'lucide-react';
import styles from './FilterChip.module.scss';
//#endregion

interface Props {
  label: string;
  onRemove: () => void;
}

export const FilterChip: FC<Props> = ({ label, onRemove }) => (
  <span className={styles.chip}>
    {label}

    <button
      type='button'
      className={styles.removeButton}
      onClick={onRemove}
      aria-label={`Remove ${label} filter`}
    >
      <X size={12} aria-hidden='true' />
    </button>
  </span>
);
