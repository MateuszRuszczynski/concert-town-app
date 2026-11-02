//#region imports
import cn from 'classnames';
import { type FC } from 'react';
import { Link } from 'react-router';
import type { EventDetails } from '../../../../types/events';
import { isToday } from '../../utils/isToday';
import { useAllMyEvents } from '../../../../api/queries/events/useEventsQueries';
import { useAllRegistrations } from '../../../../api/queries/registrations';
import { getEventRelation } from '../../utils/getEventRelation';
import styles from './CalendarDayCell.module.scss';
//#endregion

interface Props {
  date: Date | null;
  events: EventDetails[];
  span?: number;
}

export const CalendarDayCell: FC<Props> = ({ date, events, span = 1 }) => {
  const { data: myEvents = [] } = useAllMyEvents();
  const { data } = useAllRegistrations();

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
          {events.map(event => {
            const relation = getEventRelation(event, myEvents, data?.events ?? []);

            return (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className={cn(styles.eventLink, styles[relation || ''])}
              >
                {event.title}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
