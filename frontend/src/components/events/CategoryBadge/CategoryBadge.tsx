//#region imports
import cn from 'classNames';
import type { FC } from 'react';
import baseStyles from './base.module.scss';
import styles from './CategoryBadge.module.scss';
//#endregion

interface Props {
  category: string;
}

export const CategoryBadge: FC<Props> = ({ category }) => (
  <p className={cn(baseStyles.category, styles.category)}>{category}</p>
);
