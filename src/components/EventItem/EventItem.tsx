//#region imports
import type { FC } from 'react';
import type { EventDetails } from '../../types/events';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { CATEGORY_IMAGES } from './categoriesImages';
import styles from './EventItem.module.scss';
//#endregion

interface Props {
  event: EventDetails;
}

export const EventItem: FC<Props> = ({ event }) => {
  const date = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(event.startsAt));

  const locationText =
    event.location === 'online' ? 'Online event' : event.location.city;

  return (
    <div className={styles.eventItem}>
      <div className={styles.imgWrapper}>
        <img
          src={CATEGORY_IMAGES[event.category]}
          alt=""
          className={styles.eventImage}
        />
      </div>

      {event.relation && (
        <div className={`${styles.relationBadge} ${styles[event.relation]}`}>
          <span className={styles.badgeCircle} />

          {event.relation}
        </div>
      )}

      <div className={styles.eventSummary}>
        <div className={styles.eventMeta}>
          <p className={styles.category}>{event.category}</p>

          <p className={styles.price}>
            {event.price > 0 ? `$${event.price}` : 'Free'}
          </p>
        </div>

        <h2 className={styles.title}>{event.title}</h2>

        <div className={styles.eventAttributes}>
          <div className={styles.attribute}>
            <CalendarDays size={16} aria-hidden='true' />

            {date}
          </div>

          <div className={styles.attribute}>
            <MapPin size={16} aria-hidden='true' />

            {locationText}
          </div>

          <div className={styles.attribute}>
            <Users size={16} aria-hidden='true' />

            {`${event.registeredCount} / ${event.capacity}`}
          </div>
        </div>
      </div>
    </div>
  );
};
