//#region imports
import { SkeletonItem } from '../../../ui/SkeletonItem';
import baseStyles from './base.module.scss';
import styles from './EventsNavSkeleton.module.scss';
//#endregion

export const EventsNavSkeleton = () => (
  <div className={baseStyles.tabs}>
    {Array.from({ length: 3 }).map((_, i) => (
      <SkeletonItem key={i} additionalClass={styles.tab} />
    ))}
  </div>
);
