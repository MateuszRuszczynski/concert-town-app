import { EventItemSkeleton } from '../EventItem/EventItemSkeleton';
import styles from './base.module.scss';

export const EventsListSkeleton = () => (
  <ul className={styles.eventsList}>
    {Array.from({ length: 3 }).map((_, i) => (
      <li key={i}>
        <EventItemSkeleton />
      </li>
    ))}
  </ul>
);
