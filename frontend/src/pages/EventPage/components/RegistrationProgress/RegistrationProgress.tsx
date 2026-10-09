//#region imports
import type { FC } from 'react';
import cn from 'classNames';
import baseStyles from './base.module.scss';
import styles from './RegistrationProgress.module.scss';
//#endregion

interface Props {
  registeredCount: number;
  capacity: number;
}

export const RegistrationProgress: FC<Props> = ({
  registeredCount,
  capacity
}) => {
  const percentage =
    capacity > 0 ? Math.round((registeredCount / capacity) * 100) : 0;

  return (
    <div className={cn(baseStyles.progress, styles.progress)}>
      <h2 className={cn(baseStyles.title, styles.title)}>Registrations</h2>

      <div className={cn(baseStyles.statsRow, styles.statsRow)}>
        <span>
          {registeredCount} of {capacity} spots filled
        </span>
        <span className={styles.percentage}>{percentage}%</span>
      </div>

      <div className={cn(baseStyles.progressBarTrack, styles.progressBarTrack)}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
