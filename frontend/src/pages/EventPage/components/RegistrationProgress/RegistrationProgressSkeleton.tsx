//#region imports
import cn from 'classNames';
import { SkeletonItem } from '../../../../components/ui/SkeletonItem';
import baseStyles from './base.module.scss';
import styles from './RegistrationProgressSkeleton.module.scss';
//#endregion

export const RegistrationProgressSkeleton = () => (
  <div className={baseStyles.progress}>
    <SkeletonItem additionalClass={cn(baseStyles.title,styles.title)} />

    <div className={baseStyles.statsRow}>
      <SkeletonItem additionalClass={styles.count} />

      <SkeletonItem additionalClass={styles.percentage} />
    </div>

    <SkeletonItem additionalClass={cn(baseStyles.progressBarTrack, styles.progressBarTrack)} />
  </div>
);
