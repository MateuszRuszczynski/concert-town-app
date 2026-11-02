//#region imports
import cn from 'classnames';
import type { FC } from 'react';
import { Link } from 'react-router';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import type { EventDetails } from '../../../types/events';
import { RelationBadge } from '../RelationBadge';
import { CategoryBadge } from '../CategoryBadge';
import { formatEventDate } from '../../../utils/date/dateFormatters';
import { useEventRelation } from '../../../hooks/useEventRelation';
import { DEFAULT_EVENT_IMAGES } from '../../../assets/defaultEventImages';
import { CanceledBadge } from '../CanceledBadge';
import baseStyles from './base.module.scss';
import styles from './EventItem.module.scss';
//#endregion

interface Props {
  event: EventDetails;
}

export const EventItem: FC<Props> = ({ event }) => {
  const relation = useEventRelation(event);
  const date = formatEventDate(event.startsAt);

  return (
    <Link
      to={`/events/${event.id}`}
      className={cn(baseStyles.eventItem, styles.eventItem)}
    >
      <div className={baseStyles.imgWrapper}>
        <img
          src={
            event.image ??
            DEFAULT_EVENT_IMAGES[event.category?.slug ?? ''] ??
            DEFAULT_EVENT_IMAGES.default
          }
          alt=''
          className={cn(baseStyles.eventImage, styles.eventImage)}
        />
      </div>

      {relation && (
        <div className={styles.relationBadge}>
          <RelationBadge relation={relation} variant='overlay' />
        </div>
      )}

      {event.status === 'canceled' && (
        <div className={styles.canceledBadge}>
          <CanceledBadge />
        </div>
      )}

      <div className={baseStyles.eventSummary}>
        <div className={baseStyles.eventMeta}>
          <CategoryBadge category={event.category?.name || null} />

          <p className={styles.price}>
            {+event.price > 0 ? `$${event.price}` : 'Free'}
          </p>
        </div>

        <h2 className={cn(baseStyles.title, styles.title)}>{event.title}</h2>

        <div className={baseStyles.eventAttributes}>
          <div className={styles.attribute}>
            <CalendarDays size={16} aria-hidden='true' />

            {date}
          </div>

          <div className={styles.attribute}>
            <MapPin size={16} aria-hidden='true' />

            {event.location === 'online' ? 'Online event' : event.location.city}
          </div>

          <div className={styles.attribute}>
            <Users size={16} aria-hidden='true' />

            {`${event.registeredCount} / ${event.capacity}`}
          </div>
        </div>
      </div>
    </Link>
  );
};
