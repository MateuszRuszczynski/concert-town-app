//#region imports
import cn from 'classNames';
import baseStyles from './base.module.scss';
import styles from './EventInfoPanelSkeleton.module.scss';
import { SkeletonItem } from '../../../../components/ui/SkeletonItem';
//#endregion

export const EventInfoPanelSkeleton = () => (
  <div className={baseStyles.panel}>
    <SkeletonItem additionalClass={cn(baseStyles.price, styles.price)} />

    <ul className={baseStyles.mainInfo}>
      {Array.from({ length: 4}).map((_, i) => (
        <li key={i}>
          <SkeletonItem additionalClass={styles.row} />
        </li>
      ))}
    </ul>
  </div>
)