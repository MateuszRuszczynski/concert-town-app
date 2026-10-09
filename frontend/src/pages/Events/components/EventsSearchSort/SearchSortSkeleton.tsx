//#region imports
import cn from 'classNames';
import baseStyles from './base.module.scss';
import styles from './SearchSortSkeleton.module.scss';
import { SkeletonItem } from '../../../../components/ui/SkeletonItem';
//#endregion

export const SearchSortSkeleton = () => (
  <div className={baseStyles.searchSortRow}>
    <SkeletonItem additionalClass={cn(baseStyles.searchBar, styles.searchBar)} />

    <SkeletonItem additionalClass={cn(baseStyles.sort, styles.sort)} />
  </div>
);
