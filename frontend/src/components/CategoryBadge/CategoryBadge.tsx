//#region imports
import type { FC } from 'react';
import type { EventCategory } from '../../types/events';
import styles from "./CategoryBadge.module.scss";
//#endregion

interface Props {
  category: EventCategory;
}

export const CategoryBadge: FC<Props> = ({ category }) => (
  <p className={styles.category}>{category}</p>
);
