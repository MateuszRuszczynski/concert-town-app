//#region imports
import type { FC } from 'react';
import { CalendarDayCell } from '../CalendarDayCell/CalendarDayCell';
import type { CalendarDay } from '../../utils/calendarDays';
import type { EventDetails } from '../../../../types/events';
import styles from './CalendarGrid.module.scss';
//#endregion

interface Props {
  days: (CalendarDay | null)[];
  eventsByDate: Map<string, EventDetails[]>;
}

function toDateKey (date: Date): string {
  return date.toISOString().slice(0, 10);
}

export const CalendarGrid: FC<Props> = ({ days, eventsByDate }) => (
  <div className={styles.grid}>
    {days.map((day, index) => (
      <CalendarDayCell
        key={day ? toDateKey(day.date) : `empty-${index}`}
        date={day?.date ?? null}
        span={day?.span}
        events={day ? eventsByDate.get(toDateKey(day.date)) ?? [] : []}
      />
    ))}
  </div>
);
