//#region imports
import cn from 'classNames';
import { CategoryBadgeSkeleton } from '../CategoryBadge';
import { SkeletonItem } from '../../ui/SkeletonItem';
import baseStyles from './base.module.scss';
import styles from './EventItemSkeleton.module.scss';
//#endregion

export const EventItemSkeleton = () => {
  return (
    <div className={baseStyles.eventItem}>
      <div className={baseStyles.imgWrapper}>
        <SkeletonItem additionalClass={baseStyles.eventImage} />
      </div>

      <div className={baseStyles.eventSummary}>
        <div className={baseStyles.eventMeta}>
          <CategoryBadgeSkeleton />

          <SkeletonItem additionalClass={styles.price} />
        </div>

        <SkeletonItem additionalClass={cn(baseStyles.title, styles.title)} />

        <ul className={baseStyles.eventAttributes}>
          {Array.from({ length: 3}).map((_, i) => (
            <li key={i}>
              <SkeletonItem additionalClass={styles.attribute} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
