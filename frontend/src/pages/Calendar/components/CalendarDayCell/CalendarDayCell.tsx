//#region imports
import cn from 'classNames';
import type { FC } from 'react';
import { Link } from 'react-router';
import type { EventDetails } from '../../../../types/events';
import styles from './CalendarDayCell.module.scss';
import { isToday } from '../../utils/isToday';
//#endregion

interface Props {
  date: Date | null;
  events: EventDetails[];
  span?: number;
}

export const CalendarDayCell: FC<Props> = ({ date, events, span = 1 }) => {
  if (!date) {
    return <div className={cn(styles.cell, styles.empty)} aria-hidden='true' />;
  }

  return (
    <div className={styles.cell} style={{ gridColumn: `span ${span}` }}>
      <span
        className={cn(styles.dayNumber, {
          [styles.today]: isToday(date)
        })}
      >
        {date.getDate()}
      </span>

      {events.length > 0 && (
        <div className={styles.eventsList}>
          {events.map(event => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className={styles.eventLink}
            >
              {event.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
