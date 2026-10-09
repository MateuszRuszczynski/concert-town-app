//#region imports
import { CategoryBadgeSkeleton } from '../../../../components/events/CategoryBadge';
import { SkeletonItem } from '../../../../components/ui/SkeletonItem';
import baseStyles from './base.module.scss';
import styles from './EventHeaderSkeleton.module.scss';
//#endregion

export const EventHeaderSkeleton = () => (
  <div className={baseStyles.header}>
    <CategoryBadgeSkeleton />

    <SkeletonItem additionalClass={styles.title} />
  </div>
);
