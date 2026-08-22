import type { FC } from 'react';
import styles from './RegistrationProgress.module.scss';

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
    <div className={styles.progress}>
      <h2 className={styles.title}>Registrations</h2>

      <div className={styles.statsRow}>
        <span>
          {registeredCount} of {capacity} spots filled
        </span>
        <span className={styles.percentage}>{percentage}%</span>
      </div>

      <div className={styles.progressBarTrack}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
