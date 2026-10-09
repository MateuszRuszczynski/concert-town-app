//#region imports
import type { FC } from 'react';
import cn from 'classNames';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '../../../ui/IconButton';
import styles from './Pagination.module.scss';
//#endregion

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<Props> = ({ page, totalPages, onPageChange }) => (
  <div className={styles.pagination}>
    <IconButton
      onClick={() => onPageChange(page - 1)}
      disabled={page === 1}
      aria-label='Previous page'
    >
      <ChevronLeft size={16} aria-hidden='true' />
    </IconButton>

   {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
      <button
        key={n}
        type="button"
        className={cn(styles.pageButton, { [styles.active]: n === page })}
        onClick={() => onPageChange(n)}
        aria-current={n === page ? 'page' : undefined}
      >
        {n}
      </button>
    ))}

    <IconButton
      onClick={() => onPageChange(page + 1)}
      disabled={page === totalPages}
      aria-label='Next page'
    >
      <ChevronRight size={16} aria-hidden='true' />
    </IconButton>
  </div>
);
