//#region imports
import cn from 'classNames';
import { useMemo, type FC } from 'react';
import { Link } from 'react-router';
import type { EventDetails } from '../../../../types/events';
import { isToday } from '../../utils/isToday';
import { useEvents } from '../../../../contexts/EventContext';
import { useRegistrations } from '../../../../contexts/RegistrationsContext';
import { getEventRelation } from '../../utils/getEventRelation';
import styles from './CalendarDayCell.module.scss';
//#endregion

interface Props {
  date: Date | null;
  events: EventDetails[];
  span?: number;
}

export const CalendarDayCell: FC<Props> = ({ date, events, span = 1 }) => {
  const { myEvents } = useEvents();
  const { registrations } = useRegistrations();
  const registeredEventIds = useMemo(
    () => new Set(registrations.map(r => r.event)),
    [registrations]
  );

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
            const relation = getEventRelation(
              event,
              myEvents,
              registeredEventIds
            );

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
