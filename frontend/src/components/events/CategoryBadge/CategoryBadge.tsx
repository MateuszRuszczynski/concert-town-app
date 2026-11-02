//#region imports
import cn from 'classnames';
import type { FC } from 'react';
import baseStyles from './base.module.scss';
import styles from './CategoryBadge.module.scss';
//#endregion

interface Props {
  category: string | null;
}

export const CategoryBadge: FC<Props> = ({ category }) => (
  <p className={cn(baseStyles.category, styles.category)}>
    {category || 'No category'}
  </p>
);
