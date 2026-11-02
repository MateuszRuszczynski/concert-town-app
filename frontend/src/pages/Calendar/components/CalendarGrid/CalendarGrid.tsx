//#region imports
import type { FC } from 'react';
import { CalendarDayCell } from '../CalendarDayCell';
import type { CalendarDay } from '../../utils/calendarDays';
import type { EventDetails } from '../../../../types/events';
import { toDateKey } from '../../utils/groupEventsByDate';
import styles from './CalendarGrid.module.scss';
//#endregion

interface Props {
  days: (CalendarDay | null)[];
  eventsByDate: Map<string, EventDetails[]>;
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
