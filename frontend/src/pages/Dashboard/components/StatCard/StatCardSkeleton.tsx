//#region imports
import { SkeletonItem } from '../../../../components/ui/SkeletonItem';
import baseStyles from './base.module.scss';
import styles from './StatCardSkeleton.module.scss';
//#endregion

export const StatCardSkeleton = () => (
  <div className={baseStyles.statCard}>
    <div className={baseStyles.header}>
      <SkeletonItem additionalClass={styles.label} />

      <SkeletonItem additionalClass={baseStyles.iconBlock} />
    </div>

    <div className={baseStyles.main}>
      <SkeletonItem additionalClass={styles.value} />

      <SkeletonItem additionalClass={styles.footer} />
    </div>
  </div>
);
