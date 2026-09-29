//#region imports
import { SkeletonItem } from '../SkeletonItem';
import baseStyles from './base.module.scss';
import styles from './PageHeaderSkeleton.module.scss';
//#endregion

export const PageHeaderSkeleton = () => (
  <div className={baseStyles.pageHeader}>
    <SkeletonItem additionalClass={styles.title} />

    <SkeletonItem additionalClass={styles.subtitle} />
  </div>
);

