//#region imports
import type { FC } from 'react';
import cn from 'classNames';
import styles from './RelationBadge.module.scss';
//#endregion

interface Props {
  relation: 'organizing' | 'attending';
  variant?: 'overlay' | 'solid';
}

export const RelationBadge: FC<Props> = ({ relation, variant = 'solid' }) => (
  <div
    className={cn(styles.relationBadge, styles[relation], {
      [styles.overlay]: variant === 'overlay'
    })}
  >
    <span className={styles.badgeCircle} />

    {relation}
  </div>
);
