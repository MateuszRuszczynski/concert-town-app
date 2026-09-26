//#region imports
import type { FC } from 'react';
import type { EventDetails } from '../../types/events';
import { EventItem } from '../EventItem';
import { EmptyBlock } from '../EmptyBlock';
import styles from './base.module.scss';
import { EventsListSkeleton } from './EventsListSkeleton';
//#endregion

interface Props {
  events: EventDetails[];
  isLoading: boolean;
}

export const EventsList: FC<Props> = ({ events, isLoading }) => {
  if (isLoading) {
    return (
      <EventsListSkeleton />
    );
  }

  if (events.length === 0) {
    return <EmptyBlock emptyMessage='No events match your filters.' />;
  }

  return (
    <ul className={styles.eventsList}>
      {events.map(event => (
        <li key={event.id}>
          <EventItem event={event} />
        </li>
      ))}
    </ul>
  );
};
