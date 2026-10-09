//#region imports
import type { FC, ReactNode } from 'react';
import { Button } from '../Button';
import styles from './EmptyBlock.module.scss';
//#endregion

interface Props {
  emptyMessage: string;
  emptyAction?: { label: ReactNode; onClick: () => void };
}

export const EmptyBlock: FC<Props> = ({ emptyMessage, emptyAction }) => (
  <div className={styles.emptyBlock}>
    <p className={styles.emptyMessage}>{emptyMessage}</p>

    {emptyAction && (
      <Button
        fitContent={true}
        variant='secondary'
        onClick={emptyAction.onClick}
      >
        {emptyAction.label}
      </Button>
    )}
  </div>
);
