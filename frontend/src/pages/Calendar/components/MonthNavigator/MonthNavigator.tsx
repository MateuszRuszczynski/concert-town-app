//#region imports
import type { FC } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconButton } from '../../../../components/IconButton/IconButton';
import styles from './MonthNavigator.module.scss';
//#endregion

interface Props {
  monthLabel: string;
  onPrevious: () => void;
  onNext: () => void;
}

export const MonthNavigator: FC<Props> = ({ monthLabel, onPrevious, onNext }) => (
  <div className={styles.navigator}>
    <IconButton onClick={onPrevious} aria-label="Previous month">
      <ChevronLeft size={16} aria-hidden="true" />
    </IconButton>

    <span className={styles.label}>{monthLabel}</span>

    <IconButton onClick={onNext} aria-label="Next month">
      <ChevronRight size={16} aria-hidden="true" />
    </IconButton>
  </div>
);
