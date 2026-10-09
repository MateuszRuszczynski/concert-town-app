//#region imports
import cn from 'classNames';
import type { FC } from 'react';
import styles from './CalendarLegend.module.scss';
import { useAuth } from '../../../../contexts/AuthContext';
//#endregion

export const CalendarLegend: FC = () => {
  const { user } = useAuth();

  return (
    <div className={styles.legend}>
      {user?.role !== 'customer' && (
        <span className={cn(styles.legendItem, styles.organizing)}>
          <span className={styles.dot} />
          Organizing
        </span>
      )}

      <span className={cn(styles.legendItem, styles.attending)}>
        <span className={styles.dot} />
        Attending
      </span>
    </div>
  );
};
