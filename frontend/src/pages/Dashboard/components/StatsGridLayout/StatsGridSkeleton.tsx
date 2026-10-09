import { StatCardSkeleton } from '../StatCard/StatCardSkeleton';
import styles from './base.module.scss';

export const StatsGridSkeleton = () => (
  <div className={styles.statsGrid}>
    {Array.from({ length: 4}).map((_, i) => (
      <StatCardSkeleton key={i} />
    ))}
  </div>
);
