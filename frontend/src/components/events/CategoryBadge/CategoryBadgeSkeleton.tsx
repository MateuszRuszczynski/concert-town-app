//#region imports
import cn from 'classNames';
import { SkeletonItem } from '../../ui/SkeletonItem';
import baseStyles from "./base.module.scss";
import styles from './CategoryBadgeSkeleton.module.scss';
//#endregion

export const CategoryBadgeSkeleton = () => (
  <SkeletonItem additionalClass={cn(baseStyles.category, styles.category)} />
);
