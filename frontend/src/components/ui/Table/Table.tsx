//#region imports
import cn from 'classNames';
import type { FC, ReactNode } from 'react';
import styles from './Table.module.scss';
//#endregion

type Props = {
  children: ReactNode;
  rowHover?: boolean;
};

export const Table: FC<Props> = ({ children, rowHover = true }) => (
  <table
    className={cn(styles.table, {
      [styles.rowHover]: rowHover
    })}
  >
    {children}
  </table>
);
